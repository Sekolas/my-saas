'use client'

import React from 'react'
import Image from 'next/image'

interface CompanionInfoCardProps {
    companion: {
        name: string
        subject: string
        topic: string
        duration: number
    }
    subjectColor: string
}

const CompanionInfoCard: React.FC<CompanionInfoCardProps> = ({ companion, subjectColor }) => {
    return (
        <div className="rounded-4xl border border-black bg-white p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <div
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: subjectColor }}
                    >
                        <Image
                            src={`/icons/${companion.subject}.svg`}
                            alt={companion.subject}
                            width={32}
                            height={32}
                            className="sm:w-10 sm:h-10"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
                            <h2 className="text-lg sm:text-2xl font-bold truncate">{companion.name}</h2>
                            <span className="subject-badge text-xs sm:text-sm">{companion.subject}</span>
                        </div>
                        <p className="text-sm sm:text-base text-muted-foreground truncate">
                            Topic: {companion.topic}
                        </p>
                    </div>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
                    <p className="text-base sm:text-lg font-semibold">{companion.duration} mins</p>
                </div>
            </div>
        </div>
    )
}

export default CompanionInfoCard
