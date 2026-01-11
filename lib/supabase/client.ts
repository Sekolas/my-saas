import { createBrowserClient } from '@supabase/ssr'

export function createClient(supabaseAccessToken?: string) {
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!

    const client = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        supabaseKey
    )

    if (supabaseAccessToken) {
        return createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            supabaseKey,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${supabaseAccessToken}`,
                    },
                },
            }
        )
    }

    return client
}
