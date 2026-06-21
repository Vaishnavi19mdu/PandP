import React from "react";
import { WorldSeed } from "../data/worldSeeds";
import { BookOpen, Award, Layers, ShieldAlert, Sparkles, BookOpenText } from "lucide-react";
import Button from "./Button";

interface WorldSeedCardProps {
  seed: WorldSeed;
  onSelect: () => void;
}

export const WorldSeedCard: React.FC<WorldSeedCardProps> = ({ seed, onSelect }) => {
  // Color code based on difficulty
  const difficultyColors = {
    Beginner: "bg-emerald-50 text-emerald-800 border-emerald-200",
    Acolyte: "bg-blue-50 text-blue-800 border-blue-200",
    Grandmaster: "bg-orange-50 text-orange-800 border-orange-200 animate-pulse-gold",
  };

  // SVG representation for cards based on illustration seeds
  const getIllustration = (type: string) => {
    switch (type) {
      case "ancient_library":
        return (
          <div className="absolute top-2 right-2 opacity-5 pointer-events-none">
            <svg className="w-24 h-24 text-soft-espresso" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 6H2v14a2 2 0 0 0 2 2h14v-2H4V6zm16-4H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
            </svg>
          </div>
        );
      case "sci_fi_station":
        return (
          <div className="absolute top-2 right-2 opacity-5 pointer-events-none">
            <svg className="w-24 h-24 text-soft-espresso" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm1 17.93V18h-2v1.93A8.001 8.001 0 0 1 4.07 13H6v-2H4.07A8.001 8.001 0 0 1 11 4.07V6h2V4.07A8.001 8.001 0 0 1 19.93 11H18v2h1.93A8.001 8.001 0 0 1 13 19.93z"/>
            </svg>
          </div>
        );
      case "desert_bazaar":
        return (
          <div className="absolute top-2 right-2 opacity-5 pointer-events-none">
            <svg className="w-24 h-24 text-soft-espresso" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 12h-2v3h-3v2h5v-5zM7 6h5v2H9v3H7V6zm14-2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H3V6h18v12z"/>
            </svg>
          </div>
        );
      case "digital_fantasy":
        return (
          <div className="absolute top-2 right-2 opacity-5 pointer-events-none">
            <svg className="w-24 h-24 text-soft-espresso" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.25z"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="absolute top-2 right-2 opacity-5 pointer-events-none">
            <svg className="w-24 h-24 text-soft-espresso" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1 1.1-.49 1.1-1.1-.49-1.1-1.1-1.1zm0-8.3c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14.5c-3.58 0-6.5-2.92-6.5-6.5S8.42 6.1 12 6.1s6.5 2.92 6.5 6.5-2.92 6.5-6.5 6.5z"/>
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="relative group bg-[#F8EAE5] border border-navy/20 rounded-2xl p-6 transition-all duration-300 shadow-md hover:shadow-xl hover:border-gold-glow cursor-pointer hover:-translate-y-1.5 flex flex-col justify-between" onClick={onSelect}>
      
      {getIllustration(seed.illustrationSeed)}
      
      {/* Top Banner details */}
      <div className="space-y-3">
        <div className="flex justify-between items-start gap-2">
          <div>
            <span className="inline-flex px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider font-semibold bg-navy/10 text-navy border border-navy/10">
              {seed.genre}
            </span>
          </div>
          <div className="flex gap-1.5">
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[9px] font-semibold ${difficultyColors[seed.difficulty]}`}>
              <Award className="w-2.5 h-2.5 mr-0.5" />
              {seed.difficulty}
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded border border-navy/10 bg-[#E9DFD2] text-[9px] text-[#4A3428] font-mono">
              <Layers className="w-2.5 h-2.5 mr-0.5" />
              {seed.length}
            </span>
          </div>
        </div>

        {/* Title */}
        <div>
          <h3 className="font-medieval text-xl text-soft-espresso group-hover:text-navy transition-colors tracking-wide leading-tight mt-1">
            {seed.name}
          </h3>
          <p className="text-[10px] text-[#678DC6] font-mono tracking-wide mt-0.5">
            Objective: {seed.objective}
          </p>
        </div>

        {/* Narrative Description */}
        <p className="text-xs text-soft-espresso/85 leading-relaxed prose prose-sm line-clamp-3">
          {seed.description}
        </p>

        {/* Companion Information */}
        <div className="bg-[#E9DFD2]/60 p-3 rounded-lg border border-navy/5 text-[11px] space-y-1">
          <p className="font-semibold text-soft-espresso/90 font-medieval flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-gold-glow animate-pulse" />
            Companion: {seed.companionName} ({seed.companionType})
          </p>
          <p className="italic text-soft-espresso/80 line-clamp-2">
            {seed.companionMessage}
          </p>
        </div>

        {/* Starting Stats Block */}
        <div className="pt-2">
          <p className="text-[10px] font-semibold text-[#4A3428]/60 uppercase tracking-wider font-mono mb-1.5">
            Starting Attributes
          </p>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-[#FAF0ED] p-1.5 rounded border border-navy/5">
              <p className="text-[9px] font-mono text-[#678DC6] uppercase">KNL</p>
              <p className="text-sm font-bold text-soft-espresso">{seed.startingStats.knowledge}</p>
            </div>
            <div className="bg-[#FAF0ED] p-1.5 rounded border border-navy/5">
              <p className="text-[9px] font-mono text-[#678DC6] uppercase">CRG</p>
              <p className="text-sm font-bold text-soft-espresso">{seed.startingStats.courage}</p>
            </div>
            <div className="bg-[#FAF0ED] p-1.5 rounded border border-navy/5">
              <p className="text-[9px] font-mono text-[#678DC6] uppercase">CRT</p>
              <p className="text-sm font-bold text-soft-espresso">{seed.startingStats.creativity}</p>
            </div>
            <div className="bg-[#FAF0ED] p-1.5 rounded border border-navy/5">
              <p className="text-[9px] font-mono text-[#678DC6] uppercase">LCK</p>
              <p className="text-sm font-bold text-soft-espresso">{seed.startingStats.luck}</p>
            </div>
          </div>
        </div>

        {/* Starting Inventory List */}
        <div className="pt-2">
          <p className="text-[10px] font-semibold text-[#4A3428]/60 uppercase tracking-wider font-mono mb-1">
            Starting Artifacts
          </p>
          <div className="flex flex-wrap gap-1.5">
            {seed.startingInventory.map((item, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-full bg-[#E9DFD2] text-[#4A3428] text-[9px] font-mono border border-gold-glow/20">
                🗝️ {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Button Action */}
      <div className="mt-5 pt-3 border-t border-navy/10 flex justify-end">
        <Button variant="secondary" className="w-full text-xs font-semibold group-hover:bg-[#678DC6] group-hover:text-white group-hover:border-gold-glow/45 tracking-wide transition-all font-medieval flex items-center justify-center gap-1">
          <BookOpenText className="w-3.5 h-3.5" />
          Unlock Chronicle
        </Button>
      </div>

    </div>
  );
};
export default WorldSeedCard;
