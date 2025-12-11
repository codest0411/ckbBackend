import { createClient } from '@supabase/supabase-js';
import config from './env.js';

if (!config.supabaseUrl || !config.supabaseServiceRoleKey) {
  throw new Error(
    'Supabase configuration missing. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.'
  );
}

const supabaseAdmin = createClient(
  config.supabaseUrl,
  config.supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);

const supabaseAuthed = config.supabaseAnonKey
  ? createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
        detectSessionInUrl: false,
      },
    })
  : supabaseAdmin;

export { supabaseAdmin, supabaseAuthed };
