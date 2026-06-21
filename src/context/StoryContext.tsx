import React, { createContext, useContext, useState, useEffect } from "react";
import { WorldSeed, worldSeeds } from "../data/worldSeeds";
import { StoryNode, StoryChoice } from "../data/mockStory";
import { getStoryGraph, ArchiveItem, initialArchives } from "../services/storyEngine";
import { endings, StoryEnding } from "../data/endings";
import { worldLoreRegistry, LoreEntry } from "../data/loreData";

// ── Firebase ──────────────────────────────────────────────────────────────────
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
// ─────────────────────────────────────────────────────────────────────────────

export type PageName =
  | "Landing"
  | "CreatePortal"
  | "WorldOverview"
  | "Adventure"
  | "Archives"
  | "Chronicle"
  | "Login"
  | "Signup"
  | "ChooseIdentity"
  | "Profile"
  | "Achievements"
  | "MapExplorer";

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  objectiveType: "start_adventure" | "complete_adventure" | "custom_world" | "read_lore";
  targetCount: number;
  currentCount: number;
  rewardType: "golden_rune" | "stat_boost";
  rewardValue: number;
  rewardStat?: "knowledge" | "courage" | "creativity" | "luck";
  claimed: boolean;
  progressText: string;
}

export interface Persona {
  name: string;
  category: "Gender Neutral" | "Female" | "Male";
  avatar: string;
  description: string;
  specialtyTrait: string;
}

export type AdventurerTitle =
  | "Novice Traveler"
  | "Portal Wanderer"
  | "Lore Seeker"
  | "Rune Scholar"
  | "Chronicle Keeper"
  | "Dream Cartographer";

export const adventurerTitles: AdventurerTitle[] = [
  "Novice Traveler",
  "Portal Wanderer",
  "Lore Seeker",
  "Rune Scholar",
  "Chronicle Keeper",
  "Dream Cartographer",
];

export interface Companion {
  id: string;
  name: string;
  avatar: string;
  type: string;
}

export const companionsList: Companion[] = [
  { id: "luna", name: "Luna", avatar: "🦉", type: "Wise Spirit Griffin" },
  { id: "ember", name: "Ember", avatar: "🦊", type: "Mischievous Fox" },
  { id: "corvus", name: "Corvus", avatar: "🐦", type: "Sarcastic Raven" },
  { id: "nimbus", name: "Nimbus", avatar: "🐱", type: "Curious Cat" },
  { id: "ashwing", name: "Ashwing", avatar: "🐉", type: "Tiny Dragon" },
];

export type StarterTraitKey = "courage" | "knowledge" | "creativity" | "luck";

export interface StarterTrait {
  key: StarterTraitKey;
  label: string;
  emoji: string;
}

export const starterTraitsList: StarterTrait[] = [
  { key: "courage", label: "Courage", emoji: "⚔️" },
  { key: "knowledge", label: "Knowledge", emoji: "📖" },
  { key: "creativity", label: "Creativity", emoji: "🎨" },
  { key: "luck", label: "Luck", emoji: "🍀" },
];

export interface User {
  fullName: string;
  email: string;
  password?: string;
  persona: Persona;
  title: AdventurerTitle;
  companion: Companion;
  starterTrait: StarterTraitKey;
  createdAt: string;
}

