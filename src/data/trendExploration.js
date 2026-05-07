export const trendGenres = [
  "Fashion & beauty",
  "Fitness & health",
  "Gaming",
  "Tech",
  "Finance",
  "Travel",
  "Food",
  "Education",
  "Parenting",
  "Comedy",
];

export const trendTopicCloudByGenre = {
  "Fashion & beauty": [
    { label: "capsule wardrobe", weight: 98 },
    { label: "clean girl makeup", weight: 88 },
    { label: "skin barrier", weight: 82 },
    { label: "spring layers", weight: 74 },
    { label: "lip combo", weight: 68 },
    { label: "quiet luxury", weight: 62 },
    { label: "GRWM", weight: 57 },
    { label: "hair gloss", weight: 50 },
    { label: "outfit rotation", weight: 44 },
    { label: "SPF routine", weight: 38 },
  ],
  "Fitness & health": [
    { label: "protein breakfast", weight: 96 },
    { label: "hybrid training", weight: 88 },
    { label: "steps challenge", weight: 79 },
    { label: "mobility", weight: 72 },
    { label: "sleep score", weight: 66 },
    { label: "meal prep", weight: 60 },
    { label: "Pilates", weight: 54 },
    { label: "recovery day", weight: 48 },
    { label: "zone 2", weight: 42 },
    { label: "hydration", weight: 36 },
  ],
  Gaming: [
    { label: "cozy gaming", weight: 94 },
    { label: "ranked climb", weight: 87 },
    { label: "patch notes", weight: 81 },
    { label: "creator codes", weight: 73 },
    { label: "boss guide", weight: 66 },
    { label: "loadout", weight: 60 },
    { label: "speedrun", weight: 54 },
    { label: "stream setup", weight: 47 },
    { label: "duo queue", weight: 41 },
    { label: "new season", weight: 35 },
  ],
  Tech: [
    { label: "AI workflow", weight: 97 },
    { label: "desk setup", weight: 88 },
    { label: "productivity stack", weight: 82 },
    { label: "wearables", weight: 74 },
    { label: "camera test", weight: 68 },
    { label: "app review", weight: 61 },
    { label: "automation", weight: 55 },
    { label: "creator tools", weight: 49 },
    { label: "battery life", weight: 42 },
    { label: "privacy", weight: 36 },
  ],
  Finance: [
    { label: "budget reset", weight: 95 },
    { label: "index funds", weight: 86 },
    { label: "salary transparency", weight: 80 },
    { label: "side income", weight: 73 },
    { label: "saving rate", weight: 66 },
    { label: "mortgage tips", weight: 59 },
    { label: "tax season", weight: 53 },
    { label: "portfolio check", weight: 47 },
    { label: "money habits", weight: 41 },
    { label: "debt payoff", weight: 34 },
  ],
  Travel: [
    { label: "city guide", weight: 97 },
    { label: "hotel review", weight: 88 },
    { label: "carry-on packing", weight: 80 },
    { label: "weekend trip", weight: 73 },
    { label: "hidden gems", weight: 67 },
    { label: "train travel", weight: 60 },
    { label: "food stops", weight: 54 },
    { label: "solo travel", weight: 48 },
    { label: "itinerary", weight: 42 },
    { label: "travel outfit", weight: 36 },
  ],
  Food: [
    { label: "high protein", weight: 96 },
    { label: "weeknight dinner", weight: 87 },
    { label: "air fryer", weight: 81 },
    { label: "meal prep", weight: 73 },
    { label: "grocery haul", weight: 67 },
    { label: "coffee routine", weight: 60 },
    { label: "one pan", weight: 54 },
    { label: "snack plate", weight: 47 },
    { label: "sourdough", weight: 41 },
    { label: "budget meals", weight: 35 },
  ],
  Education: [
    { label: "study routine", weight: 95 },
    { label: "exam prep", weight: 87 },
    { label: "language learning", weight: 80 },
    { label: "career switch", weight: 73 },
    { label: "note system", weight: 66 },
    { label: "microlearning", weight: 60 },
    { label: "AI tutor", weight: 54 },
    { label: "book summary", weight: 48 },
    { label: "course review", weight: 42 },
    { label: "focus blocks", weight: 36 },
  ],
  Parenting: [
    { label: "toddler meals", weight: 96 },
    { label: "sleep routine", weight: 88 },
    { label: "school run", weight: 79 },
    { label: "family travel", weight: 72 },
    { label: "sensory play", weight: 66 },
    { label: "nursery setup", weight: 60 },
    { label: "baby gear", weight: 54 },
    { label: "meal planning", weight: 48 },
    { label: "parenting hacks", weight: 42 },
    { label: "screen time", weight: 36 },
  ],
  Comedy: [
    { label: "POV skit", weight: 97 },
    { label: "relatable work", weight: 89 },
    { label: "dating stories", weight: 82 },
    { label: "family group chat", weight: 74 },
    { label: "voiceover", weight: 68 },
    { label: "duet format", weight: 61 },
    { label: "hot take", weight: 55 },
    { label: "character bit", weight: 49 },
    { label: "daily chaos", weight: 42 },
    { label: "trend audio", weight: 36 },
  ],
};

