import React, { useState, useEffect } from "react";
import { useStory } from "../context/StoryContext";
import { EndingCard } from "../components/EndingCard";
import { 
  Trophy, Search, Lock, BookOpen, Scroll, Sparkles, Filter, 
  Compass, ShieldAlert, ArrowRight, BookMarked, HelpCircle
} from "lucide-react";
import { worldLoreRegistry, LoreEntry } from "../data/loreData";
import { motion, AnimatePresence } from "motion/react";
import Button from "../components/Button";

type ChronicleTab = "scroll" | "lore";

export const Chronicle: React.FC = () => {
  const { activeStory, unlockedLoreIds, unlockLore, incrementQuestProgress } = useStory();
  const [activeTab, setActiveTab] = useState<ChronicleTab>(() => {
    return activeStory ? "scroll" : "lore";
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [focusedLore, setFocusedLore] = useState<LoreEntry | null>(null);

  // Trigger read_lore daily quest when visiting this page
  useEffect(() => {
    incrementQuestProgress("read_lore");
  }, []);

  // Sync tab choice if activeStory alters
  useEffect(() => {
    if (!activeStory && activeTab === "scroll") {
      setActiveTab("lore");
    }
  }, [activeStory]);

  const categories = ["All", "People", "Places", "Artifacts", "Factions", "Events", "Creatures"];

  // Filter registry
  const filteredLore = worldLoreRegistry.filter(entry => {
    const isUnlocked = unlockedLoreIds.includes(entry.id);
    const categoryMatch = selectedCategory === "All" || entry.category === selectedCategory;
    
    // Unlocked items searchable by title/desc, locked items matches only if searchable
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      if (isUnlocked) {
        return categoryMatch && (
          entry.title.toLowerCase().includes(q) || 
          entry.description.toLowerCase().includes(q)
        );
      } else {
        // Locked search
        return categoryMatch && (
          entry.category.toLowerCase().includes(q) || 
          "mystery locked portal entry".includes(q)
        );
      }
    }
    return categoryMatch;
  });

  const totalEntries = worldLoreRegistry.length;
  const discoveredCount = worldLoreRegistry.filter(e => unlockedLoreIds.includes(e.id)).length;
  const progressPercent = Math.round((discoveredCount / totalEntries) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 relative">
      {/* Absolute Decorative ambient circles */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />

      {/* Header section */}
      <div className="text-center space-y-2 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#E9DFD2] border border-[#C5A880]/30 text-[#4A3428] font-bold text-xs uppercase font-mono tracking-wider">
          <BookMarked className="w-3.5 h-3.5 text-[#C5A880]" />
          The Portal Chronicles
        </div>
        <h1 className="font-medieval text-4xl md:text-5xl font-black text-[#4A3428] tracking-wide">
          Scrolls & Codex
        </h1>
        <p className="text-sm text-[#4A3428]/70 font-sans max-w-xl mx-auto">
          Unlock cosmic history as you venture wider across dimensions. Every decision writes future archives of the Scriptorium.
        </p>
      </div>

      {/* Tab controls */}
      <div className="flex justify-center z-10 relative">
        <div className="inline-flex p-1 bg-[#3A271C] rounded-xl border border-[#C5A880]/30 shadow-2xl">
          {activeStory && (
            <button
              onClick={() => setActiveTab("scroll")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs md:text-sm font-semibold transition-all duration-300 font-medieval cursor-pointer ${
                activeTab === "scroll"
                  ? "bg-[#C5A880] text-[#1E0D07] shadow-lg border border-[#F1E4C3]"
                  : "text-[#E9DFD2] hover:text-white"
              }`}
            >
              <Scroll className="w-4 h-4" />
              Chronicle Scroll
            </button>
          )}
          <button
            onClick={() => setActiveTab("lore")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs md:text-sm font-semibold transition-all duration-300 font-medieval cursor-pointer ${
              activeTab === "lore"
                ? "bg-[#C5A880] text-[#1E0D07] shadow-lg border border-[#F1E4C3]"
                : "text-[#E9DFD2] hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            📖 World Lore Encyclopedia
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "scroll" && activeStory ? (
          <motion.div
            key="scroll-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 max-w-4xl mx-auto z-10 relative"
          >
            <div className="text-center mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#C5A880]/15 border border-[#C5A880]/30 text-gold-glow text-[11px] uppercase tracking-wide">
                <Trophy className="w-3.5 h-3.5" />
                Active Run Settlement Certificate
              </span>
            </div>
            <EndingCard />
          </motion.div>
        ) : (
          <motion.div
            key="lore-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 z-10 relative"
          >
            {/* Progression tracker panel */}
            <div className="bg-[#2D1B12] rounded-2xl border-2 border-[#C5A880]/30 p-6 md:p-8 shadow-xl max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <BookOpen className="w-32 h-32 text-orange-200" />
              </div>

              <div className="space-y-2 text-center md:text-left">
                <h2 className="font-medieval text-xl text-gold-glow font-bold">
                  Scriptorium Scribe Mastery Progress
                </h2>
                <p className="text-xs text-[#E9DFD2]/60 font-mono">
                  DISCOVERED: {discoveredCount} / {totalEntries} LEGENDARY CHRONICLES
                </p>
                <div className="w-full md:w-80 bg-[#1Alternative] bg-black/40 h-2.5 rounded-full overflow-hidden border border-[#C5A880]/20 mt-3">
                  <div 
                    className="bg-gradient-to-r from-yellow-600 via-amber-400 to-yellow-600 h-full rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(234,179,8,0.5)]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="px-6 py-4 rounded-xl bg-black/30 border border-[#C5A880]/20 text-center flex flex-col justify-center min-w-[140px]">
                <span className="text-3xl font-black font-medieval text-[#C5A880] drop-shadow-md">
                  {progressPercent}%
                </span>
                <span className="text-[10px] font-mono tracking-wider text-[#E9DFD2]/50 uppercase mt-0.5">
                  Codex Mastery
                </span>
              </div>
            </div>

            {/* Category / Filter Controls */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search query */}
                <div className="relative w-full md:w-80">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search characters, items or locations..."
                    className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-[#2D1B12] text-[#F4F1EC] border-2 border-[#C5A880]/30 placeholder-[#E9DFD2]/40 text-sm focus:outline-none focus:border-gold-glow transition-colors font-sans"
                  />
                  <Search className="w-4 h-4 text-[#C5A880] absolute left-3.5 top-3.5" />
                </div>

                {/* Filters selection */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
                  <Filter className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                  <span className="text-xs text-[#E9DFD2]/70 font-medieval shrink-0 mr-1.5">Realm Guild:</span>
                  <div className="flex gap-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                          selectedCategory === cat
                            ? "bg-[#C5A880] text-black font-semibold border-transparent"
                            : "bg-[#2D1B12] text-[#E9DFD2]/70 border-[#C5A880]/20 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Lore entries grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLore.map((entry) => {
                const isUnlocked = unlockedLoreIds.includes(entry.id);
                
                return (
                  <motion.div
                    key={entry.id}
                    layoutId={`lore-card-${entry.id}`}
                    onClick={() => {
                      if (isUnlocked) {
                        setFocusedLore(entry);
                      }
                    }}
                    className={`bg-stone-900 border-2 rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all duration-300 ${
                      isUnlocked 
                        ? "border-[#C5A880]/40 cursor-pointer hover:border-gold-glow/80 active:translate-y-0.5 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(212,175,55,0.1)] background-parchment" 
                        : "border-stone-800 opacity-75 grayscale bg-[#1D1612]/30"
                    }`}
                  >
                    {/* Ribbon color on category */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-[#C5A880] to-amber-700" />
                    
                    <div className="flex justify-between items-start pt-2">
                      <span className="text-xs font-mono tracking-widest text-amber-500 uppercase">
                        {entry.category}
                      </span>
                      {isUnlocked ? (
                        <div className="p-1 rounded bg-[#E9DFD2] text-[#4A3428] scale-90 border border-[#C5A880]/10">
                          <Compass className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="p-1 rounded bg-black/40 text-stone-500 scale-90 border border-stone-800">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="mt-3 space-y-1.5">
                      <h3 className={`font-medieval text-lg font-black tracking-wide ${isUnlocked ? "text-amber-100" : "text-stone-500 italic"}`}>
                        {isUnlocked ? entry.title : "??? [Mystery Entry]"}
                      </h3>
                      
                      {isUnlocked ? (
                        <p className="text-xs text-[#E9DFD2]/80 line-clamp-3 font-sans leading-relaxed">
                          {entry.description}
                        </p>
                      ) : (
                        <div className="pt-2 pb-1 text-[11px] text-stone-400 font-mono italic">
                          <span className="text-amber-500/70 block not-italic">Hint:</span>
                          Unlocks by exploring: "{entry.discoveredIn}" path.
                        </div>
                      )}
                    </div>

                    {isUnlocked && (
                      <div className="pt-3 border-t border-[#C5A880]/10 mt-3 flex items-center justify-between text-[11px] font-mono text-[#C5A880]/80">
                        <span>Read complete lore</span>
                        <ArrowRight className="w-3 h-3 text-gold-glow animate-pulse" />
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {filteredLore.length === 0 && (
                <div className="col-span-full py-16 text-center text-stone-400 space-y-2">
                  <ShieldAlert className="w-8 h-8 text-[#C5A880] mx-auto animate-pulse" />
                  <p className="font-medieval text-sm text-[#E9DFD2]">No recorded scrolls found in this sector guild.</p>
                  <p className="text-xs text-stone-500">Try adjusting your query coordinates or select another tab.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Encyclopedia entry read details modal */}
      <AnimatePresence>
        {focusedLore && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#26150D] border-4 border-[#C5A880] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-gold-glow to-amber-700" />
              
              <div className="p-6 md:p-8 space-y-6 relative">
                {/* Close Button */}
                <button
                  onClick={() => setFocusedLore(null)}
                  className="absolute right-4 top-4 text-amber-500 hover:text-white p-1 rounded-full hover:bg-black/20 focus:outline-none cursor-pointer transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A880] px-2 py-0.5 rounded bg-amber-500/10 border border-[#C5A880]/20 inline-block">
                    {focusedLore.category}
                  </span>
                  <h2 className="font-medieval text-2xl font-black text-[#F4F1EC] tracking-wide pt-1">
                    {focusedLore.title}
                  </h2>
                  <p className="text-[11px] text-stone-400 font-mono italic">
                    Recorded coordinates: {focusedLore.discoveredIn}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-[#C5A880]/15 space-y-2">
                  <p className="text-sm text-[#E4DBC5]/90 leading-relaxed font-sans first-letter:text-3xl first-letter:font-serif first-letter:mr-2 first-letter:float-left first-letter:text-gold-glow">
                    {focusedLore.description}
                  </p>
                </div>

                {/* Related links */}
                {focusedLore.relatedEntries && focusedLore.relatedEntries.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-mono uppercase text-[#C5A880]/70 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      Intertwined Timelines:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {focusedLore.relatedEntries.map((rel) => {
                        // Find matching entry ID
                        const match = worldLoreRegistry.find(e => e.title.toLowerCase() === rel.toLowerCase());
                        const isRelUnlocked = match ? unlockedLoreIds.includes(match.id) : false;
                        
                        return (
                          <button
                            key={rel}
                            disabled={!isRelUnlocked}
                            onClick={() => {
                              if (match) {
                                setFocusedLore(match);
                              }
                            }}
                            className={`text-xs px-2.5 py-1 rounded border font-sans select-none transition-all ${
                              isRelUnlocked
                                ? "bg-amber-950/40 text-[#E9DFD2] border-[#C5A880]/30 hover:border-gold-glow cursor-pointer"
                                : "bg-black/20 text-stone-500 border-stone-800 cursor-not-allowed"
                            }`}
                          >
                            {isRelUnlocked ? `📜 ${rel}` : `🔒 [Unknown connection]`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={() => setFocusedLore(null)}
                    variant="secondary"
                    size="sm"
                  >
                    Close Codex
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chronicle;