import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Fira_Code } from 'next/font/google';
import Script from 'next/script';
import JsonLd from '@/components/seo/JsonLd';
import { SiteVisitorTracker } from '@/components/analytics/SiteVisitorTracker';
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
    default: 'Reel Analyzer — Instagram Reels AI Summarizer & Obsidian Notes by Manikanta Sandula',
    template: '%s | Reel Analyzer',
  },
  description:
    'Reel Analyzer by Manikanta Sandula is the free, local-first AI Chrome extension and knowledge vault that extracts actionable insights, transcripts, frameworks, and Obsidian Markdown notes from Instagram Reels.',
  applicationName: 'Reel Analyzer',
  keywords: [
    'Manikanta Sandula',
    'Manikanta Sandula projects',
    'Manikanta Sandula developer',
    'Manikanta Sandula AI',
    'Manikanta Sandula Reel Analyzer',
    'Reel Analyzer',
    'Reel Analyzer Studio',
    'reelanalyzer',
    'Instagram Reels Summarizer',
    'Instagram Reels AI Summarizer',
    'Instagram Reels to Obsidian',
    'Reels to Markdown',
    'Extract Code from Instagram Reels',
    'Instagram Video Transcriber',
    'Obsidian Vault Export',
    'Video to Markdown Notes',
    'Meta AI Reel Notes',
    'ChatGPT Instagram Reels Prompt',
    'Cursor IDE Reels Workflow',
    'Personal Knowledge Management PKM',
    'AI Note Taking Chrome Extension',
    'Developer Reels Bookmarks',
    'Social Media Knowledge Base',
    'Local First Video Summaries',
    'Instagram Study Flashcards',
    'Generative Engine Optimization',
  ],
  authors: [
    { name: 'Manikanta Sandula', url: 'https://manikanta.co.in' },
  ],
  creator: 'Manikanta Sandula',
  publisher: 'Manikanta Sandula & Reel Analyzer',
  category: 'Productivity & AI Tools',
  alternates: {
    canonical: 'https://reelanalyzer.manikanta.co.in',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/logos/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/logos/icon-48.png', sizes: '48x48', type: 'image/png' },
    ],
    shortcut: '/logos/icon-16.png',
    apple: '/logos/icon-128.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://reelanalyzer.manikanta.co.in',
    title: 'Reel Analyzer — Instagram Reels AI Summarizer & Obsidian Notes by Manikanta Sandula',
    description:
      'Turn Instagram Reels into structured knowledge notes, Obsidian Markdown vaults, and study flashcards. Built by Manikanta Sandula. 100% Free, Local-First, Zero API Keys required.',
    siteName: 'Reel Analyzer',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Reel Analyzer — Turn Instagram Reels into Structured Knowledge & Obsidian Vaults by Manikanta Sandula',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reel Analyzer — Instagram Reels AI Summarizer by Manikanta Sandula',
    description:
      'Turn Instagram Reels into structured knowledge notes, Obsidian Markdown vaults, and AI coding prompts. Built by Manikanta Sandula. 100% Free & Local-First.',
    images: ['/og-image.png'],
    creator: '@manikanta891',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
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
        <JsonLd />
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
        <SiteVisitorTracker />
        {children}
      </body>
    </html>
  );
}