export const trendStatsByGenre = Object.fromEntries(
  trendGenres.map((genre, genreIndex) => {
    const lift = genreIndex * 0.7;
    return [
      genre,
      [
        [
          "Followers",
          `${Math.round(96 + genreIndex * 11)}K`,
          `+${(2.4 + lift / 10).toFixed(1)}% sample`,
        ],
        [
          "Avg. Views",
          `${Math.round(31 + genreIndex * 3.4)}K`,
          `${Math.round(24 + genreIndex * 2)}K median`,
        ],
        [
          "View rate",
          `${(24.5 + genreIndex * 1.1).toFixed(1)}%`,
          "per post avg.",
        ],
        [
          "Avg. R. views",
          `${Math.round(52 + genreIndex * 4.6)}K`,
          "+8.2% trend",
        ],
        [
          "R. view rate",
          `${(42.5 + genreIndex * 1.6).toFixed(1)}%`,
          "reels sample",
        ],
        [
          "Avg. S. views",
          `${Math.round(14 + genreIndex * 1.8)}K`,
          "story avg.",
        ],
        [
          "S. view rate",
          `${(11.3 + genreIndex * 0.7).toFixed(1)}%`,
          "story sample",
        ],
        [
          "Engagements",
          `${(5.8 + genreIndex * 0.6).toFixed(1)}K`,
          "+6.4% trend",
        ],
        [
          "Engagement rate",
          `${(4.7 + genreIndex * 0.22).toFixed(1)}%`,
          "content avg.",
        ],
        [
          "Viewers eng. rate",
          `${(8.1 + genreIndex * 0.35).toFixed(1)}%`,
          "viewer avg.",
        ],
        [
          "Avg. likes",
          `${(4.6 + genreIndex * 0.45).toFixed(1)}K`,
          "+4.1% trend",
        ],
        ["Avg. comm.", `${Math.round(92 + genreIndex * 9)}`, "per post"],
        ["Avg. shares", `${Math.round(210 + genreIndex * 22)}`, "+9.8% trend"],
        ["Avg. saves", `${Math.round(340 + genreIndex * 26)}`, "+7.5% trend"],
      ],
    ];
  }),
);

export const fallbackTrendAudience = {
  locations: [
    ["Sweden", 34.2],
    ["United States", 18.6],
    ["United Kingdom", 11.4],
    ["Germany", 8.7],
    ["Norway", 6.9],
  ],
  genderSplit: { Female: 61, Male: 33, Other: 6 },
  genderByAge: [
    { group: "13-17", female: 5, male: 3 },
    { group: "18-24", female: 26, male: 14 },
    { group: "25-34", female: 30, male: 16 },
    { group: "35-44", female: 12, male: 7 },
    { group: "45-64", female: 5, male: 3 },
    { group: "65+", female: 1, male: 1 },
  ],
};

