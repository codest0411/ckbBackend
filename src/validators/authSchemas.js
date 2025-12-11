import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Provide a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(10, 'Refresh token is required.'),
});
