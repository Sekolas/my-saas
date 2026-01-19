import { describe, it, expect } from 'vitest'
import {
    companionSchema,
    sessionSchema,
    paginationSchema,
    sanitizeSearchQuery,
    validateData,
    formatValidationErrors
} from '../validation'

describe('Companion Validation', () => {
    it('should validate valid companion data', () => {
        const validData = {
            name: 'Test Companion',
            subject: 'maths',
            topic: 'Algebra Basics',
            voice: '2BJW5coyhAzSr8STdHbE',
            style: 'casual',
            duration: 30,
        }

        const result = companionSchema.safeParse(validData)
        expect(result.success).toBe(true)
    })

    it('should reject companion with short name', () => {
        const invalidData = {
            name: 'AB',
            subject: 'maths',
            topic: 'Algebra Basics',
            voice: '2BJW5coyhAzSr8STdHbE',
            style: 'casual',
            duration: 30,
        }

        const result = companionSchema.safeParse(invalidData)
        expect(result.success).toBe(false)
    })

    it('should reject companion with invalid subject', () => {
        const invalidData = {
            name: 'Test Companion',
            subject: 'invalid-subject',
            topic: 'Algebra Basics',
            voice: '2BJW5coyhAzSr8STdHbE',
            style: 'casual',
            duration: 30,
        }

        const result = companionSchema.safeParse(invalidData)
        expect(result.success).toBe(false)
    })

    it('should reject companion with duration out of range', () => {
        const invalidData = {
            name: 'Test Companion',
            subject: 'maths',
            topic: 'Algebra Basics',
            voice: '2BJW5coyhAzSr8STdHbE',
            style: 'casual',
            duration: 200, // Too long
        }

        const result = companionSchema.safeParse(invalidData)
        expect(result.success).toBe(false)
    })

    it('should trim whitespace from strings', () => {
        const dataWithWhitespace = {
            name: '  Test Companion  ',
            subject: 'maths',
            topic: '  Algebra Basics  ',
            voice: '2BJW5coyhAzSr8STdHbE',
            style: 'casual',
            duration: 30,
        }

        const result = companionSchema.safeParse(dataWithWhitespace)
        if (result.success) {
            expect(result.data.name).toBe('Test Companion')
            expect(result.data.topic).toBe('Algebra Basics')
        }
    })
})

describe('Search Query Sanitization', () => {
    it('should sanitize basic search query', () => {
        const query = 'test search'
        const sanitized = sanitizeSearchQuery(query)
        expect(sanitized).toBe('test search')
    })

    it('should remove special SQL characters', () => {
        const query = "test'; DROP TABLE companions; --"
        const sanitized = sanitizeSearchQuery(query)
        expect(sanitized).not.toContain(';')
        expect(sanitized).not.toContain('--')
    })

    it('should handle empty or null input', () => {
        expect(sanitizeSearchQuery('')).toBe('')
        expect(sanitizeSearchQuery(null as any)).toBe('')
        expect(sanitizeSearchQuery(undefined as any)).toBe('')
    })

    it('should limit query length', () => {
        const longQuery = 'a'.repeat(200)
        const sanitized = sanitizeSearchQuery(longQuery)
        expect(sanitized.length).toBeLessThanOrEqual(100)
    })

    it('should keep basic punctuation', () => {
        const query = 'Hello, world! How are you?'
        const sanitized = sanitizeSearchQuery(query)
        expect(sanitized).toContain(',')
        expect(sanitized).toContain('!')
        expect(sanitized).toContain('?')
    })
})

describe('Pagination Validation', () => {
    it('should validate valid pagination params', () => {
        const result = paginationSchema.safeParse({ limit: 10, page: 1 })
        expect(result.success).toBe(true)
    })

    it('should use default values', () => {
        const result = paginationSchema.safeParse({})
        if (result.success) {
            expect(result.data.limit).toBe(10)
            expect(result.data.page).toBe(1)
        }
    })

    it('should reject invalid limit', () => {
        const result = paginationSchema.safeParse({ limit: 200, page: 1 })
        expect(result.success).toBe(false)
    })

    it('should reject negative page number', () => {
        const result = paginationSchema.safeParse({ limit: 10, page: -1 })
        expect(result.success).toBe(false)
    })
})

describe('Validation Helpers', () => {
    it('should validate data successfully', () => {
        const data = { limit: 10, page: 1 }
        const result = validateData(paginationSchema, data)

        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.limit).toBe(10)
        }
    })

    it('should return errors for invalid data', () => {
        const data = { limit: -1, page: 0 }
        const result = validateData(paginationSchema, data)

        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.errors).toBeDefined()
        }
    })

    it('should format validation errors', () => {
        const data = { name: 'AB', subject: 'invalid' }
        const result = companionSchema.safeParse(data)

        if (!result.success) {
            const formatted = formatValidationErrors(result.error)
            expect(formatted).toHaveProperty('name')
            expect(formatted).toHaveProperty('subject')
        }
    })
})
