"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { subjectsColors, recentSessions } from '@/constants'

const CompanionLessonPage = () => {
  const params = useParams()
  const router = useRouter()
  const companionId = params.id as string

  const [companion, setCompanion] = useState<any>(null)
  const [isMicOn, setIsMicOn] = useState(false)
  const [currentLessonText, setCurrentLessonText] = useState('')
  const [lessonSubtext, setLessonSubtext] = useState('')

  useEffect(() => {
    // Fetch companion data based on ID
    const foundCompanion = recentSessions.find(s => s.id === companionId)
    
    if (foundCompanion) {
      setCompanion(foundCompanion)
      // Set lesson content based on companion
      if (foundCompanion.subject === 'science') {
        setCurrentLessonText('Neural networks of the brain are made up of billions of neurons')
        setLessonSubtext('(nerve cells) that communicate through electrical and chemical signals')
      } else if (foundCompanion.subject === 'maths') {
        setCurrentLessonText('Derivatives measure the rate of change of a function')
        setLessonSubtext('while integrals calculate the accumulation of quantities over an interval')
      } else if (foundCompanion.subject === 'language') {
        setCurrentLessonText('Literature allows us to explore different perspectives and cultures')
        setLessonSubtext('through the power of storytelling and written expression')
      } else if (foundCompanion.subject === 'coding') {
        setCurrentLessonText('If-else statements allow programs to make decisions')
        setLessonSubtext('by executing different code blocks based on specific conditions')
      } else if (foundCompanion.subject === 'history') {
        setCurrentLessonText('World Wars shaped the modern geopolitical landscape')
        setLessonSubtext('through complex alliances, technological advances, and social changes')
      } else if (foundCompanion.subject === 'economics') {
        setCurrentLessonText('Supply and demand determine market prices')
        setLessonSubtext('through the interaction of producers and consumers in the marketplace')
      } else {
        setCurrentLessonText('Welcome to your learning session!')
        setLessonSubtext('Let\'s begin exploring this topic together')
      }
    } else {
      // Default companion if ID not found (for demo purposes)
      const defaultCompanion = {
        id: companionId,
        subject: 'science',
        name: 'Neura the Brainy Explorer',
        topic: 'Neural Network of the Brain',
        duration: 45,
        color: '#E5D0FF',
      }
      setCompanion(defaultCompanion)
      setCurrentLessonText('Neural networks of the brain are made up of billions of neurons')
      setLessonSubtext('(nerve cells) that communicate through electrical and chemical signals')
    }
  }, [companionId])

  const handleMicToggle = () => {
    setIsMicOn(!isMicOn)
    // Handle mic toggle logic here
  }

  const handleRepeat = () => {
    // Handle repeat logic here
    console.log('Repeating last message')
  }

  const handleEndLesson = () => {
    if (confirm('Are you sure you want to end this lesson?')) {
      router.push('/companion')
    }
  }

  if (!companion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading companion...</p>
      </div>
    )
  }

  const subjectColor = subjectsColors[companion.subject as keyof typeof subjectsColors] || '#E5D0FF'

  return (
    <div className="min-h-screen bg-background">
      {/* Top Lesson Bar */}
      <div className="bg-[#1a1a2e] text-white py-2 px-4">
        <p className="text-sm font-medium">Lesson</p>
      </div>

      {/* Navigation Header */}
      <header className="border-b border-border bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: subjectColor }}>
              C
            </div>
            <span className="text-xl font-bold">Converso</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <Link href="/companion" className="text-sm text-muted-foreground hover:text-foreground">
              Learning Companions
            </Link>
            <Link href="/journey" className="text-sm text-muted-foreground hover:text-foreground">
              My Journey
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center text-white text-xs font-semibold">
                A
              </div>
              <button className="w-8 h-8 bg-destructive rounded flex items-center justify-center hover:bg-destructive/90 transition-colors">
                <Image
                  src="/icons/logout.svg"
                  alt="Logout"
                  width={16}
                  height={16}
                  className="invert"
                />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Lesson Information Card */}
        <div className="rounded-4xl border border-black bg-white p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: subjectColor }}
              >
                <Image
                  src={`/icons/${companion.subject}.svg`}
                  alt={companion.subject}
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold">{companion.name}</h2>
                  <span className="subject-badge">{companion.subject}</span>
                </div>
                <p className="text-muted-foreground">
                  Topic: {companion.topic}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">{companion.duration} mins</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex gap-6">
          {/* Left: Companion Display Area */}
          <div className="flex-1 rounded-4xl border-4 border-destructive bg-white p-12 flex flex-col items-center justify-center min-h-[500px]">
            <div
              className="w-48 h-48 rounded-2xl flex items-center justify-center mb-6"
              style={{ backgroundColor: subjectColor }}
            >
              <Image
                src={`/icons/${companion.subject}.svg`}
                alt={companion.name}
                width={120}
                height={120}
              />
            </div>
            <h3 className="text-3xl font-bold">{companion.name}</h3>
          </div>

          {/* Right: User Controls Panel */}
          <div className="w-80 rounded-4xl border border-black bg-white p-6 flex flex-col gap-6">
            {/* User Profile */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center text-white text-2xl font-semibold">
                A
              </div>
              <p className="text-lg font-semibold">Adrian</p>
            </div>

            {/* Control Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-4 border-2 border-black"
                onClick={handleMicToggle}
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
                className="w-full justify-start gap-3 h-auto py-4 border-2 border-black"
                onClick={handleRepeat}
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
              className="w-full mt-auto py-6 text-lg font-semibold"
              onClick={handleEndLesson}
            >
              End Lesson
            </Button>
          </div>
        </div>

        {/* Lesson Text Display */}
        <div className="mt-8 space-y-2">
          <p className="text-2xl font-medium">{currentLessonText}</p>
          <p className="text-lg text-muted-foreground">{lessonSubtext}</p>
        </div>
      </div>
    </div>
  )
}

export default CompanionLessonPage

