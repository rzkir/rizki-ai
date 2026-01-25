const SITE_URL = process.env.NEXT_PUBLIC_APP_URL as string
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME as string

//=================== Home ===================//
export const breadcrumbHomeJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Beranda", "item": SITE_URL },
    ]
}

export const sitelinksJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "url": SITE_URL,
    "description": "Advanced AI assistant platform providing specialized solutions for academia, legal, marketing, and creative tasks",
    "potentialAction": {
        "@type": "SearchAction",
        "target": `${SITE_URL}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
    },
    "mainEntity": {
        "@type": "Organization",
        "name": SITE_NAME,
        "url": SITE_URL,
        "description": "Advanced AI assistant platform providing specialized solutions for academia, legal, marketing, and creative tasks"
    }
}

export const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SITE_NAME,
    "url": SITE_URL,
    "logo": `${SITE_URL}/favicon.ico`,
    "description": "Advanced AI assistant platform providing specialized solutions for academia, legal, marketing, and creative tasks"
}

//=================== Signin ===================//
export const breadcrumbSigninJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Beranda", "item": `${SITE_URL}` },
        { "@type": "ListItem", "position": 2, "name": "Masuk", "item": `${SITE_URL}/signin` }
    ]
}

export function SigninSitelinksJsonLd() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        url: `${SITE_URL}/signin`,
        name: `${SITE_NAME} - Masuk`,
        description: 'Masuk ke akun ' + SITE_NAME + ' - Platform AI Assistant yang menyediakan solusi khusus untuk akademik, legal, marketing, dan tugas kreatif',
        mainEntity: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
            description: 'Advanced AI assistant platform providing specialized solutions for academia, legal, marketing, and creative tasks'
        },
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Beranda',
                    item: SITE_URL
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Masuk',
                    item: `${SITE_URL}/signin`
                }
            ]
        }
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}
//=================== Signup ===================//
export function SignupSitelinksJsonLd() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        url: `${SITE_URL}/signup`,
        name: `${SITE_NAME} - Daftar Akun`,
        description: 'Daftar akun baru di ' + SITE_NAME + ' - Platform AI Assistant yang menyediakan solusi khusus untuk akademik, legal, marketing, dan tugas kreatif',
        mainEntity: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
            description: 'Advanced AI assistant platform providing specialized solutions for academia, legal, marketing, and creative tasks'
        },
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Beranda',
                    item: SITE_URL
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Daftar',
                    item: `${SITE_URL}/signup`
                }
            ]
        }
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}

export const breadcrumbSignupJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Beranda", "item": `${SITE_URL}` },
        { "@type": "ListItem", "position": 2, "name": "Daftar", "item": `${SITE_URL}/signup` }
    ]
}

//=================== Programming ===================//
export const breadcrumbProgrammingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Beranda", "item": `${SITE_URL}` },
        { "@type": "ListItem", "position": 2, "name": "Programming", "item": `${SITE_URL}/programming` }
    ]
}

//=================== Technology ===================//
export const breadcrumbTechnologyJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Beranda", "item": `${SITE_URL}` },
        { "@type": "ListItem", "position": 2, "name": "Technology", "item": `${SITE_URL}/technology` }
    ]
}

//=================== Academia ===================//
export const breadcrumbAcademiaJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Beranda", "item": `${SITE_URL}` },
        { "@type": "ListItem", "position": 2, "name": "Academia", "item": `${SITE_URL}/academia` }
    ]
}

//=================== Science ===================//
export const breadcrumbScienceJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Beranda", "item": `${SITE_URL}` },
        { "@type": "ListItem", "position": 2, "name": "Science", "item": `${SITE_URL}/science` }
    ]
}

//=================== Translation ===================//
export const breadcrumbTranslationJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Beranda", "item": `${SITE_URL}` },
        { "@type": "ListItem", "position": 2, "name": "Translation", "item": `${SITE_URL}/translation` }
    ]
}

//=================== Image Analysis ===================//
export const breadcrumbImageAnalysisJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Beranda", "item": `${SITE_URL}` },
        { "@type": "ListItem", "position": 2, "name": "Analisis Gambar", "item": `${SITE_URL}/image-analysis` }
    ]
}

//=================== Image Generator ===================//
export const breadcrumbImageGeneratorJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Beranda", "item": `${SITE_URL}` },
        { "@type": "ListItem", "position": 2, "name": "Generator Gambar", "item": `${SITE_URL}/image-generator` }
    ]
}

//=================== Curhat ===================//
export const breadcrumbCurhatJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Beranda", "item": `${SITE_URL}` },
        { "@type": "ListItem", "position": 2, "name": "Curhat", "item": `${SITE_URL}/curhat` }
    ]
}

//=================== Health ===================//
export const breadcrumbHealthJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Beranda", "item": `${SITE_URL}` },
        { "@type": "ListItem", "position": 2, "name": "Kesehatan", "item": `${SITE_URL}/health` }
    ]
}

//=================== Finance ===================//
export const breadcrumbFinanceJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Beranda", "item": `${SITE_URL}` },
        { "@type": "ListItem", "position": 2, "name": "Keuangan", "item": `${SITE_URL}/finance` }
    ]
}

//=================== Legal ===================//
export const breadcrumbLegalJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Beranda", "item": `${SITE_URL}` },
        { "@type": "ListItem", "position": 2, "name": "Legal", "item": `${SITE_URL}/legal` }
    ]
}

//=================== Marketing ===================//
export const breadcrumbMarketingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Beranda", "item": `${SITE_URL}` },
        { "@type": "ListItem", "position": 2, "name": "Marketing", "item": `${SITE_URL}/marketing` }
    ]
}

//=================== SEO ===================//
export const breadcrumbSeoJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Beranda", "item": `${SITE_URL}` },
        { "@type": "ListItem", "position": 2, "name": "SEO", "item": `${SITE_URL}/seo` }
    ]
}

//=================== Video Generator ===================//
export const breadcrumbVideoGeneratorJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Beranda", "item": `${SITE_URL}` },
        { "@type": "ListItem", "position": 2, "name": "Generator Video", "item": `${SITE_URL}/video-generator` }
    ]
}

//=================== Video Analysis ===================//
export const breadcrumbVideoAnalysisJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Beranda", "item": `${SITE_URL}` },
        { "@type": "ListItem", "position": 2, "name": "Analisis Video", "item": `${SITE_URL}/video-analysis` }
    ]
}