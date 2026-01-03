"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import Link from 'next/link'
import { subjects, subjectsColors, voices } from '@/constants'

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Get the selected voice ID
    const selectedVoice = voices[formData.voiceGender as keyof typeof voices]?.[formData.voiceStyle as 'casual' | 'formal']

    const companionData = {
      name: formData.name,
      subject: formData.subject,
      topic: formData.topic,
      voice: selectedVoice || '',
      style: formData.teachingStyle,
      duration: formData.duration,
    }

    try {
      // Handle companion creation logic here
      console.log('Creating companion:', companionData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to companion page or show success message
      alert('Companion created successfully!')
      // You can redirect here: router.push('/companion')
    } catch (error) {
      console.error('Error creating companion:', error)
      alert('Failed to create companion. Please try again.')
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
                      className={`rounded-2xl border-2 p-4 text-left transition-all ${
                        formData.subject === subject
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
                        className={`flex-1 rounded-xl border-2 p-3 transition-all ${
                          formData.voiceGender === 'male'
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-background hover:border-primary/50'
                        }`}
                      >
                        <span className="font-medium">Male</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('voiceGender', 'female')}
                        className={`flex-1 rounded-xl border-2 p-3 transition-all ${
                          formData.voiceGender === 'female'
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
                        className={`flex-1 rounded-xl border-2 p-3 transition-all ${
                          formData.voiceStyle === 'casual'
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-background hover:border-primary/50'
                        }`}
                      >
                        <span className="font-medium">Casual</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('voiceStyle', 'formal')}
                        className={`flex-1 rounded-xl border-2 p-3 transition-all ${
                          formData.voiceStyle === 'formal'
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
                    className={`flex-1 rounded-xl border-2 p-3 transition-all ${
                      formData.teachingStyle === 'casual'
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
                    className={`flex-1 rounded-xl border-2 p-3 transition-all ${
                      formData.teachingStyle === 'formal'
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

