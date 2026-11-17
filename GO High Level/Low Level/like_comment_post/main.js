import express from 'express';
import jwt from 'jsonwebtoken';
import postsRouter from './routes/posts.js';
import commentsRouter from './routes/comments.js';
import usersRouter from './routes/users.js';

const app = express();
app.use(express.json());

// Authorization: Bearer <JWT> -> req.user = { sub: userId, locationId }
app.use((req, res, next) => {
  try {
    req.user = jwt.verify(req.headers.authorization?.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch {
    res.sendStatus(401);
  }
});

app.use('/v1/posts', postsRouter);
app.use('/v1/comments', commentsRouter);
app.use('/v1/users', usersRouter);

app.listen(3000);
