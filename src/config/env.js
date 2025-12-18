import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../../../.env'),
});

const normalizeCorsOrigin = (value) => {
  const trimmed = (value || '').trim();
  if (!trimmed) return '';
  if (trimmed === '*') return '*';

  try {
    const url = new URL(trimmed);
    return `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ''}`;
  } catch {
    return trimmed.replace(/\/+$/, '');
  }
};

const requiredKeys = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_ANON_KEY',
  'APP_JWT_SECRET',
  'APP_REFRESH_SECRET',
  'APP_ADMIN_EMAIL',
  'APP_ADMIN_PASSWORD',
];

const missing = requiredKeys.filter((key) => !process.env[key]);

if (missing.length) {
  console.warn(
    `⚠️  Missing environment variables: ${missing.join(
      ', '
    )}. Backend may not function correctly.`
  );
}

const config = {
  port: process.env.PORT || 5000,
  corsOrigins: (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => normalizeCorsOrigin(origin))
    .filter(Boolean),
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  storageBucket: process.env.SUPABASE_STORAGE_BUCKET || 'media',
  jwtSecret: process.env.APP_JWT_SECRET,
  refreshSecret: process.env.APP_REFRESH_SECRET,
  adminEmail: process.env.APP_ADMIN_EMAIL,
  adminPassword: process.env.APP_ADMIN_PASSWORD,
  contactNotificationEmail: process.env.CONTACT_NOTIFICATION_EMAIL || '',
};

export default config;
