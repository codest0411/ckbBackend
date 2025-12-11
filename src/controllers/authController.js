import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config/env.js';
import { sendError, sendSuccess } from '../utils/response.js';

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = '7d';

const signAccessToken = (payload) =>
  jwt.sign(payload, config.jwtSecret, { expiresIn: ACCESS_TOKEN_TTL });

const signRefreshToken = (payload) =>
  jwt.sign(payload, config.refreshSecret, { expiresIn: REFRESH_TOKEN_TTL });

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, {
      status: 400,
      message: 'Email and password are required.',
      errorCode: 'AUTH_VALIDATION_FAILED',
    });
  }

  const adminEmail = config.adminEmail?.toLowerCase();
  const adminPassword = config.adminPassword;

  if (!adminEmail || !adminPassword) {
    return sendError(res, {
      status: 500,
      message: 'Admin credentials are not configured on the server.',
      errorCode: 'AUTH_CONFIG_MISSING',
    });
  }

  if (email.toLowerCase() !== adminEmail) {
    return sendError(res, {
      status: 401,
      message: 'Invalid credentials. Please try again.',
      errorCode: 'AUTH_INVALID_CREDENTIALS',
    });
  }

  let passwordValid = false;

  if (adminPassword.startsWith('$2')) {
    passwordValid = await bcrypt.compare(password, adminPassword);
  } else {
    passwordValid = password === adminPassword;
  }

  if (!passwordValid) {
    return sendError(res, {
      status: 401,
      message: 'Invalid credentials. Please try again.',
      errorCode: 'AUTH_INVALID_CREDENTIALS',
    });
  }

  const payload = {
    sub: 'admin',
    email: adminEmail,
    role: 'admin',
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return sendSuccess(res, {
    message: '✨ Logged in successfully.',
    data: {
      accessToken,
      refreshToken,
      user: payload,
    },
  });
};

export const refresh = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return sendError(res, {
      status: 400,
      message: 'Refresh token is required.',
      errorCode: 'AUTH_REFRESH_TOKEN_MISSING',
    });
  }

  try {
    const payload = jwt.verify(refreshToken, config.refreshSecret);
    const newAccessToken = signAccessToken({
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    });
    const newRefreshToken = signRefreshToken({
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    });

    return sendSuccess(res, {
      message: '🔄 Token refreshed.',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    return sendError(res, {
      status: 401,
      message: 'Refresh token invalid or expired.',
      errorCode: 'AUTH_REFRESH_FAILED',
      details: error.message,
    });
  }
};
