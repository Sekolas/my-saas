import React from 'react'
import { Button } from '@/components/ui/button'
import CompanionCard from '@/components/CompanionCard'
import CompanionList from '@/components/ui/CompanionList'
import CTA from '@/components/ui/CTA'
import { completedLessons, recentSessions } from '@/constants'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const Page = async () => {
  const { userId } = await auth()

  if (userId) {
    const supabase = await createClient()
    const { data: companions } = await supabase
      .from('companions')
      .select('id')
      .eq('author', userId)

    if (!companions || companions.length === 0) {
      redirect('/companion/new')
    }
  }

  return (
    <main>
      <h1 className='text-2xl underline'>Popular Companions</h1>
      <section className='home-section'>
        <CompanionCard
          id="1"
          subject="Science"
          name="Neura the Brainy Explorer"
          topic="Neural Network of the Brain"
          duration="45 mins"
          color="linear-gradient(135deg, #8636b1ff 0%, #d4b5e8 100%)"
        />
        <CompanionCard
          id="2"
          subject="Math"
          name="Calculus the Number Wizard"
          topic="Advanced Calculus Concepts"
          duration="60 mins"
          color="linear-gradient(135deg, #d13c7fff 0%, #ffb5d4 100%)"
        />
        <CompanionCard
          id="3"
          subject="History"
          name="Chronos the Time Traveler"
          topic="Ancient Civilizations"
          duration="50 mins"
          color="linear-gradient(135deg, #32e4a5ff 0%, #b5e8d4 100%)"
        />

      </section>
      <section className='home-section'>
        <CompanionList
          title="Recently completed lessons"
          companions={recentSessions}
        />
        <CTA />
      </section>



    </main >
  )
}

export default Page