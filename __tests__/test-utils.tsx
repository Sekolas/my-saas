import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'

// Custom render function that includes providers
export function renderWithProviders(
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
) {
    return render(ui, { ...options })
}

// Mock data generators
export const mockCompanion = (overrides = {}) => ({
    id: 'test-companion-id',
    name: 'Test Companion',
    subject: 'maths',
    topic: 'Test Topic',
    duration: 30,
    voice: '2BJW5coyhAzSr8STdHbE',
    style: 'casual',
    author: 'test-user-id',
    bookmarked: false,
    created_at: new Date().toISOString(),
    ...overrides,
})

export const mockCompanions = (count: number = 5) => {
    return Array.from({ length: count }, (_, i) => mockCompanion({
        id: `companion-${i}`,
        name: `Companion ${i}`,
        subject: ['maths', 'science', 'history', 'language', 'coding'][i % 5],
    }))
}

export const mockSession = (overrides = {}) => ({
    id: 'test-session-id',
    user_id: 'test-user-id',
    companion_id: 'test-companion-id',
    completed: false,
    created_at: new Date().toISOString(),
    ...overrides,
})

// Re-export everything from testing library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
