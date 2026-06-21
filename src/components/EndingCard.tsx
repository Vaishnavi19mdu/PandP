import React from "react";
import { useStory } from "../context/StoryContext";
import { endings } from "../data/endings";
import { Trophy, Star, ShieldCheck, RefreshCw, Undo2, Share2, Compass, Sparkles } from "lucide-react";
import Button from "./Button";

export const EndingCard: React.FC = () => {
  const { activeStory, resetActiveStory, setPage } = useStory();

  if (!activeStory) return null;

  const { graph, currentNodeId, stats, inventory, world, isCustom } = activeStory;
  const currentNode = graph.find(n => n.id === currentNodeId);

  // Look up pre-build endings or default custom
  const matchedEnding = endings.find(e => e.worldId === world.id && e.id === currentNode?.endingId);
  
  const endingTitle = matchedEnding?.title || currentNode?.title || "Story Complete";
  const endingDescription = matchedEnding?.description || currentNode?.description || "Your path has come to its natural end. The dimensional coordinates have stabilized.";
  const achievementName = matchedEnding?.achievementName || (isCustom ? "Custom Scriptor" : "Pioneer of Portals");
  const secrets = matchedEnding?.secretsFound || (isCustom ? ["Assembled a custom coordinate string", "Secured custom portal core parameters"] : ["Completed the world's primary objectives"]);

  // Calculate scores
  const attributesTotal = stats.knowledge + stats.courage + stats.creativity + stats.luck;
  const statsBonus = attributesTotal * 50;
  const inventoryBonus = inventory.length * 75;
  const finalScore = statsBonus + inventoryBonus;

  const handleRestart = () => {
    resetActiveStory();
  };

  const handleNewAdventure = () => {
    resetActiveStory();
    setPage("CreatePortal");
  };

  return (
    <div className="bg-[#F8EAE5] border-2 border-gold-glow/70 rounded-2xl p-6 md:p-10 relative shadow-2xl overflow-hidden book-shadow animate-float">
      {/* Radiant Glow Lights */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-navy via-gold-glow to-lavender-blue" />
      <div className="absolute top-10 right-10 w-32 h-32 bg-gold-glow/10 blur-3xl pointer-events-none" />

      <div className="text-center space-y-6 max-w-2xl mx-auto">
        
        {/* Decorative Badge */}
        <div className="mx-auto w-16 h-16 rounded-full bg-gold-glow/20 border-2 border-gold-glow flex items-center justify-center text-gold-glow shadow-md">
          <Trophy className="w-8 h-8 text-gold-glow animate-pulse-gold" />
        </div>

        {/* Ending Titles */}
        <div className="space-y-1">
          <p className="text-[10px] md:text-xs font-mono text-[#678DC6]/80 uppercase tracking-widest font-bold">
            Chronicle Chapter Compiled
          </p>
          <h2 className="font-medieval text-3xl md:text-5xl text-soft-espresso tracking-wide font-extrabold leading-tight">
            {endingTitle}
          </h2>
          <span className="inline-flex items-center gap-1.5 bg-[#4A3428] text-gold-glow px-3/1.5 py-1 text-xs font-semibold rounded-full border border-gold-glow/40 mt-1 flex-row">
            <Sparkles className="w-3.5 h-3.5" />
            Reward Title: {achievementName}
          </span>
        </div>

        {/* Narrative Box */}
        <div className="bg-white/60 p-5 md:p-7 rounded-xl border border-navy/10 leading-relaxed font-sans text-soft-espresso/90 text-sm md:text-md italic text-left relative shadow-inner">
          <span className="font-medieval text-4xl text-navy/40 absolute -top-5 -left-2 select-none pointer-events-none">"</span>
          {endingDescription}
          <span className="font-medieval text-4xl text-navy/40 absolute -bottom-10 -right-2 select-none pointer-events-none">"</span>
        </div>

        {/* Secrets Found */}
        <div className="text-left space-y-2 bg-[#E9DFD2]/50 p-4 rounded-xl border border-navy/5">
          <p className="font-medieval text-xs text-soft-espresso font-bold uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Milestones and Secrets Compiled:
          </p>
          <ul className="space-y-1.5 text-xs text-soft-espresso/80 font-sans list-inside list-disc">
            {secrets.map((sec, idx) => (
              <li key={idx}>
                {sec}
              </li>
            ))}
          </ul>
        </div>

        {/* Final Score Stat Matrix Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/40 p-4 rounded-xl border border-navy/10">
          <div className="text-center p-2.5">
            <p className="text-[10px] font-mono text-[#678DC6] uppercase tracking-wider">Stats Multiplier</p>
            <p className="text-xl font-medieval text-soft-espresso font-bold mt-1">{attributesTotal} Attributes</p>
            <p className="text-[10px] font-mono text-soft-espresso/60 mt-0.5">+{statsBonus} XP</p>
          </div>
          <div className="text-center p-2.5 border-y sm:border-y-0 sm:border-x border-navy/10">
            <p className="text-[10px] font-mono text-[#678DC6] uppercase tracking-wider">Active Inventory</p>
            <p className="text-xl font-medieval text-soft-espresso font-bold mt-1">{inventory.length} Artifacts</p>
            <p className="text-[10px] font-mono text-soft-espresso/60 mt-0.5">+{inventoryBonus} XP</p>
          </div>
          <div className="text-center p-2.5">
            <p className="text-[10px] font-mono text-gold-glow bg-[#4A3428] py-0.5 px-2 rounded-full uppercase tracking-widest font-bold">Total Chronicle Score</p>
            <p className="text-2xl font-medieval text-navy font-black mt-2">{finalScore} XP</p>
            <p className="text-[10px] font-mono text-emerald-600 font-semibold mt-0.5">Verified Scribe Rank</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
          <Button 
            variant="secondary" 
            onClick={handleRestart}
            className="w-full sm:w-auto text-xs py-3 px-5 font-medieval tracking-wider uppercase flex items-center justify-center gap-2"
          >
            <Undo2 className="w-4 h-4" />
            Home (The Great Hall)
          </Button>

          <Button 
            variant="magic" 
            onClick={handleNewAdventure}
            className="w-full sm:w-auto text-xs py-3 px-6 uppercase flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-gold-glow animate-spin" />
            Open Another Portal
          </Button>
        </div>

      </div>
    </div>
  );
};
export default EndingCard;
