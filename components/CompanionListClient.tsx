'use client'

import React, { useState, useMemo } from 'react'
import CompanionCard from '@/components/CompanionCard'
import { Input } from '@/components/ui/input'
import { Search, ChevronDown } from 'lucide-react'
import { Database } from '@/types/database.types'
import { subjects, subjectsColors } from '@/constants'
import { useDebounce } from 'use-debounce'

type Companion = Database['public']['Tables']['companions']['Row']

interface CompanionListClientProps {
    companions: Companion[]
}

const CompanionListClient = ({ companions }: CompanionListClientProps) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedSubject, setSelectedSubject] = useState<string>('all')

    // Debounce search term to avoid excessive filtering
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300)

    const getColorForSubject = (subject: string): string => {
        if (!subject) return '#E5D0FF'
        const normalizedSubject = subject.toLowerCase()
        return subjectsColors[normalizedSubject as keyof typeof subjectsColors] || '#E5D0FF'
    }

    const filteredCompanions = useMemo(() => {
        if (!companions || companions.length === 0) return []

        let result = companions

        // Filter by subject
        if (selectedSubject !== 'all') {
            result = result.filter(companion =>
                companion?.subject?.toLowerCase() === selectedSubject.toLowerCase()
            )
        }

        // Filter by search term (debounced)
        if (debouncedSearchTerm.trim()) {
            const term = debouncedSearchTerm.toLowerCase()
            result = result.filter(companion => {
                if (!companion) return false

                const name = companion.name?.toLowerCase() || ''
                const subject = companion.subject?.toLowerCase() || ''
                const topic = companion.topic?.toLowerCase() || ''

                return name.includes(term) || subject.includes(term) || topic.includes(term)
            })
        }

        return result
    }, [companions, debouncedSearchTerm, selectedSubject])

    return (
        <div className="container mx-auto px-6 py-8">
            {/* Header with Title and Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold">Companion Library</h1>

                <div className="flex gap-3 w-full md:w-auto">
                    {/* Search Input */}
                    <div className="relative flex-1 md:flex-initial md:w-64">
                        <div className="relative flex items-center h-11 rounded-lg border border-gray-300 bg-white px-4">
                            <Search className="h-4 w-4 text-gray-400 mr-2 shrink-0" aria-hidden="true" />
                            <Input
                                type="search"
                                placeholder="Search your companions..."
                                className="flex-1 h-full border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-sm placeholder:text-gray-400 px-0"
                                onChange={(e) => setSearchTerm(e.target.value)}
                                value={searchTerm}
                                aria-label="Search companions"
                            />
                        </div>
                    </div>

                    {/* Subject Filter Dropdown */}
                    <div className="relative">
                        <select
                            className="h-11 px-4 pr-10 rounded-lg border border-gray-300 bg-white text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            aria-label="Filter by subject"
                        >
                            <option value="all">Select subject</option>
                            {subjects.map((subject) => (
                                <option key={subject} value={subject}>
                                    {subject.charAt(0).toUpperCase() + subject.slice(1)}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" aria-hidden="true" />
                    </div>
                </div>
            </div>

            {/* Cards Grid */}
            {filteredCompanions.length > 0 ? (
                <div className="companions-grid" role="list">
                    {filteredCompanions.map((companion) => (
                        <CompanionCard
                            key={companion.id}
                            id={companion.id}
                            name={companion.name}
                            topic={companion.topic}
                            subject={companion.subject}
                            duration={companion.duration}
                            color={getColorForSubject(companion.subject)}
                            isBookmarked={companion.bookmarked}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-gray-500" role="status">
                    {searchTerm || selectedSubject !== 'all'
                        ? 'No companions found matching your filters.'
                        : 'No companions found. Create one to get started!'}
                </div>
            )}
        </div>
    )
}

export default CompanionListClient
