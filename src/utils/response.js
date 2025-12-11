export const sendSuccess = (res, { message = 'Success', data = null, status = 200 }) =>
  res.status(status).json({ success: true, message, data });

export const sendError = (
  res,
  { message = 'Request failed', status = 500, errorCode = 'SERVER_ERROR', details = null }
) =>
  res.status(status).json({
    success: false,
    message,
    errorCode,
    details,
  });
