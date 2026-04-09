import { z } from 'zod'

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

export type LoginFormData = z.infer<typeof loginSchema>

/**
 * Register form validation schema
 */
export const registerSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  full_name: z.string().min(2, 'Nama minimal 2 karakter'),
  role: z.enum(['student', 'instructor']),
})

export type RegisterFormData = z.infer<typeof registerSchema>

/**
 * Course creation/update form validation schema
 */
export const courseSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  slug: z
    .string()
    .min(3, 'Slug minimal 3 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan dash'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  price: z.number().min(0, 'Harga tidak boleh negatif'),
  thumbnail_url: z.string().url('URL tidak valid').optional().or(z.literal('')),
  is_published: z.boolean(),
})

export type CourseFormData = z.infer<typeof courseSchema>