export const trendAudienceByGenre = {
  "Fashion & beauty": {
    locations: [
      ["Sweden", 31.8],
      ["France", 16.4],
      ["United Kingdom", 12.2],
      ["Germany", 9.5],
      ["Denmark", 6.8],
    ],
    genderSplit: { Female: 74, Male: 21, Other: 5 },
    genderByAge: [
      { group: "13-17", female: 6, male: 1 },
      { group: "18-24", female: 32, male: 7 },
      { group: "25-34", female: 29, male: 9 },
      { group: "35-44", female: 10, male: 4 },
      { group: "45-64", female: 4, male: 2 },
      { group: "65+", female: 1, male: 0 },
    ],
  },
  "Fitness & health": {
    locations: [
      ["United States", 28.2],
      ["Sweden", 17.5],
      ["United Kingdom", 12.8],
      ["Australia", 8.9],
      ["Norway", 6.4],
    ],
    genderSplit: { Female: 57, Male: 39, Other: 4 },
    genderByAge: [
      { group: "13-17", female: 3, male: 2 },
      { group: "18-24", female: 21, male: 15 },
      { group: "25-34", female: 27, male: 17 },
      { group: "35-44", female: 11, male: 8 },
      { group: "45-64", female: 5, male: 4 },
      { group: "65+", female: 1, male: 1 },
    ],
  },
  Gaming: {
    locations: [
      ["United States", 32.4],
      ["United Kingdom", 13.1],
      ["Germany", 10.7],
      ["Sweden", 7.9],
      ["Canada", 6.6],
    ],
    genderSplit: { Female: 24, Male: 70, Other: 6 },
    genderByAge: [
      { group: "13-17", female: 5, male: 18 },
      { group: "18-24", female: 12, male: 36 },
      { group: "25-34", female: 8, male: 21 },
      { group: "35-44", female: 3, male: 7 },
      { group: "45-64", female: 1, male: 2 },
      { group: "65+", female: 0, male: 0 },
    ],
  },
  Tech: {
    locations: [
      ["United States", 36.1],
      ["India", 14.8],
      ["United Kingdom", 10.1],
      ["Germany", 8.4],
      ["Sweden", 5.8],
    ],
    genderSplit: { Female: 31, Male: 64, Other: 5 },
    genderByAge: [
      { group: "13-17", female: 2, male: 5 },
      { group: "18-24", female: 11, male: 24 },
      { group: "25-34", female: 16, male: 29 },
      { group: "35-44", female: 7, male: 13 },
      { group: "45-64", female: 3, male: 5 },
      { group: "65+", female: 1, male: 1 },
    ],
  },
  Finance: {
    locations: [
      ["United States", 41.7],
      ["United Kingdom", 11.6],
      ["Canada", 7.8],
      ["Germany", 6.2],
      ["Sweden", 5.4],
    ],
    genderSplit: { Female: 42, Male: 54, Other: 4 },
    genderByAge: [
      { group: "13-17", female: 1, male: 2 },
      { group: "18-24", female: 12, male: 18 },
      { group: "25-34", female: 21, male: 25 },
      { group: "35-44", female: 10, male: 12 },
      { group: "45-64", female: 5, male: 7 },
      { group: "65+", female: 1, male: 2 },
    ],
  },
  Travel: {
    locations: [
      ["France", 18.9],
      ["United States", 17.4],
      ["Spain", 12.5],
      ["Italy", 11.7],
      ["Sweden", 8.2],
    ],
    genderSplit: { Female: 63, Male: 32, Other: 5 },
    genderByAge: [
      { group: "13-17", female: 3, male: 1 },
      { group: "18-24", female: 24, male: 10 },
      { group: "25-34", female: 31, male: 15 },
      { group: "35-44", female: 12, male: 6 },
      { group: "45-64", female: 5, male: 3 },
      { group: "65+", female: 1, male: 1 },
    ],
  },
  Food: {
    locations: [
      ["United States", 29.4],
      ["United Kingdom", 13.6],
      ["Sweden", 10.2],
      ["Italy", 8.5],
      ["France", 7.4],
    ],
    genderSplit: { Female: 66, Male: 29, Other: 5 },
    genderByAge: [
      { group: "13-17", female: 4, male: 2 },
      { group: "18-24", female: 23, male: 9 },
      { group: "25-34", female: 28, male: 12 },
      { group: "35-44", female: 14, male: 7 },
      { group: "45-64", female: 7, male: 4 },
      { group: "65+", female: 2, male: 1 },
    ],
  },
  Education: {
    locations: [
      ["United States", 30.2],
      ["India", 16.3],
      ["United Kingdom", 9.6],
      ["Canada", 7.1],
      ["Germany", 5.9],
    ],
    genderSplit: { Female: 55, Male: 40, Other: 5 },
    genderByAge: [
      { group: "13-17", female: 7, male: 5 },
      { group: "18-24", female: 28, male: 19 },
      { group: "25-34", female: 17, male: 13 },
      { group: "35-44", female: 6, male: 5 },
      { group: "45-64", female: 2, male: 2 },
      { group: "65+", female: 0, male: 1 },
    ],
  },
  Parenting: {
    locations: [
      ["United States", 25.6],
      ["Sweden", 16.7],
      ["United Kingdom", 13.2],
      ["Norway", 7.9],
      ["Canada", 6.1],
    ],
    genderSplit: { Female: 78, Male: 18, Other: 4 },
    genderByAge: [
      { group: "13-17", female: 1, male: 0 },
      { group: "18-24", female: 12, male: 3 },
      { group: "25-34", female: 38, male: 8 },
      { group: "35-44", female: 25, male: 6 },
      { group: "45-64", female: 6, male: 2 },
      { group: "65+", female: 1, male: 1 },
    ],
  },
  Comedy: {
    locations: [
      ["United States", 39.8],
      ["United Kingdom", 12.2],
      ["Canada", 8.1],
      ["Australia", 6.7],
      ["Germany", 5.3],
    ],
    genderSplit: { Female: 49, Male: 45, Other: 6 },
    genderByAge: [
      { group: "13-17", female: 8, male: 7 },
      { group: "18-24", female: 25, male: 22 },
      { group: "25-34", female: 17, male: 16 },
      { group: "35-44", female: 5, male: 5 },
      { group: "45-64", female: 2, male: 2 },
      { group: "65+", female: 0, male: 1 },
    ],
  },
};

