import { createBrowserClient } from '@supabase/ssr'

export function createClient(supabaseAccessToken?: string) {
    const client = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    if (supabaseAccessToken) {
        return createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
