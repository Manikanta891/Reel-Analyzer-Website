import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Fira_Code } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-fira-code',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://reelanalyzer.manikanta.co.in'),
  title: {
    default: 'Reel Analyzer — Turn Instagram Reels into Structured Knowledge',
    template: '%s | Reel Analyzer',
  },
  description: 'Turn fast-paced Instagram Reels into permanent, structured knowledge notes, Obsidian Markdown vaults, and interactive study flashcards.',
  keywords: [
    'Instagram Reels Summarizer',
    'Obsidian Vault Export',
    'Video to Markdown',
    'Personal Knowledge Management',
    'Developer Notes',
    'AI Note Taking',
  ],
  authors: [{ name: 'Manikanta' }],
  creator: 'Manikanta',
  icons: {
    icon: '/logos/icon-32.png',
    shortcut: '/logos/icon-16.png',
    apple: '/logos/icon-128.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://reelanalyzer.manikanta.co.in',
    title: 'Reel Analyzer — Turn Instagram Reels into Structured Knowledge',
    description: 'Turn fast-paced Instagram Reels into permanent, structured knowledge notes and Obsidian Markdown vaults.',
    siteName: 'Reel Analyzer',
    images: [
      {
        url: '/phone-card.png',
        width: 1200,
        height: 630,
        alt: 'Reel Analyzer Knowledge Vault',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reel Analyzer — Turn Instagram Reels into Structured Knowledge',
    description: 'Turn fast-paced Instagram Reels into permanent, structured knowledge notes and Obsidian Markdown vaults.',
    images: ['/phone-card.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${plusJakarta.variable} ${firaCode.variable}`}>
      <head>
        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VLYBXXKDZ4"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-VLYBXXKDZ4');
          `}
        </Script>
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <Script
            id="google-adsense-script"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-brand-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