export const emergingKeywordSnapshots = [
  {
    label: "protein pancakes",
    source: "sphere",
    platform: "tiktok",
    sphereTags: ["Food", "Fitness & health"],
    currentMentions: 1840,
    previousMentions: 820,
    sampleCreators: ["@mealprepmaja", "@leannefitness"],
  },
  {
    label: "coffee protein shake",
    source: "sphere",
    platform: "instagram",
    sphereTags: ["Food", "Fitness & health"],
    currentMentions: 1260,
    previousMentions: 140,
    sampleCreators: ["@mayaskitchen", "@mealprepmaja"],
  },
  {
    label: "freezer breakfast prep",
    source: "sphere",
    platform: "youtube",
    sphereTags: ["Food"],
    currentMentions: 760,
    previousMentions: 38,
    sampleCreators: ["@mealprepmaja"],
  },
  {
    label: "soft glam reset",
    source: "sphere",
    platform: "instagram",
    sphereTags: ["Fashion & beauty"],
    currentMentions: 2180,
    previousMentions: 980,
    sampleCreators: ["@nikkietutorials", "@linneastyle"],
  },
  {
    label: "barrier repair makeup",
    source: "sphere",
    platform: "tiktok",
    sphereTags: ["Fashion & beauty"],
    currentMentions: 930,
    previousMentions: 35,
    sampleCreators: ["@nikkietutorials"],
  },
  {
    label: "zone 2 walk",
    source: "sphere",
    platform: "tiktok",
    sphereTags: ["Fitness & health"],
    currentMentions: 1510,
    previousMentions: 610,
    sampleCreators: ["@leannefitness"],
  },
  {
    label: "mobility snack",
    source: "sphere",
    platform: "instagram",
    sphereTags: ["Fitness & health"],
    currentMentions: 690,
    previousMentions: 42,
    sampleCreators: ["@leannefitness"],
  },
  {
    label: "AI meeting notes",
    source: "sphere",
    platform: "youtube",
    sphereTags: ["Tech", "Education"],
    currentMentions: 2410,
    previousMentions: 1050,
    sampleCreators: ["@techwithnoah", "@alextechdesk"],
  },
  {
    label: "desk cable audit",
    source: "sphere",
    platform: "instagram",
    sphereTags: ["Tech"],
    currentMentions: 840,
    previousMentions: 0,
    sampleCreators: ["@alextechdesk"],
  },
  {
    label: "budget reset payday",
    source: "sphere",
    platform: "tiktok",
    sphereTags: ["Finance"],
    currentMentions: 1320,
    previousMentions: 520,
    sampleCreators: ["@financewithfreja"],
  },
  {
    label: "carry-on capsule",
    source: "sphere",
    platform: "instagram",
    sphereTags: ["Travel", "Fashion & beauty"],
    currentMentions: 1180,
    previousMentions: 430,
    sampleCreators: ["@travelsofella"],
  },
  {
    label: "study sprint timer",
    source: "sphere",
    platform: "youtube",
    sphereTags: ["Education"],
    currentMentions: 970,
    previousMentions: 44,
    sampleCreators: ["@studywithsara"],
  },
  {
    label: "toddler snack tray",
    source: "sphere",
    platform: "instagram",
    sphereTags: ["Parenting", "Food"],
    currentMentions: 890,
    previousMentions: 290,
    sampleCreators: ["@parentingnora"],
  },
  {
    label: "office POV audio",
    source: "sphere",
    platform: "tiktok",
    sphereTags: ["Comedy"],
    currentMentions: 1730,
    previousMentions: 510,
    sampleCreators: ["@dailychaos"],
  },
  {
    label: "protein breakfast bowl",
    source: "reference",
    platform: "tiktok",
    referenceCreatorIds: ["ref-leanne", "ref-mayafood"],
    currentMentions: 960,
    previousMentions: 80,
    sampleCreators: ["@leannefitness", "@mealprepmaja"],
  },
  {
    label: "grocery haul breakfast",
    source: "reference",
    platform: "instagram",
    referenceCreatorIds: ["ref-mayafood"],
    currentMentions: 720,
    previousMentions: 0,
    sampleCreators: ["@mayaskitchen", "@mealprepmaja"],
  },
  {
    label: "coffee routine prep",
    source: "reference",
    platform: "instagram",
    referenceCreatorIds: ["ref-mayafood", "ref-leanne"],
    currentMentions: 610,
    previousMentions: 45,
    sampleCreators: ["@mayaskitchen"],
  },
  {
    label: "creator desk setup",
    source: "reference",
    platform: "youtube",
    referenceCreatorIds: ["ref-alex"],
    currentMentions: 1040,
    previousMentions: 260,
    sampleCreators: ["@alextechdesk", "@techwithnoah"],
  },
  {
    label: "ranked patch loadout",
    source: "reference",
    platform: "tiktok",
    referenceCreatorIds: ["ref-caspergaming"],
    currentMentions: 1380,
    previousMentions: 490,
    sampleCreators: ["@casperplays", "@rankedrasmus"],
  },
  {
    label: "soft tailoring capsule",
    source: "reference",
    platform: "instagram",
    referenceCreatorIds: ["ref-matilda"],
    currentMentions: 1180,
    previousMentions: 380,
    sampleCreators: ["@matildadjerf", "@linneastyle"],
  },
];

