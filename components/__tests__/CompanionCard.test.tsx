import { describe, it, expect, vi } from 'vitest'
import { render, screen, userEvent } from '@/__tests__/test-utils'
import CompanionCard from '../CompanionCard'

describe('CompanionCard', () => {
    const defaultProps = {
        id: 'test-id',
        name: 'Test Companion',
        topic: 'Test Topic',
        subject: 'maths',
        duration: 30,
        color: '#FFDA6E',
    }

    it('should render companion card with all props', () => {
        render(<CompanionCard {...defaultProps} />)

        expect(screen.getByText('Test Companion')).toBeInTheDocument()
        expect(screen.getByText('Topic: Test Topic')).toBeInTheDocument()
        expect(screen.getByText('Maths')).toBeInTheDocument()
        expect(screen.getByText('30 mins duration')).toBeInTheDocument()
    })

    it('should capitalize subject name', () => {
        render(<CompanionCard {...defaultProps} subject="science" />)
        expect(screen.getByText('Science')).toBeInTheDocument()
    })

    it('should format duration correctly for numbers', () => {
        render(<CompanionCard {...defaultProps} duration={45} />)
        expect(screen.getByText('45 mins duration')).toBeInTheDocument()
    })

    it('should handle string duration', () => {
        render(<CompanionCard {...defaultProps} duration="1 hour" />)
        expect(screen.getByText('1 hour duration')).toBeInTheDocument()
    })

    it('should handle invalid duration gracefully', () => {
        render(<CompanionCard {...defaultProps} duration={NaN} />)
        expect(screen.getByText('0 mins duration')).toBeInTheDocument()
    })

    it('should render bookmark button', () => {
        render(<CompanionCard {...defaultProps} />)
        const bookmarkBtn = screen.getByLabelText('Add bookmark')
        expect(bookmarkBtn).toBeInTheDocument()
    })

    it('should show bookmarked state', () => {
        render(<CompanionCard {...defaultProps} isBookmarked={true} />)
        const bookmarkBtn = screen.getByLabelText('Remove bookmark')
        expect(bookmarkBtn).toHaveAttribute('aria-pressed', 'true')
    })

    it('should call onBookmark when bookmark button is clicked', async () => {
        const onBookmark = vi.fn()
        const user = userEvent.setup()

        render(<CompanionCard {...defaultProps} onBookmark={onBookmark} />)

        const bookmarkBtn = screen.getByLabelText('Add bookmark')
        await user.click(bookmarkBtn)

        expect(onBookmark).toHaveBeenCalledTimes(1)
    })

    it('should call onLaunch when launch button is clicked', async () => {
        const onLaunch = vi.fn()
        const user = userEvent.setup()

        render(<CompanionCard {...defaultProps} onLaunch={onLaunch} />)

        const launchBtn = screen.getByRole('button', { name: /launch lesson/i })
        await user.click(launchBtn)

        expect(onLaunch).toHaveBeenCalledTimes(1)
    })

    it('should render link to companion page', () => {
        render(<CompanionCard {...defaultProps} />)
        const link = screen.getByRole('link', { name: /launch test companion lesson/i })
        expect(link).toHaveAttribute('href', '/companion/test-id')
    })

    it('should have proper accessibility attributes', () => {
        render(<CompanionCard {...defaultProps} />)

        const card = screen.getByRole('article')
        expect(card).toHaveAttribute('aria-label', 'Test Companion companion card')

        const durationDiv = screen.getByLabelText('Duration: 30 mins')
        expect(durationDiv).toBeInTheDocument()
    })

    it('should return null for missing required props', () => {
        const { container } = render(
            <CompanionCard
                {...defaultProps}
                id=""
                name=""
            />
        )
        expect(container.firstChild).toBeNull()
    })

    it('should handle missing topic gracefully', () => {
        render(<CompanionCard {...defaultProps} topic="" />)
        expect(screen.getByText('Topic: Not specified')).toBeInTheDocument()
    })

    it('should apply custom color', () => {
        const { container } = render(<CompanionCard {...defaultProps} color="#FF0000" />)
        const card = container.querySelector('.companion-card')
        expect(card).toHaveStyle({ background: '#FF0000' })
    })

    it('should use default color if none provided', () => {
        const { container } = render(<CompanionCard {...defaultProps} color="" />)
        const card = container.querySelector('.companion-card')
        expect(card).toHaveStyle({ background: '#E5D0FF' })
    })

    it('should prevent bookmark click from bubbling', async () => {
        const onBookmark = vi.fn()
        const onLaunch = vi.fn()
        const user = userEvent.setup()

        render(<CompanionCard {...defaultProps} onBookmark={onBookmark} onLaunch={onLaunch} />)

        const bookmarkBtn = screen.getByLabelText('Add bookmark')
        await user.click(bookmarkBtn)

        expect(onBookmark).toHaveBeenCalledTimes(1)
        // onLaunch should not be called when clicking bookmark
        expect(onLaunch).not.toHaveBeenCalled()
    })
})
