import { NextResponse, NextRequest } from 'next/server'
import { getAllCompanions } from '@/lib/supabase/queries'
import { createClient } from '@/lib/supabase/server'

interface PerformanceMetrics {
    test: string
    query: string
    runs: number
    metrics: {
        average: string
        min: string
        max: string
        p50: string
        p95: string
        p99: string
    }
    status: 'FAST' | 'MODERATE' | 'SLOW'
    message: string
}

export async function GET(request: NextRequest) {
    try {
        // Check authentication
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized', message: 'Authentication required' },
                { status: 401 }
            )
        }

        // Get query parameters
        const searchParams = request.nextUrl.searchParams
        const runs = Math.min(parseInt(searchParams.get('runs') || '5', 10), 20)
        const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100)
        const searchTerm = searchParams.get('search') || 'math'

        // Run performance test
        const durations: number[] = []
        const start = performance.now()

        for (let i = 0; i < runs; i++) {
            const iterationStart = performance.now()
            const result = await getAllCompanions(user.id, limit, 1, searchTerm)
            const iterationEnd = performance.now()
            durations.push(iterationEnd - iterationStart)
        }

        const end = performance.now()
        const totalDuration = end - start

        // Calculate metrics
        const sortedDurations = [...durations].sort((a, b) => a - b)
        const average = durations.reduce((a, b) => a + b, 0) / durations.length
        const min = Math.min(...durations)
        const max = Math.max(...durations)
        const p50 = sortedDurations[Math.floor(sortedDurations.length * 0.5)]
        const p95 = sortedDurations[Math.floor(sortedDurations.length * 0.95)]
        const p99 = sortedDurations[Math.floor(sortedDurations.length * 0.99)]

        // Determine status
        let status: 'FAST' | 'MODERATE' | 'SLOW'
        let message: string

        if (average < 50) {
            status = 'FAST'
            message = 'Database queries are performing excellently. Latency is likely network/rendering.'
        } else if (average < 200) {
            status = 'MODERATE'
            message = 'Database queries are performing adequately. Consider optimization if needed.'
        } else {
            status = 'SLOW'
            message = 'Database queries are slow. Optimization recommended.'
        }

        const metrics: PerformanceMetrics = {
            test: `Database Query Performance (${runs} runs)`,
            query: `getAllCompanions with search "${searchTerm}", limit ${limit}`,
            runs,
            metrics: {
                average: average.toFixed(2) + 'ms',
                min: min.toFixed(2) + 'ms',
                max: max.toFixed(2) + 'ms',
                p50: p50.toFixed(2) + 'ms',
                p95: p95.toFixed(2) + 'ms',
                p99: p99.toFixed(2) + 'ms',
            },
            status,
            message,
        }

        return NextResponse.json(metrics, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
        })
    } catch (error) {
        console.error('[test-performance] Error:', error)

        return NextResponse.json(
            {
                error: 'Internal Server Error',
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            },
            { status: 500 }
        )
    }
}
