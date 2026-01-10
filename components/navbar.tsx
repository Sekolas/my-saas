import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import NavItems from './NavItems'

function Navbar() {
  return (
    <nav className='navbar'>
      <Link href="/">
        <div className='flex items-center gap-2.5 cursor-pointer'>
          <Image
            src="/images/logo.svg"
            alt="logo"
            width={46}
            height={44}
          />
        </div>
      </Link>
      <div className='flex items-center gap-4'>
        <NavItems />
        <SignedOut>
          <Link href="/sign-in">
            <button className='btn-signin'>Sign In</button>
          </Link>
          <Link href="/sign-up">
            <button className='btn-signin'>Sign Up</button>
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  )
}

export default Navbar