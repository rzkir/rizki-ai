import { LoginForm } from '@/components/auth/signin/login-form'

export default function Signin() {
    return (
        <section className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <LoginForm />
            </div>
        </section>
    )
}
