import React from "react";
import { StoryChoice } from "../data/mockStory";
import { useStory } from "../context/StoryContext";
import { Trophy, ShieldCheck, KeyRound, AlertTriangle, ChevronRight, Sparkles } from "lucide-react";

interface ChoiceCardProps {
  choice: StoryChoice;
  onSelect: () => void;
  isFirstAction?: boolean;
}

export const ChoiceCard: React.FC<ChoiceCardProps> = ({ choice, onSelect, isFirstAction }) => {
  const { activeStory } = useStory();

  if (!activeStory) return null;

  const currentStats = activeStory.stats;
  const currentInventory = activeStory.inventory;

  // Evaluate requirements
  let hasItem = true;
  if (choice.itemRequirement) {
    hasItem = currentInventory.includes(choice.itemRequirement);
  }

  let hasStat = true;
  let requiredStatName = "";
  let requiredStatValue = 0;
  let currentStatValue = 0;

  if (choice.statRequirement) {
    requiredStatName = choice.statRequirement.stat;
    requiredStatValue = choice.statRequirement.value;
    currentStatValue = currentStats[requiredStatName as keyof typeof currentStats];
    hasStat = currentStatValue >= requiredStatValue;
  }

  const isDisabled = !hasItem; // Only item requirements lock selection; stat failures lead to alternative timelines/failure nodes!
  
  return (
    <div
      onClick={() => {
        if (!isDisabled) {
          onSelect();
        }
      }}
      className={`relative rounded-xl p-[2.5px] text-left transition-all duration-300 w-full group select-none ${
        isDisabled 
          ? "bg-slate-300/40 opacity-60 cursor-not-allowed" 
          : isFirstAction
            ? "breathe-gold hover:scale-[1.015] active:scale-[0.99] cursor-pointer"
            : "bg-[#4A3428]/10 hover:bg-[#4A3428]/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
      }`}
    >
      <style>{`
        @keyframes border-shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes breathe-glow {
          0%, 100% { box-shadow: 0 0 12px rgba(230,192,106,0.35); }
          50% { box-shadow: 0 0 32px rgba(230,192,106,0.8); }
        }
        .breathe-gold {
          background: linear-gradient(90deg, #E6C06A, #D69F3D, #E6C06A, #FFF4D9);
          background-size: 300% 300%;
          animation: border-shimmer 4s linear infinite, breathe-glow 3s ease-in-out infinite;
        }
      `}</style>

      {/* Subtle Magical Particles absolute container inside recommended path */}
      {isFirstAction && !isDisabled && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          <span className="absolute text-[8px] animate-ping opacity-35 top-2 left-6 text-gold-glow">✨</span>
          <span className="absolute text-[7px] animate-pulse opacity-45 bottom-3 right-8 text-amber-500">✦</span>
          <span className="absolute text-[9px] animate-bounce opacity-30 top-4 right-12 text-gold-glow">✨</span>
        </div>
      )}

      <div className={`p-5 rounded-[10px] h-full relative z-10 transition-colors ${
        isDisabled 
          ? "bg-slate-100" 
          : isFirstAction 
            ? "bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EE] to-[#FAF0ED]" 
            : "bg-[#F8EAE5] border border-navy/15 hover:border-gold-glow/70 hover:bg-[#FAF0ED]"
      }`}>
        
        {/* Micro Floating Active Quest Badge spaced cleanly to avoid text overlaps */}
        {isFirstAction && !isDisabled && (
          <div className="absolute -top-3 left-4 z-20 flex items-center gap-1 bg-gradient-to-r from-gold-glow to-[#4A3428] text-white font-medieval text-[9.5px] font-bold px-3 py-0.5 rounded-full border border-[#E6C06A] shadow-md animate-bounce">
            <Sparkles className="w-3 h-3 text-gold-glow animate-pulse" />
            <span>DESTINED CORRIDOR PATH</span>
          </div>
        )}
        
        {/* Decorative Gold Side Ribbon for magical cards */}
        {choice.statRequirement && !isDisabled && (
          <div className="absolute top-0 right-0 h-full w-1 rounded-r-[10px] bg-gold-glow" />
        )}
        
        <div className="flex items-start gap-4 pt-1">
          {/* Requirement indicator icons */}
          <div className="flex-shrink-0 mt-0.5">
            {choice.itemRequirement ? (
              <div className={`p-2 rounded-lg ${hasItem ? "bg-[#E6C06A]/25 text-[#4A3428]" : "bg-red-100 text-red-600"}`}>
                <KeyRound className="w-5 h-5" />
              </div>
            ) : choice.statRequirement ? (
              <div className={`p-2 rounded-lg ${hasStat ? "bg-navy/15 text-navy" : "bg-orange-100 text-orange-600 animate-pulse"}`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-[#E9DFD2] text-[#4A3428]">
                <ChevronRight className="w-5 h-5" />
              </div>
            )}
          </div>

          {/* Text Area */}
          <div className="flex-1 space-y-1.5">
            <p className="font-medieval text-sm md:text-md text-[#4A3428] font-bold leading-snug">
              {choice.text}
            </p>
            
            {/* Metadata rewards & requirements badges */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
              {choice.itemRequirement && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                  hasItem 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  Requires Item: {choice.itemRequirement} {hasItem ? "✓" : "✗"}
                </span>
              )}

              {choice.statRequirement && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                  hasStat 
                    ? "bg-blue-50 text-blue-700 border border-blue-200" 
                    : "bg-orange-50 text-orange-700 border border-orange-200 animate-pulse"
                }`}>
                  {requiredStatName.toUpperCase()} {requiredStatValue}+ (You have {currentStatValue})
                  {!hasStat && " (Risky Fail Pathway!)"}
                </span>
              )}

              {choice.statReward && !isDisabled && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Reward: +{choice.statReward.value} {choice.statReward.stat.toUpperCase()}
                </span>
              )}

              {choice.itemReward && !isDisabled && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-amber-50 text-amber-700 border border-amber-200">
                  Unlocks Item: {choice.itemReward}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChoiceCard;
