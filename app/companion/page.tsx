import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { getAllCompanions } from '@/lib/supabase/queries'
import CompanionListClient from '@/components/CompanionListClient'

const Companion = async () => {
  const user = await currentUser()

  if (!user || !user.id) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-10 text-gray-500">
          Please log in to view your companions.
        </div>
      </div>
    )
  }

  // Fetch ALL companions once (no search, no pagination for now)
  const result = await getAllCompanions(user.id, 100, 1)
  const companions = result.data

  return <CompanionListClient companions={companions} />
}

export default Companion