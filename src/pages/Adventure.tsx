import React, { useState, useEffect, useRef } from "react";
import { useStory } from "../context/StoryContext";
import { AdventurePanel } from "../components/AdventurePanel";
import { StatsInventory } from "../components/StatsInventory";
import { PortalMap } from "../components/PortalMap";
import {
  Map,
  LayoutDashboard,
  Sparkles,
  Undo2,
  LogOut,
  HelpCircle,
  Backpack,
  Dice5,
  Scroll,
  Compass,
  Eye,
  X,
  Layers,
  BookOpen,
  Loader2,
  Trophy,
} from "lucide-react";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { motion, AnimatePresence } from "motion/react";
import {
  generateScene,
  createStoryDoc,
  saveLoreEntries,
  GeneratedScene,
} from "../services/groqService";

type Stat = "courage" | "knowledge" | "creativity" | "luck";

// How many Groq scenes a run gets before the portal forces a conclusion.
const SCENE_CAPS: Record<"Short" | "Medium" | "Long", number> = {
  Short: 5,
  Medium: 8,
  Long: 12,
};

// Collectible artifacts that can be found mid-journey (separate from choice rewards).
const COLLECTIBLE_POOL: { item: string; flavor: string }[] = [
  { item: "Crystal Shard", flavor: "A sliver of frozen starlight hums faintly in your palm." },
  { item: "Stardust Compass", flavor: "Its needle spins once, then settles — pointing toward you." },
  { item: "Scroll of Lore", flavor: "Brittle parchment inked in script that rearranges itself as you read." },
];

