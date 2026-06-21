import React from "react";
import { useStory } from "../context/StoryContext";
import { ArrowRight, Compass, Shield, Award, Calendar, Layers, MapPin, Sparkles } from "lucide-react";
import Button from "../components/Button";

export const WorldOverview: React.FC = () => {
  const { activeStory, setPage } = useStory();

  if (!activeStory) return null;

  const { world, stats, inventory, isCustom } = activeStory;

  const handleBegin = () => {
    setPage("Adventure");
  };

  const handleCancel = () => {
    setPage("CreatePortal");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-float">
      
      {/* Decorative Golden Light Band */}
      <h2 className="text-center font-mono text-[10px] text-[#678DC6] uppercase tracking-widest leading-none">
        Portal Connection Verified • Stabilizing Vector
      </h2>

      {/* World Overview Card wrapper */}
      <div className="bg-[#F8EAE5] border-2 border-gold-glow/50 rounded-3xl p-6 md:p-10 relative shadow-2xl book-shadow overflow-hidden">
        {/* Decorative corner markers */}
        <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-[#4a3428]/25 rounded-tl-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-[#4a3428]/25 rounded-br-2xl pointer-events-none" />

        <div className="space-y-8 max-w-2xl mx-auto">
          
          {/* Main Titles */}
          <div className="text-center space-y-2">
            <span className="inline-flex px-3 py-1 rounded bg-[#E9DFD2] text-[#4A3428] font-bold text-xs uppercase font-mono tracking-wider border border-navy/10">
              {world.genre} World Archetype
            </span>
            <h1 className="font-medieval text-3xl md:text-5xl font-extrabold text-soft-espresso tracking-wide leading-tight">
              {world.name}
            </h1>
            <div className="flex justify-center flex-wrap items-center gap-3.5 pt-1.5 text-xs">
              <span className="inline-flex items-center text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <Award className="w-3.5 h-3.5 mr-1" />
                {world.difficulty} Rating
              </span>
              <span className="inline-flex items-center text-blue-800 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                <Layers className="w-3.5 h-3.5 mr-1" />
                {world.length} Length
              </span>
            </div>
          </div>

          {/* Core Concept Descriptive Text block */}
          <div className="space-y-2 bg-white/45 p-5 md:p-6 rounded-2xl border border-navy/5 shadow-inner">
            <h3 className="font-medieval text-sm font-bold text-soft-espresso uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-navy" />
              Primary Narrative Objective:
            </h3>
            <p className="text-sm font-sans text-soft-espresso/90 leading-relaxed font-medium">
              {world.objective}
            </p>
            <p className="text-xs font-sans text-soft-espresso/80 leading-relaxed pt-2 border-t border-[#4a3428]/10">
              {world.description}
            </p>
          </div>

          {/* Companion card */}
          <div className="bg-[#4A3428] text-[#F4F1EC] rounded-2xl p-5 border border-gold-glow/40 relative overflow-hidden flex gap-4">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold-glow/10 blur-2xl rounded-full" />
            <div className="w-12 h-12 rounded-full bg-[#E6C06A] text-[#4A3428] flex items-center justify-center flex-shrink-0 shadow">
              <Sparkles className="w-6 h-6 animate-pulse-gold text-[#4A3428]" />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase text-[#E9DFD2]/60">Your active companion</span>
              <h4 className="font-medieval text-md text-gold-glow font-bold leading-none mt-0.5">
                {world.companionName} ({world.companionType})
              </h4>
              <p className="text-xs italic text-[#E9DFD2] leading-relaxed pt-1.5">
                {world.companionMessage}
              </p>
            </div>
          </div>

          {/* Layout Grid of Characters attributes & assets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Character Stats Box */}
            <div className="bg-white/40 p-4 border border-navy/15 rounded-2xl space-y-2">
              <p className="font-medieval text-xs font-bold text-soft-espresso uppercase tracking-wider">
                Character Attributes (Initial)
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-blue-50/50 rounded border border-blue-100 flex justify-between items-center">
                  <span className="font-medium">Knowledge</span>
                  <span className="font-mono font-bold font-medieval">{stats.knowledge}</span>
                </div>
                <div className="p-2 bg-red-50/50 rounded border border-red-100 flex justify-between items-center">
                  <span className="font-medium">Courage</span>
                  <span className="font-mono font-bold font-medieval">{stats.courage}</span>
                </div>
                <div className="p-2 bg-purple-50/50 rounded border border-purple-100 flex justify-between items-center">
                  <span className="font-medium">Creativity</span>
                  <span className="font-mono font-bold font-medieval">{stats.creativity}</span>
                </div>
                <div className="p-2 bg-emerald-50/50 rounded border border-emerald-100 flex justify-between items-center">
                  <span className="font-medium">Luck</span>
                  <span className="font-mono font-bold font-medieval">{stats.luck}</span>
                </div>
              </div>
            </div>

            {/* Starting Artifacts bag */}
            <div className="bg-white/40 p-4 border border-navy/15 rounded-2xl space-y-2">
              <p className="font-medieval text-xs font-bold text-soft-espresso uppercase tracking-wider">
                Manifested Arcane Backpack
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {inventory.map((item, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1 font-mono text-[9.5px] font-semibold bg-[#E9DFD2] text-[#4A3428] rounded-full border border-gold-glow/30"
                  >
                    🎗️ {item}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-6 border-t border-navy/10">
            <Button 
              variant="secondary" 
              onClick={handleCancel}
              className="w-full sm:w-auto text-xs py-3.5 px-6 uppercase tracking-wider font-medieval"
            >
              Recalibrate coordinates
            </Button>

            <Button 
              variant="magic" 
              onClick={handleBegin}
              className="w-full sm:w-auto text-sm py-3.5 px-8 flex items-center justify-center gap-2.5 shadow-lg group"
            >
              <Compass className="w-4 h-4 text-gold-glow animate-spin" />
              Enter portal coordinates
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

        </div>
      </div>

    </div>
  );
};
export default WorldOverview;
