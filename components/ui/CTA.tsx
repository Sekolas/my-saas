import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './button'

const CTA = () => {
    return (
        <section className="cta-section">
            <div className='cta-badge text-sm'>start your journey</div>
            <h2 className='text-2xl font-bold'>Ready to get started?</h2>
            <p className='text-base'>Sign up now and start learning with our AI-powered companions.</p>
            <Button className='cta-button'>Get Started</Button>
            <Image src="/images/cta.svg" alt="cta" width={362} height={232} />
            <Link href="/companion/new" className='btn-primary'>
                <Image src="/icons/plus.svg" alt="plus" width={12} height={12} />
                <span>Add New Companion</span>
            </Link>
        </section>
    )
}

export default CTA