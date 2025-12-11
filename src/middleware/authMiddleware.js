import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { sendError } from '../utils/response.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return sendError(res, {
      status: 401,
      message: '🚫 Unauthorized. Provide a valid access token.',
      errorCode: 'AUTH_TOKEN_MISSING',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = payload;
    return next();
  } catch (error) {
    return sendError(res, {
      status: 401,
      message: '⚠️ Token invalid or expired. Please log in again.',
      errorCode: 'AUTH_TOKEN_INVALID',
      details: error.message,
    });
  }
};
