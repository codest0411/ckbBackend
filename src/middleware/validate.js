import { sendError } from '../utils/response.js';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    const parsed = await schema.parseAsync(req.body);
    req.validatedBody = parsed;
    next();
  } catch (error) {
    return sendError(res, {
      status: 400,
      message: 'Validation failed.',
      errorCode: 'REQUEST_VALIDATION_FAILED',
      details: error.issues?.map((issue) => issue.message).join(', '),
    });
  }
};

export const validateQuery = (schema) => async (req, res, next) => {
  try {
    const parsed = await schema.parseAsync(req.query);
    req.validatedQuery = parsed;
    next();
  } catch (error) {
    return sendError(res, {
      status: 400,
      message: 'Query validation failed.',
      errorCode: 'QUERY_VALIDATION_FAILED',
      details: error.issues?.map((issue) => issue.message).join(', '),
    });
  }
};
