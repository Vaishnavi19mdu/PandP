import React, { useState } from "react";
import { useStory } from "../context/StoryContext";
import { Sparkles, Compass, HelpCircle, Layers, ArrowRight, Dices, Info } from "lucide-react";
import Button from "../components/Button";

export const CreatePortal: React.FC = () => {
  const { createCustomWorld, startAdventure, worldSeedsList } = useStory();
  const [seed, setSeed] = useState("");
  const [genre, setGenre] = useState<string>("Fantasy");
  const [length, setLength] = useState<"Short" | "Medium" | "Long">("Medium");

  const genresList = [
    { name: "Fantasy", icon: "✨", desc: "Magic ruins, pocket dimensions, and sorcerer logs." },
    { name: "Mystery", icon: "🔍", desc: "Clockwork mechanical puzzles, archives, and secrets." },
    { name: "Sci-Fi", icon: "🚀", desc: "Derelict listens, solar grids, and orbital frequency beacons." },
    { name: "Adventure", icon: "⛵", desc: "Trade routes, shifting sand bays, and bartering nomads." },
    { name: "Educational", icon: "🎓", desc: "Digital raven nets, malicious mimic spells, and security ciphers." }
  ];

  const presets = [
    { title: "The Hollow Archives", id: "hollow-archives" },
    { title: "The Phishing Kingdom", id: "phishing-kingdom" },
    { title: "The Last Signal", id: "last-signal" },
    { title: "Merchant's Trial", id: "merchants-trial" },
    { title: "The Lost Empire", id: "lost-empire" }
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const promptSeed = seed.trim() || `An uncharted realm in the ${genre} coordinates`;
    createCustomWorld(promptSeed, genre, length);
  };

  const handleApplyPreset = (worldId: string) => {
    // Look up the preloaded worldseed
    const found = worldSeedsList.find(w => w.id === worldId);
    if (found) {
      // Start the specific handcrafted adventure
      startAdventure(found);
    }
  };

  const handleRandomizePrompt = () => {
    const ideas = [
      "A clockwork cat traversing gears inside a giant grandfather clock",
      "An underwater deep sea dome leaking mechanical binary liquid",
      "A merchant ship sailing across a desert of white salt shards",
      "A research station around a black hole emitting musical notes",
      "A wizard trying to defend their library database from data demons",
      "An archaeologist solving rotating mirror stone lights in an overgrown mountain gorge"
    ];
    const pick = ideas[Math.floor(Math.random() * ideas.length)];
    setSeed(pick);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <h1 className="font-medieval text-3xl md:text-5xl font-black text-soft-espresso tracking-wide flex items-center justify-center gap-2">
          <Compass className="w-10 h-10 text-navy animate-spin" />
          The Portal Forge
        </h1>
        <p className="text-sm text-soft-espresso/80 max-w-lg mx-auto font-sans leading-relaxed">
          Calibrate dimensional coordinates, specify local laws, and establish paths. Every variable entered rewrites the portal algorithms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Creation Card Form */}
        <form onSubmit={handleGenerate} className="lg:col-span-2 bg-[#F8EAE5] border border-navy/20 rounded-2xl p-6 md:p-8 space-y-6 shadow-md relative overflow-hidden">
          {/* Subtle magical accent */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-navy via-gold-glow to-lavender-blue" />

          {/* 1. Prompt / Seed text area */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs md:text-sm">
              <label className="font-medieval font-bold text-soft-espresso flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-gold-glow animate-pulse" />
                1. Specify the Story Coordinate Seed
              </label>
              <button 
                type="button" 
                onClick={handleRandomizePrompt}
                className="text-navy hover:text-[#AAB2FF] flex items-center gap-1 font-semibold text-xs font-mono cursor-pointer"
              >
                <Dices className="w-3.5 h-3.5" />
                Randomize Concept
              </button>
            </div>
            
            <textarea
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="E.g., An overgrown cathedral inhabited by flying mechanical butterflies guarding a glass library core..."
              className="w-full h-24 bg-white/60 p-4 rounded-xl border border-navy/20 text-[#4A3428] placeholder-[#4A3428]/45 text-sm font-sans focus:outline-none focus:border-gold-glow focus:ring-1 focus:ring-gold-glow"
            />
          </div>

          {/* 2. Selecting Genre Grid */}
          <div className="space-y-3.5">
            <label className="font-medieval text-xs md:text-sm font-bold text-soft-espresso block">
              2. Select the Guild Genre Environment
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {genresList.map((g) => {
                const isSelected = genre === g.name;
                return (
                  <div
                    key={g.name}
                    onClick={() => setGenre(g.name)}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all duration-300 cursor-pointer flex gap-3 relative overflow-hidden ${
                      isSelected 
                        ? "bg-navy text-white border-gold-glow shadow-md" 
                        : "bg-white/50 text-soft-espresso border-navy/10 hover:border-navy/45 hover:bg-white"
                    }`}
                  >
                    <span className="text-2xl mt-0.5 select-none">{g.icon}</span>
                    <div className="space-y-0.5">
                      <p className="font-medieval text-sm font-bold">{g.name}</p>
                      <p className={`text-[10px] leading-relaxed ${isSelected ? "text-white/80" : "text-soft-espresso/70"}`}>
                        {g.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Length Calibrations */}
          <div className="space-y-3">
            <label className="font-medieval text-xs md:text-sm font-bold text-soft-espresso block">
              3. Calibrate Adventure Length Matrix
            </label>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {(["Short", "Medium", "Long"] as const).map((len) => {
                const isSelected = length === len;
                const badges = {
                  Short: "3-Step Sandbox (Fast)",
                  Medium: "5-Step Sandbox (Balanced)",
                  Long: "8-Step Sandbox (Deep)"
                };
                return (
                  <div
                    key={len}
                    onClick={() => setLength(len)}
                    className={`p-3 rounded-lg border cursor-pointer font-medium transition-all duration-300 ${
                      isSelected 
                        ? "bg-[#4A3428] text-gold-glow border-gold-glow shadow-md font-semibold font-medieval" 
                        : "bg-white/40 border-navy/10 hover:border-navy/45 text-soft-espresso"
                    }`}
                    title={badges[len]}
                  >
                    {len}
                    <span className="block text-[8px] opacity-75 font-mono mt-0.5">{badges[len].split(" ")[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Generate Button */}
          <div className="pt-4 border-t border-navy/10 flex justify-center">
            <Button 
              variant="magic" 
              type="submit" 
              className="w-full text-base py-3 px-8 font-semibold tracking-wide flex items-center justify-center gap-2 shadow-lg"
            >
              <Compass className="w-5 h-5 text-gold-glow animate-spin" />
              Manifest Story Portal
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

        </form>

        {/* Preset Suggestions sidebar info card */}
        <div className="space-y-6">
          <div className="bg-[#4A3428]/95 text-white rounded-2xl p-5 border-2 border-gold-glow/50 space-y-4 shadow-md">
            <div className="flex items-center gap-2 text-gold-glow border-b border-white/5 pb-2">
              <Sparkles className="w-4.5 h-4.5 text-gold-glow animate-pulse" />
              <h3 className="font-medieval text-md font-bold tracking-wider">
                Handcrafted Gates
              </h3>
            </div>
            
            <p className="text-[11px] leading-relaxed text-white/85">
              To trigger predefined high-fidelity story models directly, click on any pre-compiled archives below to open their corresponding vaults.
            </p>

            <div className="space-y-2 pt-2">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset.id)}
                  className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/10 hover:border-gold-glow hover:bg-white/10 transition-all text-xs text-gold-glow/90 font-medieval flex items-center justify-between group cursor-pointer"
                >
                  <span>⚔️ {preset.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/50 group-hover:text-gold-glow transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Scribe advice */}
          <div className="bg-[#F8EAE5]/60 border border-navy/15 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-soft-espresso shadow-inner">
            <Info className="w-5 h-5 text-navy flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-medieval font-semibold">Rules of the Scriptorium</h4>
              <p className="text-[11px] font-sans text-soft-espresso/80">Every custom coordinate sets standard starting components. Track items, raise attributes, and use your Portal Map to locate ending hubs safely without losing alignment.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
export default CreatePortal;
