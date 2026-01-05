import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './button'

const CTA = () => {
    return (
        <section className="cta-section">
            <div className='cta-badge'>start your journey</div>
            <h2 className='text-3xl font-bold'>Ready to get started?</h2>
            <p className='text-xl'>Sign up now and start learning with our AI-powered companions.</p>
            <Image src="../images/cta.svg" alt="cta" width={362} height={232} />
            <Link href="/companion/new">
                <button className='btn-primary'>
                    <Image src="../icons/plus.svg" alt="plus" width={12} height={12} />
                    <p>Add New Companion</p>
                </button>
            </Link>
        </section>
    )
}

export default CTA