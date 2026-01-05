import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Clock, Bookmark } from 'lucide-react'

interface CompanionCardProps {
    id: string
    name: string
    topic: string
    subject: string
    duration: string
    color: string
    onLaunch?: () => void
    onBookmark?: () => void
    isBookmarked?: boolean
}

const CompanionCard = ({
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
    return (
        <div className="companion-card" style={{ background: color }}>
            <div className="flex justify-between items-center">
                <span className="subject-badge">{subject}</span>
                <button
                    className="companion-bookmark"
                    onClick={onBookmark}
                    aria-label="Bookmark"
                >
                    <Bookmark
                        size={20}
                        fill={isBookmarked ? "currentColor" : "none"}
                    />
                </button>
            </div>

            <h3 className="companion-title">{name}</h3>
            <p className="companion-topic">Topic: {topic}</p>

            <div className="companion-duration">
                <Clock size={16} />
                <span>{duration} duration</span>
            </div>

            <Link href={`/companion/${id}`}>
                <Button
                    className="companion-launch-btn"
                    onClick={onLaunch}
                >
                    Launch Lesson
                </Button>
            </Link>
        </div>
    )
}

export default CompanionCard