export function normalizeEmergingKeyword(entry) {
  const currentMentions = Number(entry.currentMentions) || 0;
  const previousMentions = Number(entry.previousMentions) || 0;
  const growth =
    previousMentions > 0
      ? ((currentMentions - previousMentions) / previousMentions) * 100
      : currentMentions > 0
        ? 100
        : 0;
  return {
    ...entry,
    currentMentions,
    previousMentions,
    growth: Number(growth.toFixed(1)),
    new: previousMentions < 50,
  };
}

export function sortEmergingKeywords(keywords) {
  return [...keywords].sort((a, b) => {
    if (a.new !== b.new) return a.new ? -1 : 1;
    if (b.growth !== a.growth) return b.growth - a.growth;
    return b.currentMentions - a.currentMentions;
  });
}

export function normalizedEmergingKeywordSnapshots() {
  return sortEmergingKeywords(emergingKeywordSnapshots.map(normalizeEmergingKeyword));
}

export function relatedTopicsForSearch(keyword) {
  const clean = keyword.toLowerCase().replace(/\s+/g, " ").trim();
  const seeds = [
    "trend",
    "routine",
    "review",
    "tips",
    "haul",
    "guide",
    "setup",
    "before after",
    "mistakes",
    "favorites",
  ];
  return seeds.map((seed, index) => ({
    label: index % 3 === 0 ? clean + " " + seed : seed + " " + clean,
    weight: 96 - index * 7,
  }));
}

export function statsForSearch(keyword) {
  const size = Math.max(1, keyword.trim().length);
  const modifier = Math.min(9, size);
  return [
    ["Followers", Math.round(82 + modifier * 9) + "K", "+2.9% sample"],
    ["Avg. Views", Math.round(28 + modifier * 4) + "K", "keyword avg."],
    ["View rate", (22 + modifier * 1.2).toFixed(1) + "%", "per post avg."],
    ["Avg. R. views", Math.round(46 + modifier * 5) + "K", "+7.8% trend"],
    ["R. view rate", (38 + modifier * 1.8).toFixed(1) + "%", "reels sample"],
    ["Avg. S. views", Math.round(11 + modifier * 2) + "K", "story avg."],
    ["S. view rate", (9.5 + modifier * 0.8).toFixed(1) + "%", "story sample"],
    ["Engagements", (4.8 + modifier * 0.55).toFixed(1) + "K", "+5.6% trend"],
    [
      "Engagement rate",
      (4.1 + modifier * 0.24).toFixed(1) + "%",
      "content avg.",
    ],
    [
      "Viewers eng. rate",
      (7.4 + modifier * 0.38).toFixed(1) + "%",
      "viewer avg.",
    ],
    ["Avg. likes", (3.7 + modifier * 0.48).toFixed(1) + "K", "+4.4% trend"],
    ["Avg. comm.", Math.round(78 + modifier * 12), "per post"],
    ["Avg. shares", Math.round(180 + modifier * 28), "+8.9% trend"],
    ["Avg. saves", Math.round(290 + modifier * 31), "+7.1% trend"],
  ];
}
