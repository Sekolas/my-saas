"use server"
import { createClient } from './server'
import { Database } from '@/types/database.types'

type Companion = Database['public']['Tables']['companions']['Row']
type CompanionInsert = Database['public']['Tables']['companions']['Insert']
type CompanionUpdate = Database['public']['Tables']['companions']['Update']

type Session = Database['public']['Tables']['sessions']['Row']
type SessionInsert = Database['public']['Tables']['sessions']['Insert']

// Companion Queries
export async function getAllCompanions(userId: string): Promise<Companion[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('companions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
}

export async function getCompanionById(id: string): Promise<Companion | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('companions')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

export async function createCompanion(companion: CompanionInsert): Promise<{ data?: Companion; error?: any }> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('companions')
        .insert(companion)
        .select()
        .single()

    if (error) {
        console.error('Supabase Create Error:', error)
        return { error }
    }
    return { data }
}

export async function updateCompanion(id: string, updates: CompanionUpdate): Promise<Companion> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('companions')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deleteCompanion(id: string): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('companions')
        .delete()
        .eq('id', id)

    if (error) throw error
}

export async function toggleBookmark(id: string, bookmarked: boolean): Promise<Companion> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('companions')
        .update({ bookmarked })
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

// Session Queries
export async function getUserSessions(userId: string): Promise<Session[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
}

export async function createSession(session: SessionInsert): Promise<Session> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('sessions')
        .insert(session)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function completeSession(id: string): Promise<Session> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('sessions')
        .update({ completed: true })
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}
