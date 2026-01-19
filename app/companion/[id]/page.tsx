"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { getCompanionById } from '@/lib/supabase/queries'
import { subjectsColors } from '@/constants'
import CompanionInfoCard from '@/components/companion/CompanionInfoCard'
import CompanionDisplay from '@/components/companion/CompanionDisplay'
import SessionControls from '@/components/companion/SessionControls'
import LessonText from '@/components/companion/LessonText'

type Companion = {
  id: string
  name: string
  subject: string
  topic: string
  duration: number
  author: string
  created_at: string
  bookmarked: boolean
}

const CompanionLessonPage = () => {
  const params = useParams()
  const router = useRouter()
  const companionId = params.id as string
  const { user } = useUser()

  const [companion, setCompanion] = useState<Companion | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMicOn, setIsMicOn] = useState(false)
  const [currentLessonText, setCurrentLessonText] = useState('')
  const [lessonSubtext, setLessonSubtext] = useState('')

  useEffect(() => {
    async function fetchCompanion() {
      try {
        setLoading(true)
        setError(null)

        const data = await getCompanionById(companionId)

        if (!data) {
          setError('Companion not found')
          return
        }

        setCompanion(data)

        // Set lesson content based on companion subject
        const lessonContent = getLessonContent(data.subject)
        setCurrentLessonText(lessonContent.text)
        setLessonSubtext(lessonContent.subtext)
      } catch (err) {
        console.error('Error fetching companion:', err)
        setError('Failed to load companion')
      } finally {
        setLoading(false)
      }
    }

    if (companionId) {
      fetchCompanion()
    }
  }, [companionId])

  const getLessonContent = (subject: string) => {
    const lessonMap: Record<string, { text: string; subtext: string }> = {
      science: {
        text: 'Neural networks of the brain are made up of billions of neurons',
        subtext: '(nerve cells) that communicate through electrical and chemical signals'
      },
      maths: {
        text: 'Derivatives measure the rate of change of a function',
        subtext: 'while integrals calculate the accumulation of quantities over an interval'
      },
      language: {
        text: 'Literature allows us to explore different perspectives and cultures',
        subtext: 'through the power of storytelling and written expression'
      },
      coding: {
        text: 'If-else statements allow programs to make decisions',
        subtext: 'by executing different code blocks based on specific conditions'
      },
      history: {
        text: 'World Wars shaped the modern geopolitical landscape',
        subtext: 'through complex alliances, technological advances, and social changes'
      },
      economics: {
        text: 'Supply and demand determine market prices',
        subtext: 'through the interaction of producers and consumers in the marketplace'
      }
    }

    return lessonMap[subject] || {
      text: 'Welcome to your learning session!',
      subtext: "Let's begin exploring this topic together"
    }
  }

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading companion...</p>
      </div>
    )
  }

  if (error || !companion) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-destructive text-lg">{error || 'Companion not found'}</p>
        <Button onClick={() => router.push('/companion')}>
          Back to Companions
        </Button>
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Lesson Information Card */}
        <CompanionInfoCard companion={companion} subjectColor={subjectColor} />

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Left: Companion Display Area */}
          <CompanionDisplay companion={companion} subjectColor={subjectColor} />

          {/* Right: User Controls Panel */}
          <SessionControls
            isMicOn={isMicOn}
            onMicToggle={handleMicToggle}
            onRepeat={handleRepeat}
            onEndLesson={handleEndLesson}
            userName={user?.firstName || user?.username || 'User'}
            userImage={user?.imageUrl}
          />
        </div>

        {/* Lesson Text Display */}
        <LessonText lessonText={currentLessonText} lessonSubtext={lessonSubtext} />
      </div>
    </div>
  )
}

export default CompanionLessonPage
