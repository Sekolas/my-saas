'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Clock, Bookmark } from 'lucide-react'

interface CompanionCardProps {
    id: string
    name: string
    topic: string
    subject: string
    duration: number | string
    color: string
    onLaunch?: () => void
    onBookmark?: () => void
    isBookmarked?: boolean
}

const CompanionCard = React.memo(({
    id,
    name,
    topic,
    subject,
    duration,
    color,
    onLaunch,
    onBookmark,
    isBookmarked = false
}: CompanionCardProps) => {
    const formatDuration = (dur: number | string): string => {
        if (typeof dur === 'string') return dur
        if (typeof dur === 'number' && !isNaN(dur)) {
            return `${dur} mins`
        }
        return '0 mins'
    }

    const handleBookmarkClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()
        onBookmark?.()
    }

    // Validate required props
    if (!id || !name || !subject) {
        console.error('CompanionCard: Missing required props', { id, name, subject })
        return null
    }

    // Safely capitalize subject
    const capitalizedSubject = subject ?
        subject.charAt(0).toUpperCase() + subject.slice(1) :
        'Unknown'

    return (
        <div
            className="companion-card"
            style={{ background: color || '#E5D0FF' }}
            role="article"
            aria-label={`${name} companion card`}
        >
            <div className="companion-card-header">
                <span className="companion-category">{capitalizedSubject}</span>
                <button
                    className="companion-bookmark"
                    onClick={handleBookmarkClick}
                    aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                    aria-pressed={isBookmarked}
                    type="button"
                >
                    <Bookmark
                        size={20}
                        fill={isBookmarked ? "currentColor" : "none"}
                        aria-hidden="true"
                    />
                </button>
            </div>

            <h3 className="companion-title">{name}</h3>
            <p className="companion-topic">Topic: {topic || 'Not specified'}</p>

            <div className="companion-duration" aria-label={`Duration: ${formatDuration(duration)}`}>
                <Clock size={16} aria-hidden="true" />
                <span>{formatDuration(duration)} duration</span>
            </div>

            <Link href={`/companion/${id}`} aria-label={`Launch ${name} lesson`}>
                <Button
                    className="companion-launch-btn"
                    onClick={onLaunch}
                    type="button"
                >
                    Launch Lesson
                </Button>
            </Link>
        </div>
    )
})

CompanionCard.displayName = 'CompanionCard'

export default CompanionCard
