import { createClient } from '@supabase/supabase-js'

// Note: This client should ONLY be used in server contexts (Server Actions/Components)
// It bypasses Row Level Security (RLS) policies.
export const createAdminClient = () => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )
}
