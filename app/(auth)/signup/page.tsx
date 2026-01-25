import Signup from "@/components/auth/signup/Signup"

import { breadcrumbSignupJsonLd } from '@/helper/breadchumb/Script'

export default function SignupPage() {
  return (
    <>
      <script
        id="breadcrumb-signup-schema"
        type="application/ld+json"
        key="breadcrumb-signup-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSignupJsonLd) }}
      />
      <Signup />
    </>
  )
}
