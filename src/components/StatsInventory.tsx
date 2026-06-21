import React, { useState, useEffect } from "react";
import { useStory } from "../context/StoryContext";
import { BookOpen, Shield, Lightbulb, Clover, Backpack, HelpCircle, UserCheck, ChevronDown, ChevronUp, Sparkles, AlertCircle } from "lucide-react";
import Modal from "./Modal";
import { motion, AnimatePresence } from "motion/react";

export const StatsInventory: React.FC = () => {
  const { activeStory } = useStory();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  
  // Collapse toggles for mobile responsiveness
  const [isAttributesOpen, setIsAttributesOpen] = useState(true);
  const [isArtifactsOpen, setIsArtifactsOpen] = useState(true);
  const [isCompanionOpen, setIsCompanionOpen] = useState(true);

  // New item notification & animation states
  const [prevInventoryLength, setPrevInventoryLength] = useState(0);
  const [backpackAnimating, setBackpackAnimating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Gold Particle burst coordinates
  const [goldParticles, setGoldParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number }[]>([]);

  const triggerGoldBurst = () => {
    const burst = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: (Math.random() - 0.5) * 150, // horizontal spray
      y: (Math.random() - 0.5) * 60 - 30, // vertical float
      size: Math.random() * 5 + 3.5,
      duration: Math.random() * 0.8 + 0.6
    }));
    setGoldParticles(burst);
    setTimeout(() => {
      setGoldParticles([]);
    }, 1500);
  };

  useEffect(() => {
    if (activeStory) {
      if (prevInventoryLength > 0 && activeStory.inventory.length > prevInventoryLength) {
        // Find newly added item
        const newItem = activeStory.inventory[activeStory.inventory.length - 1];
        if (newItem) {
          setToastMessage(`✨ ${newItem} Added`);
          setBackpackAnimating(true);
          triggerGoldBurst();
          // Auto clear animation and message
          const animTimer = setTimeout(() => setBackpackAnimating(false), 1200);
          const toastTimer = setTimeout(() => setToastMessage(null), 3500);
          return () => {
            clearTimeout(animTimer);
            clearTimeout(toastTimer);
          };
        }
      }
      setPrevInventoryLength(activeStory.inventory.length);
    }
  }, [activeStory?.inventory]);

  if (!activeStory) return null;

  const { stats, inventory, world } = activeStory;

  const statMeta = [
    {
      name: "Knowledge",
      value: stats.knowledge,
      color: "bg-blue-500",
      icon: <BookOpen className="w-4 h-4 text-blue-500" />,
      desc: "Ability to decipher ancient ciphers, historic blueprints, and spell-codes."
    },
    {
      name: "Courage",
      value: stats.courage,
      color: "bg-red-500",
      icon: <Shield className="w-4 h-4 text-red-500" />,
      desc: "Grit to run up moving obstacles and face dangerous guardians raw."
    },
    {
      name: "Creativity",
      value: stats.creativity,
      color: "bg-purple-500",
      icon: <Lightbulb className="w-4 h-4 text-purple-500" />,
      desc: "Wit to hack systems, pick antique lock pins, and sculpt ambient spell mist."
    },
    {
      name: "Luck",
      value: stats.luck,
      color: "bg-emerald-500",
      icon: <Clover className="w-4 h-4 text-emerald-500" />,
      desc: "Chance to discover hidden bypass handles and land securely when falling."
    }
  ];

  const getItemLore = (itemName: string) => {
    const normalized = itemName.toLowerCase();

    if (normalized.includes("book") || normalized.includes("ledger") || normalized.includes("journal") || normalized.includes("manuscript") || normalized.includes("archives")) {
      return {
        description: "Written in faded runic script and bound in thick hide. The pages smell faintly of cedar and dry tea. Reading its margins reveals spatial stabilization equations that keep the local portal aligned.",
        affinity: "Knowledge",
        icon: "📖",
        quality: "Mythic Scribe"
      };
    }
    if (normalized.includes("key") || normalized.includes("crystal") || normalized.includes("core") || normalized.includes("battery") || normalized.includes("lever")) {
      return {
        description: "A softly humming artifact. It vibrates at a perfect 432Hz frequency, emitting a warm azure glow. Re-injects spatial matrix codes to open locked pathways.",
        affinity: "Creativity",
        icon: "🔑",
        quality: "Rare Coordinate Core"
      };
    }
    if (normalized.includes("compass") || normalized.includes("map") || normalized.includes("decoder") || normalized.includes("astral")) {
      return {
        description: "Its brass rotating gears are extremely complex, pointing not towards Earthly magnetic north, but straight towards the nearest dimensional rift stabilization node.",
        affinity: "Luck",
        icon: "🧭",
        quality: "Scribe Standard"
      };
    }
    if (normalized.includes("feather") || normalized.includes("quill") || normalized.includes("pen")) {
      return {
        description: "An iridescent silver plume plucked from a dimensional message raven. Highly responsive to spell-mist currents. Enables swift formulation of new paths.",
        affinity: "Creativity",
        icon: "🪶",
        quality: "Ethereal Accessory"
      };
    }
    if (normalized.includes("sword") || normalized.includes("blade") || normalized.includes("shield") || normalized.includes("dagger") || normalized.includes("guard")) {
      return {
        description: "An ancient protective tool once held by portal sentries. Formed of dense dark-espresso alloy, protecting the bearer against void sickness and entropy.",
        affinity: "Courage",
        icon: "🛡️",
        quality: "Sentinels Relic"
      };
    }
    if (normalized.includes("coin") || normalized.includes("token") || normalized.includes("gold") || normalized.includes("crest")) {
      return {
        description: "A heavy round coin carrying the crest of the Scriptorium. It hums with latent luck-fields and serves as currency to persuade stubborn portal gatekeepers.",
        affinity: "Luck",
        icon: "🪙",
        quality: "Antique Handout"
      };
    }

    // Fallback hash generator
    const hash = itemName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const materials = ["glowing glass", "brushed copper", "cold star-steel", "ancient driftwood", "crystallized moss"];
    const selectedMaterial = materials[hash % materials.length];
    const affinities = ["Knowledge", "Courage", "Creativity", "Luck"] as const;
    const selectedAffinity = affinities[hash % affinities.length];

    return {
      description: `A curious object fashioned from ${selectedMaterial}. It hums softly in your palm, whispering secrets of forgotten parallel branches. Truly a vital artifact on your journey.`,
      affinity: selectedAffinity,
      icon: "✨",
      quality: "Uncharted Archetype"
    };
  };

  return (
    <div className="space-y-6 w-full">
      
      {/* 1. Attributes Box */}
      <div className="bg-[#F8EAE5] border border-navy/20 rounded-2xl p-5 shadow-sm space-y-4">
        
        {/* Title */}
        <div 
          onClick={() => setIsAttributesOpen(!isAttributesOpen)} 
          className="pb-2.5 flex items-center justify-between border-b border-navy/10 cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <span className="font-medieval text-md font-bold text-soft-espresso tracking-wider block">
              Coded Attributes (D10)
            </span>
            <span className="text-[9px] font-mono font-medium text-[#678DC6] bg-white px-2 py-0.5 rounded border border-[#678DC6]/15 max-md:hidden">
              Multiplier: 50pts
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-sans text-navy font-semibold md:hidden">
              {isAttributesOpen ? "Collapse" : "Expand"}
            </span>
            {isAttributesOpen ? <ChevronUp className="w-4 h-4 text-soft-espresso" /> : <ChevronDown className="w-4 h-4 text-soft-espresso" />}
          </div>
        </div>

        {/* List of attributes */}
        {isAttributesOpen && (
          <div className="space-y-3.5 animate-fadeIn">
            {statMeta.map((st) => (
              <div key={st.name} className="space-y-1 group relative">
                <div className="flex justify-between items-center text-xs">
                  <p className="font-semibold text-soft-espresso flex items-center gap-1.5 font-medieval">
                    {st.icon}
                    {st.name}
                  </p>
                  <div className="font-mono text-[11px] bg-white border border-[#4a3428]/10 px-2 py-0.5 rounded-full font-bold">
                    {st.value}/10
                  </div>
                </div>

                {/* Progress bar container */}
                <div className="h-2 bg-[#E9DFD2] rounded-full overflow-hidden border border-[#4a3428]/5 relative">
                  <div 
                    className={`h-full ${st.color} bg-gradient-to-r from-${st.color} to-gold-glow/50 transition-all duration-500`}
                    style={{ width: `${st.value * 10}%` }}
                  />
                </div>

                {/* Hover Tooltip descriptor */}
                <div className="opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity absolute bottom-full left-0 mb-1 z-30 w-full bg-[#4A3428] text-[#F4F1EC] text-[9.5px] p-2 rounded shadow-xl border border-gold-glow font-sans">
                  {st.desc}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Adventure Pack (Inventory Items Grid) */}
      <div className="bg-[#F8EAE5] border border-navy/20 rounded-2xl p-5 shadow-sm space-y-4 relative">
        
        {/* Title */}
        <div 
          onClick={() => setIsArtifactsOpen(!isArtifactsOpen)} 
          className="pb-2.5 flex items-center justify-between border-b border-navy/10 cursor-pointer select-none"
        >
          <span className="font-medieval text-md font-bold text-soft-espresso tracking-wider flex items-center gap-2">
            <div className={`relative ${backpackAnimating ? "animate-bounce origin-center rotate-12 scale-125" : ""}`}>
              {backpackAnimating && (
                <div className="absolute inset-0 bg-gold-glow/40 blur-md rounded-full scale-150 animate-pulse" />
              )}
              <Backpack className={`w-5 h-5 ${backpackAnimating ? "text-gold-glow" : "text-soft-espresso"}`} />
            </div>
            Arcane Backpack ({inventory.length})
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#678DC6] bg-white px-2 py-0.5 rounded border border-[#678DC6]/15">
              Click Item for Lore
            </span>
            {isArtifactsOpen ? <ChevronUp className="w-4 h-4 text-soft-espresso" /> : <ChevronDown className="w-4 h-4 text-soft-espresso" />}
          </div>
        </div>

        {/* Gold Particle Burst Renderer */}
        <div className="relative flex justify-center w-full">
          <AnimatePresence>
            {goldParticles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                animate={{ 
                  x: p.x, 
                  y: p.y, 
                  opacity: 0, 
                  scale: [1, 1.4, 0],
                  rotate: Math.random() * 360 
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: p.duration, ease: "easeOut" }}
                className="absolute pointer-events-none rounded-full bg-gradient-to-r from-gold-glow to-[#FAF0ED] shadow-[0_0_8px_#E6C06A] z-40 flex items-center justify-center font-bold text-[8px] text-[#4A3428]"
                style={{ width: p.size, height: p.size, left: "50%", top: "-10px" }}
              >
                ✦
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Display grid with unfolding height and scale animation */}
        <AnimatePresence initial={false}>
          {isArtifactsOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0, scale: 0.96 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-2 pt-1">
                {inventory.length === 0 ? (
                  <div className="p-4 bg-[#E9DFD2]/30 rounded-xl border border-dashed border-navy/15 text-center text-xs text-soft-espresso/60 italic">
                    Pack is empty. Explore alternative rooms to discover rare artifacts.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 relative">
                    {inventory.map((item, idx) => (
                      <motion.div 
                        key={idx} 
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedItem(item)}
                        className="bg-[#E9DFD2] p-2.5 rounded-xl border-2 border-gold-glow/20 shadow-sm flex flex-col justify-between group hover:border-[#D4AF37] hover:bg-white hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 h-1 w-8 bg-gradient-to-r from-gold-glow to-transparent" />
                        <span className="text-[11px] font-semibold text-[#4A3428] font-medieval leading-tight break-words pr-1">
                          ⚜️ {item}
                        </span>
                        <span className="text-[7.5px] font-mono text-[#678DC6] tracking-wider uppercase mt-1.5 flex items-center gap-1 group-hover:text-gold-glow transform group-hover:translate-x-0.5 transition-all">
                          Inspect {`✦`}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom Handheld Enchanted Book Tooltip Modal for Lore Details */}
        <AnimatePresence>
          {selectedItem && (() => {
            const lore = getItemLore(selectedItem);
            return (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                className="p-4 bg-[#4A3428] text-white border-2 border-gold-glow rounded-xl shadow-xl mt-3.5 space-y-3 relative overflow-hidden"
              >
                {/* Gold corner ornaments */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gold-glow/40 rounded-tl pointer-events-none" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gold-glow/40 rounded-tr pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gold-glow/40 rounded-bl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gold-glow/40 rounded-br pointer-events-none" />

                <div className="flex justify-between items-start border-b border-white/10 pb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl select-none bg-white/15 p-1 rounded-lg border border-white/15 shadow-sm">
                      {lore.icon}
                    </span>
                    <div className="text-left">
                      <h4 className="font-medieval text-xs font-black text-gold-glow tracking-wide block">
                        {selectedItem}
                      </h4>
                      <span className="inline-block text-[7.5px] font-mono uppercase bg-gold-glow/20 text-gold-glow px-1 py-0.2 rounded border border-gold-glow/20 font-bold">
                        {lore.quality}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="text-white/60 hover:text-white bg-white/5 hover:bg-white/15 w-5 h-5 rounded flex items-center justify-center font-mono text-[9px] transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <p className="font-serif italic text-xs leading-relaxed text-[#E9DFD2] text-left">
                  "{lore.description}"
                </p>

                <div className="flex justify-between items-center text-[9px] font-mono pt-1.5 border-t border-white/5 text-[#E9DFD2]/80">
                  <span>Affinity: <strong className="text-gold-glow">{lore.affinity}</strong></span>
                  <span className="text-[8px] bg-white/10 px-1 py-0.2 rounded text-shadow">P&P Artifact</span>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>

      </div>

      {/* 3. Guide Information Card */}
      <div className="bg-[#4A3428] text-[#F4F1EC] border border-gold-glow/30 rounded-2xl p-4 shadow-md space-y-2 relative overflow-hidden">
        
        {/* Back decorative light splash */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gold-glow/15 blur-2xl rounded-full pointer-events-none" />

        <div 
          onClick={() => setIsCompanionOpen(!isCompanionOpen)} 
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E6C06A] flex items-center justify-center text-[#4A3428] flex-shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-medieval text-xs font-bold text-gold-glow leading-none">
                {world.companionName}
              </h4>
              <span className="text-[8px] font-mono text-[#E9DFD2]/60 uppercase">
                {world.companionType}
              </span>
            </div>
          </div>
          <div>
            {isCompanionOpen ? <ChevronUp className="w-4 h-4 text-gold-glow/70" /> : <ChevronDown className="w-4 h-4 text-gold-glow/70" />}
          </div>
        </div>
        
        {isCompanionOpen && (
          <p className="text-[10.5px] italic text-[#E9DFD2]/95 border-t border-white/5 pt-2 font-sans animate-fadeIn">
            "{world.companionMessage}"
          </p>
        )}
      </div>

      {/* Artifact Lore modal popovers */}
      {selectedItem && (() => {
        const lore = getItemLore(selectedItem);
        return (
          <Modal
            isOpen={!!selectedItem}
            onClose={() => setSelectedItem(null)}
            title="Artifact Inspection Vault"
            footerButtons={
              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2 text-xs uppercase tracking-wider font-medieval bg-[#4A3428] text-white hover:bg-navy transition-all rounded-lg border border-gold-glow/40 shadow-md cursor-pointer"
              >
                Grip Artifact & Return
              </button>
            }
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-[#F8EAE5] border border-[#4a3428]/10 rounded-2xl">
                <span className="text-4xl p-2 bg-white rounded-xl border border-gold-glow/30 select-none shadow-sm">
                  {lore.icon}
                </span>
                <div className="space-y-1">
                  <span className="text-[9px] font-mono uppercase bg-gold-glow/20 text-[#4A3428] px-2 py-0.5 rounded-md border border-gold-glow/30 font-bold">
                    {lore.quality}
                  </span>
                  <h3 className="font-medieval text-md md:text-lg font-bold text-soft-espresso">
                    {selectedItem}
                  </h3>
                  <p className="text-xs text-[#678DC6] uppercase font-mono font-semibold flex items-center gap-1 pt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-gold-glow" /> Affinity attribute: <strong className="text-soft-espresso font-medieval">{lore.affinity}</strong>
                  </p>
                </div>
              </div>

              <div className="space-y-2 font-sans text-[#4a3428]">
                <h4 className="font-medieval text-xs font-bold uppercase tracking-wider text-soft-espresso/80">
                  Lore Ledger Footprint:
                </h4>
                <p className="text-xs md:text-sm leading-relaxed p-3.5 bg-white/55 rounded-xl border border-navy/5 italic shadow-inner">
                  "{lore.description}"
                </p>
              </div>

              <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-2.5 text-[11px] text-blue-950 font-sans leading-normal">
                <AlertCircle className="w-4 h-4 text-[#678DC6] mt-0.5 flex-shrink-0" />
                <p>
                  This artifact remains in your active inventory as long as alignment holds true. Presenting it at specific portal junctions triggers key storyline outcomes.
                </p>
              </div>
            </div>
          </Modal>
        );
      })()}

      {/* 4. Magical Item Received Toast Notification Overlay */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-[999] bg-[#FAF0ED] text-soft-espresso border-2 border-gold-glow/50 rounded-xl p-3.5 shadow-2xl flex items-center gap-3 animate-fadeIn border-b-4 max-w-sm">
          <div className="w-9 h-9 rounded-lg bg-[#4A3428] border border-gold-glow flex items-center justify-center text-md text-gold-glow select-none animate-pulse">
            🎒
          </div>
          <div>
            <h5 className="font-medieval text-xs font-black tracking-wide text-[#4A3428] uppercase leading-none">
              Arcane Backpack
            </h5>
            <p className="font-sans text-[11px] font-semibold text-emerald-800 mt-1">
              {toastMessage}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
export default StatsInventory;
