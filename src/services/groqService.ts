// src/services/groqService.ts
// Calls Groq directly from the frontend — fine for a hackathon demo.
// Move this to a backend route before going to production.

import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface StoryChoice {
  text: string;
  trait: "Courage" | "Knowledge" | "Creativity" | "Luck";
  reward: string;
}

export interface GeneratedScene {
  sceneTitle: string;
  narrative: string;
  choices: StoryChoice[];
  loreUnlocks: string[];
}

export interface GenerateStoryParams {
  seedPrompt: string;
  genre: string;
  adventurerName: string;
  companion: string;
  playerStats: {
    courage: number;
    knowledge: number;
    creativity: number;
    luck: number;
  };
  storyId?: string;       // pass if continuing an existing story
  sceneNumber?: number;   // pass if continuing (default 1)
  previousNarrative?: string; // pass to maintain story continuity
}

// ── System Prompt ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are Pages & Portals, a fantasy interactive storyteller.
Generate branching adventures in JSON only. No preamble, no markdown, no code fences.

Rules:
- Write immersive fantasy scenes, under 250 words.
- Generate exactly 3 choices.
- Each choice must affect exactly one trait: Courage, Knowledge, Creativity, or Luck.
- loreUnlocks is an array of short location/item/character names discovered in this scene (can be empty).

Return this exact JSON shape and nothing else:
{
  "sceneTitle": "",
  "narrative": "",
  "choices": [
    { "text": "", "trait": "", "reward": "" }
  ],
  "loreUnlocks": []
}`;

// ── Core function ─────────────────────────────────────────────────────────────

export async function generateScene(
  params: GenerateStoryParams
): Promise<{ scene: GeneratedScene; sceneId: string | null }> {
  const {
    seedPrompt,
    genre,
    adventurerName,
    companion,
    playerStats,
    storyId,
    sceneNumber = 1,
    previousNarrative,
  } = params;

  // Build user message
  const continuationNote = previousNarrative
    ? `\n\nPrevious scene summary: "${previousNarrative.slice(0, 200)}..."\nContinue the story naturally from here.`
    : "";

  const userMessage = `
Genre: ${genre}
World Seed / Prompt: "${seedPrompt}"
Adventurer: ${adventurerName}
Companion: ${companion}
Scene Number: ${sceneNumber}
Player Stats: Courage ${playerStats.courage}, Knowledge ${playerStats.knowledge}, Creativity ${playerStats.creativity}, Luck ${playerStats.luck}
${continuationNote}

Generate the next immersive scene with exactly 3 branching choices.
`.trim();

  // ── Call Groq ───────────────────────────────────────────────────────────────
  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.85,
      max_tokens: 700,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content ?? "";

  // Strip any accidental markdown fences just in case
  const cleaned = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  let scene: GeneratedScene;
  try {
    scene = JSON.parse(cleaned);
  } catch (e) {
    throw new Error(`Groq returned invalid JSON: ${cleaned.slice(0, 200)}`);
  }

  // ── Save scene to Firestore (non-blocking) ──────────────────────────────────
  let sceneId: string | null = null;
  try {
    const firebaseUser = auth.currentUser;
    if (firebaseUser && storyId) {
      const sceneRef = await addDoc(collection(db, "scenes"), {
        storyId,
        userId: firebaseUser.uid,
        sceneNumber,
        narrative: scene.narrative,
        sceneTitle: scene.sceneTitle,
        choices: scene.choices,
        loreUnlocks: scene.loreUnlocks,
        createdAt: serverTimestamp(),
      });
      sceneId = sceneRef.id;

      // Update story's currentScene counter
      await updateDoc(doc(db, "stories", storyId), {
        currentScene: sceneNumber,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (e) {
    console.warn("Firestore scene save failed (local fallback active):", e);
  }

  return { scene, sceneId };
}

// ── Create a new story doc in Firestore ───────────────────────────────────────
// Call this once when user starts a brand-new adventure.

export async function createStoryDoc(params: {
  title: string;
  genre: string;
  seedPrompt: string;
}): Promise<string | null> {
  try {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;

    const storyRef = await addDoc(collection(db, "stories"), {
      userId: firebaseUser.uid,
      title: params.title,
      genre: params.genre,
      seedPrompt: params.seedPrompt,
      currentScene: 0,
      status: "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Increment user's totalStories counter
    await updateDoc(doc(db, "users", firebaseUser.uid), {
      totalStories: increment(1),
      currentStoryId: storyRef.id,
    });

    return storyRef.id;
  } catch (e) {
    console.warn("Firestore createStoryDoc failed:", e);
    return null;
  }
}

// ── Save a lore entry ─────────────────────────────────────────────────────────
// Call this when loreUnlocks is non-empty after generateScene.

export async function saveLoreEntries(
  loreNames: string[],
  storyId: string,
  genre: string
): Promise<void> {
  try {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser || loreNames.length === 0) return;

    const batch = loreNames.map((name) =>
      addDoc(collection(db, "loreEntries"), {
        userId: firebaseUser.uid,
        storyId,
        type: "location", // default; extend if you want types
        name,
        description: `Discovered in a ${genre} portal.`,
        discoveredAt: serverTimestamp(),
      })
    );

    await Promise.all(batch);

    // Increment user's totalLoreEntries
    await updateDoc(doc(db, "users", firebaseUser.uid), {
      totalLoreEntries: increment(loreNames.length),
    });
  } catch (e) {
    console.warn("Firestore saveLoreEntries failed:", e);
  }
}

// ── Save a completed ending ───────────────────────────────────────────────────

export async function saveEnding(params: {
  title: string;
  storyId: string;
}): Promise<void> {
  try {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return;

    await addDoc(collection(db, "endings"), {
      userId: firebaseUser.uid,
      title: params.title,
      storyId: params.storyId,
      unlockedAt: serverTimestamp(),
    });

    await updateDoc(doc(db, "users", firebaseUser.uid), {
      totalEndings: increment(1),
      currentStoryId: null,
    });

    await updateDoc(doc(db, "stories", params.storyId), {
      status: "completed",
      updatedAt: serverTimestamp(),
    });
  } catch (e) {
    console.warn("Firestore saveEnding failed:", e);
  }
}