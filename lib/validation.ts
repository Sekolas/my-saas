import { z } from 'zod'

// Companion validation schema
export const companionSchema = z.object({
    name: z.string()
        .min(3, 'Companion name must be at least 3 characters')
        .max(100, 'Companion name must be less than 100 characters')
        .trim(),
    subject: z.enum(['maths', 'language', 'science', 'history', 'coding', 'economics'], {
        message: 'Please select a valid subject',
    }),
    topic: z.string()
        .min(3, 'Topic must be at least 3 characters')
        .max(200, 'Topic must be less than 200 characters')
        .trim(),
    voice: z.string()
        .min(1, 'Voice is required'),
    style: z.enum(['casual', 'formal'], {
        message: 'Style must be either casual or formal',
    }),
    duration: z.number()
        .int('Duration must be a whole number')
        .min(5, 'Duration must be at least 5 minutes')
        .max(120, 'Duration must be at most 120 minutes'),
})

export type CompanionFormData = z.infer<typeof companionSchema>

// Session validation schema
export const sessionSchema = z.object({
    user_id: z.string().uuid('Invalid user ID'),
    companion_id: z.string().uuid('Invalid companion ID'),
    completed: z.boolean().default(false),
})

export type SessionFormData = z.infer<typeof sessionSchema>

// Search query sanitization
export function sanitizeSearchQuery(query: string): string {
    if (!query || typeof query !== 'string') return ''

    // Remove special characters that could cause issues in SQL
    // Keep alphanumeric, spaces, and basic punctuation
    return query
        .trim()
        .replace(/[^\w\s\-.,!?]/g, '')
        .slice(0, 100) // Limit length
}

// Pagination validation
export const paginationSchema = z.object({
    limit: z.number()
        .int()
        .min(1, 'Limit must be at least 1')
        .max(100, 'Limit must be at most 100')
        .default(10),
    page: z.number()
        .int()
        .min(1, 'Page must be at least 1')
        .default(1),
})

export type PaginationParams = z.infer<typeof paginationSchema>

// Helper function to validate and parse data
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
    success: true; data: T
} | {
    success: false; errors: z.ZodError
} {
    const result = schema.safeParse(data)

    if (result.success) {
        return { success: true, data: result.data }
    }

    return { success: false, errors: result.error }
}

// Format validation errors for user display
export function formatValidationErrors(errors: z.ZodError): Record<string, string> {
    const formatted: Record<string, string> = {}

    errors.issues.forEach((error) => {
        const path = error.path.join('.')
        formatted[path] = error.message
    })

    return formatted
}

