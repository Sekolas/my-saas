import { NextResponse } from 'next/server'
import { getAllCompanions } from '@/lib/supabase/queries'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const start = performance.now()
    // Run query 5 times to get average
    for (let i = 0; i < 5; i++) {
        await getAllCompanions(user.id, 50, 1, 'math') // Test with search term
    }
    const end = performance.now()
    const duration = (end - start) / 5

    return NextResponse.json({
        test: 'Database Query Performance (Average of 5 runs)',
        query: 'getAllCompanions with search "math"',
        averageDurationMs: duration.toFixed(2),
        message: duration < 50 ? 'Database is FAST. Latency is likely network/rendering.' : 'Database query is SLOW.'
    })
}
