import { StatusCodes } from 'http-status-codes';

export function notFound(req, res, next) {
  res.status(StatusCodes.NOT_FOUND).json({ message: 'Route not found' });
}

export function errorHandler(err, req, res, next) {
  const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }
  res.status(status).json({ message });
}
