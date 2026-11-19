const interestKeywords = {
  teknologi: [
    'teknologi',
    'technology',
    'tech',
    'digital',
    'coding',
    'programming',
    'informatika',
    'software',
    'web development',
    'kecerdasan buatan',
    'artificial intelligence',
    'ai',
  ],
  bisnis: [
    'bisnis',
    'business',
    'entrepreneur',
    'entrepreneurship',
    'kewirausahaan',
    'ekonomi',
    'startup',
    'keuangan',
  ],
  akademik: [
    'akademik',
    'academic',
    'study',
    'belajar',
    'ujian',
    'research',
    'riset',
    'penelitian',
    'kuliah',
  ],
  seni: [
    'seni',
    'art',
    'creative',
    'kreatif',
    'design',
    'desain',
    'poster',
    'photography',
    'fotografi',
    'lukisan',
    'pameran',
  ],
  musik: [
    'musik',
    'music',
    'choir',
    'singing',
    'vocal',
    'paduan suara',
    'menyanyi',
    'vokal',
    'lagu',
    'konser',
  ],
  olahraga: [
    'olahraga',
    'sports',
    'sport',
    'fitness',
    'basket',
    'badminton',
    'volleyball',
    'sepak bola',
  ],
  sosial: [
    'sosial',
    'social',
    'volunteer',
    'relawan',
    'community',
    'komunitas',
    'kemanusiaan',
    'bakti sosial',
  ],
  kerohanian: [
    'spiritual',
    'religious',
    'ibadah',
    'worship',
    'vesper',
    'sabbath',
    'midweek',
    'kerohanian',
    'rohani',
  ],
  kepemimpinan: [
    'kepemimpinan',
    'leadership',
    'organization',
    'organisasi',
    'bem',
    'public speaking',
    'komunikasi',
  ],
  lingkungan: [
    'lingkungan',
    'environment',
    'sustainability',
    'alam',
    'eco',
    'kebersihan',
    'iklim',
  ],
};

const normalize = value =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const hasKeyword = (text, keyword) => {
  const normalizedKeyword = normalize(keyword).trim();
  if (!normalizedKeyword) return false;
  const expression = new RegExp(
    `(^|[^a-z0-9])${escapeRegExp(normalizedKeyword)}($|[^a-z0-9])`
  );
  return expression.test(normalize(text));
};

export const categoryText = (event, categories = []) =>
  `${event.title || ''} ${event.organizerName || ''} ${event.description || ''} ${
    event.eventType || ''
  } ${(event.tags || []).join(' ')} ${
    categories.find(category => category.id === event.categoryId)?.name ||
    event.categoryId ||
    ''
  }`;

export const matchingInterests = (event, user, categories = []) => {
  const text = categoryText(event, categories);
  return (user?.interests || []).filter(interest => {
    const keywords = interestKeywords[normalize(interest).trim()] || [interest];
    return keywords.some(keyword => hasKeyword(text, keyword));
  });
};

export const matchingPreferences = (event, user, categories = []) => {
  const text = categoryText(event, categories);
  const preferences = [
    ...(user?.interests || []),
    ...(user?.hobbies || []),
  ].filter(Boolean);
  return [...new Set(preferences)].filter(preference => {
    const keywords = interestKeywords[normalize(preference).trim()] || [preference];
    return keywords.some(keyword => hasKeyword(text, keyword));
  });
};

const compareByDate = (left, right) =>
  left.date.localeCompare(right.date) ||
  (left.startTime || '').localeCompare(right.startTime || '');

export const getRecommendations = (
  events,
  user,
  categories = [],
  fallbackLimit = 3
) => {
  const preferences = [
    ...(user?.interests || []),
    ...(user?.hobbies || []),
  ].filter(Boolean);
  if (!preferences.length) {
    return [...events].sort(compareByDate).slice(0, fallbackLimit);
  }

  return events
    .map(event => ({
      event,
      matches: matchingPreferences(event, user, categories),
    }))
    .filter(result => result.matches.length > 0)
    .sort(
      (left, right) =>
        right.matches.length - left.matches.length ||
        compareByDate(left.event, right.event)
    )
    .map(result => result.event);
};

export const getRecommendationGroups = (
  events,
  user,
  categories = [],
  fallbackLimit = 3
) => {
  const interests = user?.interests || [];
  if (!interests.length) {
    return [
      {
        interest: null,
        events: getRecommendations(events, user, categories, fallbackLimit),
      },
    ];
  }

  return interests.map(interest => ({
    interest,
    events: getRecommendations(
      events,
      { ...user, interests: [interest] },
      categories
    ),
  }));
};

export const recommendationScore = (event, user, categories = []) => {
  const text = normalize(categoryText(event, categories));
  const preferences = [
    ...(user?.interests || []),
    ...(user?.hobbies || []),
    ...(user?.activityTypes || []),
    ...(user?.freeTime || []),
  ].filter(Boolean);
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Makassar',
  }).format(new Date());

  return preferences.reduce(
    (score, preference) => score + (text.includes(normalize(preference)) ? 3 : 0),
    0,
  ) + (event.date >= today ? 1 : 0);
};

export const recommendationReason = (event, user, categories = []) => {
  const matches = matchingPreferences(event, user, categories);
  return matches.length
    ? `Cocok dengan ${matches.slice(0, 2).join(' dan ')}`
    : 'Agenda terdekat yang masih tersedia';
};
