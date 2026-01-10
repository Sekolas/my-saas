import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <SignUp
                appearance={{
                    elements: {
                        rootBox: "mx-auto",
                        card: "shadow-xl"
                    }
                }}
                routing="path"
                path="/sign-up"
                signInUrl="/sign-in"
                forceRedirectUrl="/companion"
                fallbackRedirectUrl="/"
            />
        </div>
    )
}
