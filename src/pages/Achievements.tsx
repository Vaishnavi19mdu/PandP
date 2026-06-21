import React from "react";
import { useStory } from "../context/StoryContext";
import { 
  Award, Shield, Check, Lock, Sparkles, BookOpen, Compass, Flame, 
  Clock, Coins, Sparkle, Trophy, Zap, Landmark
} from "lucide-react";
import { motion } from "motion/react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isUnlocked: boolean;
  flavor: string;
}

export const Achievements: React.FC = () => {
  const { 
    currentUser, archives, setPage, 
    goldenRunes, statBoosts, dailyQuests, claimDailyQuest 
  } = useStory();

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto text-center p-8 bg-[#FAF5EC] border-2 border-[#D4AF37] rounded-3xl mt-12 shadow-xl">
        <h2 className="font-medieval text-2xl font-black text-[#4A3428] mb-3">Traveler Verification Required</h2>
        <p className="text-xs font-serif italic text-soft-espresso/80 mb-6 font-medieval">
          "Your achievement registry requires active traveler credentials."
        </p>
        <button
          onClick={() => setPage("Login")}
          className="px-6 py-3 bg-[#4A3428] text-gold-glow rounded-xl font-medieval text-xs font-bold uppercase cursor-pointer"
        >
          Enter Scriptorium Login
        </button>
      </div>
    );
  }

  // Calculate Achievement statuses dynamic to actual archives list
  const totalCompleted = archives.length;
  const hasHighScore = archives.some(a => a.score >= 800);
  const genresSet = new Set(archives.map(a => a.genre));
  const hasCustom = archives.some(a => a.isCustom);

  const rawAchievements = [
    {
      id: "ach-1",
      title: "The First Seal",
      description: "Step through your first portal and successfully complete a chronicle log.",
      icon: <BookOpen className="w-6 h-6 text-[#E6C06A]" />,
      isUnlocked: totalCompleted >= 1,
      flavor: '"Your first footprints have pressed deep into the sediment of parallel dimensions."'
    },
    {
      id: "ach-2",
      title: "Master Archivist",
      description: "Successfully complete 3 or more adventure chronicle entries.",
      icon: <Shield className="w-6 h-6 text-[#678DC6]" />,
      isUnlocked: totalCompleted >= 3,
      flavor: '"Your wisdom binds worlds; parallel gates stay wider at your presence."'
    },
    {
      id: "ach-3",
      title: "High Score Scholar",
      description: "Secure a score above 800 points on any completed dimension chronicle.",
      icon: <Award className="w-6 h-6 text-emerald-600" />,
      isUnlocked: hasHighScore,
      flavor: '"A sharp mind has outmaneuvered the ancient protective matrix locks."'
    },
    {
      id: "ach-4",
      title: "Multiverse Specialist",
      description: "Complete chronicles in at least 2 distinct story genres.",
      icon: <Compass className="w-6 h-6 text-purple-600" />,
      isUnlocked: genresSet.size >= 2,
      flavor: '"Your scope extends across both technical matrices and ethereal magical fields."'
    },
    {
      id: "ach-5",
      title: "Creative Pioneer",
      description: "Manifest a custom dimensional realm via seed coordinate programming.",
      icon: <Flame className="w-6 h-6 text-orange-500 animate-pulse" />,
      isUnlocked: hasCustom,
      flavor: '"You do not merely read chronicles - you weave raw entropy into active chapters."'
    }
  ];

  const unlockedCount = rawAchievements.filter(a => a.isUnlocked).length;
  const isEternalLegend = unlockedCount === rawAchievements.length;

  const achievementsList: Achievement[] = [
    ...rawAchievements,
    {
      id: "ach-6",
      title: "Eternal Legend",
      description: "Acquire every intermediate portal achievement to fulfill your final scroll title.",
      icon: <Sparkles className="w-6 h-6 text-[#D4AF37] animate-spin-slow" />,
      isUnlocked: isEternalLegend,
      flavor: '"To you, all books are open, all worlds are home, and the portal core serves your whisper."'
    }
  ];

  const finalUnlockedCount = achievementsList.filter(a => a.isUnlocked).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-[#4A3428] space-y-12">
      {/* Title Header */}
      <div className="space-y-2 text-center md:text-left">
        <span className="font-mono text-[9px] tracking-widest uppercase bg-[#D4AF37]/20 text-[#678DC6] border border-[#D4AF37]/30 px-3 py-1 rounded-full font-bold">
          High King's Scroll of Worthiness
        </span>
        <h1 className="font-medieval text-3xl md:text-5xl font-black text-[#F4F1EC] tracking-wide drop-shadow-md">
          Traveler Achievements Ledger
        </h1>
        <p className="text-sm font-serif italic text-[#E9DFD2]/70">
          "Each heroic trial leaves a glowing rune in the cosmic registry. Earn titles to gain access to rare artifacts."
        </p>
      </div>

      {/* Progress metrics header */}
      <div className="bg-[#2D1B12] rounded-2xl border-2 border-[#C5A880]/30 p-6 md:p-8 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Trophy className="w-32 h-32 text-orange-200" />
        </div>

        <div className="space-y-1.5 text-center md:text-left">
          <p className="font-medieval text-xl text-gold-glow font-bold block">Cumulative Scroll Progress</p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
            <span className="bg-[#4E2B1F] text-[#E6C06A] text-[10px] uppercase tracking-wide font-medieval px-2.5 py-1 rounded-lg border border-[#C5A880]/30">
              Rank: {currentUser.title}
            </span>
            <span className="text-xs font-mono text-[#E9DFD2]/70">
              ({finalUnlockedCount} / 6 Runes Awakened)
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full md:max-w-md bg-black/40 rounded-full border border-[#C5A880]/20 h-5 p-1 relative shadow-inner overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-600 via-amber-400 to-yellow-600 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(234,179,8,0.5)]"
            style={{ width: `${(finalUnlockedCount / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* 🔮 Daily Quests Sanctum Block */}
      <div className="bg-[#1C0F0A] border-2 border-[#C5A880]/40 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden space-y-6">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-[#C5A880]/20">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-gold-glow text-[11px] uppercase font-mono tracking-wider font-bold">
              <Clock className="w-3.5 h-3.5 text-gold-glow animate-pulse" />
              Portal Cycle Refreshes Daily
            </div>
            <h2 className="font-medieval text-2xl font-black text-[#F4F1EC]">
              🔮 Daily Quests Sanctum
            </h2>
            <p className="text-xs text-[#E9DFD2]/60 font-sans">
              Complete dynamic sector assignments to claim Golden Runes or permanent traveler stat augmentations.
            </p>
          </div>

          {/* Golden Rune and Stats Balance widget */}
          <div className="flex gap-4">
            {/* Runes counter */}
            <div className="px-5 py-3 rounded-2xl bg-black/40 border border-[#C5A880]/25 text-center shrink-0 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-950/40 border border-gold-glow/50 text-gold-glow">
                <Coins className="w-5 h-5 animate-bounce" />
              </div>
              <div className="text-left">
                <span className="block text-xl font-bold font-medieval text-gold-glow leading-none">
                  {goldenRunes}
                </span>
                <span className="text-[9px] font-mono tracking-wider uppercase text-[#E9DFD2]/50 mt-0.5 block">
                  Golden Runes
                </span>
              </div>
            </div>

            {/* Stat augmentations counter */}
            <div className="px-5 py-3 rounded-2xl bg-black/40 border border-[#C5A880]/25 text-center shrink-0 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
                <Zap className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-[#E9DFD2] leading-none">
                  KN +{statBoosts.knowledge} | CR +{statBoosts.creativity}
                </span>
                <span className="text-[9px] font-mono tracking-wider uppercase text-[#E9DFD2]/50 mt-1 block">
                  Augmented Stats
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quests cards List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dailyQuests.map((quest) => {
            const isCompleted = quest.currentCount >= quest.targetCount;
            const progressPercent = Math.min(100, Math.round((quest.currentCount / quest.targetCount) * 100));

            return (
              <div 
                key={quest.id} 
                className={`p-5 rounded-2xl border-2 flex flex-col justify-between space-y-4 relative overflow-hidden transition-all duration-300 ${
                  quest.claimed
                    ? "bg-[#2D1B12]/20 border-[#C5A880]/10 opacity-60 grayscale"
                    : isCompleted
                      ? "bg-stone-900 border-gold-glow/70 shadow-[0_4px_15px_rgba(234,179,8,0.15)] bg-gradient-to-b from-amber-950/20 to-black/30"
                      : "bg-[#2D1B12]/80 border-[#C5A880]/20"
                }`}
              >
                {/* Header info */}
                <div className="space-y-1.5 text-left">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono uppercase text-amber-500 font-bold">
                      {quest.rewardType === "golden_rune" ? "Runic Bounty" : "Blessing Essence"}
                    </span>
                    {quest.claimed ? (
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase border border-emerald-500/20 px-2 py-0.5 rounded bg-emerald-500/10">
                        Claimed ✓
                      </span>
                    ) : isCompleted ? (
                      <span className="text-[10px] font-mono text-gold-glow font-bold uppercase border border-gold-glow/30 px-2 py-0.5 rounded bg-gold-glow/15 animate-pulse">
                        Ready
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-[#E9DFD2]/50 uppercase">
                        In Progress
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-medieval text-base font-extrabold text-[#F4F1EC] leading-snug">
                    {quest.title}
                  </h3>
                  <p className="text-xs text-[#E9DFD2]/70 leading-relaxed font-sans font-medium">
                    {quest.description}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1 text-left">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-[#C5A880]">Progress</span>
                    <span className="text-[#F4F1EC] font-bold">
                      {quest.currentCount} / {quest.targetCount}
                    </span>
                  </div>
                  <div className="w-full bg-black/40 border border-[#C5A880]/15 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${
                        isCompleted ? "bg-gold-glow" : "bg-gradient-to-r from-amber-700 to-yellow-600"
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Actions / Reward section */}
                <div className="pt-2.5 border-t border-[#C5A880]/10 flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[9px] font-mono uppercase text-[#E9DFD2]/45 block">Reward Grant</span>
                    <span className="text-xs font-bold font-medieval text-gold-glow flex items-center gap-1 pt-0.5">
                      {quest.rewardType === "golden_rune" ? (
                        <>
                          <Coins className="w-3.5 h-3.5" />
                          +{quest.rewardValue} Runes
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 text-emerald-400" />
                          +{quest.rewardValue} {quest.rewardStat?.toUpperCase()}
                        </>
                      )}
                    </span>
                  </div>

                  {!quest.claimed ? (
                    <button
                      disabled={!isCompleted}
                      onClick={() => claimDailyQuest(quest.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medieval font-bold border transition-all cursor-pointer ${
                        isCompleted
                          ? "bg-[#C5A880] text-black border-transparent hover:brightness-115 shadow-[0_2px_8px_rgba(234,179,8,0.25)] hover:scale-105 active:scale-95"
                          : "bg-black/20 text-[#E9DFD2]/35 border-transparent cursor-not-allowed"
                      }`}
                    >
                      Claim Reward
                    </button>
                  ) : (
                    <span className="text-xs font-serif italic text-stone-500 py-1.5 block">
                      Ledger Updated
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spacer style separator */}
      <div className="relative flex py-4 items-center">
        <div className="flex-grow border-t border-[#C5A880]/20"></div>
        <span className="flex-shrink mx-4 font-medieval text-xs text-gold-glow tracking-widest uppercase">
          ⚔️ Legendary Ledger Runes ⚔️
        </span>
        <div className="flex-grow border-t border-[#C5A880]/20"></div>
      </div>

      {/* Achievement cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-transparent">
        {achievementsList.map((ach) => (
          <motion.div
            key={ach.id}
            whileHover={{ scale: 1.01, y: -2 }}
            className={`relative rounded-3xl p-6 border-2 flex flex-col justify-between shadow-md transition-all overflow-hidden ${
              ach.isUnlocked
                ? "bg-[#FAF5EC] border-[#D4AF37]/50 text-[#4A3428]"
                : "bg-[#4D3325]/5 border-[#4D3325]/10 text-[#4A3428]/60 filter grayscale opacity-75"
            }`}
          >
            {/* Visual Header */}
            <div>
              <div className="flex items-start justify-between gap-4 border-b border-[#4A3428]/10 pb-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl border shadow-sm ${
                    ach.isUnlocked ? "bg-[#4D3325]/10 border-gold-glow/50" : "bg-black/5 border-[#4D3325]/15"
                  }`}>
                    {ach.icon}
                  </div>
                  <div>
                    <h3 className="font-medieval text-base font-extrabold tracking-wide">
                      {ach.title}
                    </h3>
                    <p className="text-[8px] font-mono uppercase text-[#678DC6] font-bold tracking-widest mt-0.5">
                      {ach.isUnlocked ? "✓ Rune Restored" : "✗ Locked"}
                    </p>
                  </div>
                </div>

                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                  ach.isUnlocked 
                    ? "bg-[#E6C06A]/20 border-gold-glow text-[#4E2B1F]" 
                    : "bg-[#4D3325]/5 border-[#4D3325]/15 text-[#4D3325]/30"
                }`}>
                  {ach.isUnlocked ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Lock className="w-3 h-3" />}
                </div>
              </div>

              <p className="text-xs font-serif leading-relaxed text-soft-espresso/95 mb-4 text-left">
                {ach.description}
              </p>
            </div>

            {/* Flavor Text */}
            <div className={`pt-2 mt-auto border-t border-dashed ${ach.isUnlocked ? "border-[#4A3428]/10 text-left" : "border-transparent text-left"}`}>
              {ach.isUnlocked ? (
                <p className="text-[10px] font-serif italic text-[#678DC6]/90 mt-1 leading-normal">
                  {ach.flavor}
                </p>
              ) : (
                <p className="text-[10px] font-mono text-[#4A3428]/40 mt-1">
                  Conditions not yet fulfilled by current archives.
                </p>
              )}
            </div>

            {/* Glowing feedback strip */}
            {ach.isUnlocked && (
              <div className="absolute top-0 right-0 h-1.5 w-16 bg-gradient-to-l from-gold-glow to-transparent" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
