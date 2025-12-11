import { z } from 'zod';

export const contactSchema = z.object({
  fullname: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Provide a valid email address.'),
  subject: z.string().max(160, 'Subject should be short.').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

export const messageListSchema = z.object({
  search: z.string().optional(),
});
