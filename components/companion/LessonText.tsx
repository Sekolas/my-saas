'use client'

import React from 'react'

interface LessonTextProps {
    lessonText: string
    lessonSubtext: string
}

const LessonText: React.FC<LessonTextProps> = ({ lessonText, lessonSubtext }) => {
    return (
        <div className="mt-6 sm:mt-8 space-y-2 px-2 sm:px-0">
            <p className="text-lg sm:text-xl lg:text-2xl font-medium">{lessonText}</p>
            <p className="text-base sm:text-lg text-muted-foreground">{lessonSubtext}</p>
        </div>
    )
}

export default LessonText