export const fantasyPersonas: Persona[] = [
  // Gender Neutral
  {
    name: "Sage Rowan",
    category: "Gender Neutral",
    avatar: "🧙‍♂️",
    description: "Rowan holds natural insights of cosmic forest portals.",
    specialtyTrait: "Sylvan Sight: Discovers hidden forest coordinates.",
  },
  {
    name: "Nova Ash",
    category: "Gender Neutral",
    avatar: "✨",
    description: "Ash explores space-wells with swift ether-stepping.",
    specialtyTrait: "Chrono Step: Retries failed temporal challenges once.",
  },
  {
    name: "Ember Vale",
    category: "Gender Neutral",
    avatar: "🔥",
    description: "Vale sculpts hot temporal flame rings.",
    specialtyTrait: "Pyromancy Core: Illuminates stygian caverns and rift dungeons.",
  },
  {
    name: "Quinn Lorekeeper",
    category: "Gender Neutral",
    avatar: "📜",
    description: "Quinn catalogues ancient runic letters.",
    specialtyTrait: "Cryptographer: Decodes encrypted high-order matrix texts.",
  },
  {
    name: "River Hollow",
    category: "Gender Neutral",
    avatar: "🌊",
    description: "River listens to resonance waves flowing between portals.",
    specialtyTrait: "Aqualung Spirit: Breathes plasma stardust currents.",
  },
  {
    name: "Echo Thorn",
    category: "Gender Neutral",
    avatar: "🍃",
    description: "Echo manipulates botanical quantum vines.",
    specialtyTrait: "Flora Whisper: Manifests bridges of living runebark.",
  },
  // Female
  {
    name: "Lyra Starfall",
    category: "Female",
    avatar: "✨",
    description: "Lyra commands celestial constellations.",
    specialtyTrait: "Star Compass: Reveals unexplored dimensions on maps.",
  },
  {
    name: "Elara Moonwhisper",
    category: "Female",
    avatar: "🌙",
    description: "Elara interprets silver whispers of the cosmic moon.",
    specialtyTrait: "Siren Resonance: Calms and pacifies hostile rift guardians.",
  },
  {
    name: "Seraphina Vale",
    category: "Female",
    avatar: "🕊️",
    description: "Seraphina channels guardian spirit sanctuary wings.",
    specialtyTrait: "Aegis Aura: Negates minor physical portal hazards.",
  },
  {
    name: "Aria Evermist",
    category: "Female",
    avatar: "🌫️",
    description: "Aria manipulates mist densities to weave illusionary shields.",
    specialtyTrait: "Shroud Veil: Bypasses security patrols without combat.",
  },
  {
    name: "Celeste Nightbloom",
    category: "Female",
    avatar: "🌸",
    description: "Celeste cultivates botanical spores that bloom with life-essence.",
    specialtyTrait: "Stardust Remedy: Heals party and restores mental focus.",
  },
  // Male
  {
    name: "Orion Blackwood",
    category: "Male",
    avatar: "🌲",
    description: "Orion maps lost coordinates in wild cosmic forests.",
    specialtyTrait: "Astro-cartography: Reveals complete biome maps from inception.",
  },
  {
    name: "Caspian Thorn",
    category: "Male",
    avatar: "⚔️",
    description: "Caspian breaches sealed gate anomalies.",
    specialtyTrait: "Stellar Parry: Bypasses energetic security barriers.",
  },
  {
    name: "Lucien Embercrest",
    category: "Male",
    avatar: "🌌",
    description: "Lucien harnesses dark supernova solar flares.",
    specialtyTrait: "Supernova Spark: Deals powerful damage to twilight anomalies.",
  },
  {
    name: "Aldric Stormbane",
    category: "Male",
    avatar: "⚡",
    description: "Aldric channels cosmic static lightning.",
    specialtyTrait: "Volt Conduit: Repowers dark energy machines instantly.",
  },
  {
    name: "Finn Hollowbrook",
    category: "Male",
    avatar: "🏹",
    description: "Finn manifest celestial starlight arrows that lock targets.",
    specialtyTrait: "Eagle Horizon: Anticipates hazards three nodes in advance.",
  },
];

interface ActiveStoryState {
  world: WorldSeed;
  graph: StoryNode[];
  currentNodeId: string;
  stats: {
    knowledge: number;
    courage: number;
    creativity: number;
    luck: number;
  };
  inventory: string[];
  log: string[];
  choicesMade: { sceneTitle: string; decisionText: string }[];
  isCustom: boolean;
  customDetails?: {
    seed: string;
    genre: string;
    length: "Short" | "Medium" | "Long";
  };
}

// ── appendGroqNode param type ─────────────────────────────────────────────────
interface GroqNodeInput {
  id: string;
  title: string;
  description?: string;
  x: number;
  y: number;
  choices: StoryChoice[];
  isEnding: boolean;
  endingId?: string;
  prevNodeId: string;
}

