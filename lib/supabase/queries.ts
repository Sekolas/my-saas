"use server"
import { createClient } from './server'
import { Database } from '@/types/database.types'
import { sanitizeSearchQuery } from '@/lib/validation'

type Companion = Database['public']['Tables']['companions']['Row']
type CompanionInsert = Database['public']['Tables']['companions']['Insert']
type CompanionUpdate = Database['public']['Tables']['companions']['Update']

type Session = Database['public']['Tables']['sessions']['Row']
type SessionInsert = Database['public']['Tables']['sessions']['Insert']

interface PaginatedResult<T> {
    data: T[]
    pagination: {
        page: number
        limit: number
        total: number
        hasMore: boolean
    }
}

/**
 * Get all companions for a user with pagination and optional search
 * @param userId - The user ID to filter companions
 * @param limit - Number of items per page (default: 10, max: 100)
 * @param page - Page number (1-indexed)
 * @param search - Optional search term for filtering by subject or topic
 * @returns Paginated list of companions
 */
export async function getAllCompanions(
    userId: string,
    limit: number = 10,
    page: number = 1,
    search?: string
): Promise<PaginatedResult<Companion>> {
    try {
        const supabase = await createClient()

        // Validate and sanitize inputs
        const safeLimit = Math.min(Math.max(1, limit), 100)
        const safePage = Math.max(1, page)
        const safeSearch = search ? sanitizeSearchQuery(search) : undefined

        const from = (safePage - 1) * safeLimit
        const to = from + safeLimit - 1

        // Build query
        let query = supabase
            .from('companions')
            .select('*', { count: 'exact' })
            .eq('author', userId)
            .order('created_at', { ascending: false })
            .range(from, to)

        if (safeSearch) {
            query = query.or(`subject.ilike.%${safeSearch}%,topic.ilike.%${safeSearch}%,name.ilike.%${safeSearch}%`)
        }

        const { data, error, count } = await query

        if (error) {
            console.error('[getAllCompanions] Database error:', error)
            throw new Error(`Failed to fetch companions: ${error.message}`)
        }

        const total = count || 0
        const hasMore = from + safeLimit < total

        return {
            data: data || [],
            pagination: {
                page: safePage,
                limit: safeLimit,
                total,
                hasMore,
            },
        }
    } catch (error) {
        console.error('[getAllCompanions] Unexpected error:', error)
        throw error
    }
}

/**
 * Get a single companion by ID
 * @param id - The companion ID
 * @returns The companion or null if not found
 */
export async function getCompanionById(id: string): Promise<Companion | null> {
    try {
        if (!id || typeof id !== 'string') {
            throw new Error('Invalid companion ID')
        }

        const supabase = await createClient()

        const { data, error } = await supabase
            .from('companions')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                // Not found
                return null
            }
            console.error('[getCompanionById] Database error:', error)
            throw new Error(`Failed to fetch companion: ${error.message}`)
        }

        return data
    } catch (error) {
        console.error('[getCompanionById] Unexpected error:', error)
        throw error
    }
}

/**
 * Create a new companion
 * @param companion - The companion data to insert
 * @returns Object with data or error
 */
export async function createCompanion(companion: CompanionInsert): Promise<{ data?: Companion; error?: any }> {
    try {
        if (!companion || typeof companion !== 'object') {
            return { error: { message: 'Invalid companion data' } }
        }

        const supabase = await createClient()

        const { data, error } = await supabase
            .from('companions')
            .insert(companion)
            .select()
            .single()

        if (error) {
            console.error('[createCompanion] Database error:', error)
            return { error }
        }

        return { data }
    } catch (error) {
        console.error('[createCompanion] Unexpected error:', error)
        return { error }
    }
}

/**
 * Update an existing companion
 * @param id - The companion ID
 * @param updates - The fields to update
 * @returns The updated companion
 */
export async function updateCompanion(id: string, updates: CompanionUpdate): Promise<Companion> {
    try {
        if (!id || typeof id !== 'string') {
            throw new Error('Invalid companion ID')
        }

        if (!updates || typeof updates !== 'object') {
            throw new Error('Invalid update data')
        }

        const supabase = await createClient()

        const { data, error } = await supabase
            .from('companions')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('[updateCompanion] Database error:', error)
            throw new Error(`Failed to update companion: ${error.message}`)
        }

        return data
    } catch (error) {
        console.error('[updateCompanion] Unexpected error:', error)
        throw error
    }
}

