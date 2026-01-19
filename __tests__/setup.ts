import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import React from 'react'

// Cleanup after each test
afterEach(() => {
    cleanup()
})

// Mock Next.js router
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
        pathname: '/',
        query: {},
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
    redirect: vi.fn(),
}))

// Mock Clerk authentication
vi.mock('@clerk/nextjs', () => ({
    useUser: () => ({
        user: {
            id: 'test-user-id',
            firstName: 'Test',
            lastName: 'User',
            emailAddresses: [{ emailAddress: 'test@example.com' }],
        },
        isLoaded: true,
        isSignedIn: true,
    }),
    useAuth: () => ({
        userId: 'test-user-id',
        isLoaded: true,
        isSignedIn: true,
    }),
}))

vi.mock('@clerk/nextjs/server', () => ({
    auth: vi.fn(() => Promise.resolve({ userId: 'test-user-id' })),
    clerkMiddleware: vi.fn(() => vi.fn()),
}))

// Mock Supabase client
vi.mock('@/lib/supabase/server', () => ({
    createClient: vi.fn(() => ({
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            update: vi.fn().mockReturnThis(),
            delete: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn(() => Promise.resolve({ data: null, error: null })),
            order: vi.fn().mockReturnThis(),
            range: vi.fn().mockReturnThis(),
            or: vi.fn().mockReturnThis(),
        })),
        auth: {
            getUser: vi.fn(() => Promise.resolve({
                data: { user: { id: 'test-user-id' } },
                error: null
            })),
        },
    })),
}))

vi.mock('@/lib/supabase/client', () => ({
    createClient: vi.fn(() => ({
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            update: vi.fn().mockReturnThis(),
            delete: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn(() => Promise.resolve({ data: null, error: null })),
            order: vi.fn().mockReturnThis(),
            range: vi.fn().mockReturnThis(),
            or: vi.fn().mockReturnThis(),
        })),
    })),
}))

// Mock Next.js Image component
vi.mock('next/image', () => ({
    default: (props: any) => {
        return React.createElement('img', props)
    },
}))

// Mock Next.js Link component
vi.mock('next/link', () => ({
    default: ({ children, href, ...props }: any) => {
        return React.createElement('a', { href, ...props }, children)
    },
}))