interface StoryContextType {
  currentPage: PageName;
  setPage: (page: PageName) => void;
  activeStory: ActiveStoryState | null;
  archives: ArchiveItem[];
  worldSeedsList: WorldSeed[];
  startAdventure: (
    world: WorldSeed,
    customDetails?: { seed: string; genre: string; length: "Short" | "Medium" | "Long" }
  ) => void;
  chooseOption: (choice: StoryChoice) => { success: boolean; feedbackMsg: string };
  completeAdventure: (overrideEndingId?: string) => void;
  resetActiveStory: () => void;
  clearArchives: () => void;
  createCustomWorld: (seed: string, genre: string, length: "Short" | "Medium" | "Long") => void;
  appendGroqNode: (node: GroqNodeInput) => void;
  // Auth
  currentUser: User | null;
  personasList: Persona[];
  loginUser: (email: string, password: string) => { success: boolean; error?: string };
  signupUser: (
    fullName: string,
    email: string,
    password: string,
    persona: Persona,
    title: AdventurerTitle,
    companion: Companion,
    starterTrait: StarterTraitKey
  ) => Promise<{ success: boolean; error?: string }>;
  logoutUser: () => void;
  updateProfile: (fullName: string, persona: Persona) => void;
  // Lore and Daily Quests
  unlockedLoreIds: string[];
  unlockLore: (id: string) => void;
  newLoreToast: string | null;
  setNewLoreToast: (title: string | null) => void;
  goldenRunes: number;
  statBoosts: { knowledge: number; courage: number; creativity: number; luck: number };
  dailyQuests: DailyQuest[];
  claimDailyQuest: (id: string) => void;
  incrementQuestProgress: (
    type: "start_adventure" | "complete_adventure" | "custom_world" | "read_lore"
  ) => void;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export const StoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageName>("Landing");
  const [activeStory, setActiveStory] = useState<ActiveStoryState | null>(null);

