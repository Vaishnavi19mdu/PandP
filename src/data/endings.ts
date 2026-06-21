export interface StoryEnding {
  id: string;
  worldId: string;
  title: string;
  description: string;
  rewardType: string;
  achievementName: string;
  secretsFound: string[];
}

export const endings: StoryEnding[] = [
  {
    id: "ha-ending-victory",
    worldId: "hollow-archives",
    title: "Master Archivist of Midnight",
    description: "You emerged from the folding library folds with the original Codex under your arm. In doing so, you saved centuries of forbidden knowledge from falling into silent dust. The ancient scholars in the High Keep award you the Silver Star Quill.",
    rewardType: "Spirited Victory",
    achievementName: "The Scholar Unchained",
    secretsFound: ["Midnight alignment code deciphered", "Raven's grudging respect earned"]
  },
  {
    id: "ha-ending-mystery",
    worldId: "hollow-archives",
    title: "The Silent Watcher",
    description: "While setting the warding chalk barriers kept you alive, you are now locked deep in the shifting bookshelves. You have become a myth whispered among young novitiates: a silent shadow that organizes chaotic books when the lamps go dim.",
    rewardType: "Mystic Stalemate",
    achievementName: "Ghost in the Shelves",
    secretsFound: ["Warding barrier active", "Chalk circle coordinates memorized"]
  },
  {
    id: "ha-ending-sacrifice",
    worldId: "hollow-archives",
    title: "The Broken Signal",
    description: "You escaped without the Codex but scrambled the map gears, burying the library safely so the paper beast could never escape. You return with an empty pack but a clear conscience.",
    rewardType: "Noble Retreat",
    achievementName: "Sacrificial Sentinel",
    secretsFound: ["Clockwork loop disabled"]
  },
  {
    id: "ha-ending-trap",
    worldId: "hollow-archives",
    title: "Inked Forever",
    description: "The black liquid ink fully bonds with your soul. You are now page 512 of a musty tome on structural magic, forever awaiting a future reader to trace your outlines and learn your cautionary story.",
    rewardType: "Tragic Downfall",
    achievementName: "Read and Wept",
    secretsFound: ["Ink curse triggered"]
  },
  {
    id: "pk-ending-victory",
    worldId: "phishing-kingdom",
    title: "Grand Marshal of Firewalls",
    description: "You have verified the Royal Treasury sender and captured the fraudulent Lord of Scams. The Digital Raven-Nets are now authentic, and citizens send their magical coins without fear of deceptive spell blocks.",
    rewardType: "Absolute Cleanse",
    achievementName: "Verified Sigil",
    secretsFound: ["Loupe authentication success", "Scammer fortress coordinates acquired"]
  },
  {
    id: "pk-ending-scammed",
    worldId: "phishing-kingdom",
    title: "Wandering Ghost Protocol",
    description: "You signed the parasitic contract and lost custody of your private memory keys. Your runes belong to the scammer cartel, leaving you to wander the outer digital dunes as an unverified guest.",
    rewardType: "Absolute Defeat",
    achievementName: "Phished Spellcaster",
    secretsFound: ["Mimic signature trigger"]
  }
];
