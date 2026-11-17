-- unquoted names: Postgres stores them lowercase (row.likecount in JS)
-- prod uses Snowflake ids; BIGSERIAL here. Both are time-sortable, so ORDER BY id = ORDER BY createdAt

CREATE TABLE users (
  id             BIGINT PRIMARY KEY,
  locationId     BIGINT NOT NULL,          -- tenant
  name           TEXT,
  followerCount  INT DEFAULT 0,
  followingCount INT DEFAULT 0,
  createdAt      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE posts (
  id           BIGSERIAL PRIMARY KEY,
  locationId   BIGINT NOT NULL,
  authorId     BIGINT NOT NULL REFERENCES users,
  content      TEXT,
  mediaKeys    TEXT[],                     -- S3 object keys, e.g. posts/42/9f3a.jpg; CDN URL built on read
  likeCount    INT DEFAULT 0,
  commentCount INT DEFAULT 0,
  status       SMALLINT DEFAULT 1,         -- 1 active, 2 deleted
  createdAt    TIMESTAMPTZ DEFAULT now(),
  updatedAt    TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX ON posts (locationId, authorId, id DESC);

CREATE TABLE comments (
  id            BIGSERIAL PRIMARY KEY,
  locationId    BIGINT NOT NULL,
  postId        BIGINT NOT NULL REFERENCES posts,
  authorId      BIGINT NOT NULL,
  parentId      BIGINT REFERENCES comments,  -- NULL = top-level
  replyToUserId BIGINT,                      -- "@Priya"
  text          TEXT,
  likeCount     INT DEFAULT 0,
  replyCount    INT DEFAULT 0,
  status        SMALLINT DEFAULT 1,
  createdAt     TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX ON comments (postId, parentId, id DESC);

CREATE TABLE likes (
  userId     BIGINT,
  targetType SMALLINT,                     -- 1 post, 2 comment
  targetId   BIGINT,
  createdAt  TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (userId, targetType, targetId)
);
CREATE INDEX ON likes (targetType, targetId, createdAt DESC);

CREATE TABLE follows (
  followerId BIGINT,
  followeeId BIGINT,
  createdAt  TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (followerId, followeeId),
  CHECK (followerId <> followeeId)
);
CREATE INDEX ON follows (followeeId, createdAt DESC);
