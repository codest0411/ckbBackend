import path from 'path';
import { v4 as uuid } from 'uuid';
import config from '../config/env.js';
import { supabaseAdmin } from '../config/supabase.js';

const resolveExtension = (filename, mimetype) => {
  const extFromName = path.extname(filename || '').replace('.', '');
  if (extFromName) return extFromName;

  const mimeMap = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'application/pdf': 'pdf',
  };

  return mimeMap[mimetype] || 'png';
};

export const uploadToStorage = async (file) => {
  if (!config.storageBucket) {
    throw new Error('Storage bucket is not configured.');
  }

  const extension = resolveExtension(file.originalname, file.mimetype);
  const filePath = `media/${new Date().getFullYear()}/${uuid()}.${extension}`;

  const { error } = await supabaseAdmin.storage
    .from(config.storageBucket)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(config.storageBucket)
    .getPublicUrl(filePath);

  return {
    path: filePath,
    url: publicUrlData.publicUrl,
  };
};

export const deleteFromStorage = async (storagePath) => {
  if (!config.storageBucket) return;
  await supabaseAdmin.storage.from(config.storageBucket).remove([storagePath]);
};
