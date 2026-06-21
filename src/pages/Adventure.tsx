import React, { useState, useEffect } from "react";
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
  BookOpen
} from "lucide-react";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { motion, AnimatePresence } from "motion/react";

export const Adventure: React.FC = () => {
  const { activeStory, chooseOption, resetActiveStory } = useStory();
  const [showMap, setShowMap] = useState(true);
  const [abortModalOpen, setAbortModalOpen] = useState(false);
  
  // Interactive HUD state variables
  const [backpackOpen, setBackpackOpen] = useState(false);
  const [activeItemLore, setActiveItemLore] = useState<{ name: string; lore: string } | null>(null);
  
  // Fate Roll states
  const [isRolling, setIsRolling] = useState(false);
  const [rollChoiceText, setRollChoiceText] = useState("");
  const [rollResult, setRollResult] = useState<{ text: string; icon: string } | null>(null);

  // New item notification spark effect
  const [prevInventoryCount, setPrevInventoryCount] = useState(activeStory?.inventory.length || 0);
  const [showItemSparkle, setShowItemSparkle] = useState<string | null>(null);

  useEffect(() => {
    if (!activeStory) return;
    if (activeStory.inventory.length > prevInventoryCount) {
      const newlyAcquired = activeStory.inventory[activeStory.inventory.length - 1];
      setShowItemSparkle(newlyAcquired);
      setPrevInventoryCount(activeStory.inventory.length);
      const timer = setTimeout(() => {
        setShowItemSparkle(null);
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      setPrevInventoryCount(activeStory.inventory.length);
    }
  }, [activeStory?.inventory]);

  if (!activeStory) return null;

  const { world } = activeStory;

  const handleAbort = () => {
    setAbortModalOpen(false);
    resetActiveStory();
  };

  // Scroll anchor helper
  const scrollToAnchor = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Lore lookups for rare relics
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

  // Fate Roll triggers selection of random non-disabled choice card option
  const handleFateRoll = () => {
    if (isRolling || !activeStory) return;

    const currentNode = activeStory.graph.find((node) => node.id === activeStory.currentNodeId);
    if (!currentNode || currentNode.isEnding) return;

    // Compile list of available choice cards player has requirements for
    const validChoices = currentNode.choices.filter((choice) => {
      if (choice.statRequirement) {
        if ((activeStory.stats[choice.statRequirement.stat] || 0) < choice.statRequirement.value) {
          return false;
        }
      }
      if (choice.itemRequirement) {
        if (!activeStory.inventory.includes(choice.itemRequirement)) {
          return false;
        }
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
      "Settling path timeline..."
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
      // Roll random Choice
      const rolled = validChoices[Math.floor(Math.random() * validChoices.length)];
      setRollResult({
        text: `The fates have rolled standard option: "${rolled.text}"!`,
        icon: rolled.text.includes("Investigate") ? "⚔️" : rolled.text.includes("Hide") ? "🤫" : "📜"
      });

      // Maintain popup for 1.8s, then trigger choice select automatically!
      setTimeout(() => {
        setRollResult(null);
        chooseOption(rolled);
        setIsRolling(false);
        // Anchor to standard panel view
        scrollToAnchor("choices-section");
      }, 1600);

    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-10 pb-32 relative">
      
      {/* 1. Header Information Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#F8EAE5] p-5 rounded-2xl border border-navy/20 gap-4 book-shadow shadow-sm relative">
        
        {/* World Name and Scribe tags */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex px-2 py-0.5 rounded text-[9px] uppercase font-mono tracking-wider font-semibold bg-navy/10 text-navy border border-navy/10">
              {world.genre} Universe
            </span>
            <span className="inline-flex px-2 py-0.5 rounded text-[9px] uppercase font-mono tracking-wider font-semibold bg-gold-glow/20 text-[#4A3428] border border-gold-glow/40 animate-pulse-gold">
              Level: {world.difficulty}
            </span>
          </div>
          <h1 className="font-medieval text-xl md:text-2xl font-black text-soft-espresso tracking-wide leading-none">
            {world.name} • Active Story
          </h1>
          <p className="text-[10px] text-soft-espresso/60 font-sans tracking-wide">
            Companion Guide: <strong className="text-soft-espresso font-medieval">{world.companionName}</strong> is stable and ready.
          </p>
        </div>

        {/* Option togglers */}
        <div className="flex justify-end items-center gap-2 w-full md:w-auto">
          <Button 
            variant="secondary" 
            onClick={() => setShowMap(!showMap)}
            className="text-xs py-2 px-4 shadow-sm flex items-center justify-center gap-1.5"
          >
            {showMap ? <LayoutDashboard className="w-4 h-4 text-navy" /> : <Map className="w-4 h-4 text-navy" />}
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

      {/* 2. Visual Branch Constellation Map Toggler */}
      {showMap && (
        <div className="transition-all duration-500 transform animate-float">
          <PortalMap />
        </div>
      )}

      {/* 3. Main Split Game Core Grid Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative pb-12">
        
        {/* Left Column: Primary narrative panel with choice cards */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStory?.currentNodeId || "adventure-panel"}
              initial={{ rotateY: -65, transformOrigin: "left center", opacity: 0, scale: 0.96 }}
              animate={{ rotateY: 0, transformOrigin: "left center", opacity: 1, scale: 1 }}
              exit={{ rotateY: 65, transformOrigin: "right center", opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.65, ease: [0.25, 1, 0.35, 1] }}
              style={{ perspective: 1500, transformStyle: "preserve-3d" }}
            >
              <AdventurePanel />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column: Active Scribe profile progress indicators & item blocks */}
        <div className="lg:col-span-1">
          <StatsInventory />
        </div>

      </div>

      {/* 4. EXTREMELY POLISHED GAME-LIKE STICKY HUD ACTION DOCK */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[45] w-full max-w-md px-4 pointer-events-none">
        <div className="pointer-events-auto bg-[#4A3428] border-2 border-gold-glow/75 text-white py-2 px-4 sm:px-6 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.5)] flex items-center justify-between gap-2 text-xs font-mono select-none">
          
          {/* Active Corridor Anchor Link */}
          <button 
            onClick={() => scrollToAnchor("choices-section")}
            className="flex flex-col items-center gap-0.5 text-[#E9DFD2] hover:text-gold-glow transition-colors font-semibold group cursor-pointer"
          >
            <Compass className="w-5 h-5 text-gold-glow group-hover:animate-spin" />
            <span className="text-[9px] uppercase tracking-wider font-mono">Corridor</span>
          </button>

          {/* Scriptorium Journal Link */}
          <button 
            onClick={() => scrollToAnchor("journal-section")}
            className="flex flex-col items-center gap-0.5 text-[#E9DFD2] hover:text-gold-glow transition-colors font-semibold group cursor-pointer"
          >
            <Scroll className="w-5 h-5 text-gold-glow group-hover:scale-115 transition-transform" />
            <span className="text-[9px] uppercase tracking-wider font-mono">Journal</span>
          </button>

          {/* FATE ROLL FEATURE BUTTON */}
          <button 
            onClick={handleFateRoll}
            disabled={isRolling}
            className={`flex flex-col items-center justify-center -mt-6 bg-gradient-to-tr from-[#678DC6] via-[#E6C06A] to-amber-400 p-3.5 rounded-full border-2 border-gold-glow cursor-pointer text-[#4A3428] shadow-lg transition-transform hover:scale-110 active:scale-95 group ${isRolling ? "animate-pulse" : "animate-bounce"}`}
            title="Roll Fate dice on active corridors"
          >
            <Dice5 className={`w-6 h-6 stroke-[2.2] text-[#4A3428] ${isRolling ? "animate-spin" : "group-hover:rotate-45 transition-transform"}`} />
            <span className="text-[7.5px] font-black uppercase text-[#4A3428] mt-0.5 font-medieval tracking-widest whitespace-nowrap">Fate Roll</span>
          </button>

          {/* ARCANE BACKPACK Vault model trigger */}
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

      {/* 5. ITEM ACQUISITION SPARKLING POPUP NOTIFICATION */}
      <AnimatePresence>
        {showItemSparkle && (
          <motion.div 
            initial={{ y: 50, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -30, opacity: 0, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-[#4A3428] border-2 border-gold-glow px-6 py-4.5 rounded-2xl shadow-[0_15px_45px_0_rgba(0,0,0,0.4)] flex items-center gap-4.5 text-white max-w-sm w-full"
          >
            <div className="w-11 h-11 bg-gold-glow text-[#4A3428] rounded-xl flex items-center justify-center text-2xl border border-white animate-spin">
              🎒
            </div>
            <div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#E6C06A] block font-bold">
                relic acquired!
              </span>
              <p className="font-medieval text-md font-extrabold text-white">
                {showItemSparkle} Added to Pack
              </p>
              <p className="text-[10px] font-mono text-[#E9DFD2]/75 leading-normal mt-0.5">
                Inspect your Arcane Backpack using bottom HUD dock at any time!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. REAL-TIME CELESTIAL DICE ROLLING (FATE ROLL) SIMULATION OVERLAY */}
      <AnimatePresence>
        {isRolling && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#1A0F0A]/90 backdrop-blur-md p-4"
          >
            <div className="max-w-md w-full bg-[#2A1D15] border-2 border-gold-glow rounded-3xl p-6 text-center space-y-6 text-white shadow-2xl relative overflow-hidden">
              {/* Rotating particle background glow */}
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

              {/* Rolled conclusion card popup */}
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

      {/* 7. DETAILED ARCANE BACKPACK DRAWER/MODAL POPUP */}
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
              {/* Back aesthetic glow */}
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

              {/* Items storage grid */}
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
                    {activeStory.inventory.map((item, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setActiveItemLore({ name: item, lore: getItemLore(item) })}
                        className="bg-[#F8EAE5] border-2 border-gold-glow/20 p-3.5 rounded-2xl flex flex-col justify-between hover:border-gold-glow hover:bg-white transition-all cursor-pointer shadow-sm relative group"
                      >
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
                    ))}
                  </div>
                )}

                {/* Relic lore drawer within popup */}
                <AnimatePresence>
                  {activeItemLore && (
                    <motion.div 
                      initial={{ opacity: 0, h: 0, y: 15 }}
                      animate={{ opacity: 1, h: "auto", y: 0 }}
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
                      <p className="font-serif leading-relaxed italic text-[#E9DFD2] pr-1 font-medium font-medium">
                        "{activeItemLore.lore}"
                      </p>
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

      {/* Abort Portal Modal Check overlay */}
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
            Are you sure you want to abandon the current coordinates in <strong>"{world.name}"</strong>?
          </p>
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs leading-normal text-red-800">
            ⛔ Aborting this session will collapse the active coordinates fabric, discarding your inventory and level milestones.
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Adventure;
