export interface WorldSeed {
  id: string;
  name: string;
  genre: string;
  difficulty: "Beginner" | "Acolyte" | "Grandmaster";
  companionName: string;
  companionType: string;
  companionMessage: string;
  objective: string;
  length: "Short" | "Medium" | "Long";
  description: string;
  startingStats: {
    knowledge: number;
    courage: number;
    creativity: number;
    luck: number;
  };
  startingInventory: string[];
  illustrationSeed: string; // Used to customize visual background or icons
}

export const worldSeeds: WorldSeed[] = [
  {
    id: "hollow-archives",
    name: "The Hollow Archives",
    genre: "Fantasy",
    difficulty: "Acolyte",
    companionName: "Corvus",
    companionType: "Sarcastic Raven",
    companionMessage: "'Oh great, another mortal seeking books. Try not to trigger the silent ward spells or we both end up as bookmarks.'",
    objective: "Recover a forgotten manuscript before the library disappears.",
    length: "Medium",
    description: "An infinite library of dust and echoes suspended inside a pocket dimension. Every three hours, the shelves shuffle, erasing unauthorized guests. Ancient guardians patrols the aisles, hunting down the legendary Codex of Midnight.",
    startingStats: {
      knowledge: 5,
      courage: 3,
      creativity: 4,
      luck: 2
    },
    startingInventory: ["Bronze Key", "Map Fragment", "Ancient Compass"],
    illustrationSeed: "ancient_library"
  },
  {
    id: "last-signal",
    name: "The Last Signal",
    genre: "Sci-Fi",
    difficulty: "Grandmaster",
    companionName: "A.R.I.A.",
    companionType: "AI Projection / Hologram Owl",
    companionMessage: "'Energy cells are at fifteen percent. Atmospheric shield breach imminent. It would be... logical to hurry, Pioneer.'",
    objective: "Re-establish communication with the orbital beacon before the star goes quiet.",
    length: "Long",
    description: "A derelict listening post on an icy moon rotating around a decaying neutron star. Uncover the final logs of the crew, decipher orbital alignment matrices, and decide whether to release or contain a volatile cosmic frequency.",
    startingStats: {
      knowledge: 6,
      courage: 2,
      creativity: 5,
      luck: 1
    },
    startingInventory: ["Thermal Flare", "Decrypter Module", "Coaxial Splitter"],
    illustrationSeed: "sci_fi_station"
  },
  {
    id: "merchants-trial",
    name: "Merchant's Trial",
    genre: "Adventure",
    difficulty: "Beginner",
    companionName: "Barnaby",
    companionType: "Jovial Merchant's Guild Golem",
    companionMessage: "'A deal's a deal, friend! Just check the weight of those coins and keep an eye on the dune-sharks!'",
    objective: "Negotiate the safe passage of silk caravans through the Sunken Shallows.",
    length: "Short",
    description: "A shifting desert of salt flats and sand-drowned sea beds. Navigating trade routes means bartering with desert nomads, tracking weather anomalies, and handling your ledger without going completely bankrupt.",
    startingStats: {
      knowledge: 3,
      courage: 4,
      creativity: 3,
      luck: 4
    },
    startingInventory: ["Ledger Book", "Sack of Spices", "Golden Scale"],
    illustrationSeed: "desert_bazaar"
  },
  {
    id: "phishing-kingdom",
    name: "The Phishing Kingdom",
    genre: "Educational",
    difficulty: "Acolyte",
    companionName: "Sylas",
    companionType: "Wise Digital Sprite",
    companionMessage: "'Caution: appearances can be deceptive here. Never trust a crown that hasn't been verified by the scroll signature.'",
    objective: "Thwart the Deceiver Lord by identifying fraudulent scrolls and digital mimics.",
    length: "Medium",
    description: "A magical realm where spellcasters communicate via digital raven-nets. The trickster demons seek your secret runes by sending fake royal decrees. Train your analytical senses to decode the signs of phishing spells.",
    startingStats: {
      knowledge: 4,
      courage: 3,
      creativity: 5,
      luck: 3
    },
    startingInventory: ["Loupe of Truth", "Secured Signet", "Warning Scroll"],
    illustrationSeed: "digital_fantasy"
  },
  {
    id: "lost-empire",
    name: "The Lost Empire",
    genre: "Mystery",
    difficulty: "Grandmaster",
    companionName: "Nyx",
    companionType: "Spectral Panther",
    companionMessage: "'The vines remember who spilt blood here. Step lightly, or the stones will swallow your shadow.'",
    objective: "Solve the architectural riddle of the central obsidian obelisk.",
    length: "Long",
    description: "An overgrown obsidian city buried in a volcanic rainforest canyon. Poisonous spores and ancient mechanical traps block entry to the inner sanctum. Solve historical clockwork puzzles to uncover safe pathways.",
    startingStats: {
      knowledge: 4,
      courage: 5,
      creativity: 3,
      luck: 2
    },
    startingInventory: ["Obsidian Shard", "Vine Cutter", "Vial of Anti-venom"],
    illustrationSeed: "jungle_ruins"
  }
];
