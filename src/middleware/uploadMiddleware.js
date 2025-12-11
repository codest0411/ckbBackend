import multer from 'multer';
import { sendError } from '../utils/response.js';

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const resumeMimeTypes = ['application/pdf'];

const storage = multer.memoryStorage();

const imageFileFilter = (req, file, cb) => {
  if (imageMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Upload images only.'), false);
  }
};

const resumeFileFilter = (req, file, cb) => {
  if (resumeMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Upload PDF resume only.'), false);
  }
};

const imageUploader = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

const resumeUploader = multer({
  storage,
  fileFilter: resumeFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return sendError(res, {
      status: 400,
      message: `Upload failed: ${err.message}`,
      errorCode: 'UPLOAD_VALIDATION_FAILED',
    });
  }

  if (err) {
    return sendError(res, {
      status: 400,
      message: err.message || 'Upload failed.',
      errorCode: 'UPLOAD_ERROR',
    });
  }

  return next();
};

export const imageUpload = imageUploader.single('file');
export const resumeUpload = resumeUploader.single('file');
