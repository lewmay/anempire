/**
 * Centralized SEO Metadata
 * Define unique title, description, OG tags for each page.
 * Used by metadata utility functions to generate proper meta tags.
 */

export const seoConfig = {
  // Site-wide defaults
  site: {
    name: 'anEmpire',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://anempire.com',
    description: 'When marketing isn\'t designed to connect to how a business actually operates, it can\'t compound. Understanding the structural pattern behind growth.',
    ogImage: '/og-image.png', // Default OG image
    twitterHandle: '@anempire', // If you have one
  },

  // Organization info for structured data
  organization: {
    name: 'anEmpire',
    legalName: 'anEmpire',
    description: 'Strategic consulting for owner-led service businesses moving from effort-based growth to compounding systems.',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://anempire.com',
    email: 'hello@anempire.com',
    // Add more if available: logo, address, social profiles, etc.
  },

  // Page-specific metadata
  pages: {
    home: {
      title: 'anEmpire — When Marketing Can\'t Compound',
      description: 'Most marketing doesn\'t fail loudly. It fades. Not because the work was bad, but because it lived on its own. Understanding the structural pattern behind growth.',
      ogTitle: 'anEmpire — When Marketing Can\'t Compound',
      ogDescription: 'Understanding the structural pattern behind why most marketing resets instead of compounds.',
    },

    pattern: {
      title: 'The Pattern — anEmpire',
      description: 'The pattern is structural, not tactical. Marketing fails when campaigns live separately from the business they\'re trying to grow. There\'s no bridge.',
      ogTitle: 'The Pattern — anEmpire',
      ogDescription: 'Why marketing doesn\'t compound: the structural pattern across service businesses.',
    },

    locate: {
      title: 'Locate Your Business — anEmpire',
      description: 'Before you take a quiz, understand the three patterns service businesses fall into and what changes when they move out of them.',
      ogTitle: 'Locate Your Business — anEmpire',
      ogDescription: 'Understand where your business is in the pattern of effort-based to compounding growth.',
    },

    save: {
      title: 'Save for Later — anEmpire',
      description: 'This page is dense on purpose. Save it for when you\'re ready to sit with the pattern explanation.',
      ogTitle: 'Save for Later — anEmpire',
      ogDescription: 'Get a reminder to return to the pattern explanation when you\'re ready.',
    },

    thankYou: {
      title: 'That\'s Enough for Now — anEmpire',
      description: 'Clarity doesn\'t rush. It accumulates.',
      ogTitle: 'Thank You — anEmpire',
      ogDescription: 'That\'s enough for now. Clarity doesn\'t rush. It accumulates.',
    },

    patternExplained: {
      title: 'The Pattern Explained — anEmpire',
      description: 'When owner-led service businesses move from effort to compounding. Understanding the three awarenesses: effort is carrying the business, growth reveals what was invisible, the business can now carry growth.',
      ogTitle: 'The Pattern Explained — anEmpire',
      ogDescription: 'The three awarenesses of structural growth in owner-led service businesses.',
    },

    ask: {
      title: 'Ask a Question — anEmpire',
      description: 'You don\'t need to be ready. You don\'t need a plan. If something you just read landed, this is where to ask.',
      ogTitle: 'Ask a Question — anEmpire',
      ogDescription: 'Ask a question about the pattern, growth, or where your business is.',
    },

    conversation: {
      title: 'Request a Conversation — anEmpire',
      description: 'This is not an introduction call. A working conversation about whether structure can unlock what effort hasn\'t.',
      ogTitle: 'Request a Conversation — anEmpire',
      ogDescription: 'Request a strategic conversation about moving from effort-based to compounding growth.',
    },

    blog: {
      title: 'Articles — anEmpire',
      description: 'Collected observations on growth, structure, and visibility in owner-led service businesses.',
      ogTitle: 'Articles — anEmpire',
      ogDescription: 'Editorial observations on the structural patterns behind compounding growth.',
    },
  },
} as const;

export type SeoConfig = typeof seoConfig;
