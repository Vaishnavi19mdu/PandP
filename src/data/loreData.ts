export interface LoreEntry {
  id: string;
  title: string;
  category: "People" | "Places" | "Artifacts" | "Factions" | "Events" | "Creatures";
  discoveredIn: string;
  description: string;
  relatedEntries: string[];
}

export const worldLoreRegistry: LoreEntry[] = [
  // People
  {
    id: "lore-rowan",
    title: "Sage Rowan",
    category: "People",
    discoveredIn: "The Great Woods Selection",
    description: "An ancient forest traveler who holds mystical insights of woodland portals. Rowan was the first to catalog gravity wave anomalies beneath runebark trees.",
    relatedEntries: ["The Hollow Archives", "Echo Thorn", "Rift Griffin"]
  },
  {
    id: "lore-ash",
    title: "Nova Ash",
    category: "People",
    discoveredIn: "Nebula Core Selection",
    description: "A fast-stepping celestial scout. Ash traverses unstable solar wind channels by shifting their molecular frequency.",
    relatedEntries: ["Portal Anchor", "The Chronos Breach", "Lyra Starfall"]
  },
  {
    id: "lore-vale",
    title: "Ember Vale",
    category: "People",
    discoveredIn: "Pyre Realms Selection",
    description: "An ethereal sculptor of temporal flame. Vale converts high-entropy stardust into durable heat shields to withstand portal atmospheric friction.",
    relatedEntries: ["Lucien Embercrest", "The Great Blaze", "Portal Anchor"]
  },
  {
    id: "lore-quinn",
    title: "Quinn Lorekeeper",
    category: "People",
    discoveredIn: "Scriptorium Chronicles",
    description: "An elite keeper of lost scroll fragments. Quinn is capable of matching historical inks to their exact dimensional origin.",
    relatedEntries: ["The Scriptorium Faction", "Dusty Scroll Fragment", "Sage Rowan"]
  },
  {
    id: "lore-lyra",
    title: "Lyra Starfall",
    category: "People",
    discoveredIn: "Astral Canopy Select",
    description: "A brilliant celestial sorceress who commands astral alignments. She can project pathways between far-flung constellations.",
    relatedEntries: ["Nova Ash", "Celeste Nightbloom", "Aria's Observatory"]
  },
  {
    id: "lore-elara",
    title: "Elara Moonwhisper",
    category: "People",
    discoveredIn: "Silver Moon Glades",
    description: "An empathic telepath who can interpret the faint vibration of solid portals. She is revered for negotiating peace with sleeping cosmic beasts.",
    relatedEntries: ["Luna the Owlette", "Echo Thorn", "Seraphina Vale"]
  },
  {
    id: "lore-seraphina",
    title: "Seraphina Vale",
    category: "People",
    discoveredIn: "Golden Spires",
    description: "A legendary protector of portal thresholds who channels protective light. Her shields protect travelers from temporal warping.",
    relatedEntries: ["Elara Moonwhisper", "Aldric Stormbane", "The Great Scriptorium"]
  },
  {
    id: "lore-orion",
    title: "Orion Blackwood",
    category: "People",
    discoveredIn: "Ancient Grove",
    description: "A ranger who tracks the borders where wilderness melts into raw code. Orion's charts are used by initiates to navigate the outer rim.",
    relatedEntries: ["Sage Rowan", "Echo Thorn", "Caspian Thorn"]
  },
  {
    id: "lore-caspian",
    title: "Caspian Thorn",
    category: "People",
    discoveredIn: "The Bleeding Gates",
    description: "A daring swordsman specialized in breaking spatial seal locks. Caspian uses runic blades to slice through defensive temporal grids.",
    relatedEntries: ["Portal Anchor", "Orion Blackwood", "Lucien Embercrest"]
  },

  // Places
  {
    id: "lore-hollow-archives",
    title: "The Hollow Archives",
    category: "Places",
    discoveredIn: "Chapter 1",
    description: "A forgotten library suspended between parallel realities. Shifting shelves hold thousands of living manuscripts writing themselves in real-time.",
    relatedEntries: ["Quinn Lorekeeper", "Dusty Scroll Fragment", "Portal Anchor"]
  },
  {
    id: "lore-astral-observatory",
    title: "Aria's Observatory",
    category: "Places",
    discoveredIn: "Chapter 2",
    description: "A towering observatory constructed from star-glass. Its heavy telescope is calibrated to project tangible path coordinates onto dark matter fields.",
    relatedEntries: ["Lyra Starfall", "Nova Ash", "The Chronos Breach"]
  },
  {
    id: "lore-ember-sanctum",
    title: "The Ember Sanctum",
    category: "Places",
    discoveredIn: "Chapter 3",
    description: "A volatile fortress built into a core rift. The thermal heat here runs at high frequency, generating infinite physical energy fields used for manufacturing portals.",
    relatedEntries: ["Ember Vale", "Lucien Embercrest", "Portal Anchor"]
  },

  // Artifacts
  {
    id: "lore-portal-anchor",
    title: "Portal Anchor",
    category: "Artifacts",
    discoveredIn: "Introductory Trials",
    description: "A heavy brass lock infused with high-gravity chronite. It pins diverging spatial streams together, preventing travelers from fading into non-existence.",
    relatedEntries: ["The Scriptorium Faction", "Nova Ash", "The Hollow Archives"]
  },
  {
    id: "lore-dusty-scroll",
    title: "Dusty Scroll Fragment",
    category: "Artifacts",
    discoveredIn: "Scribe Vaults",
    description: "A brittle, gold-flecked fragment of the First Scroll. Once read aloud, it temporarily stabilizes gravity currents for safe crossing.",
    relatedEntries: ["Quinn Lorekeeper", "The Scriptorium Faction", "The Hollow Archives"]
  },

  // Factions
  {
    id: "lore-scriptorium",
    title: "The Scriptorium Faction",
    category: "Factions",
    discoveredIn: "Initiation Ceremony",
    description: "A historic order of dimensional chronologists who gather completed logs. They maintain the Cosmic Ledger to guarantee the continuation of reality.",
    relatedEntries: ["Quinn Lorekeeper", "Sage Rowan", "The Hollow Archives"]
  },

  // Events
  {
    id: "lore-chronos-breach",
    title: "The Chronos Breach",
    category: "Events",
    discoveredIn: "Grand Chronicle Book",
    description: "A terrifying rift catastrophe in our ancestral timeline where history merged, and physical barriers turned into liquid ink.",
    relatedEntries: ["The Scriptorium Faction", "Portal Anchor", "Nova Ash"]
  },

  // Creatures
  {
    id: "lore-luna",
    title: "Luna the Owlette",
    category: "Creatures",
    discoveredIn: "Forest Outpost",
    description: "A small cosmic owl with stardust feathers. Luna can see alternative outcomes of any decision before the traveler takes action.",
    relatedEntries: ["Elara Moonwhisper", "Sage Rowan", "Portal Anchor"]
  },
  {
    id: "lore-griffin",
    title: "Rift Griffin",
    category: "Creatures",
    discoveredIn: "Wild Canopy Peak",
    description: "A noble companion species that lives on high-voltage static charges. Their golden feathers can redirect portal electrical discharge safely.",
    relatedEntries: ["Caspian Thorn", "Orion Blackwood", "Sage Rowan"]
  }
];
