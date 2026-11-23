import { HttpError } from '../errors.js';

// no route matched
export const routeNotFound = (req, res) => res.sendStatus(404);

// one place that turns any thrown error into a reply
// (Express 5 sends errors from async handlers here by itself)
export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return err.code ? res.status(err.status).json({ error: err.code }) : res.sendStatus(err.status);
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'INVALID_JSON' }); // express.json() got broken JSON
  }

  console.error(err);
  res.sendStatus(500);
};
