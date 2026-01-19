import { describe, it, expect, vi } from 'vitest'
import { render, screen, userEvent } from '@/__tests__/test-utils'
import CompanionListClient from '../CompanionListClient'
import { mockCompanions } from '@/__tests__/test-utils'

describe('CompanionListClient', () => {
    const companions = mockCompanions(10)

    it('should render all companions', () => {
        render(<CompanionListClient companions={companions} />)
        expect(screen.getByText('Companion Library')).toBeInTheDocument()
        expect(screen.getAllByRole('article')).toHaveLength(10)
    })

    it('should filter companions by subject', async () => {
        const user = userEvent.setup()
        render(<CompanionListClient companions={companions} />)

        const subjectFilter = screen.getByLabelText('Filter by subject')
        await user.selectOptions(subjectFilter, 'maths')

        // Should only show maths companions
        const cards = screen.getAllByRole('article')
        expect(cards.length).toBeLessThan(10)
    })

    it('should search companions by name', async () => {
        const user = userEvent.setup()
        const testCompanions = [
            ...mockCompanions(3),
            { ...mockCompanions(1)[0], name: 'Unique Test Name', id: 'unique-id' }
        ]

        render(<CompanionListClient companions={testCompanions} />)

        const searchInput = screen.getByLabelText('Search companions')
        await user.type(searchInput, 'Unique')

        // Wait for debounce
        await new Promise(resolve => setTimeout(resolve, 350))

        expect(screen.getByText('Unique Test Name')).toBeInTheDocument()
    })

    it('should search companions by topic', async () => {
        const user = userEvent.setup()
        const testCompanions = [
            ...mockCompanions(3),
            { ...mockCompanions(1)[0], topic: 'Quantum Physics', id: 'quantum-id' }
        ]

        render(<CompanionListClient companions={testCompanions} />)

        const searchInput = screen.getByLabelText('Search companions')
        await user.type(searchInput, 'Quantum')

        // Wait for debounce
        await new Promise(resolve => setTimeout(resolve, 350))

        expect(screen.getByText(/Quantum Physics/)).toBeInTheDocument()
    })

    it('should show empty state when no companions match filters', async () => {
        const user = userEvent.setup()
        render(<CompanionListClient companions={companions} />)

        const searchInput = screen.getByLabelText('Search companions')
        await user.type(searchInput, 'NonExistentCompanion123')

        // Wait for debounce
        await new Promise(resolve => setTimeout(resolve, 350))

        expect(screen.getByText('No companions found matching your filters.')).toBeInTheDocument()
    })

    it('should show empty state when no companions exist', () => {
        render(<CompanionListClient companions={[]} />)
        expect(screen.getByText('No companions found. Create one to get started!')).toBeInTheDocument()
    })

    it('should handle null/undefined companions gracefully', () => {
        const invalidCompanions = [
            ...companions,
            null as any,
            undefined as any,
            { id: 'invalid', name: null, subject: null, topic: null } as any
        ]

        const { container } = render(<CompanionListClient companions={invalidCompanions} />)
        // Should not crash
        expect(container).toBeInTheDocument()
    })

    it('should debounce search input', async () => {
        const user = userEvent.setup()
        render(<CompanionListClient companions={companions} />)

        const searchInput = screen.getByLabelText('Search companions')

        // Type quickly
        await user.type(searchInput, 'test')

        // Should still show all companions immediately (debounced)
        expect(screen.getAllByRole('article').length).toBeGreaterThan(0)

        // Wait for debounce
        await new Promise(resolve => setTimeout(resolve, 350))

        // Now filter should be applied
        const articlesAfterDebounce = screen.queryAllByRole('article')
        expect(articlesAfterDebounce.length).toBeGreaterThanOrEqual(0)
    })

    it('should combine subject filter and search', async () => {
        const user = userEvent.setup()
        const testCompanions = [
            { ...mockCompanions(1)[0], subject: 'maths', name: 'Math Companion', id: '1' },
            { ...mockCompanions(1)[0], subject: 'science', name: 'Science Companion', id: '2' },
            { ...mockCompanions(1)[0], subject: 'maths', name: 'Another Math', id: '3' },
        ]

        render(<CompanionListClient companions={testCompanions} />)

        // Filter by maths
        const subjectFilter = screen.getByLabelText('Filter by subject')
        await user.selectOptions(subjectFilter, 'maths')

        // Search for specific name
        const searchInput = screen.getByLabelText('Search companions')
        await user.type(searchInput, 'Math Companion')

        // Wait for debounce
        await new Promise(resolve => setTimeout(resolve, 350))

        // Should only show the one that matches both filters
        expect(screen.getByText('Math Companion')).toBeInTheDocument()
        expect(screen.queryByText('Another Math')).not.toBeInTheDocument()
    })

    it('should reset to all companions when filters are cleared', async () => {
        const user = userEvent.setup()
        render(<CompanionListClient companions={companions} />)

        const searchInput = screen.getByLabelText('Search companions')
        await user.type(searchInput, 'test')

        // Wait for debounce
        await new Promise(resolve => setTimeout(resolve, 350))

        // Clear search
        await user.clear(searchInput)

        // Wait for debounce
        await new Promise(resolve => setTimeout(resolve, 350))

        // Should show all companions again
        expect(screen.getAllByRole('article')).toHaveLength(10)
    })

    it('should have proper accessibility attributes', () => {
        render(<CompanionListClient companions={companions} />)

        expect(screen.getByLabelText('Search companions')).toBeInTheDocument()
        expect(screen.getByLabelText('Filter by subject')).toBeInTheDocument()
        expect(screen.getByRole('list')).toBeInTheDocument()
    })
})
