"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import Link from 'next/link'
import { subjects, subjectsColors, voices } from '@/constants'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { createCompanion } from '@/app/actions/companion'

const CompanionBuilderPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    topic: '',
    voiceGender: 'male',
    voiceStyle: 'casual',
    teachingStyle: 'casual',
    duration: 30,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Companion name is required'
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject'
    }

    if (!formData.topic.trim()) {
      newErrors.topic = 'Topic is required'
    }

    if (formData.duration < 5 || formData.duration > 120) {
      newErrors.duration = 'Duration must be between 5 and 120 minutes'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const { user } = useUser()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !user) {
      return
    }

    setIsSubmitting(true)

    try {
      // Get the selected voice ID
      const selectedVoice = voices[formData.voiceGender as keyof typeof voices]?.[formData.voiceStyle as 'casual' | 'formal']

      const submissionData = new FormData()
      submissionData.append('name', formData.name)
      submissionData.append('subject', formData.subject)
      submissionData.append('topic', formData.topic)
      submissionData.append('voice', selectedVoice || '')
      submissionData.append('style', formData.teachingStyle)
      submissionData.append('duration', formData.duration.toString())

      const result = await createCompanion(null, submissionData)

      if (result.message) {
        throw new Error(result.message)
      }

      if (result.success && result.companionId) {
        router.push(`/companion/${result.companionId}`)
      }
    } catch (error: any) {
      console.error('Error creating companion:', error)
      alert(`Failed to create companion: ${error.message || 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedVoiceId = voices[formData.voiceGender as keyof typeof voices]?.[formData.voiceStyle as 'casual' | 'formal']

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Build Your AI Companion</h1>
            <p className="text-muted-foreground">
              Create a custom learning companion tailored to your needs
            </p>
          </div>

          {/* Builder Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-4xl border border-black bg-white p-8 space-y-6">
              {/* Companion Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Companion Name *
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Neura the Brainy Explorer"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="input"
                  required
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Subject Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Subject *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {subjects.map((subject) => (
                    <button
                      key={subject}
                      type="button"
                      onClick={() => handleInputChange('subject', subject)}
                      className={`rounded-2xl border-2 p-4 text-left transition-all ${formData.subject === subject
                        ? 'border-primary bg-primary/10'
                        : 'border-black bg-white hover:shadow-md'
                        }`}
                      style={{
                        borderColor: formData.subject === subject
                          ? undefined
                          : subjectsColors[subject as keyof typeof subjectsColors],
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Image
                          src={`/icons/${subject}.svg`}
                          alt={subject}
                          width={24}
                          height={24}
                        />
                        <span className="font-semibold text-sm capitalize">{subject}</span>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.subject && (
                  <p className="text-sm text-destructive">{errors.subject}</p>
                )}
              </div>

              {/* Topic */}
              <div className="space-y-2">
                <label htmlFor="topic" className="text-sm font-medium">
                  Topic *
                </label>
                <Input
                  id="topic"
                  type="text"
                  placeholder="e.g., Neural Network of the Brain"
                  value={formData.topic}
                  onChange={(e) => handleInputChange('topic', e.target.value)}
                  className="input"
                  required
                />
                {errors.topic && (
                  <p className="text-sm text-destructive">{errors.topic}</p>
                )}
              </div>

              {/* Voice Selection */}
              <div className="space-y-4">
                <label className="text-sm font-medium">
                  Voice Settings
                </label>

                <div className="grid grid-cols-2 gap-4">
                  {/* Voice Gender */}
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">Gender</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleInputChange('voiceGender', 'male')}
                        className={`flex-1 rounded-xl border-2 p-3 transition-all ${formData.voiceGender === 'male'
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-background hover:border-primary/50'
                          }`}
                      >
                        <span className="font-medium">Male</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('voiceGender', 'female')}
                        className={`flex-1 rounded-xl border-2 p-3 transition-all ${formData.voiceGender === 'female'
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-background hover:border-primary/50'
                          }`}
                      >
                        <span className="font-medium">Female</span>
                      </button>
                    </div>
                  </div>

                  {/* Voice Style */}
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">Voice Style</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleInputChange('voiceStyle', 'casual')}
                        className={`flex-1 rounded-xl border-2 p-3 transition-all ${formData.voiceStyle === 'casual'
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-background hover:border-primary/50'
                          }`}
                      >
                        <span className="font-medium">Casual</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('voiceStyle', 'formal')}
                        className={`flex-1 rounded-xl border-2 p-3 transition-all ${formData.voiceStyle === 'formal'
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-background hover:border-primary/50'
                          }`}
                      >
                        <span className="font-medium">Formal</span>
                      </button>
                    </div>
                  </div>
                </div>

                {selectedVoiceId && (
                  <p className="text-xs text-muted-foreground">
                    Voice ID: {selectedVoiceId}
                  </p>
                )}
              </div>

              {/* Teaching Style */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Teaching Style
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleInputChange('teachingStyle', 'casual')}
                    className={`flex-1 rounded-xl border-2 p-3 transition-all ${formData.teachingStyle === 'casual'
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-background hover:border-primary/50'
                      }`}
                  >
                    <span className="font-medium">Casual</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Friendly and conversational
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('teachingStyle', 'formal')}
                    className={`flex-1 rounded-xl border-2 p-3 transition-all ${formData.teachingStyle === 'formal'
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-background hover:border-primary/50'
                      }`}
                  >
                    <span className="font-medium">Formal</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Professional and structured
                    </p>
                  </button>
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label htmlFor="duration" className="text-sm font-medium">
                  Session Duration (minutes) *
                </label>
                <Input
                  id="duration"
                  type="number"
                  min="5"
                  max="120"
                  step="5"
                  placeholder="30"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 30)}
                  className="input"
                  required
                />
                {errors.duration && (
                  <p className="text-sm text-destructive">{errors.duration}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Recommended: 15-60 minutes
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Companion'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CompanionBuilderPage

