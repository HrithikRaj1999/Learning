-- Q3.8  Quiz Product: Schema Design & Advanced SQL Queries
--
-- ==============================================================
-- 1. DATA STRUCTURE NEEDED & WHY (Simple Explanation)
-- ==============================================================
-- - DATA STRUCTURE: Relational Database Schema (PostgreSQL 3NF).
-- - WHY: Entity-Relationship modeling for quizzes requires exact relational constraints:
--   Nouns: Users, Quizzes, Questions, Options, Attempts, Answers (6 Tables).
--   FK constraints enforce integrity; composite PKs prevent duplicate submissions.
--
-- ==============================================================
-- 2. INTUITION (What I am thinking to tell to interviewer)
-- ==============================================================
-- - "Decompose product into 6 core tables in Third Normal Form (3NF)."
-- - "`is_correct` belongs on `question_option`, NOT `question`. (Allows multiple correct options in future)."
-- - "Composite PK `(attempt_id, question_id)` on `attempt_answer` guarantees exactly one answer per question per attempt."
-- - "Partial Unique Index `WHERE submitted_at IS NULL` guarantees at most ONE active/open attempt per user per quiz!"
-- - "Denormalized `score` on `quiz_attempt` avoids calculating O(N) scoring JOINs for every leaderboard query."
--
-- ==============================================================
-- 3. STEPS TO SOLVE & ALGORITHM SKELETON (In Words)
-- ==============================================================
-- - Tables:
--     1. app_user (user_id PK)
--     2. quiz (quiz_id PK, created_by FK)
--     3. question (question_id PK, quiz_id FK, position UNIQUE(quiz_id, position))
--     4. question_option (option_id PK, question_id FK, is_correct BOOL)
--     5. quiz_attempt (attempt_id PK, user_id FK, quiz_id FK, score INT)
--     6. attempt_answer (PRIMARY KEY(attempt_id, question_id), option_id FK)
-- - Indexes:
--     - Foreign keys: `idx_question_quiz`, `idx_option_question`.
--     - Leaderboard: `idx_attempt_quiz_score ON quiz_attempt(quiz_id, score DESC)`.
--     - Partial Index: `idx_one_open_attempt ON quiz_attempt(user_id, quiz_id) WHERE submitted_at IS NULL`.
-- - Core Queries:
--     1. Score single attempt (JOIN attempt_answer -> question_option, SUM points).
--     2. Leaderboard Top 10 (`MAX(score) GROUP BY user_id ORDER BY best_score DESC`).
--     3. Hardest Questions (AVG percentage correct per question).
--     4. User History with unanswered question count subquery.
--
-- ==============================================================
-- 4. TIME & SPACE COMPLEXITY
-- ==============================================================
-- - TIME COMPLEXITY:
--     - Score Calculation: O(Q) where Q = number of questions in attempt.
--     - Leaderboard Query: O(log N + K) with Index `(quiz_id, score DESC)`.
-- - SPACE COMPLEXITY: O(U * Q) growth on `attempt_answer` (Partition candidate).
--
-- ==============================================================
-- 5. VISUAL DIAGRAM
-- ==============================================================
-- Entity-Relationship Diagram:
--
--   app_user 1------* quiz 1------* question 1------* question_option
--       |                                |                (is_correct)
--       |                                |                      ^
--       *                                *                      |
--   quiz_attempt 1------------* attempt_answer *----------------+
--   (score, submitted_at)      PK (attempt_id, question_id)
--
-- ==============================================================
-- 6. KEY GOTCHAS & THINGS TO SAY OUT LOUD
-- ==============================================================
-- - POSTGRES DOES NOT INDEX FOREIGN KEYS AUTOMATICALLY: You must add explicit B-Tree indexes on FK columns to prevent FULL TABLE SCANS during JOINs!
-- - PARTIAL INDEX FOR OPEN ATTEMPTS: `WHERE submitted_at IS NULL` ensures only ONE active quiz attempt per user while allowing multiple completed historical attempts.
-- - COALESCE IN SCORING QUERY: `COALESCE(SUM(...), 0)` avoids returning `NULL` for attempts with 0 correct answers.
-- - LEADERBOARD SCALING: For high traffic, store Top-100 Leaderboards in Redis Sorted Sets (`ZADD`), updated asynchronously on submit.


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
