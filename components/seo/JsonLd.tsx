import React from 'react';

export const FAQ_ITEMS = [
  {
    question: 'How does Reel Analyzer extract notes and summaries from Instagram Reels?',
    answer:
      'Reel Analyzer automatically detects when you open saved Instagram Reels, sends clean transcript and visual cues to Meta AI in a secure, local-first workflow, and extracts structured insights, key takeaways, step-by-step frameworks, and code blocks.',
  },
  {
    question: 'Do I need my own OpenAI, Gemini, or Claude API keys to use Reel Analyzer?',
    answer:
      'No! Reel Analyzer is 100% free and requires zero paid API keys. It leverages your existing browser session with Meta AI for fast, unlimited summarization without monthly API fees or rate limits.',
  },
  {
    question: 'How does the Obsidian Markdown Vault export work?',
    answer:
      'With a single click, you can export your entire collection of summarized reels into a structured, organized `.zip` file containing formatted `.md` Markdown files. These notes include YAML frontmatter, tags, domains, and backlink hooks designed specifically for Obsidian, Logseq, and Notion.',
  },
  {
    question: 'Is my personal browsing data or Instagram login private and secure?',
    answer:
      'Yes, 100%. Reel Analyzer operates with a strict local-first architecture. All your saved reels, summaries, and transcripts remain on your local device (IndexedDB/Chrome Storage). We do not track, store, or transmit your Instagram credentials or personal data.',
  },
  {
    question: 'Can I search, filter, and organize my reel summaries by topic and creator?',
    answer:
      'Yes. The companion Web Dashboard and local vault let you categorize reels by domains (e.g., Technology, Acting, Cooking, Business), filter by specific creators, search through full-text notes, and study them with interactive flashcards.',
  },
];

export default function JsonLd() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Reel Analyzer',
    alternateName: ['Reel Analyzer Studio', 'ReelAnalyzer'],
    url: 'https://reelanalyzer.manikanta.co.in',
    description:
      'Extract Instagram Reels into permanent, structured knowledge notes, Obsidian Markdown vaults, and interactive study flashcards.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://reelanalyzer.manikanta.co.in/vault?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Reel Analyzer',
    url: 'https://reelanalyzer.manikanta.co.in',
    logo: 'https://reelanalyzer.manikanta.co.in/logos/icon-128.png',
    sameAs: [
      'https://chromewebstore.google.com/detail/nfoegekloemokpjdmhbkfaihnokfecci',
      'https://github.com/Manikanta891/Reel-Analyzer-Website',
    ],
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Reel Analyzer',
    applicationCategory: 'MultimediaApplication, Productivity, EducationalApplication',
    operatingSystem: 'Google Chrome, Microsoft Edge, Brave, Web Browser',
    url: 'https://reelanalyzer.manikanta.co.in',
    downloadUrl:
      'https://chromewebstore.google.com/detail/nfoegekloemokpjdmhbkfaihnokfecci?utm_source=item-share-cb',
    image: 'https://reelanalyzer.manikanta.co.in/og-image.png',
    screenshot: 'https://reelanalyzer.manikanta.co.in/og-image.png',
    description:
      'Extract Instagram Reels into permanent, structured knowledge notes, Obsidian Markdown vaults, and interactive study flashcards. 100% Free & Local-First.',
    softwareVersion: '1.2.0',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      ratingCount: '24',
      bestRating: '5',
      worstRating: '1',
    },
    author: {
      '@type': 'Person',
      name: 'Manikanta',
      url: 'https://manikanta.co.in',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