/**
 * Delete a companion
 * @param id - The companion ID
 */
export async function deleteCompanion(id: string): Promise<void> {
    try {
        if (!id || typeof id !== 'string') {
            throw new Error('Invalid companion ID')
        }

        const supabase = await createClient()

        const { error } = await supabase
            .from('companions')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('[deleteCompanion] Database error:', error)
            throw new Error(`Failed to delete companion: ${error.message}`)
        }
    } catch (error) {
        console.error('[deleteCompanion] Unexpected error:', error)
        throw error
    }
}

/**
 * Toggle bookmark status for a companion
 * @param id - The companion ID
 * @param bookmarked - The new bookmark status
 * @returns The updated companion
 */
export async function toggleBookmark(id: string, bookmarked: boolean): Promise<Companion> {
    try {
        if (!id || typeof id !== 'string') {
            throw new Error('Invalid companion ID')
        }

        if (typeof bookmarked !== 'boolean') {
            throw new Error('Invalid bookmark status')
        }

        const supabase = await createClient()

        const { data, error } = await supabase
            .from('companions')
            .update({ bookmarked })
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('[toggleBookmark] Database error:', error)
            throw new Error(`Failed to toggle bookmark: ${error.message}`)
        }

        return data
    } catch (error) {
        console.error('[toggleBookmark] Unexpected error:', error)
        throw error
    }
}

// Session Queries

/**
 * Get user sessions with pagination
 * @param userId - The user ID
 * @param limit - Number of items per page
 * @param page - Page number (1-indexed)
 * @returns Paginated list of sessions
 */
export async function getUserSessions(
    userId: string,
    limit: number = 10,
    page: number = 1
): Promise<PaginatedResult<Session>> {
    try {
        if (!userId || typeof userId !== 'string') {
            throw new Error('Invalid user ID')
        }

        const supabase = await createClient()

        const safeLimit = Math.min(Math.max(1, limit), 100)
        const safePage = Math.max(1, page)

        const from = (safePage - 1) * safeLimit
        const to = from + safeLimit - 1

        const { data, error, count } = await supabase
            .from('sessions')
            .select('*', { count: 'exact' })
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .range(from, to)

        if (error) {
            console.error('[getUserSessions] Database error:', error)
            throw new Error(`Failed to fetch sessions: ${error.message}`)
        }

        const total = count || 0
        const hasMore = from + safeLimit < total

        return {
            data: data || [],
            pagination: {
                page: safePage,
                limit: safeLimit,
                total,
                hasMore,
            },
        }
    } catch (error) {
        console.error('[getUserSessions] Unexpected error:', error)
        throw error
    }
}

/**
 * Create a new session
 * @param session - The session data to insert
 * @returns The created session
 */
export async function createSession(session: SessionInsert): Promise<Session> {
    try {
        if (!session || typeof session !== 'object') {
            throw new Error('Invalid session data')
        }

        const supabase = await createClient()

        const { data, error } = await supabase
            .from('sessions')
            .insert(session)
            .select()
            .single()

        if (error) {
            console.error('[createSession] Database error:', error)
            throw new Error(`Failed to create session: ${error.message}`)
        }

        return data
    } catch (error) {
        console.error('[createSession] Unexpected error:', error)
        throw error
    }
}

/**
 * Mark a session as completed
 * @param id - The session ID
 * @returns The updated session
 */
export async function completeSession(id: string): Promise<Session> {
    try {
        if (!id || typeof id !== 'string') {
            throw new Error('Invalid session ID')
        }

        const supabase = await createClient()

        const { data, error } = await supabase
            .from('sessions')
            .update({ completed: true })
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('[completeSession] Database error:', error)
            throw new Error(`Failed to complete session: ${error.message}`)
        }

        return data
    } catch (error) {
        console.error('[completeSession] Unexpected error:', error)
        throw error
    }
}
