import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Reel Analyzer — Knowledge Vault',
  description: 'Clean, structured knowledge library extracted from Instagram Reels.',
  icons: {
    icon: '/logos/icon-32.png',
    shortcut: '/logos/icon-16.png',
    apple: '/logos/icon-128.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fira+Code:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
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
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-brand-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
