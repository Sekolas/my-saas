'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface SessionControlsProps {
    isMicOn: boolean
    onMicToggle: () => void
    onRepeat: () => void
    onEndLesson: () => void
    userName?: string
    userImage?: string
}

const SessionControls: React.FC<SessionControlsProps> = ({
    isMicOn,
    onMicToggle,
    onRepeat,
    onEndLesson,
    userName = 'User',
    userImage
}) => {
    // Get first letter of username for fallback avatar
    const userInitial = userName.charAt(0).toUpperCase()

    return (
        <div className="w-full lg:w-80 rounded-4xl border border-black bg-white p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
            {/* User Profile */}
            <div className="flex flex-col items-center gap-3">
                {userImage ? (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-gray-200">
                        <Image
                            src={userImage}
                            alt={userName}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center text-white text-xl sm:text-2xl font-semibold">
                        {userInitial}
                    </div>
                )}
                <p className="text-base sm:text-lg font-semibold">{userName}</p>
            </div>

            {/* Control Buttons */}
            <div className="space-y-3">
                <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-auto py-3 sm:py-4 border-2 border-black text-sm sm:text-base"
                    onClick={onMicToggle}
                >
                    <Image
                        src={isMicOn ? '/icons/mic-on.svg' : '/icons/mic-off.svg'}
                        alt={isMicOn ? 'Mic on' : 'Mic off'}
                        width={20}
                        height={20}
                    />
                    <span>{isMicOn ? 'Turn off mic' : 'Turn on mic'}</span>
                </Button>

                <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-auto py-3 sm:py-4 border-2 border-black text-sm sm:text-base"
                    onClick={onRepeat}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                        <path d="M21 3v5h-5" />
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                        <path d="M3 21v-5h5" />
                    </svg>
                    <span>Repeat</span>
                </Button>
            </div>

            {/* End Lesson Button */}
            <Button
                variant="destructive"
                className="w-full mt-auto py-4 sm:py-6 text-base sm:text-lg font-semibold"
                onClick={onEndLesson}
            >
                End Lesson
            </Button>
        </div>
    )
}

export default SessionControls
