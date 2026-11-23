import express from 'express';
import postsRouter from './routes/posts.js';
import commentsRouter from './routes/comments.js';
import usersRouter from './routes/users.js';
import { requireAuth } from './middleware/auth.js';
import { errorHandler, routeNotFound } from './middleware/errorHandler.js';

// request path: express.json -> requireAuth -> router (param checks, validate, paginate)
//               -> controller -> service -> db/db_queries -> Postgres
const app = express();

app.use(express.json());
app.use(requireAuth);

app.use('/v1/posts', postsRouter);
app.use('/v1/comments', commentsRouter);
app.use('/v1/users', usersRouter);

app.use(routeNotFound);
app.use(errorHandler); // must be last

app.listen(3000);
