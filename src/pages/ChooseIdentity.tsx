import React, { useState } from "react";
import { useStory, Persona, fantasyPersonas } from "../context/StoryContext";
import { Sparkles, Trophy, Shield, Feather, ChevronRight, User, Sparkle, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const ChooseIdentity: React.FC = () => {
  const { signupUser, setPage } = useStory();
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"All" | "Gender Neutral" | "Female" | "Male">("All");

  const handleSelect = (persona: Persona) => {
    setSelectedPersona(persona);
  };

  const handleConfirmIdentity = () => {
    if (!selectedPersona) return;

    // Retrieve pending registration data if present
    const pendingStr = sessionStorage.getItem("pp_pending_registration");
    if (pendingStr) {
      try {
        const { fullName, email, password } = JSON.parse(pendingStr);
        signupUser(fullName, email, password, selectedPersona);
        sessionStorage.removeItem("pp_pending_registration");
      } catch (e) {
        signupUser("Honored Traveler", "honored@example.com", "password123", selectedPersona);
      }
    } else {
      signupUser(selectedPersona.name, `${selectedPersona.name.toLowerCase().replace(/\s+/g, "")}@fantasy.com`, "password123", selectedPersona);
    }
    
    setRegistrationSuccess(true);
  };

  const filteredPersonas = fantasyPersonas.filter(p => {
    if (activeTab === "All") return true;
    return p.category === activeTab;
  });

  // Success Screen
  if (registrationSuccess && selectedPersona) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-b from-[#1F120C] via-[#2E1E16] to-[#0F0805] flex items-center justify-center p-4">
        {/* Particle and Glow Layer */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,192,106,0.18),transparent_55%)] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 18, stiffness: 100 }}
          className="relative max-w-lg w-full bg-[#FAF5EC] rounded-3xl border-2 border-[#D4AF37] p-8 md:p-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden text-[#4A3428]"
        >
          {/* Corner gold ornaments */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37]" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#D4AF37]" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#D4AF37]" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37]" />

          {/* Golden burst ring */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E6C06A] p-[2px] shadow-lg mb-6 ring-8 ring-[#4A3428]/10 animate-bounce">
            <div className="w-full h-full bg-[#4A3428] rounded-full flex items-center justify-center text-4xl select-none">
              {selectedPersona.avatar}
            </div>
          </div>

          <p className="text-sm font-mono tracking-widest text-[#D4AF37] uppercase font-bold">
            ✨ Identity Bound ✨
          </p>
          
          <h2 className="font-medieval text-3xl font-black text-[#4A3428] mt-3">
            Welcome, {selectedPersona.name}
          </h2>

          <p className="font-serif italic text-sm text-soft-espresso/80 max-w-sm mx-auto mt-4 leading-relaxed">
            "The first page of your chronicle has been written. Beyond the shifting fog of ancient portals, your legend awaits."
          </p>

          {/* Augmented capability presentation */}
          <div className="my-6 p-4 rounded-2xl bg-amber-500/10 border border-[#D4AF37]/30 text-left max-w-md mx-auto space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-700 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Unique Legacy Specialty Trait:
            </span>
            <p className="text-sm font-medieval font-black text-[#4A3428] pl-4.5">
              {selectedPersona.specialtyTrait}
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-[#4A3428]/10 flex flex-col gap-3">
            <button
              onClick={() => setPage("CreatePortal")}
              className="w-full py-4 bg-gradient-to-r from-[#4A3428] via-[#4E2B1F] to-[#1F120C] text-[#E6C06A] border border-[#D4AF37] rounded-xl font-medieval text-base font-black tracking-widest shadow-2xl hover:brightness-125 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer uppercase flex items-center justify-center gap-2"
            >
              <Shield className="w-5 h-5 text-gold-glow" />
              <span>Open Your First Portal</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-b from-[#2E1E16] via-[#3E2B21] to-[#1F120C] flex flex-col justify-start items-center p-4">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(230,192,106,0.1),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(103,141,198,0.06),transparent_60%)] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-5xl mt-6 mb-12">
        {/* Header Hero Section */}
        <div className="text-center space-y-3 mb-8">
          <span className="font-mono text-[10px] tracking-widest uppercase bg-[#D4AF37]/20 text-[#E6C06A] border border-[#D4AF37]/35 px-3 py-1 rounded-full font-bold">
            Chapter II: The Bound Ritual
          </span>
          <h1 className="font-medieval text-3xl md:text-5xl font-black text-white tracking-wide">
            Choose Your Adventurer Identity
          </h1>
          <p className="text-sm font-serif italic text-[#E9DFD2]/80 max-w-xl mx-auto leading-relaxed">
            "Every traveler leaves a different mark upon the pages. Select your fantasy persona below."
          </p>
        </div>

        {/* Category Filters Button Tabs */}
        <div className="flex justify-center gap-2 mb-8 bg-[#1f120c]/80 p-1.5 rounded-2xl border border-[#D4AF37]/25 max-w-md mx-auto">
          {(["All", "Gender Neutral", "Female", "Male"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer tracking-wide transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-gold-glow to-[#E6C06A] text-[#2E1E16] font-bold shadow-lg border border-[#F1E4C3]"
                  : "text-[#E6C06A]/75 hover:bg-white/5 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Choice Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredPersonas.map((persona) => {
            const isSelected = selectedPersona?.name === persona.name;
            return (
              <motion.div
                key={persona.name}
                whileHover={{ y: -6, scale: 1.02, shadow: "0 10px 25px rgba(212,175,55,0.15)" }}
                onClick={() => handleSelect(persona)}
                className={`relative bg-[#FAF5EC] rounded-2xl border-4 p-5 flex flex-col justify-between shadow-xl cursor-pointer transition-all overflow-hidden text-[#4A3428] ${
                  isSelected
                    ? "border-[#D4AF37] ring-4 ring-[#D4AF37]/30 bg-[#FAF1E3]"
                    : "border-transparent hover:border-[#D4AF37]/30"
                }`}
              >
                {/* Visual Category Label tag */}
                <div className="absolute top-3.5 right-3.5 text-[8.5px] font-mono font-bold uppercase bg-[#1F120C]/10 text-[#4A3428]/80 px-2 py-0.5 rounded-md">
                  {persona.category}
                </div>

                <div className="flex items-start gap-4 text-left">
                  <span className="text-4xl select-none p-2 bg-[#E9DFD2] rounded-xl border border-gold-glow/20 shadow-sm shrink-0">
                    {persona.avatar}
                  </span>
                  <div className="mt-1">
                    <h3 className="font-medieval text-base font-extrabold tracking-wide leading-tight mt-1">
                      {persona.name}
                    </h3>
                    <p className="text-[9px] font-mono text-[#4A3428]/50 uppercase tracking-widest font-bold">
                      Portal Scribe Profile
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-[#4A3428]/10 text-left space-y-3">
                  <p className="text-xs font-serif italic leading-relaxed text-[#4A3428]/80 text-left">
                    "{persona.description}"
                  </p>
                  
                  {/* Specialty Trait block */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-[#D4AF37]/20 mt-1">
                    <Sparkle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="text-[10px] font-mono text-amber-800 font-extrabold leading-tight">
                      {persona.specialtyTrait}
                    </span>
                  </div>
                </div>

                {/* Decorative border feedback */}
                {isSelected && (
                  <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-gold-glow to-transparent" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Action Button Segment */}
        <div className="mt-10 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {selectedPersona ? (
              <motion.div
                key="confirm-box"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full max-w-md bg-[#FAF5EC] border-2 border-[#D4AF37] p-5 rounded-2xl shadow-xl space-y-4 text-center"
              >
                <div className="flex items-center justify-center gap-2">
                  <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#4A3428]/80 animate-pulse">Legacy Chosen: </p>
                  <span className="bg-[#4D3325] text-[#E6C06A] text-xs font-bold font-medieval px-2.5 py-1.5 rounded inline-flex items-center gap-1.5">
                    {selectedPersona.avatar} {selectedPersona.name}
                  </span>
                </div>
                
                <button
                  onClick={handleConfirmIdentity}
                  className="w-full py-4 bg-gradient-to-r from-[#4E2B1F] via-[#4A3428] to-[#1F120C] text-[#E6C06A] border border-[#D4AF37]/50 rounded-xl font-medieval text-base font-black tracking-widest shadow-lg hover:brightness-125 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer uppercase flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-gold-glow animate-pulse" />
                  <span>Bind This Identity</span>
                </button>
              </motion.div>
            ) : (
              <div className="text-[#FAF5EC]/60 text-xs font-serif italic text-center">
                Select an identity above to complete the bound ritual and begin.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ChooseIdentity;
