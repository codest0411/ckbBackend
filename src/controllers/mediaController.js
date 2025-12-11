import { supabaseAdmin } from '../config/supabase.js';
import { sendError, sendSuccess } from '../utils/response.js';
import { deleteFromStorage, uploadToStorage } from '../services/mediaService.js';

export const uploadMedia = async (req, res) => {
  if (!req.file) {
    return sendError(res, {
      status: 400,
      message: 'Attach an image file to upload.',
      errorCode: 'MEDIA_NO_FILE',
    });
  }

  try {
    const stored = await uploadToStorage(req.file);

    const record = {
      file_name: req.file.originalname,
      file_type: req.file.mimetype,
      size_bytes: req.file.size,
      storage_path: stored.path,
      url: stored.url,
      alt: req.body.alt || null,
      project_id: req.body.project_id || null,
      blog_id: req.body.blog_id || null,
      service_id: req.body.service_id || null,
    };

    const { data, error } = await supabaseAdmin.from('media').insert(record).select().single();

    if (error) {
      await deleteFromStorage(stored.path);
      return sendError(res, {
        message: 'Unable to save media metadata.',
        errorCode: 'MEDIA_SAVE_FAILED',
        details: error.message,
      });
    }

    return sendSuccess(res, {
      status: 201,
      message: '📸 Upload successful.',
      data,
    });
  } catch (err) {
    return sendError(res, {
      message: 'Upload failed.',
      errorCode: 'MEDIA_UPLOAD_ERROR',
      details: err.message,
    });
  }
};

export const listMedia = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return sendError(res, {
        message: 'Unable to load media library.',
        errorCode: 'MEDIA_LIST_FAILED',
        details: error.message,
      });
    }

    return sendSuccess(res, {
      message: 'Media loaded.',
      data,
    });
  } catch (err) {
    return sendError(res, {
      message: 'Unexpected error loading media.',
      errorCode: 'MEDIA_LIST_ERROR',
      details: err.message,
    });
  }
};

export const deleteMedia = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return sendError(res, {
      status: 400,
      message: 'Media ID is required.',
      errorCode: 'MEDIA_ID_REQUIRED',
    });
  }

  try {
    const { data, error } = await supabaseAdmin.from('media').delete().eq('id', id).select().single();

    if (error) {
      return sendError(res, {
        message: 'Unable to delete media.',
        errorCode: 'MEDIA_DELETE_FAILED',
        details: error.message,
      });
    }

    if (data?.storage_path) {
      await deleteFromStorage(data.storage_path);
    }

    return sendSuccess(res, {
      message: '🗑️ Media removed.',
    });
  } catch (err) {
    return sendError(res, {
      message: 'Unexpected error deleting media.',
      errorCode: 'MEDIA_DELETE_ERROR',
      details: err.message,
    });
  }
};
