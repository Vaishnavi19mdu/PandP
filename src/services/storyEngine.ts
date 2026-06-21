import { StoryNode, predefinedStories } from "../data/mockStory";
import { WorldSeed } from "../data/worldSeeds";

/**
 * Gets the static story graph or procedurally generates a customized one
 * based on the user's custom created portal.
 */
export function getStoryGraph(worldId: string, customDetails?: { seed: string; genre: string; length: "Short" | "Medium" | "Long" }): StoryNode[] {
  // Check if predefined story exists
  if (predefinedStories[worldId]) {
    return predefinedStories[worldId];
  }

  // Otherwise, procedurally construct a story graph based on user parameters
  const seedText = customDetails?.seed || "An uncharted pocket world of magic and mystery";
  const genre = customDetails?.genre || "Adventure";
  const length = customDetails?.length || "Medium";

  // Derive title from seed or genre
  const cleanedSeed = seedText.trim();
  const worldName = cleanedSeed.length > 25 ? cleanedSeed.substring(0, 25) + "..." : cleanedSeed;
  
  // Custom companion based on genre
  let companionName = "Luna";
  let companionType = "Spectral Griffin";
  let companionMsg = "'Keep your eye on the horizons. Custom realms can drift if we stay in one place too long!'";

  if (genre === "Sci-Fi") {
    companionName = "NEXUS-7";
    companionType = "Floating Polyhedral Bot";
    companionMsg = "'Custom spacetime sector initialized. Probability of survival: reasonable. Let us explore.'";
  } else if (genre === "Mystery") {
    companionName = "Jasper";
    companionType = "Monocled Clockwork Ferret";
    companionMsg = "'Fascinating coordinates! Smells like brass grease and hidden drawer latches. Let us sniff them out.'";
  } else if (genre === "Educational") {
    companionName = "Socrates";
    companionType = "Ethereal Stone Owl";
    companionMsg = "'Every customized coordinate holds a specific lesson. Train your curiosity, pupil.'";
  } else if (genre === "Adventure") {
    companionName = "Cap'n Flint";
    companionType = "Holographic Parakeet";
    companionMsg = "'Ahoy! This custom portal smells of gold coin chests and high winds. Onward!'";
  }

  const startNode: StoryNode = {
    id: `${worldId}-start`,
    title: `Portal Entry: ${worldName}`,
    description: `The golden portal rings mesh into alignment. You step through, landing on a solid block of floating light suspended above a swirling vortex of ${genre} vectors. You are in a newly emerged sector described as: "${seedText}". Your guide ${companionName} (${companionType}) materials by your side.`,
    companionComment: companionMsg,
    worldEvent: `A resonance pulse sweeps across this newly established portal sector.`,
    x: 10,
    y: 50,
    choices: [
      {
        text: `Explore the core energy signature with magical calculations.`,
        nextNodeId: `${worldId}-exploration`,
        statRequirement: {
          stat: "knowledge",
          value: 4,
          failureNodeId: `${worldId}-tangle`,
          failureText: "The fluctuating dimension energies overwhelm your senses, triggering a minor sensory backlash."
        },
        statReward: { stat: "knowledge", value: 1 },
        logText: "You calculated the ambient signature equations safely."
      },
      {
        text: `Bravely cut a path directly towards the central nexus.`,
        nextNodeId: `${worldId}-nexus`,
        statRequirement: {
          stat: "courage",
          value: 4,
          failureNodeId: `${worldId}-safety`,
          failureText: "You are pushed back by gravitational anomalies, forcing you to seek high ground."
        },
        statReward: { stat: "courage", value: 1 },
        logText: "You charged into the center using brute bravery."
      }
    ]
  };

  const tangleNode: StoryNode = {
    id: `${worldId}-tangle`,
    title: `The Energy Snarl`,
    description: `The dimensional coordinates twist. You are briefly suspended inside a dense mesh of glowing matrix threads that mirror local rules. ${companionName} tries to stabilize your boots.`,
    companionComment: "'The timeline coordinates are loose! Let's utilize our creative minds to re-anchor.'",
    x: 35,
    y: 15,
    choices: [
      {
        text: "Knit a creative magic net to align the threads.",
        nextNodeId: `${worldId}-exploration`,
        statReward: { stat: "creativity", value: 1 },
        logText: "You creatively aligned the loose coordinates."
      },
      {
        text: "Rely on sheer, unadulterated luck to fall backwards in safety.",
        nextNodeId: `${worldId}-safety`,
        logText: "You tumbled backwards hoping to land on solid ground."
      }
    ]
  };

  const safetyNode: StoryNode = {
    id: `${worldId}-safety`,
    title: `The Safe Platform`,
    description: `You roll onto a secure platform constructed out of ancient white quartz tiles. An exquisite lockbox hums with a warm glow.`,
    companionComment: "'A treasure chest, just floating in deep space! That is incredibly lucky!'",
    x: 35,
    y: 85,
    choices: [
      {
        text: "Pry open the lockbox using luck.",
        nextNodeId: `${worldId}-exploration`,
        statRequirement: {
          stat: "luck",
          value: 3,
          failureNodeId: `${worldId}-unlocked-trap`,
          failureText: "The locked mechanism triggers, releasing a dense burst of thick sparklers. You are forced to leave."
        },
        itemReward: "Prismatic Keycard",
        logText: "Your extraordinary luck clicked the lockbox open."
      }
    ]
  };

  const unlockedTrapNode: StoryNode = {
    id: `${worldId}-unlocked-trap`,
    title: `Explosion of Sparks`,
    description: "The box was a dummy trap! The portal stabilizes itself but the explosion of light forces you to sprint forward blindly towards the center.",
    companionComment: "'Ouch! That is what we call cosmic feedback. Hurry!'",
    x: 55,
    y: 85,
    choices: [
      {
        text: "Rout the final sector by running for current core.",
        nextNodeId: `${worldId}-nexus`,
        logText: "You ran through the glowing smoke directly towards the heart."
      }
    ]
  };

  const explorationNode: StoryNode = {
    id: `${worldId}-exploration`,
    title: "The Heart of Innovation",
    description: `You uncover the anchor of your conceptual world. The architecture of "${worldName}" is spectacular. Right in front of you floats a magical, spinning Relic from which multiple light channels flow.`,
    companionComment: `'The portal code is stable! We can seize the Relic to seal this custom adventure permanently!'`,
    x: 60,
    y: 35,
    choices: [
      {
        text: "Solve the relational lock puzzles with Creativity.",
        nextNodeId: `${worldId}-ending-victory`,
        statRequirement: {
          stat: "creativity",
          value: 4,
          failureNodeId: `${worldId}-ending-stalemate`,
          failureText: "You fail the matrix calculation, sealing the artifact, but you still escape safely."
        },
        logText: "You solved the cosmic lock puzzle with pure creative flare."
      }
    ]
  };

  const nexusNode: StoryNode = {
    id: `${worldId}-nexus`,
    title: "The Portal Citadel",
    description: "You stand at the ultimate threshold. A majestic obelisk of condensed light pulses. Stepping inside will allow you to consolidate your experience, locking in your custom chronicles.",
    companionComment: "'A historic moment! Let's take the leap!'",
    x: 80,
    y: 50,
    choices: [
      {
        text: "Stride into the light core to seal the custom archive.",
        nextNodeId: `${worldId}-ending-victory`,
        logText: "You merged your lifeforce with the portal core."
      }
    ]
  };

  const victoryNode: StoryNode = {
    id: `${worldId}-ending-victory`,
    title: `The Custom Chronicle Written`,
    description: `Congratulations! You consolidated the coordinate energies of "${worldName}". You jump back into the primary portal, returning safely with fresh insights and your name recorded in the Chronicles.`,
    isEnding: true,
    endingId: `custom-victory-${worldId}`,
    x: 95,
    y: 50,
    choices: []
  };

  const stalemateNode: StoryNode = {
    id: `${worldId}-ending-stalemate`,
    title: "Custom Realm Drifts",
    description: `The customized sector starts to fade into static. You take the emergency gateway bypass, landing safely in your library, but the portal closes behind you.`,
    isEnding: true,
    endingId: `custom-stalemate-${worldId}`,
    x: 95,
    y: 20,
    choices: []
  };

  // Compile the list
  return [
    startNode,
    tangleNode,
    safetyNode,
    unlockedTrapNode,
    explorationNode,
    nexusNode,
    victoryNode,
    stalemateNode
  ];
}
export interface ArchiveItem {
  id: string; // Unique running id
  worldId: string;
  title: string;
  genre: string;
  completionPercent: number;
  endingUnlocked: string;
  createdDate: string;
  isCustom: boolean;
  score: number;
}

// Persistent user archives mock tracker initialization (or stored in localStorage)
export const initialArchives: ArchiveItem[] = [
  {
    id: "arch-1",
    worldId: "hollow-archives",
    title: "Escapes of Midnight",
    genre: "Fantasy",
    completionPercent: 100,
    endingUnlocked: "Master Archivist of Midnight",
    createdDate: "2026-06-15",
    isCustom: false,
    score: 850
  },
  {
    id: "arch-2",
    worldId: "phishing-kingdom",
    title: "Verification Shield Run",
    genre: "Educational",
    completionPercent: 100,
    endingUnlocked: "Hero of the Digital Realm",
    createdDate: "2026-06-19",
    isCustom: false,
    score: 910
  }
];
