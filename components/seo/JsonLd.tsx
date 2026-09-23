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
    question: 'Who created Reel Analyzer?',
    answer:
      'Reel Analyzer was designed and developed by Manikanta Sandula, an AI and software engineer specializing in browser extensions, personal knowledge management, and AI developer workflows.',
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
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://manikanta.co.in/#person',
    name: 'Manikanta Sandula',
    alternateName: ['Manikanta', 'Manikanta891'],
    jobTitle: 'AI & Software Engineer',
    description:
      'Creator of Reel Analyzer, specialized in AI agents, browser extensions, and local-first personal knowledge management systems.',
    url: 'https://manikanta.co.in',
    sameAs: [
      'https://github.com/Manikanta891',
      'https://www.linkedin.com/in/manikantasandula/',
      'https://x.com/manikanta891',
      'https://manikanta.co.in',
    ],
    knowsAbout: [
      'Artificial Intelligence',
      'Browser Extensions',
      'Personal Knowledge Management',
      'Obsidian',
      'Full Stack Engineering',
      'Next.js',
      'Generative Engine Optimization',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Reel Analyzer',
    alternateName: [
      'Reel Analyzer Studio',
      'ReelAnalyzer',
      'Reel Analyzer by Manikanta Sandula',
    ],
    url: 'https://reelanalyzer.manikanta.co.in',
    description:
      'Extract Instagram Reels into permanent, structured knowledge notes, Obsidian Markdown vaults, and interactive study flashcards. Built by Manikanta Sandula.',
    author: {
      '@type': 'Person',
      name: 'Manikanta Sandula',
      url: 'https://manikanta.co.in',
    },
    creator: {
      '@id': 'https://manikanta.co.in/#person',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate:
          'https://reelanalyzer.manikanta.co.in/vault?q={search_term_string}',
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
    founder: {
      '@id': 'https://manikanta.co.in/#person',
    },
    sameAs: [
      'https://chromewebstore.google.com/detail/nfoegekloemokpjdmhbkfaihnokfecci',
      'https://github.com/Manikanta891/Reel-Analyzer-Website',
      'https://github.com/Manikanta891',
    ],
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Reel Analyzer',
    applicationCategory:
      'MultimediaApplication, Productivity, EducationalApplication',
    operatingSystem: 'Google Chrome, Microsoft Edge, Brave, Web Browser',
    url: 'https://reelanalyzer.manikanta.co.in',
    downloadUrl:
      'https://chromewebstore.google.com/detail/nfoegekloemokpjdmhbkfaihnokfecci?utm_source=item-share-cb',
    image: 'https://reelanalyzer.manikanta.co.in/og-image.png',
    screenshot: 'https://reelanalyzer.manikanta.co.in/og-image.png',
    description:
      'Extract Instagram Reels into permanent, structured knowledge notes, Obsidian Markdown vaults, and interactive study flashcards. Built by Manikanta Sandula. 100% Free & Local-First.',
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
      name: 'Manikanta Sandula',
      url: 'https://manikanta.co.in',
    },
    creator: {
      '@id': 'https://manikanta.co.in/#person',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Turn Instagram Reels into Structured Notes and Obsidian Vaults',
    description:
      'A step-by-step guide to extracting actionable insights, transcripts, and code snippets from saved Instagram Reels into Obsidian Markdown using Reel Analyzer.',
    image: 'https://reelanalyzer.manikanta.co.in/og-image.png',
    author: {
      '@type': 'Person',
      name: 'Manikanta Sandula',
    },
    step: [
      {
        '@type': 'HowToStep',
        name: 'Install Reel Analyzer Extension',
        text: 'Add the free Reel Analyzer extension to Google Chrome, Brave, or Microsoft Edge.',
        url: 'https://chromewebstore.google.com/detail/nfoegekloemokpjdmhbkfaihnokfecci',
      },
      {
        '@type': 'HowToStep',
        name: 'Open any Instagram Reel',
        text: 'Navigate to any Instagram Reel on desktop or browse your Saved Reels tab.',
        url: 'https://www.instagram.com',
      },
      {
        '@type': 'HowToStep',
        name: 'Click 1-Click Analyze',
        text: 'Click the Analyze Reel button. The extension extracts the key insight, step-by-step framework, mentioned tools, and code blocks.',
      },
      {
        '@type': 'HowToStep',
        name: 'Export to Obsidian or Prompt AI Agent',
        text: 'Export structured Markdown notes with YAML properties to your Obsidian vault, or copy the context directly into ChatGPT, Gemini, or Cursor IDE.',
        url: 'https://reelanalyzer.manikanta.co.in/vault',
      },
    ],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://reelanalyzer.manikanta.co.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Knowledge Vault',
        item: 'https://reelanalyzer.manikanta.co.in/vault',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Privacy Policy',
        item: 'https://reelanalyzer.manikanta.co.in/privacy',
      },
    ],
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
