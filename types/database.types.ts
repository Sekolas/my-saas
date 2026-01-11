export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            companions: {
                Row: {
                    id: string
                    created_at: string
                    author: string
                    name: string
                    subject: string
                    topic: string
                    voice: string
                    style: string
                    duration: number
                    bookmarked: boolean
                }
                Insert: {
                    id?: string
                    created_at?: string
                    author: string
                    name: string
                    subject: string
                    topic: string
                    voice: string
                    style: string
                    duration: number
                    bookmarked?: boolean
                }
                Update: {
                    id?: string
                    created_at?: string
                    author?: string
                    name?: string
                    subject?: string
                    topic?: string
                    voice?: string
                    style?: string
                    duration?: number
                    bookmarked?: boolean
                }
            }
            sessions: {
                Row: {
                    id: string
                    created_at: string
                    user_id: string
                    companion_id: string
                    duration: number
                    completed: boolean
                }
                Insert: {
                    id?: string
                    created_at?: string
                    user_id: string
                    companion_id: string
                    duration: number
                    completed?: boolean
                }
                Update: {
                    id?: string
                    created_at?: string
                    user_id?: string
                    companion_id?: string
                    duration?: number
                    completed?: boolean
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
