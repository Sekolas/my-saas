'use client'

import React from 'react'
import Image from 'next/image'

interface CompanionDisplayProps {
    companion: {
        name: string
        subject: string
    }
    subjectColor: string
}

const CompanionDisplay: React.FC<CompanionDisplayProps> = ({ companion, subjectColor }) => {
    return (
        <div className="flex-1 rounded-4xl border-4 border-destructive bg-white p-6 sm:p-8 lg:p-12 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]">
            <div
                className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-2xl flex items-center justify-center mb-4 sm:mb-6"
                style={{ backgroundColor: subjectColor }}
            >
                <Image
                    src={`/icons/${companion.subject}.svg`}
                    alt={companion.name}
                    width={80}
                    height={80}
                    className="sm:w-24 sm:h-24 lg:w-[120px] lg:h-[120px]"
                />
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center">{companion.name}</h3>
        </div>
    )
}

export default CompanionDisplay
