-- Q3.8  Quiz product: schema plus queries
--
-- ==============================================================
-- 1. INTUITION
-- ==============================================================
-- WHAT
--   Tables for a quiz app, then queries on my own schema.
--
-- HOW I FIND THE TABLES
--   I name the nouns in the product. Each noun is a table.
--     a user creates a quiz
--     a quiz has questions
--     a question has options, one of them is correct
--     a user takes an attempt at a quiz
--     an attempt records one chosen option per question
--   Six nouns, six tables. The links between them become
--   the foreign keys.
--
-- TWO DECISIONS I WOULD DEFEND
--   1. is_correct sits on the OPTION row, not on the
--      question as correct_option_id. Then a question can
--      have two correct options later, with no migration.
--   2. "one answer per question per attempt" is a COMPOSITE
--      PRIMARY KEY, not a check in code. Let the database
--      enforce what must never happen.
--
-- ==============================================================
-- 2. VISUAL EXAMPLE
-- ==============================================================
--   app_user 1--* quiz 1--* question 1--* question_option
--       |                       |            (is_correct)
--       |                       |                  ^
--       *                       *                  |
--   quiz_attempt 1--------* attempt_answer *-------+
--   (score, submitted_at)   PK (attempt_id, question_id)
--
-- SCORING ONE ATTEMPT
--   walk attempt_answer -> question_option -> is_correct
--   and add up question.points where that was true.
--
--   attempt 91, quiz 5
--     q1 (2 pts)  chose option 3  correct    -> +2
--     q2 (1 pt)   chose option 7  wrong      -> +0
--     q3 (1 pt)   not answered               -> +0
--     score = 2
--
-- ==============================================================
-- 3. SKELETON
-- ==============================================================
--   tables   app_user, quiz, question, question_option,
--            quiz_attempt, attempt_answer
--   indexes  only for what my queries filter and sort on
--   queries  1. score one attempt
--            2. leaderboard for a quiz
--            3. hardest questions
--            4. one user's history
--
-- ==============================================================
-- 4. GOTCHAS
-- ==============================================================
-- - POSTGRES DOES NOT INDEX FOREIGN KEYS for you. Every FK I
--   join on gets an index, or the leaderboard does a full
--   table scan.
-- - UNIQUE (quiz_id, position), so two questions cannot both
--   claim slot 3.
-- - PARTIAL UNIQUE INDEX for "one OPEN attempt per user per
--   quiz". Unique only WHERE submitted_at IS NULL, because
--   finished attempts are allowed to repeat.
-- - MAX(score) in the leaderboard. A user can attempt a quiz
--   many times.
-- - COALESCE the score, or an attempt with no correct answer
--   returns NULL instead of 0.
-- - ON DELETE CASCADE from quiz down to questions and
--   options, but NOT to attempts. Those are history, so I
--   soft delete the quiz instead.
--
-- Written for PostgreSQL.

