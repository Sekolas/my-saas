'use client'

import React, { useState, useMemo } from 'react'
import CompanionCard from '@/components/CompanionCard'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { Database } from '@/types/database.types'

type Companion = Database['public']['Tables']['companions']['Row']

const PASTEL_COLORS = [
    '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9',
    '#BAE1FF', '#E6B3FF', '#FFB3E6', '#B3FFF6',
]

interface CompanionListClientProps {
    companions: Companion[]
}

const CompanionListClient = ({ companions }: CompanionListClientProps) => {
    const [searchTerm, setSearchTerm] = useState('')

    const getRandomColor = (id: string) => {
        const sum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        return PASTEL_COLORS[sum % PASTEL_COLORS.length]
    }

    const filteredCompanions = useMemo(() => {
        if (!searchTerm.trim()) return companions

        const term = searchTerm.toLowerCase()
        return companions.filter(companion =>
            companion.subject.toLowerCase().includes(term) ||
            companion.topic.toLowerCase().includes(term)
        )
    }, [companions, searchTerm])

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold">Companions</h1>

                <div className="relative w-full max-w-md">
                    <div className="relative flex items-center w-full h-14 rounded-full border-2 border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent px-4">
                        <Search className="h-5 w-5 text-gray-400 mr-3 shrink-0" />
                        <Input
                            type="search"
                            placeholder="Search subject or topic..."
                            className="flex-1 h-full border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-lg placeholder:text-gray-400 px-0"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                        />
                    </div>
                </div>
            </div>

            {filteredCompanions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCompanions.map((companion) => (
                        <CompanionCard
                            key={companion.id}
                            id={companion.id}
                            name={companion.name}
                            topic={companion.topic}
                            subject={companion.subject}
                            duration={`${companion.duration} min`}
                            color={getRandomColor(companion.id)}
                            isBookmarked={companion.bookmarked}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 text-gray-500">
                    {searchTerm ? 'No companions found matching your search.' : 'No companions found. Create one to get started!'}
                </div>
            )}
        </div>
    )
}

export default CompanionListClient
