"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import Link from 'next/link'
import { subjects, subjectsColors, voices, recentSessions } from '@/constants'

const CompanionPage = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedCompanion, setSelectedCompanion] = useState<any>(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'companion'; content: string }>>([])
  const [isListening, setIsListening] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleSubjectSelect = (subject: string) => {
    // Clear any pending timeout from previous subject
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
    setSelectedSubject(subject)
    const companion = recentSessions.find(s => s.subject === subject)
    
    // Create a default companion if none is found in recentSessions
    const companionToUse = companion || {
      id: `default-${subject}`,
      subject: subject,
      name: `${subject.charAt(0).toUpperCase() + subject.slice(1)} Companion`,
      topic: `Introduction to ${subject.charAt(0).toUpperCase() + subject.slice(1)}`,
      duration: 30,
      color: subjectsColors[subject as keyof typeof subjectsColors] || '#E5D0FF',
    }
    
    setSelectedCompanion(companionToUse)
    setMessages([{
      role: 'companion',
      content: `Hello! I'm ${companionToUse.name}. Ready to learn about ${companionToUse.topic}?`
    }])
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    // Clear any pending timeout from previous message
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    setMessages([...messages, { role: 'user', content: message }])
    setMessage('')

    // Simulate companion response
    timeoutRef.current = setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'companion',
        content: `That's a great question! Let me explain that in more detail...`
      }])
      timeoutRef.current = null
    }, 1000)
  }

  const toggleListening = () => {
    setIsListening(!isListening)
    // Handle voice input logic here
  }

  // Cleanup timeout on unmount or when subject changes
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [selectedSubject])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {!selectedSubject ? (
          /* Subject Selection */
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">Choose Your Learning Companion</h1>
              <p className="text-muted-foreground">
                Select a subject to start learning with your AI companion
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => handleSubjectSelect(subject)}
                  className="rounded-2xl border border-black bg-white p-6 hover:shadow-lg transition-all text-left"
                  style={{
                    borderColor: subjectsColors[subject as keyof typeof subjectsColors],
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Image
                      src={`/icons/${subject}.svg`}
                      alt={subject}
                      width={32}
                      height={32}
                    />
                    <h3 className="font-semibold capitalize">{subject}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {recentSessions.find(s => s.subject === subject)?.name || 'AI Companion'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Companion Chat Interface */
          <div className="max-w-4xl mx-auto">
            <div className="rounded-4xl border border-black bg-white p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: selectedCompanion?.color }}
                  >
                    <Image
                      src={`/icons/${selectedSubject}.svg`}
                      alt={selectedSubject || ''}
                      width={32}
                      height={32}
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedCompanion?.name}</h2>
                    <p className="text-muted-foreground">{selectedCompanion?.topic}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Clear any pending timeout when changing subject
                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current)
                      timeoutRef.current = null
                    }
                    setSelectedSubject(null)
                    setSelectedCompanion(null)
                    setMessages([])
                  }}
                >
                  Change Subject
                </Button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="rounded-4xl border border-black bg-white p-6 mb-6 min-h-[400px] max-h-[500px] overflow-y-auto">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                type="text"
                placeholder="Type your message or question..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={toggleListening}
                className={isListening ? 'bg-destructive text-white' : ''}
              >
                <Image
                  src={isListening ? '/icons/mic-on.svg' : '/icons/mic-off.svg'}
                  alt={isListening ? 'Stop listening' : 'Start listening'}
                  width={20}
                  height={20}
                />
              </Button>
              <Button type="submit" size="lg">
                Send
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default CompanionPage

