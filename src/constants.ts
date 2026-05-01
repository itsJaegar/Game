import { Applicant } from './types/game';

export const COUNTRIES = ['Arstotzka', 'Kolechia', 'Antegria', 'Impor', 'United Federation', 'Obristan', 'Republicia', 'Cobrastan'];

export const PURPOSES = ['Work', 'Visit', 'Asylum', 'Transit', 'Permanent Residency', 'Diplomatic'];

export const generateApplicant = (day: number): Applicant => {
  const idValue = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  const names = ['Ivan', 'Dimitri', 'Sergei', 'Anna', 'Yulia', 'Boris', 'Mikhail', 'Elena', 'Viktor', 'Svetlana', 'Yuri', 'Oleg', 'Natalia', 'Katya'];
  const lastNames = ['Ivanov', 'Petrov', 'Sokolov', 'Popov', 'Lebedev', 'Kozlov', 'Novikov', 'Morozov', 'Volkov', 'Solovyov'];
  
  const name = `${names[Math.floor(Math.random() * names.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
  const purpose = PURPOSES[Math.floor(Math.random() * PURPOSES.length)];
  
  // Difficulty scaling: Ambiguity increases with days
  // Day 1-2: Clear criminals or clear value.
  // Day 3+: Subtle issues (edge case value scores, specific country restrictions)
  
  let hasCriminalRecord = false;
  let valueScore = Math.floor(Math.random() * 50) + 25; // Default mediocre

  if (day <= 2) {
    // Clear cases
    hasCriminalRecord = Math.random() < 0.3; // 30% are clear criminals
    valueScore = Math.random() < 0.5 ? Math.floor(Math.random() * 30) : Math.floor(Math.random() * 30) + 70;
  } else {
    // Ambiguous cases
    hasCriminalRecord = Math.random() < 0.15; // Fewer clear criminals, more "borderline" value scores
    valueScore = Math.floor(Math.random() * 60) + 20; // 20-80, more center-heavy
  }
  
  // Expiry date logic
  const expiryDate = new Date();
  const expiryLuck = Math.random();
  if (day <= 2) {
    if (expiryLuck < 0.2) {
      expiryDate.setDate(expiryDate.getDate() - Math.floor(Math.random() * 100) - 1); // Clearly expired
    } else {
      expiryDate.setDate(expiryDate.getDate() + Math.floor(Math.random() * 500)); // Clearly valid
    }
  } else {
    if (expiryLuck < 0.25) {
      // Very close to expiry or just expired
      const offset = Math.random() < 0.5 ? -1 : 1;
      expiryDate.setDate(expiryDate.getDate() + offset); 
    } else {
      expiryDate.setDate(expiryDate.getDate() + Math.floor(Math.random() * 100));
    }
  }

  return {
    id: idValue,
    name,
    country,
    purpose,
    hasCriminalRecord,
    valueScore,
    documentExpiry: expiryDate.toISOString().split('T')[0],
    photo: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${name}&backgroundColor=000000&fontColor=33ff33`
  };
};

export const RULES_BY_DAY: Record<number, string[]> = {
  1: [
    'ENFORCE: ENTRY PERMIT MUST BE VALID.',
    'REJECT: KNOWN CRIMINALS DETECTED BY SCAN.'
  ],
  2: [
    'ENFORCE: VALID ENTRY PERMIT.',
    'REJECT: KNOWN CRIMINALS.',
    'SCRUTINY: APPLICANTS FROM KOLECHIA ARE FORBIDDEN FOR SECURITY REVIEW.'
  ],
  3: [
    'ENFORCE: VALID ENTRY PERMIT.',
    'REJECT: KNOWN CRIMINALS.',
    'ECONOMIC POLICY: VALUE INDEX MUST BE ABOVE 40% FOR ENTRY.',
    'SCRUTINY: KOLECHIA RESTRICTIONS REMAIN IN EFFECT.'
  ],
  4: [
    'ENFORCE: VALID ENTRY PERMIT.',
    'REJECT: KNOWN CRIMINALS.',
    'ECONOMIC POLICY: VALUE INDEX INCREASED TO 55%.',
    'SCRUTINY: KOLECHIA AND ANTEGRIA ARE NOW UNDER TOTAL EMBARGO.'
  ],
  5: [
    'ENFORCE: ALL PREVIOUS RULES APPLY.',
    'DIPLOMATIC: DIPLOMATIC PURPOSE BYPASSES VALUE INDEX BUT REQUIRES NON-CRIMINAL STATUS.',
    'REJECT: ANYONE FROM COBRASTAN (NON-EXISTENT COUNTRY).'
  ]
};

export const SHOP_ITEMS = [
  { id: 'dog', name: 'LOYAL PUPPY', price: 500, type: 'dog' },
  { id: 'cat', name: 'CYBER FELINE', price: 500, type: 'cat' },
  { id: 'panda', name: 'BAMBOO BOT', price: 800, type: 'panda' },
  { id: 'bird', name: 'VOID SPARROW', price: 300, type: 'bird' },
  { id: 'robot', name: 'MINI-BOT v1', price: 1000, type: 'robot' },
];

export const COLORS = [
  { name: 'CLASSIC GREEN', value: '#33ff33' },
  { name: 'AMBER CRT', value: '#ffb000' },
  { name: 'CYBER BLUE', value: '#00ffff' },
  { name: 'GHOST WHITE', value: '#e0e0e0' },
];

export const FONTS = [
  { name: 'TERMINAL MONO', value: '"JetBrains Mono", monospace' },
  { name: 'RETRO SERIF', value: '"Courier New", serif' },
  { name: 'DOT MATRIX', value: 'monospace' },
];

export const getEmailsForDay = (day: number) => {
  const allEmails = [
    {
      id: 1,
      from: 'HR_DEPT',
      subject: '[URGENT] WELCOME TO BORDER CONTROL',
      time: '08:00 AM',
      body: `CONGRATULATIONS. YOU HAVE BEEN ASSIGNED TO BORDER CHECKPOINT DELTA-4.\n\nYOUR RESPONSIBILITIES COVER THE EVALUATION AND PROCESSING OF ALL FOREIGN ENTITIES SEEKING ENTRY.\n\nYOUR CREDENTIALS:\nUSERNAME: ADMIN_ENTRY\nPASSWORD: THE_WALL\n\nREPORT IMMEDIATELY.`
    },
    {
      id: 2,
      from: 'J_VANCE',
      subject: 'Did you see what happened?',
      time: '08:15 AM',
      body: `Hey, did you catch that mess outside? Someone was literally gunned down right in front of the gate. Security didn't even blink.\n\nStay sharp.`
    },
    {
      id: 3,
      from: 'S_PETROV',
      subject: 'Has anyone seen Miller?',
      time: '09:30 AM',
      body: `Miller's desk was empty this morning. Supervisor Kroll just stared at me when I asked.\n\nGuess he got "relocated".`
    },
  ];

  if (day >= 2) {
    allEmails.push({
      id: 4,
      from: 'ANON_99',
      subject: 'THEY ARE WATCHING',
      time: '11:00 AM',
      body: `Do not trust the scanners. The algorithms are biased. I saw a man let through yesterday who was "processed" by the cleaners within an hour.`
    });
  }

  if (day >= 3) {
    allEmails.push({
      id: 5,
      from: 'MGMT_UPDATE',
      subject: 'Efficiency Warning',
      time: '07:00 AM',
      body: `Recent data suggests a 5% drop in processing speed. Remember: A slow gate is a security risk. Performance reviews are scheduled for Friday.`
    });
  }

  return allEmails;
};
