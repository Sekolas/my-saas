'use client'

import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

const SearchInput = () => {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()
    const [value, setValue] = useState(searchParams.get('search') || '')

    useEffect(() => {
        setValue(searchParams.get('search') || '')
    }, [searchParams])

    useEffect(() => {
        const timeout = setTimeout(() => {
            const params = new URLSearchParams(searchParams)
            if (value) {
                params.set('search', value)
            } else {
                params.delete('search')
            }
            replace(`${pathname}?${params.toString()}`)
        }, 800)

        return () => clearTimeout(timeout)
    }, [value, pathname])

    return (
        <div className="relative w-full max-w-md mx-auto mb-8">
            <div className="relative flex items-center w-full h-14 rounded-full border-2 border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent px-4">
                <Search className="h-5 w-5 text-gray-400 mr-3 shrink-0" />
                <Input
                    type="search"
                    placeholder="Search subject or topic..."
                    className="flex-1 h-full border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-lg placeholder:text-gray-400 px-0"
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                />
            </div>
        </div>
    )
}

export default SearchInput
