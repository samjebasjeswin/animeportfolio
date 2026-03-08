import './globals.css'

export const metadata = {
    title: 'SAMJEBAS | WordPress & Full-stack Developer',
    description: 'Jeswin K - WordPress & Full-stack Developer crafting digital universes with Next.js, Python, and AI.',
    keywords: 'Full-stack Developer, WordPress Developer, Next.js, Python, AI, Computer Vision',
    authors: [{ name: 'Jeswin K - SAMJEBAS' }],
    openGraph: {
        title: 'SAMJEBAS | WordPress & Full-stack Developer',
        description: 'Crafting digital universes with Next.js, architecting backends with Python.',
        type: 'website',
    },
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>{children}</body>
        </html>
    )
}