export const Adventure: React.FC = () => {
  const { activeStory, chooseOption, resetActiveStory, currentUser, unlockLore, appendGroqNode } = useStory();
  const [showMap, setShowMap] = useState(true);
  const [abortModalOpen, setAbortModalOpen] = useState(false);

  // ── Groq state ──────────────────────────────────────────────────────────────
  const [groqScene, setGroqScene] = useState<GeneratedScene | null>(null);
  const [groqLoading, setGroqLoading] = useState(false);
  const [groqError, setGroqError] = useState<string | null>(null);
  const storyDocId = useRef<string | null>(null);
  const sceneNumber = useRef<number>(1);
  const lastNarrative = useRef<string>("");
  const isFinalSceneRef = useRef<boolean>(false);
  // ────────────────────────────────────────────────────────────────────────────

  const [backpackOpen, setBackpackOpen] = useState(false);
  const [activeItemLore, setActiveItemLore] = useState<{ name: string; lore: string } | null>(null);

  // ── Hints — only 3 per run, each a different flavor, auto-dismiss in 5.5s ───
  const [hintOpen, setHintOpen] = useState(false);
  const [hintVariant, setHintVariant] = useState(0);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // ────────────────────────────────────────────────────────────────────────────

  // ── Artifacts — single-use, grey out once spent ──────────────────────────────
  const [usedArtifacts, setUsedArtifacts] = useState<Set<string>>(new Set());
  const [artifactToast, setArtifactToast] = useState<{ item: string; stat: string; value: number } | null>(null);
  // ────────────────────────────────────────────────────────────────────────────

  // ── Mid-journey collectibles — discovered on the way, claimed into the pack ──
  const [collectible, setCollectible] = useState<{ item: string; flavor: string } | null>(null);
  const claimedCollectiblesRef = useRef<Set<number>>(new Set());
  // ────────────────────────────────────────────────────────────────────────────

  const [isRolling, setIsRolling] = useState(false);
  const [rollChoiceText, setRollChoiceText] = useState("");
  const [rollResult, setRollResult] = useState<{ text: string; icon: string } | null>(null);

  const [prevInventoryCount, setPrevInventoryCount] = useState(activeStory?.inventory.length || 0);
  const [showItemSparkle, setShowItemSparkle] = useState<string | null>(null);

  // ── Scene-progression toast + journey completion ────────────────────────────
  const [sceneToast, setSceneToast] = useState<{ number: number; title: string; final: boolean } | null>(null);
  const [journeyComplete, setJourneyComplete] = useState(false);
  // ────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!activeStory) return;
    if (activeStory.inventory.length > prevInventoryCount) {
      const newlyAcquired = activeStory.inventory[activeStory.inventory.length - 1];
      setShowItemSparkle(newlyAcquired);
      setPrevInventoryCount(activeStory.inventory.length);
      const timer = setTimeout(() => setShowItemSparkle(null), 3500);
      return () => clearTimeout(timer);
    } else {
      setPrevInventoryCount(activeStory.inventory.length);
    }
  }, [activeStory?.inventory]);

  // ── Generate first scene when Adventure mounts ───────────────────────────────
  useEffect(() => {
    if (!activeStory) return;
    handleGenerateScene();
  }, []);
  // ────────────────────────────────────────────────────────────────────────────

  if (!activeStory) return null;

  const { world } = activeStory;

  const maxScenes = SCENE_CAPS[activeStory.customDetails?.length ?? "Medium"];

  // ── Core Groq scene generator ─────────────────────────────────────────────────
  const handleGenerateScene = async () => {
    if (groqLoading) return;
    setGroqLoading(true);
    setGroqError(null);

    try {
      if (!storyDocId.current) {
        const id = await createStoryDoc({
          title: world.name,
          genre: world.genre,
          seedPrompt: activeStory.customDetails?.seed ?? world.name,
        });
        storyDocId.current = id;
      }

      const { scene } = await generateScene({
        seedPrompt: activeStory.customDetails?.seed ?? world.name,
        genre: world.genre,
        adventurerName: currentUser?.persona?.name ?? "Traveler",
        companion: currentUser?.companion?.name ?? world.companionName,
        playerStats: activeStory.stats,
        storyId: storyDocId.current ?? undefined,
        sceneNumber: sceneNumber.current,
        previousNarrative: lastNarrative.current,
      });

      const isFinalScene = sceneNumber.current >= maxScenes;
      isFinalSceneRef.current = isFinalScene;

      setGroqScene(scene);
      setHintOpen(false);
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      lastNarrative.current = scene.narrative;

      // ── Inject Groq scene into the PortalMap graph ──────────────────────────
      const nodeId = `groq-scene-${sceneNumber.current}`;
      const prevNodeId = sceneNumber.current === 1
        ? activeStory.currentNodeId
        : `groq-scene-${sceneNumber.current - 1}`;

      const xPos = Math.min(10 + (sceneNumber.current - 1) * 13, 88);
      const yPos = 30 + (sceneNumber.current % 3) * 20; // 30 | 50 | 70 | 30 | ...

      // Past the cap, this node has no onward path — it IS the ending.
      const syntheticChoices = isFinalScene
        ? []
        : scene.choices.map((c, i) => ({
            id: `${nodeId}-choice-${i}`,
            text: c.text,
            nextNodeId: `groq-scene-${sceneNumber.current + 1}`,
            logText: c.text,
            statReward: c.trait
              ? { stat: c.trait.toLowerCase() as Stat, value: 1 }
              : undefined,
            itemReward: undefined,
            itemRequirement: undefined,
            statRequirement: undefined,
          }));

      appendGroqNode({
        id: nodeId,
        title: scene.sceneTitle,
        x: xPos,
        y: yPos,
        choices: syntheticChoices,
        isEnding: isFinalScene,
        endingId: isFinalScene
          ? `groq-ending-${storyDocId.current ?? "run"}-${sceneNumber.current}`
          : undefined,
        // Link the previous node's choices to this node
        prevNodeId,
      });
      // ────────────────────────────────────────────────────────────────────────

      if (scene.loreUnlocks && scene.loreUnlocks.length > 0) {
        scene.loreUnlocks.forEach((loreName) => {
          const slug = `lore-${loreName.toLowerCase().replace(/\s+/g, "-")}`;
          unlockLore(slug);
        });
        if (storyDocId.current) {
          await saveLoreEntries(scene.loreUnlocks, storyDocId.current, world.genre);
        }
      }

      // ── Mid-journey collectible — appears on a couple of scenes per run ─────
      const collectibleScenes = [2, Math.min(maxScenes - 1, Math.max(3, Math.ceil(maxScenes / 2)))];
      if (
        !isFinalScene &&
        collectibleScenes.includes(sceneNumber.current) &&
        !claimedCollectiblesRef.current.has(sceneNumber.current)
      ) {
        setCollectible(COLLECTIBLE_POOL[sceneNumber.current % COLLECTIBLE_POOL.length]);
      } else {
        setCollectible(null);
      }
      // ────────────────────────────────────────────────────────────────────────

      // ── Scene-progression toast ─────────────────────────────────────────────
      setSceneToast({ number: sceneNumber.current, title: scene.sceneTitle, final: isFinalScene });
      setTimeout(() => setSceneToast(null), 3500);

      if (isFinalScene) {
        setJourneyComplete(true);
      }
      // ────────────────────────────────────────────────────────────────────────
    } catch (err: any) {
      setGroqError(err?.message ?? "Portal generation failed. Try again.");
    } finally {
      setGroqLoading(false);
    }
  };

  // Called when player picks a Groq-generated choice — advances map marker
  const handleGroqChoice = async (choice: GeneratedScene["choices"][number]) => {
    if (groqLoading || isFinalSceneRef.current) return;

    const currentGroqNodeId = `groq-scene-${sceneNumber.current}`;
    chooseOption({
      id: `groq-advance-${sceneNumber.current}`,
      text: choice.text,
      nextNodeId: currentGroqNodeId,
      logText: choice.text,
      statReward: choice.trait
        ? {
            stat: choice.trait.toLowerCase() as Stat,
            value: 1,
          }
        : undefined,
      itemReward: undefined,
      itemRequirement: undefined,
      statRequirement: undefined,
    });

    sceneNumber.current += 1;
    await handleGenerateScene();
    scrollToAnchor("choices-section");
  };
  // ────────────────────────────────────────────────────────────────────────────

  const handleAbort = () => {
    setAbortModalOpen(false);
    resetActiveStory();
  };

  const handleFinishJourney = () => {
    setJourneyComplete(false);
    resetActiveStory();
  };

  const scrollToAnchor = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const getItemLore = (itemName: string) => {
    switch (itemName.toLowerCase()) {
      case "skeleton key":
      case "ancient key":
      case "rusty key":
        return "An intricately forged skeleton key humming with portal grease. Its teeth are designed to override copper safety traps, letting you bypass otherwise high-risk checks.";
      case "mystic compass":
      case "stardust compass":
      case "chronometer":
        return "A heavy brass dial whose compass needle aligns with vector frequencies instead of magnetic fields. It begins to vibrate whenever a highly positive pathway gets close.";
      case "ancient map":
      case "dimensional chart":
      case "scroll of lore":
        return "A crisp velum ledger depicting historic coordinate branches. Scanning these ancient cartographies infuses your Scribe with permanent Wisdom & Knowledge check multiplier bonuses.";
      case "crystal shard":
      case "astral fragment":
      case "elixir of luck":
        return "A crystalline star-well shard radiating ambient lavender light. Possessing this fragment ensures a passive field is open, enhancing natural Luck variables by +4 points.";
      default:
        return "A rare artifact obtained during dimensional travel. Its texture is aligned with local genre coordinates, proving yours to be an adventurous and successful run.";
    }
  };

  // ── 3 distinct hint flavors — variant cycles as hintsRemaining is spent ──────
  const getHintText = (variant: number): string => {
    const isFinal = sceneNumber.current >= maxScenes;
    if (!groqScene || isFinal) {
      return `${world.companionName} murmurs: "This is the final crossing — trust what you've learned."`;
    }

    if (variant === 0) {
      // Stat-affinity hint
      const statEntries = Object.entries(activeStory.stats) as [Stat, number][];
      const strongest = statEntries.sort((a, b) => b[1] - a[1])[0];
      const matched = groqScene.choices.find(
        (c) => c.trait && strongest && c.trait.toLowerCase() === strongest[0]
      );
      if (matched && strongest) {
        return `${world.companionName} senses your ${strongest[0]} is strong — the path "${matched.text}" may favor you.`;
      }
      return `${world.companionName} shrugs: "No clear signal here — follow your instincts."`;
    }

    if (variant === 1) {
      // Caution hint — flags a risky-sounding path
      const risky = groqScene.choices.find((c) => /danger|risk|hide|attack|fight|confront/i.test(c.text));
      if (risky) {
        return `${world.companionName} grows tense near "${risky.text}" — that road may carry hidden cost.`;
      }
      return `${world.companionName} tilts their head: "None of these paths feel especially dangerous — choose freely."`;
    }

    // variant === 2: artifact hint
    const unusedIdx = activeStory.inventory.findIndex((it, i) => !usedArtifacts.has(`${i}-${it}`));
    if (unusedIdx >= 0) {
      return `${world.companionName} nudges your pack: "The ${activeStory.inventory[unusedIdx]} might help here — consider using it first."`;
    }
    return `${world.companionName} sighs: "Your pack holds nothing ready to help. Rely on your wits."`;
  };

  const handleHintButtonClick = () => {
    if (hintOpen) {
      setHintOpen(false);
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      return;
    }
    if (hintsRemaining <= 0 || groqLoading || isFinalScene) return;
    const variant = 3 - hintsRemaining; // 0, 1, 2 — a different flavor each time
    setHintVariant(variant);
    setHintsRemaining((n) => n - 1);
    setHintOpen(true);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    hintTimerRef.current = setTimeout(() => setHintOpen(false), 5500);
  };
  // ────────────────────────────────────────────────────────────────────────────

  // ── Artifact effects — what each relic boosts when "gripped" / used ─────────
  const getItemEffect = (itemName: string): { stat: Stat; value: number } => {
    switch (itemName.toLowerCase()) {
      case "skeleton key":
      case "ancient key":
      case "rusty key":
      case "bronze key":
        return { stat: "courage", value: 2 };
      case "mystic compass":
      case "stardust compass":
      case "chronometer":
      case "ancient compass":
        return { stat: "luck", value: 2 };
      case "ancient map":
      case "dimensional chart":
      case "scroll of lore":
      case "map fragment":
        return { stat: "knowledge", value: 2 };
      case "crystal shard":
      case "astral fragment":
      case "elixir of luck":
        return { stat: "creativity", value: 2 };
      default:
        return { stat: "luck", value: 1 };
    }
  };

  const handleUseArtifact = (item: string, idx: number) => {
    const key = `${idx}-${item}`;
    if (usedArtifacts.has(key) || !activeStory) return;
    const effect = getItemEffect(item);

    chooseOption({
      id: `artifact-use-${key}-${Date.now()}`,
      text: `Use ${item}`,
      nextNodeId: activeStory.currentNodeId,
      logText: `Empowered by the ${item} — ${effect.stat} +${effect.value}.`,
      statReward: { stat: effect.stat, value: effect.value },
      itemReward: undefined,
      itemRequirement: undefined,
      statRequirement: undefined,
    });

    setUsedArtifacts((prev) => new Set(prev).add(key));
    setArtifactToast({ item, stat: effect.stat, value: effect.value });
    setTimeout(() => setArtifactToast(null), 3500);
  };
  // ────────────────────────────────────────────────────────────────────────────

  // ── Claim a mid-journey collectible into the backpack ────────────────────────
  const handleClaimCollectible = () => {
    if (!collectible || !activeStory) return;
    claimedCollectiblesRef.current.add(sceneNumber.current);
    chooseOption({
      id: `claim-collectible-${sceneNumber.current}-${Date.now()}`,
      text: `Claim ${collectible.item}`,
      nextNodeId: activeStory.currentNodeId,
      logText: `Claimed the ${collectible.item} discovered along the way.`,
      statReward: undefined,
      itemReward: collectible.item,
      itemRequirement: undefined,
      statRequirement: undefined,
    });
    setCollectible(null);
  };
  // ────────────────────────────────────────────────────────────────────────────

  const handleFateRoll = () => {
    if (isRolling || !activeStory) return;

    const currentNode = activeStory.graph.find((node) => node.id === activeStory.currentNodeId);
    if (!currentNode || currentNode.isEnding) return;

    const validChoices = currentNode.choices.filter((choice) => {
      if (choice.statRequirement) {
        if ((activeStory.stats[choice.statRequirement.stat] || 0) < choice.statRequirement.value)
          return false;
      }
      if (choice.itemRequirement) {
        if (!activeStory.inventory.includes(choice.itemRequirement)) return false;
      }
      return true;
    });

    if (validChoices.length === 0) {
      alert("No valid paths are passable under your current attribute constraints!");
      return;
    }

    setIsRolling(true);
    setRollChoiceText("Spinning coordinates matrix...");

    const steps = [
      "Interpreting probability vectors... 🎲",
      "Testing cosmic code stability...",
      "Settling path timeline...",
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setRollChoiceText(steps[stepIdx]);
        stepIdx++;
      }
    }, 450);

    setTimeout(() => {
      clearInterval(interval);
      const rolled = validChoices[Math.floor(Math.random() * validChoices.length)];
      setRollResult({
        text: `The fates have rolled standard option: "${rolled.text}"!`,
        icon: rolled.text.includes("Investigate")
          ? "⚔️"
          : rolled.text.includes("Hide")
          ? "🤫"
          : "📜",
      });

      setTimeout(() => {
        setRollResult(null);
        chooseOption(rolled);
        setIsRolling(false);
        scrollToAnchor("choices-section");
      }, 1600);
    }, 1800);
  };

  const isFinalScene = sceneNumber.current >= maxScenes;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-10 pb-32 relative">

      {/* 1. Header Information Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#F8EAE5] p-5 rounded-2xl border border-navy/20 gap-4 book-shadow shadow-sm relative">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex px-2 py-0.5 rounded text-[9px] uppercase font-mono tracking-wider font-semibold bg-navy/10 text-navy border border-navy/10">
              {world.genre} Universe
            </span>
            <span className="inline-flex px-2 py-0.5 rounded text-[9px] uppercase font-mono tracking-wider font-semibold bg-gold-glow/20 text-[#4A3428] border border-gold-glow/40 animate-pulse-gold">
              Level: {world.difficulty}
            </span>
            {/* Live scene counter badge */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] uppercase font-mono tracking-wider font-semibold bg-[#678DC6]/20 text-[#678DC6] border border-[#678DC6]/30">
              <Sparkles className="w-2.5 h-2.5 animate-pulse" />
              Scene {sceneNumber.current} / {maxScenes}
            </span>
          </div>
          <h1 className="font-medieval text-xl md:text-2xl font-black text-soft-espresso tracking-wide leading-none">
            {world.name} • Active Story
          </h1>
          <p className="text-[10px] text-soft-espresso/60 font-sans tracking-wide">
            Companion Guide:{" "}
            <strong className="text-soft-espresso font-medieval">{world.companionName}</strong> is stable and ready.
          </p>
        </div>

        <div className="flex justify-end items-center gap-2 w-full md:w-auto">
          <Button
            variant="secondary"
            onClick={() => setShowMap(!showMap)}
            className="text-xs py-2 px-4 shadow-sm flex items-center justify-center gap-1.5"
          >
            {showMap ? (
              <LayoutDashboard className="w-4 h-4 text-navy" />
            ) : (
              <Map className="w-4 h-4 text-navy" />
            )}
            <span>{showMap ? "Hide Space Chart" : "Open Space Chart"}</span>
          </Button>

          <Button
            variant="secondary"
            onClick={() => setAbortModalOpen(true)}
            className="text-xs py-2 px-3 border border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 flex items-center gap-1 font-bold"
          >
            <LogOut className="w-4 h-4" />
            Abort Run
          </Button>
        </div>
      </div>

      {/* 2. Portal Map */}
      {showMap && (
        <div className="transition-all duration-500 transform animate-float">
          <PortalMap />
        </div>
      )}

      {/* 3. Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative pb-12">

        {/* Left: Groq Scene Panel */}
        <div className="lg:col-span-2 space-y-6">

          <AnimatePresence mode="wait">
            {groqLoading ? (
              <motion.div
                key="groq-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[#FAF5EC] border-2 border-[#D4AF37]/40 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 min-h-[260px]"
              >
                <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin" />
                <p className="font-medieval text-[#4A3428] text-sm tracking-widest uppercase animate-pulse">
                  Generating your scene...
                </p>
                <p className="text-[10px] font-mono text-[#4A3428]/50">
                  Pages & Portals AI is weaving your fate
                </p>
                <p className="text-[9px] font-mono text-[#678DC6]/70 mt-2">
                  ↑ Watch the Portal Chart update above
                </p>
              </motion.div>
            ) : groqError ? (
              <motion.div
                key="groq-error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 text-center space-y-4"
              >
                <p className="text-red-700 font-medieval text-sm">⛔ {groqError}</p>
                <button
                  onClick={handleGenerateScene}
                  className="px-6 py-2.5 bg-[#4A3428] text-[#E6C06A] rounded-xl font-medieval text-xs font-bold uppercase cursor-pointer hover:brightness-125 transition-all"
                >
                  Retry Portal Generation
                </button>
              </motion.div>
            ) : groqScene ? (
              <motion.div
                key={`groq-scene-${sceneNumber.current}`}
                initial={{ rotateY: -65, transformOrigin: "left center", opacity: 0, scale: 0.96 }}
                animate={{ rotateY: 0, transformOrigin: "left center", opacity: 1, scale: 1 }}
                exit={{ rotateY: 65, transformOrigin: "right center", opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.65, ease: [0.25, 1, 0.35, 1] }}
                style={{ perspective: 1500, transformStyle: "preserve-3d" }}
                className="bg-[#FAF5EC] border-2 border-[#D4AF37]/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-md"
              >
                {/* Scene header */}
                <div className="space-y-1 border-b border-[#4A3428]/10 pb-4">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#678DC6] font-bold">
                    Scene {sceneNumber.current}{isFinalScene ? " • Final Chapter" : ""}
                  </span>
                  <h2 className="font-medieval text-2xl font-black text-[#4A3428]">
                    {groqScene.sceneTitle}
                  </h2>
                </div>

                {/* Narrative */}
                <div id="choices-section" className="p-5 bg-white/60 rounded-2xl border border-[#D4AF37]/20">
                  <p className="font-serif text-sm leading-relaxed text-[#4A3428] italic">
                    {groqScene.narrative}
                  </p>
                </div>

                {/* Lore unlocks badge */}
                {groqScene.loreUnlocks && groqScene.loreUnlocks.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {groqScene.loreUnlocks.map((lore, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[9px] font-mono font-bold text-[#4A3428] uppercase tracking-widest"
                      >
                        📜 {lore} discovered
                      </span>
                    ))}
                  </div>
                )}

                {/* Mid-journey collectible */}
                {collectible && !isFinalScene && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-r from-[#678DC6]/10 via-[#E6C06A]/10 to-amber-400/10 border-2 border-dashed border-gold-glow/50 rounded-2xl flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gold-glow/20 border border-gold-glow flex items-center justify-center text-2xl shrink-0 animate-pulse">
                      ⚜️
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#678DC6] font-bold block">
                        hidden artifact glimmers
                      </span>
                      <p className="font-medieval text-sm font-bold text-[#4A3428]">{collectible.item}</p>
                      <p className="text-[10px] font-sans italic text-[#4A3428]/70">{collectible.flavor}</p>
                    </div>
                    <button
                      onClick={handleClaimCollectible}
                      className="shrink-0 px-3.5 py-2 bg-[#4A3428] text-[#E6C06A] rounded-xl font-medieval text-[10px] font-black uppercase tracking-widest cursor-pointer hover:brightness-125 transition-all"
                    >
                      Claim
                    </button>
                  </motion.div>
                )}

                {isFinalScene ? (
                  /* ── Final scene: conclude instead of branching onward ───── */
                  <div className="space-y-4 pt-2">
                    <div className="p-5 bg-[#4A3428] rounded-2xl border-2 border-gold-glow text-center space-y-2">
                      <Trophy className="w-8 h-8 mx-auto text-gold-glow" />
                      <p className="font-medieval text-[#E6C06A] text-sm font-bold uppercase tracking-widest">
                        The Portal Stabilizes Permanently
                      </p>
                      <p className="text-[11px] font-sans text-[#E9DFD2]/80 leading-relaxed max-w-sm mx-auto">
                        You've reached the end of this chronicle. Seal your journey through{" "}
                        <strong>{world.name}</strong> and return to the Library.
                      </p>
                    </div>
                    <button
                      onClick={() => setJourneyComplete(true)}
                      className="w-full px-6 py-3 bg-gradient-to-r from-[#678DC6] via-[#E6C06A] to-amber-400 text-[#4A3428] rounded-xl font-medieval text-xs font-black uppercase tracking-widest cursor-pointer hover:brightness-105 transition-all shadow-md"
                    >
                      Conclude Your Journey
                    </button>
                  </div>
                ) : (
                  /* ── Normal branching choices ─────────────────────────────── */
                  <div className="space-y-3">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[#4A3428]/60 font-bold">
                      Choose Your Path:
                    </p>
                    {groqScene.choices.map((choice, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ x: 4, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleGroqChoice(choice)}
                        disabled={groqLoading}
                        className="w-full text-left p-4 bg-white border-2 border-[#D4AF37]/25 hover:border-[#D4AF37] hover:bg-[#FAF1E3] rounded-2xl transition-all cursor-pointer group disabled:opacity-50 disabled:pointer-events-none"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1 flex-1">
                            <p className="font-medieval text-sm font-bold text-[#4A3428] group-hover:text-[#4A3428]">
                              {choice.text}
                            </p>
                            <span className="text-[9px] font-mono text-[#678DC6] uppercase tracking-widest font-bold">
                              {choice.reward}
                            </span>
                          </div>
                          <span className="shrink-0 px-2.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[9px] font-mono font-bold text-[#4A3428] uppercase tracking-wider">
                            {choice.trait}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Hints + Regenerate row */}
                <div className="pt-2 border-t border-[#4A3428]/10 space-y-3">
                  <AnimatePresence>
                    {hintOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3.5 bg-[#678DC6]/10 border border-[#678DC6]/30 rounded-xl flex items-start gap-2.5">
                          <Eye className="w-4 h-4 text-[#678DC6] shrink-0 mt-0.5" />
                          <p className="text-[11px] font-serif italic text-[#4A3428] leading-relaxed">
                            {getHintText(hintVariant)}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleHintButtonClick}
                      disabled={(hintsRemaining <= 0 && !hintOpen) || groqLoading || isFinalScene}
                      className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#678DC6] hover:text-[#4A3428] cursor-pointer transition-colors disabled:opacity-30 font-bold"
                    >
                      <Eye className="w-3 h-3" />
                      {hintOpen ? "Hide Hint" : hintsRemaining > 0 ? `Get a Hint (${hintsRemaining})` : "No Hints Left"}
                    </button>

                    <button
                      onClick={handleGenerateScene}
                      disabled={groqLoading}
                      className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#4A3428]/50 hover:text-[#4A3428] cursor-pointer transition-colors disabled:opacity-30"
                    >
                      <Sparkles className="w-3 h-3" />
                      Regenerate Scene
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="adventure-panel-fallback"
                initial={{ rotateY: -65, transformOrigin: "left center", opacity: 0, scale: 0.96 }}
                animate={{ rotateY: 0, transformOrigin: "left center", opacity: 1, scale: 1 }}
                exit={{ rotateY: 65, transformOrigin: "right center", opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.65, ease: [0.25, 1, 0.35, 1] }}
                style={{ perspective: 1500, transformStyle: "preserve-3d" }}
              >
                <AdventurePanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Stats */}
        <div className="lg:col-span-1">
          <StatsInventory />
        </div>
      </div>

      {/* 4. Sticky HUD Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[45] w-full max-w-md px-4 pointer-events-none">
        <div className="pointer-events-auto bg-[#4A3428] border-2 border-gold-glow/75 text-white py-2 px-4 sm:px-6 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.5)] flex items-center justify-between gap-2 text-xs font-mono select-none">

          <button
            onClick={() => scrollToAnchor("choices-section")}
            className="flex flex-col items-center gap-0.5 text-[#E9DFD2] hover:text-gold-glow transition-colors font-semibold group cursor-pointer"
          >
            <Compass className="w-5 h-5 text-gold-glow group-hover:animate-spin" />
            <span className="text-[9px] uppercase tracking-wider font-mono">Corridor</span>
          </button>

          <button
            onClick={() => scrollToAnchor("journal-section")}
            className="flex flex-col items-center gap-0.5 text-[#E9DFD2] hover:text-gold-glow transition-colors font-semibold group cursor-pointer"
          >
            <Scroll className="w-5 h-5 text-gold-glow group-hover:scale-115 transition-transform" />
            <span className="text-[9px] uppercase tracking-wider font-mono">Journal</span>
          </button>

          <button
            onClick={handleFateRoll}
            disabled={isRolling || isFinalScene}
            className={`flex flex-col items-center justify-center -mt-6 bg-gradient-to-tr from-[#678DC6] via-[#E6C06A] to-amber-400 p-3.5 rounded-full border-2 border-gold-glow cursor-pointer text-[#4A3428] shadow-lg transition-transform hover:scale-110 active:scale-95 group disabled:opacity-40 disabled:pointer-events-none ${
              isRolling ? "animate-pulse" : "animate-bounce"
            }`}
            title="Roll Fate dice on active corridors"
          >
            <Dice5
              className={`w-6 h-6 stroke-[2.2] text-[#4A3428] ${
                isRolling ? "animate-spin" : "group-hover:rotate-45 transition-transform"
              }`}
            />
            <span className="text-[7.5px] font-black uppercase text-[#4A3428] mt-0.5 font-medieval tracking-widest whitespace-nowrap">
              Fate Roll
            </span>
          </button>

          <button
            onClick={() => setBackpackOpen(true)}
            className="flex flex-col items-center gap-0.5 text-[#E9DFD2] hover:text-gold-glow transition-colors relative font-semibold group cursor-pointer"
          >
            {activeStory.inventory.length > 0 && (
              <span className="absolute -top-1 right-2 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[8px] font-extrabold bg-[#678DC6] text-white border border-white animate-pulse">
                {activeStory.inventory.length}
              </span>
            )}
            <Backpack className="w-5 h-5 text-gold-glow group-hover:animate-bounce" />
            <span className="text-[9px] uppercase tracking-wider font-mono">Pack</span>
          </button>
        </div>
      </div>

      {/* 5. Notifications Stack — Item Sparkle + Scene Progression, anchored top-right, auto-dismiss in 3.5s */}
      <div className="fixed top-20 right-3 md:right-6 z-[110] flex flex-col gap-3 items-end w-[88vw] max-w-xs sm:max-w-sm pointer-events-none">
        <AnimatePresence>
          {showItemSparkle && (
            <motion.div
              initial={{ x: 60, opacity: 0, scale: 0.9 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 40, opacity: 0, scale: 0.92 }}
              className="pointer-events-auto bg-[#4A3428] border-2 border-gold-glow px-6 py-4.5 rounded-2xl shadow-[0_15px_45px_0_rgba(0,0,0,0.4)] flex items-center gap-4.5 text-white w-full"
            >
              <div className="w-11 h-11 bg-gold-glow text-[#4A3428] rounded-xl flex items-center justify-center text-2xl border border-white animate-spin shrink-0">
                🎒
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#E6C06A] block font-bold">
                  relic acquired!
                </span>
                <p className="font-medieval text-md font-extrabold text-white truncate">
                  {showItemSparkle} Added to Pack
                </p>
                <p className="text-[10px] font-mono text-[#E9DFD2]/75 leading-normal mt-0.5">
                  Inspect your Arcane Backpack using bottom HUD dock at any time!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {sceneToast && (
            <motion.div
              initial={{ x: 60, opacity: 0, scale: 0.9 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 40, opacity: 0, scale: 0.92 }}
              className="pointer-events-auto bg-[#4A3428] border-2 border-gold-glow px-6 py-3.5 rounded-2xl shadow-[0_15px_45px_0_rgba(0,0,0,0.4)] flex items-center gap-3.5 text-white w-full"
            >
              <div className="w-10 h-10 bg-gold-glow/20 border border-gold-glow text-gold-glow rounded-xl flex items-center justify-center shrink-0">
                {sceneToast.final ? <Trophy className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#E6C06A] block font-bold">
                  {sceneToast.final ? "final chapter" : `scene ${sceneToast.number} begins`}
                </span>
                <p className="font-medieval text-sm font-extrabold text-white truncate">
                  {sceneToast.title}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {artifactToast && (
            <motion.div
              initial={{ x: 60, opacity: 0, scale: 0.9 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 40, opacity: 0, scale: 0.92 }}
              className="pointer-events-auto bg-[#4A3428] border-2 border-gold-glow px-6 py-3.5 rounded-2xl shadow-[0_15px_45px_0_rgba(0,0,0,0.4)] flex items-center gap-3.5 text-white w-full"
            >
              <div className="w-10 h-10 bg-gold-glow/20 border border-gold-glow text-gold-glow rounded-xl flex items-center justify-center shrink-0 text-lg">
                ✦
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#E6C06A] block font-bold">
                  artifact spent
                </span>
                <p className="font-medieval text-sm font-extrabold text-white truncate">
                  {artifactToast.item} — +{artifactToast.value} {artifactToast.stat}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 6. Fate Roll Overlay */}
      <AnimatePresence>
        {isRolling && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#1A0F0A]/90 backdrop-blur-md p-4"
          >
            <div className="max-w-md w-full bg-[#2A1D15] border-2 border-gold-glow rounded-3xl p-6 text-center space-y-6 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gold-glow/5 blur-3xl rounded-full animate-spin pointer-events-none" />
              <div className="relative space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-gold-glow/15 flex items-center justify-center text-4xl animate-bounce border border-gold-glow">
                  🎲
                </div>
                <h3 className="font-medieval text-xl font-bold tracking-widest text-[#E6C06A] uppercase">
                  Dice of Fate Rolling
                </h3>
                <div className="p-4 bg-black/40 rounded-xl max-w-xs mx-auto border border-white/5 shadow-inner">
                  <p className="text-xs font-mono tracking-wider animate-pulse text-[#FAF0ED]">
                    {rollChoiceText}
                  </p>
                </div>
              </div>
              <AnimatePresence>
                {rollResult && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="p-5 bg-gold-glow text-soft-espresso rounded-2xl border-2 border-[#FAF0ED] shadow-xl text-center space-y-2 animate-fadeIn"
                  >
                    <span className="text-2xl block">{rollResult.icon}</span>
                    <h4 className="font-medieval text-sm font-black tracking-wide">
                      DECIDED PATH CHOSEN!
                    </h4>
                    <p className="text-xs font-sans leading-snug font-medium italic">
                      "{rollResult.text}"
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. Backpack Modal */}
      <AnimatePresence>
        {backpackOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[#4A3428]/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="bg-[#FAF0ED] text-soft-espresso border-2 border-gold-glow rounded-3xl p-6 md:p-8 max-w-lg w-full relative overflow-hidden book-shadow flex flex-col justify-between max-h-[85vh]"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold-glow/15 blur-2xl rounded-full" />

              <div className="flex justify-between items-center border-b border-[#4A3428]/10 pb-4">
                <span className="font-medieval text-lg font-black tracking-wider text-soft-espresso flex items-center gap-2">
                  🛡️ Ancient Arcane Backpack
                </span>
                <button
                  onClick={() => {
                    setBackpackOpen(false);
                    setActiveItemLore(null);
                  }}
                  className="p-1 rounded-full hover:bg-neutral-200 cursor-pointer text-soft-espresso"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="my-6 overflow-y-auto space-y-5 flex-1 pr-1 scrollbar-thin">
                <p className="text-xs text-soft-espresso/60 leading-normal font-sans italic text-center max-w-xs mx-auto">
                  Click on any discovered relic slot below to decipher the artifact history and usage.
                </p>

                {activeStory.inventory.length === 0 ? (
                  <div className="p-8 border-2 border-dashed border-[#4A3428]/15 rounded-2xl text-center space-y-3">
                    <span className="text-4xl block select-none mb-1 opacity-60">🎒</span>
                    <h5 className="font-medieval text-sm font-bold text-soft-espresso">🎒 Pack is Vacant</h5>
                    <p className="text-[11px] font-sans leading-relaxed text-soft-espresso/70 max-w-xs mx-auto">
                      Explore other portal junctions, bypass security doors, or select high-intelligence decisions to claim ancient objects.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3.5">
                    {activeStory.inventory.map((item, idx) => {
                      const itemKey = `${idx}-${item}`;
                      const isUsed = usedArtifacts.has(itemKey);
                      return (
                        <div
                          key={idx}
                          onClick={() => setActiveItemLore({ name: item, lore: getItemLore(item) })}
                          className={`border-2 p-3.5 rounded-2xl flex flex-col justify-between transition-all cursor-pointer shadow-sm relative group ${
                            isUsed
                              ? "bg-[#F8EAE5]/50 border-[#4A3428]/10 opacity-50 grayscale"
                              : "bg-[#F8EAE5] border-gold-glow/20 hover:border-gold-glow hover:bg-white"
                          }`}
                        >
                          {isUsed && (
                            <span className="absolute top-2 right-2 text-[7px] font-mono uppercase tracking-widest bg-[#4A3428]/70 text-white px-1.5 py-0.5 rounded-full">
                              Spent
                            </span>
                          )}
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-base select-none">⚜️</span>
                            <span className="font-medieval text-xs font-bold leading-snug break-words">
                              {item}
                            </span>
                          </div>
                          <span className="text-[8.5px] font-mono text-navy group-hover:text-gold-glow tracking-widest uppercase transition-all duration-300">
                            Inspect &rarr;
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <AnimatePresence>
                  {activeItemLore && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="p-5 bg-[#4A3428] text-[#F4F1EC] rounded-2xl border-2 border-gold-glow shadow-inner relative space-y-2 text-xs"
                    >
                      <div className="flex justify-between items-center border-b border-white/5 pb-1.5 mb-2">
                        <span className="font-medieval text-[#E6C06A] font-bold uppercase tracking-wider block">
                          ✦ Deciphered Vault lore for: {activeItemLore.name}
                        </span>
                        <button
                          onClick={() => setActiveItemLore(null)}
                          className="text-neutral-400 hover:text-white text-[11px] font-mono cursor-pointer"
                        >
                          [Close Lore]
                        </button>
                      </div>
                      <p className="font-serif leading-relaxed italic text-[#E9DFD2] pr-1 font-medium">
                        "{activeItemLore.lore}"
                      </p>
                      {(() => {
                        const idx = activeStory.inventory.findIndex((it) => it === activeItemLore.name);
                        const itemKey = `${idx}-${activeItemLore.name}`;
                        const isUsed = idx >= 0 && usedArtifacts.has(itemKey);
                        const effect = getItemEffect(activeItemLore.name);
                        return isUsed ? (
                          <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 pt-1">
                            Already used this run
                          </p>
                        ) : (
                          <button
                            onClick={() => idx >= 0 && handleUseArtifact(activeItemLore.name, idx)}
                            className="mt-1 w-full py-2 bg-gold-glow text-[#4A3428] rounded-xl font-medieval text-[10px] font-black uppercase tracking-widest hover:brightness-110 cursor-pointer transition-all"
                          >
                            ✦ Use Artifact (+{effect.value} {effect.stat})
                          </button>
                        );
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="border-t border-[#4A3428]/10 pt-4 text-center">
                <Button
                  variant="magic"
                  onClick={() => {
                    setBackpackOpen(false);
                    setActiveItemLore(null);
                  }}
                  className="w-full text-xs py-3 uppercase tracking-wider font-medieval"
                >
                  Conclude Inventory Check
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Abort Modal */}
      <Modal
        isOpen={abortModalOpen}
        onClose={() => setAbortModalOpen(false)}
        title="Collapse Portal Alignment?"
        footerButtons={
          <>
            <Button variant="secondary" onClick={() => setAbortModalOpen(false)}>
              Maintain (Resume)
            </Button>
            <Button
              variant="magic"
              onClick={handleAbort}
              className="bg-red-700 hover:bg-red-800 text-white font-medieval uppercase border-red-500"
            >
              Abort Run
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm">
            Are you sure you want to abandon the current coordinates in{" "}
            <strong>"{world.name}"</strong>?
          </p>
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs leading-normal text-red-800">
            ⛔ Aborting this session will collapse the active coordinates fabric, discarding your
            inventory and level milestones.
          </div>
        </div>
      </Modal>

      {/* Journey Complete Modal */}
      <Modal
        isOpen={journeyComplete}
        onClose={() => setJourneyComplete(false)}
        title="Chronicle Sealed"
        footerButtons={
          <Button variant="magic" onClick={handleFinishJourney}>
            Return to Library
          </Button>
        }
      >
        <div className="space-y-3 text-center">
          <Trophy className="w-10 h-10 mx-auto text-gold-glow" />
          <p className="text-sm">
            You completed <strong>{sceneNumber.current}</strong> scenes in{" "}
            <strong>"{world.name}"</strong>. The portal has stabilized permanently and your chronicle
            is recorded in the Archives.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Adventure;