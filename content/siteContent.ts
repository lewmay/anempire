/**
 * Central Site Content
 * All page copy is defined here for easy editing.
 * Organized by page, then by section.
 */

export const siteContent = {
  // Global elements
  global: {
    siteName: 'anEmpire',
    blogLinkText: 'Blog articles',
  },

  // Homepage content
  homepage: {
    sections: [
      {
        id: 'opening',
        text: 'Most marketing doesn\'t fail loudly.\n\nIt fades.',
      },
      {
        id: 'pattern',
        text: 'Campaigns run.\n\nMetrics move.\n\nThen everything resets.',
      },
      {
        id: 'divider',
        text: 'Not because the work was bad...\n\nbut because it lived on its own.',
      },
      {
        id: 'structure',
        text: 'When marketing isn\'t designed to connect\nto how a business actually operates,\nit can\'t compound.',
      },
      {
        id: 'universal',
        text: 'No matter how creative it is.\n\nNo matter who builds it.',
      },
      {
        id: 'observation',
        text: 'You will see this pattern repeat\n\nacross service businesses.',
      },
      {
        id: 'industries',
        text: 'Different industries.\n\nSame outcome.',
      },
      {
        id: 'question',
        text: 'What do you want to do next?',
      },
    ],
    links: {
      pattern: 'Follow the pattern',
      locate: 'Locate your business inside it',
    },
    scrollIndicator: 'scroll down',
  },

  // Pattern page content
  pattern: {
    opening: 'The pattern is structural. Not tactical.',
    sections: [
      'Marketing doesn\'t fail because campaigns are bad.',
      'It fails because they live separately from the business they\'re trying to grow.',
      'There\'s no bridge.',
      'What attracts people doesn\'t connect to what serves them.',
      'So every campaign starts from the same place.',
      'New leads flow in. The business responds. Then it stops.',
      'The owner fills the gaps. The team adapts. Systems stay informal.',
      'What worked at one scale breaks at the next.',
      'Growth doesn\'t compound. It resets.',
      'That\'s the pattern.',
    ],
    finalQuestion: 'Where is your business in this pattern?',
    links: {
      locate: 'Locate your business',
      stepBack: 'Step back to overview',
    },
  },

  // Locate page content
  locate: {
    title: 'Before we continue',
    explanation: [
      'Most sites would ask you to take a quiz.',
      'You\'d answer questions about your business.',
      'The system would score your responses.',
      'Then you\'d get results that feel personalized but mostly aren\'t.',
    ],
    alternative: 'Instead, we\'ll show you the three patterns businesses actually fall into, and what changes when they move out of them.',
    reassurance: 'It\'s dense on purpose. You don\'t have to process all of it now.',
    links: {
      lookNow: 'Look at this now',
      saveLater: 'Save this for later',
    },
  },

  // Save for Later page content
  save: {
    title: 'Save this for later',
    explanation: [
      'This page is dense on purpose.',
      'It doesn\'t reveal itself in a single read.',
    ],
    options: {
      email: {
        label: 'Send me a reminder',
        helper: 'One email only. No sequence. No follow-ups.',
        placeholder: 'your@email.com',
        button: 'Send reminder',
      },
      noThanks: {
        label: 'No thanks, I\'ll find my way back',
      },
    },
  },

  // Thank You page content
  thankYou: {
    title: 'That\'s enough for now.',
    body: 'Clarity doesn\'t rush.\n\nIt accumulates.',
    closing: 'We\'ll reach out if there\'s something to add.',
    link: 'Return to the beginning',
  },

  // Pattern Explained page content
  patternExplained: {
    title: 'The Pattern Explained',
    subtitle: 'When owner-led firms actually move from effort to compounding',
    opening: 'Most service businesses don\'t plateau because they lack opportunities.\n\nThey plateau because the owner becomes the bottleneck.\n\nThis pattern is structural, not personal.',
    sections: [
      {
        title: 'First Awareness',
        subtitle: 'Effort is carrying the business',
        content: [
          'At this stage, the owner is everywhere.',
          'Client relationships depend on them.',
          'Quality control runs through them.',
          'Every decision loops back to them.',
          'This works—until demand increases.',
          'Growth doesn\'t relieve pressure. It multiplies it.',
          'What feels like momentum is actually effort compounding on itself.',
        ],
      },
      {
        title: 'Second Awareness',
        subtitle: 'Growth reveals what was invisible',
        content: [
          'When demand rises, systems that didn\'t exist start to matter.',
          'Processes that were "handled" become constraints.',
          'The owner can\'t be in every conversation anymore.',
          'Delegation fails because there\'s nothing formal to delegate to.',
          'Marketing brings leads in, but delivery can\'t keep up.',
          'What worked at one scale breaks at the next.',
          'This is where most businesses stall.',
        ],
      },
      {
        title: 'Third Awareness',
        subtitle: 'The business can now carry growth',
        content: [
          'Structure replaces effort.',
          'Systems exist independent of the owner.',
          'Delegation works because processes are documented.',
          'Quality remains consistent without constant oversight.',
          'Marketing connects to delivery, so campaigns compound instead of reset.',
          'The owner becomes focused on direction, not execution.',
          'Growth no longer feels like it might break everything.',
        ],
      },
    ],
    closing: {
      title: 'Where this leaves you',
      content: [
        'If you\'re reading this, you already know which stage you\'re in.',
        'The question isn\'t whether you recognize the pattern.',
        'It\'s what you do next.',
      ],
    },
    links: {
      seeWhereIAm: 'See where I am',
      stepBack: 'Step back',
    },
  },

  // Ask a Question page content
  ask: {
    title: 'Ask a Question',
    opening: 'You don\'t need to be ready. You don\'t need a plan.',
    whatThisIs: {
      title: 'What this is',
      content: 'This isn\'t a discovery call request.\n\nIt\'s just a question.\n\nIf it makes sense to respond, we will.',
    },
    form: {
      title: 'Two ways to ask',
      question: {
        label: 'What\'s your question?',
        placeholder: 'Type here...',
      },
      contact: {
        label: 'Optional contact details',
        helper: 'Only if you want a response',
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
      },
      submit: 'Send question',
    },
    hotline: {
      title: 'Or use the anEmpire Hotline',
      description: 'Call or text. Same idea. No pressure.',
      number: '1-800-EMPIRE-0',
      note: 'Real number. Real responses. No scripts.',
    },
    whatHappens: {
      title: 'What happens next',
      content: 'If your question opens something worth exploring, we\'ll respond.\n\nIf it doesn\'t, you won\'t hear from us.\n\nNo follow-up sequences. No check-ins.',
    },
    closing: 'You\'re not committing to anything. This is just an opening.',
    links: {
      stepBack: 'Step back',
    },
  },

  // Request a Conversation page content
  conversation: {
    title: 'Request a Conversation',
    opening: 'This is not an introduction call.\n\nThis is a working conversation about whether structure can unlock what effort hasn\'t.',
    beforeYouContinue: {
      title: 'Before you continue',
      criteria: [
        'You run or lead a service business doing at least $500K annually',
        'You\'ve tried marketing that produced activity but didn\'t compound',
        'You suspect the problem is structural, not tactical',
        'You\'re willing to change how the business operates—not just how it markets',
      ],
      closing: 'If these don\'t describe where you are, this conversation isn\'t the right fit yet.',
    },
    form: {
      businessInfo: {
        title: 'Business Information',
        fields: {
          name: 'Business name',
          role: 'Your role in the business',
          revenue: {
            label: 'Current annual revenue range',
            options: [
              'Under $500K',
              '$500K - $1M',
              '$1M - $3M',
              '$3M - $5M',
              'Over $5M',
            ],
          },
          revenueModel: 'Primary revenue model',
          teamSize: 'Number of people involved in delivery',
        },
      },
      qualifyingQuestions: {
        title: 'Qualifying Questions',
        fields: {
          limitation: 'What is limiting growth right now?',
          responsibility: 'Who is responsible for fixing what\'s not working?',
          willingness: {
            label: 'Are you willing to change how the business operates?',
            options: [
              'Yes, structure needs to change',
              'Maybe, depends on what it requires',
              'No, I want better marketing tactics',
            ],
          },
        },
      },
      additional: {
        label: 'Anything else we should know?',
        placeholder: 'Optional',
      },
      submit: 'Request conversation',
    },
    whatHappens: {
      title: 'What happens next',
      content: 'We\'ll review your request.\n\nIf it\'s a fit, we\'ll reach out to schedule.\n\nIf it\'s not, you won\'t hear from us.',
    },
    closing: 'This isn\'t about interest. It\'s about intent.',
    links: {
      stepBack: 'Step back',
    },
  },

  // Blog index page content
  blog: {
    title: 'Articles',
    subtitle: 'Collected observations on growth, structure, and visibility.',
    links: {
      backToPattern: 'Back to The Pattern',
      stepBack: 'Step back',
    },
  },
} as const;

export type SiteContent = typeof siteContent;
