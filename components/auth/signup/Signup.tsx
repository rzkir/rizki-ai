import { SignupForm } from './signup-form'

export default function Signup() {
    return (
        <section className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-7xl mx-auto">
                <SignupForm />
            </div>
        </section>
    )
}