  // ── Archives ────────────────────────────────────────────────────────────────
  const [archives, setArchives] = useState<ArchiveItem[]>(() => {
    const saved = localStorage.getItem("pp_archives");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return initialArchives; }
    }
    return initialArchives;
  });

  useEffect(() => {
    localStorage.setItem("pp_archives", JSON.stringify(archives));
  }, [archives]);

  // ── Lore ────────────────────────────────────────────────────────────────────
  const [unlockedLoreIds, setUnlockedLoreIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("pp_unlocked_lore");
    if (saved) {
      try {
        const decoded = JSON.parse(saved);
        if (Array.isArray(decoded)) return decoded;
      } catch (e) {}
    }
    return ["lore-portal-anchor", "lore-scriptorium", "lore-chronos-breach"];
  });

  const [newLoreToast, setNewLoreToast] = useState<string | null>(null);

  const unlockLore = (id: string) => {
    setUnlockedLoreIds((prev) => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      localStorage.setItem("pp_unlocked_lore", JSON.stringify(updated));
      const entry = worldLoreRegistry.find((l) => l.id === id);
      if (entry) {
        setNewLoreToast(entry.title);
        setTimeout(() => setNewLoreToast(null), 4000);
      }
      return updated;
    });
  };

  // ── Golden Runes & Stat Boosts ───────────────────────────────────────────────
  const [goldenRunes, setGoldenRunes] = useState<number>(() => {
    return Number(localStorage.getItem("pp_golden_runes") || "3");
  });

  interface StatBoosts {
    knowledge: number;
    courage: number;
    creativity: number;
    luck: number;
  }

  const defaultStatBoosts: StatBoosts = { knowledge: 0, courage: 0, creativity: 0, luck: 0 };

  const [statBoosts, setStatBoosts] = useState<StatBoosts>(() => {
    const saved = localStorage.getItem("pp_stat_boosts");
    if (saved) {
      try {
        return JSON.parse(saved) as StatBoosts;
      } catch (e) {}
    }
    return defaultStatBoosts;
  });

  useEffect(() => {
    localStorage.setItem("pp_golden_runes", String(goldenRunes));
  }, [goldenRunes]);

  useEffect(() => {
    localStorage.setItem("pp_stat_boosts", JSON.stringify(statBoosts));
  }, [statBoosts]);

  // ── Daily Quests ─────────────────────────────────────────────────────────────
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>(() => {
    const saved = localStorage.getItem("pp_daily_quests");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      {
        id: "quest-1",
        title: "Scribe of Eternity",
        description: "Explore or start a celestial portal run to secure stability.",
        objectiveType: "start_adventure",
        targetCount: 1,
        currentCount: 0,
        rewardType: "golden_rune",
        rewardValue: 2,
        claimed: false,
        progressText: "Start 1 Adventure Portal",
      },
      {
        id: "quest-2",
        title: "Matrix Cryptographer",
        description: "Study ancient parchment filters to uncover hidden world events.",
        objectiveType: "read_lore",
        targetCount: 1,
        currentCount: 0,
        rewardType: "stat_boost",
        rewardValue: 15,
        rewardStat: "knowledge",
        claimed: false,
        progressText: "Unlock / View Lore Archives",
      },
      {
        id: "quest-3",
        title: "Grand Sector Manifestation",
        description: "Scribe and code a custom dimension seed realm.",
        objectiveType: "custom_world",
        targetCount: 1,
        currentCount: 0,
        rewardType: "stat_boost",
        rewardValue: 20,
        rewardStat: "creativity",
        claimed: false,
        progressText: "Weave 1 Custom Seed Dimension",
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem("pp_daily_quests", JSON.stringify(dailyQuests));
  }, [dailyQuests]);

  const incrementQuestProgress = (
    type: "start_adventure" | "complete_adventure" | "custom_world" | "read_lore"
  ) => {
    setDailyQuests((prev) =>
      prev.map((q) => {
        if (q.objectiveType === type && !q.claimed) {
          const nextCount = Math.min(q.targetCount, q.currentCount + 1);
          return { ...q, currentCount: nextCount };
        }
        return q;
      })
    );
  };

  const claimDailyQuest = (id: string) => {
    setDailyQuests((prev) =>
      prev.map((q) => {
        if (q.id === id && q.currentCount >= q.targetCount && !q.claimed) {
          if (q.rewardType === "golden_rune") {
            setGoldenRunes((r) => r + q.rewardValue);
          } else if (q.rewardType === "stat_boost" && q.rewardStat) {
            const statKey = q.rewardStat;
            setStatBoosts((b) => ({ ...b, [statKey]: b[statKey] + q.rewardValue }));
          }
          return { ...q, claimed: true };
        }
        return q;
      })
    );
  };

  // ── Adventure Logic ──────────────────────────────────────────────────────────
  const startAdventure = (
    world: WorldSeed,
    customDetails?: { seed: string; genre: string; length: "Short" | "Medium" | "Long" }
  ) => {
    const graph = getStoryGraph(world.id, customDetails);

    setActiveStory({
      world,
      graph,
      currentNodeId: graph[0].id,
      stats: { ...world.startingStats },
      inventory: [...world.startingInventory],
      log: [`Portal opened. Adventure begins in ${world.name}`],
      choicesMade: [],
      isCustom: !!customDetails,
      customDetails,
    });

    incrementQuestProgress("start_adventure");

    if (world.id === "arch-haven") unlockLore("lore-hollow-archives");
    else if (world.id === "astral-observatory") unlockLore("lore-astral-observatory");
    else if (world.id === "ember-sanctum") unlockLore("lore-ember-sanctum");

    setCurrentPage("WorldOverview");
  };

  const createCustomWorld = (seed: string, genre: string, length: "Short" | "Medium" | "Long") => {
    const customId = `custom-${Date.now()}`;
    const customWorld: WorldSeed = {
      id: customId,
      name:
        seed.trim().length > 30
          ? seed.trim().substring(0, 30) + "..."
          : seed.trim() || "Uncharted Void",
      genre,
      difficulty: length === "Short" ? "Beginner" : length === "Medium" ? "Acolyte" : "Grandmaster",
      companionName:
        genre === "Sci-Fi" ? "NEXUS-7" : genre === "Mystery" ? "Jasper" : "Luna",
      companionType:
        genre === "Sci-Fi"
          ? "Security Probe"
          : genre === "Mystery"
          ? "Mechanical Ferret"
          : "Spirit Griffin",
      companionMessage: "'A newly manifested realm! The path is unstable, stay sharp!'",
      objective: `Resolve the structural core anomaly within the ${genre} coordinates.`,
      length,
      description: `Procedurally generated world born from your seed code: "${seed}" under the ${genre} guild.`,
      startingStats: {
        knowledge: genre === "Sci-Fi" ? 5 : 3,
        courage: genre === "Adventure" ? 5 : 3,
        creativity: genre === "Educational" || genre === "Mystery" ? 5 : 3,
        luck: 3,
      },
      startingInventory: ["Quantum Seal", "Portal Anchor"],
      illustrationSeed: genre.toLowerCase(),
    };

    incrementQuestProgress("custom_world");
    startAdventure(customWorld, { seed, genre, length });
  };

  const chooseOption = (choice: StoryChoice): { success: boolean; feedbackMsg: string } => {
    if (!activeStory) return { success: false, feedbackMsg: "No active adventure." };

    const currentNode = activeStory.graph.find((n) => n.id === activeStory.currentNodeId);
    const sceneTitle = currentNode?.title || "Unknown Scene";

    if (choice.itemRequirement && !activeStory.inventory.includes(choice.itemRequirement)) {
      return {
        success: false,
        feedbackMsg: `Portal locked! You require the item [${choice.itemRequirement}] to select this path.`,
      };
    }

    if (choice.statRequirement) {
      const { stat, value, failureNodeId, failureText } = choice.statRequirement;
      const userValue = activeStory.stats[stat];

      if (userValue < value) {
        setActiveStory((prev) => {
          if (!prev) return null;
          const updatedStats = { ...prev.stats };
          updatedStats[stat] = Math.min(10, updatedStats[stat] + 1);
          return {
            ...prev,
            currentNodeId: failureNodeId,
            stats: updatedStats,
            log: [...prev.log, `[Fallen Attempt] ${choice.text}`, failureText],
            choicesMade: [
              ...prev.choicesMade,
              { sceneTitle, decisionText: `${choice.text} (Failed Challenge)` },
            ],
          };
        });
        return {
          success: true,
          feedbackMsg: `Challenge Failed! Your ${stat} (${userValue}) was too low. Transferred to alternative timeline.`,
        };
      }
    }

    setActiveStory((prev) => {
      if (!prev) return null;

      const updatedStats = { ...prev.stats };
      if (choice.statReward) {
        const { stat, value } = choice.statReward;
        updatedStats[stat] = Math.min(10, updatedStats[stat] + value);
      }

      const updatedInventory = [...prev.inventory];
      if (choice.itemReward && !updatedInventory.includes(choice.itemReward)) {
        updatedInventory.push(choice.itemReward);
      }

      return {
        ...prev,
        currentNodeId: choice.nextNodeId,
        stats: updatedStats,
        inventory: updatedInventory,
        log: [...prev.log, `[Choice] ${choice.text}`, choice.logText],
        choicesMade: [...prev.choicesMade, { sceneTitle, decisionText: choice.text }],
      };
    });

    return { success: true, feedbackMsg: "Path secured!" };
  };

  // ── appendGroqNode ────────────────────────────────────────────────────────────
  // Called by Adventure.tsx each time Groq generates a new scene.
  // Appends the scene as a real node in the graph and moves currentNodeId to it,
  // so the PortalMap marker advances in real-time as the player progresses.
  const appendGroqNode = (node: GroqNodeInput) => {
    setActiveStory((prev) => {
      if (!prev) return null;

      // If this node already exists just move the marker (e.g. regenerate hit)
      if (prev.graph.some((n) => n.id === node.id)) {
        return { ...prev, currentNodeId: node.id };
      }

      // Patch the previous node so it has a forward edge to the new node
      const updatedGraph: StoryNode[] = prev.graph.map((n) => {
        if (n.id !== node.prevNodeId) return n;
        const alreadyLinked = n.choices.some((c) => c.nextNodeId === node.id);
        if (alreadyLinked) return n;

        const continueChoice: StoryChoice = {
          text: "Continue",
          nextNodeId: node.id,
          logText: `Entered ${node.title}`,
          // NOTE: these fields are optional (`?:`) on StoryChoice, i.e. typed as
          // `T | undefined`, not `T | null`. Use `undefined` (or omit entirely)
          // rather than `null` so this object satisfies the StoryChoice type.
          statReward: undefined,
          itemReward: undefined,
          itemRequirement: undefined,
          statRequirement: undefined,
        };

        return {
          ...n,
          choices: [...n.choices, continueChoice],
        };
      });

      const newNode: StoryNode = {
        id: node.id,
        title: node.title,
        description: node.description ?? `A newly conjured scene unfolds: ${node.title}.`,
        x: node.x,
        y: node.y,
        choices: node.choices,
        isEnding: node.isEnding,
        endingId: node.endingId,
      };

      return {
        ...prev,
        graph: [...updatedGraph, newNode],
        currentNodeId: node.id,
      };
    });
  };
  // ─────────────────────────────────────────────────────────────────────────────

  const completeAdventure = async (overrideEndingId?: string) => {
    if (!activeStory) return;

    const currentNode = activeStory.graph.find((n) => n.id === activeStory.currentNodeId);
    const endingId = overrideEndingId || currentNode?.endingId || "custom-victory";

    let endingTitle = "Unresolved Destiny";
    let endingDesc = "A lingering portal closes.";

    const matchedEnding = endings.find((e) => e.id === endingId);
    if (matchedEnding) {
      endingTitle = matchedEnding.title;
      endingDesc = matchedEnding.description;
    } else if (activeStory.isCustom) {
      endingTitle = endingId.includes("stalemate") ? "Realm Lost to Spacetime" : "Nexus Stabilized";
      endingDesc = endingId.includes("stalemate")
        ? "The coordinate vector collapsed prematurely, but you survived."
        : "You sealed the custom seed memory forever.";
    }

    const finalScore =
      (activeStory.stats.knowledge +
        activeStory.stats.courage +
        activeStory.stats.creativity +
        activeStory.stats.luck) *
        50 +
      activeStory.inventory.length * 75;

    const newArchive: ArchiveItem = {
      id: `arch-${Date.now()}`,
      worldId: activeStory.world.id,
      title: activeStory.world.name,
      genre: activeStory.world.genre,
      completionPercent: 100,
      endingUnlocked: endingTitle,
      createdDate: new Date().toISOString().split("T")[0],
      isCustom: activeStory.isCustom,
      score: finalScore,
    };

    setArchives((prev) => [newArchive, ...prev]);
    setCurrentPage("Chronicle");

    try {
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        await setDoc(doc(db, "stories", newArchive.id), {
          storyId: newArchive.id,
          userId: firebaseUser.uid,
          title: newArchive.title,
          genre: newArchive.genre,
          status: "completed",
          score: finalScore,
          endingUnlocked: endingTitle,
          createdAt: serverTimestamp(),
        });
      }
    } catch (e) {
      console.warn("Firestore story save failed (local fallback active):", e);
    }
  };

  const resetActiveStory = () => {
    setActiveStory(null);
    setCurrentPage("Landing");
  };

  const clearArchives = () => {
    setArchives([]);
  };

  // ── User / Auth State ────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("pp_current_user");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  const [usersRegistry, setUsersRegistry] = useState<User[]>(() => {
    const saved = localStorage.getItem("pp_users_registry");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    const initialUsers: User[] = [
      {
        fullName: "Scribe Scholar",
        email: "scholar@portals.com",
        password: "password123",
        persona: fantasyPersonas[0],
        title: "Rune Scholar",
        companion: companionsList[0],
        starterTrait: "knowledge",
        createdAt: new Date().toISOString(),
      },
      {
        fullName: "Master Portalcraft",
        email: "master@portals.com",
        password: "password123",
        persona: fantasyPersonas[3],
        title: "Chronicle Keeper",
        companion: companionsList[2],
        starterTrait: "courage",
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem("pp_users_registry", JSON.stringify(initialUsers));
    return initialUsers;
  });

  useEffect(() => {
    localStorage.setItem("pp_users_registry", JSON.stringify(usersRegistry));
  }, [usersRegistry]);

  const loginUser = (email: string, password: string): { success: boolean; error?: string } => {
    const found = usersRegistry.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { success: false, error: "Chronicle registry key not found (Unknown email)." };
    }
    if (found.password !== password) {
      return { success: false, error: "Incorrect portal password coordinates." };
    }

    setCurrentUser(found);
    localStorage.setItem("pp_current_user", JSON.stringify(found));

    signInWithEmailAndPassword(auth, email, password).catch((e) =>
      console.warn("Firebase login failed (local fallback active):", e)
    );

    return { success: true };
  };

  const signupUser = async (
    fullName: string,
    email: string,
    password: string,
    persona: Persona,
    title: AdventurerTitle,
    companion: Companion,
    starterTrait: StarterTraitKey
  ): Promise<{ success: boolean; error?: string }> => {
    const exists = usersRegistry.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return {
        success: false,
        error: "This coordinate identifier email matches an existing traveler.",
      };
    }

    const newUser: User = {
      fullName,
      email,
      password,
      persona,
      title,
      companion,
      starterTrait,
      createdAt: new Date().toISOString(),
    };

    setUsersRegistry((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    localStorage.setItem("pp_current_user", JSON.stringify(newUser));
    setStatBoosts((b) => ({ ...b, [starterTrait]: b[starterTrait] + 1 }));

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        fullName,
        adventurerName: persona.name,
        title,
        companion: companion.name,
        starterTrait,
        createdAt: serverTimestamp(),
        totalStories: 0,
        totalEndings: 0,
        totalLoreEntries: 0,
        currentStoryId: null,
      });
    } catch (e) {
      console.warn("Firebase signup failed (local fallback active):", e);
    }

    return { success: true };
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem("pp_current_user");
    signOut(auth).catch((e) => console.warn("Firebase signOut failed:", e));
  };

  const updateProfile = async (fullName: string, persona: Persona) => {
    if (!currentUser) return;

    const updated = { ...currentUser, fullName, persona };
    setCurrentUser(updated);
    localStorage.setItem("pp_current_user", JSON.stringify(updated));
    setUsersRegistry((prev) =>
      prev.map((u) => (u.email === currentUser.email ? { ...u, fullName, persona } : u))
    );

    try {
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        await updateDoc(doc(db, "users", firebaseUser.uid), {
          fullName,
          adventurerName: persona.name,
        });
      }
    } catch (e) {
      console.warn("Firestore profile update failed (local fallback active):", e);
    }
  };

  // ── Auto-unlock persona lore ─────────────────────────────────────────────────
  useEffect(() => {
    if (currentUser) {
      const parts = currentUser.persona.name.toLowerCase().split(" ");
      const lastName = parts[parts.length - 1];
      const personaLoreId = `lore-${lastName}`;
      if (worldLoreRegistry.some((l) => l.id === personaLoreId)) {
        unlockLore(personaLoreId);
      }
    }
  }, [currentUser?.persona?.name]);

  // ── Context value ────────────────────────────────────────────────────────────
  return (
    <StoryContext.Provider
      value={{
        currentPage,
        setPage: setCurrentPage,
        activeStory,
        archives,
        worldSeedsList: worldSeeds,
        startAdventure,
        chooseOption,
        completeAdventure,
        resetActiveStory,
        clearArchives,
        createCustomWorld,
        appendGroqNode,
        currentUser,
        personasList: fantasyPersonas,
        loginUser,
        signupUser,
        logoutUser,
        updateProfile,
        unlockedLoreIds,
        unlockLore,
        newLoreToast,
        setNewLoreToast,
        goldenRunes,
        statBoosts,
        dailyQuests,
        claimDailyQuest,
        incrementQuestProgress,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};

export const useStory = () => {
  const context = useContext(StoryContext);
  if (context === undefined) {
    throw new Error("useStory must be used within a StoryProvider");
  }
  return context;
};