'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Companions', href: '/companion' },
    { label: 'My journey', href: '/my-journey' },
]

function NavItems() {
    const pathname = usePathname()

    return (
        <ul className='flex items-center gap-4'>
            {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                    <li key={item.href}>
                        <Link
                            href={item.href}
                            className={isActive ? 'font-bold' : 'font-normal'}
                        >
                            {item.label}
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}

export default NavItems
