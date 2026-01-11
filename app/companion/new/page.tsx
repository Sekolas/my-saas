import React from 'react'
import CompanionForm from '@/components/CompanionForm'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

const CompanionBuilderPage = async () => {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

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
          <CompanionForm />
        </div>
      </div>
    </div>
  )
}

export default CompanionBuilderPage