CREATE TABLE app_user (
    user_id      BIGSERIAL PRIMARY KEY,
    email        TEXT NOT NULL UNIQUE,   -- login id
    display_name TEXT NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE quiz (
    quiz_id      BIGSERIAL PRIMARY KEY,
    title        TEXT NOT NULL,
    created_by   BIGINT NOT NULL REFERENCES app_user(user_id),
    -- drafts must not show up in listings
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE question (
    question_id BIGSERIAL PRIMARY KEY,
    quiz_id     BIGINT NOT NULL
                REFERENCES quiz(quiz_id) ON DELETE CASCADE,
    body        TEXT NOT NULL,
    points      INT NOT NULL DEFAULT 1 CHECK (points > 0),
    position    INT NOT NULL,        -- order inside the quiz
    UNIQUE (quiz_id, position)       -- no fighting over slot 3
);

CREATE TABLE question_option (
    option_id   BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL
                REFERENCES question(question_id) ON DELETE CASCADE,
    body        TEXT NOT NULL,
    is_correct  BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE quiz_attempt (
    attempt_id   BIGSERIAL PRIMARY KEY,
    quiz_id      BIGINT NOT NULL REFERENCES quiz(quiz_id),
    user_id      BIGINT NOT NULL REFERENCES app_user(user_id),
    started_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    submitted_at TIMESTAMPTZ,   -- NULL while still in progress
    score        INT            -- filled in on submit
);

CREATE TABLE attempt_answer (
    attempt_id  BIGINT NOT NULL
                REFERENCES quiz_attempt(attempt_id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL REFERENCES question(question_id),
    option_id   BIGINT NOT NULL REFERENCES question_option(option_id),
    answered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- exactly one answer per question per attempt
    PRIMARY KEY (attempt_id, question_id)
);

-- Indexes. Each one backs a query below.
CREATE INDEX idx_question_quiz
    ON question (quiz_id, position);

CREATE INDEX idx_option_question
    ON question_option (question_id);

-- leaderboard
CREATE INDEX idx_attempt_quiz_score
    ON quiz_attempt (quiz_id, score DESC);

-- my history
CREATE INDEX idx_attempt_user_time
    ON quiz_attempt (user_id, started_at DESC);

-- per question stats
CREATE INDEX idx_answer_question_option
    ON attempt_answer (question_id, option_id);

-- One OPEN attempt per user per quiz. A partial index says
-- "unique only for the rows that matter".
CREATE UNIQUE INDEX idx_one_open_attempt
    ON quiz_attempt (user_id, quiz_id)
    WHERE submitted_at IS NULL;


-- Query 1: score one attempt.
-- Join the chosen option, add the points where it is correct.
SELECT a.attempt_id,
       COALESCE(
           SUM(CASE WHEN o.is_correct THEN q.points ELSE 0 END),
           0
       ) AS score
FROM   quiz_attempt    a
JOIN   attempt_answer  ans ON ans.attempt_id = a.attempt_id
JOIN   question        q   ON q.question_id  = ans.question_id
JOIN   question_option o   ON o.option_id    = ans.option_id
WHERE  a.attempt_id = $1
GROUP  BY a.attempt_id;


-- Query 2: leaderboard, best score per user, top 10.
-- MAX because a user may attempt the same quiz many times.
SELECT u.user_id,
       u.display_name,
       MAX(a.score) AS best_score
FROM   quiz_attempt a
JOIN   app_user     u ON u.user_id = a.user_id
WHERE  a.quiz_id = $1
  AND  a.submitted_at IS NOT NULL
GROUP  BY u.user_id, u.display_name
ORDER  BY best_score DESC
LIMIT  10;


-- Query 3: hardest questions, worst first.
-- AVG over a 1 / 0 case is the share that got it right.
SELECT q.question_id,
       q.body,
       COUNT(*) AS times_answered,
       ROUND(
           AVG(CASE WHEN o.is_correct THEN 1.0 ELSE 0.0 END) * 100,
           1
       ) AS percent_correct
FROM   question        q
JOIN   attempt_answer  ans ON ans.question_id = q.question_id
JOIN   question_option o   ON o.option_id     = ans.option_id
WHERE  q.quiz_id = $1
GROUP  BY q.question_id, q.body
ORDER  BY percent_correct ASC;


-- Query 4: one user's history, with questions left blank.
SELECT a.attempt_id,
       z.title,
       a.score,
       a.submitted_at,
       (SELECT COUNT(*) FROM question q
         WHERE q.quiz_id = a.quiz_id)
       - (SELECT COUNT(*) FROM attempt_answer ans
           WHERE ans.attempt_id = a.attempt_id) AS unanswered
FROM   quiz_attempt a
JOIN   quiz         z ON z.quiz_id = a.quiz_id
WHERE  a.user_id = $1
ORDER  BY a.started_at DESC
LIMIT  20;


-- ==============================================================
-- 5. SAY OUT LOUD
-- ==============================================================
-- - "Normalised to 3NF. No answer text is copied anywhere,
--    so there is one place to edit it."
-- - "score on quiz_attempt is a deliberate denormalisation.
--    Running query 1 for every leaderboard row would be
--    expensive, so I compute it once at submit time, in the
--    same transaction. The cost is that it can drift if a
--    question is edited later, so a published quiz should be
--    frozen or versioned."
-- - "attempt_answer is the table that explodes: users times
--    questions. Partition it by month or by quiz_id, and
--    archive old attempts to cold storage."
-- - "Leaderboards are read far more than written, so I would
--    keep the top N in a Redis sorted set and refresh it on
--    submit."
-- - "The quiz plus questions plus options read is join heavy
--    and never changes during a live quiz, so I would cache
--    that payload too."
