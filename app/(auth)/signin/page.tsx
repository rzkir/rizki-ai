import Signin from '@/components/auth/signin/Signin'

import { breadcrumbSigninJsonLd } from '@/helper/breadchumb/Script'

export default function SigninPage() {
  return (
    <>
      <script
        id="breadcrumb-signin-schema"
        type="application/ld+json"
        key="breadcrumb-signin-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSigninJsonLd) }}
      />
      <Signin />
    </>
  )
}
