import React, { useState } from "react";
import {
  useStory,
  Persona,
  fantasyPersonas,
  AdventurerTitle,
  adventurerTitles,
  Companion,
  companionsList,
  StarterTraitKey,
  starterTraitsList
} from "../context/StoryContext";
import {
  Sparkles,
  Shield,
  Sparkle,
  Zap,
  ChevronLeft,
  ChevronRight,
  Crown,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type Step = "name" | "title" | "companion" | "trait" | "success";

const STEP_ORDER: { key: Step; label: string }[] = [
  { key: "name", label: "Identity" },
  { key: "title", label: "Title" },
  { key: "companion", label: "Companion" },
  { key: "trait", label: "Trait" }
];

export const ChooseIdentity: React.FC = () => {
  const { signupUser, setPage } = useStory();

  const [step, setStep] = useState<Step>("name");
  const [activeTab, setActiveTab] = useState<"All" | "Gender Neutral" | "Female" | "Male">("All");

  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<AdventurerTitle>("Novice Traveler");
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);
  const [selectedTrait, setSelectedTrait] = useState<StarterTraitKey | null>(null);

  const stepIndex = STEP_ORDER.findIndex(s => s.key === step);

  const filteredPersonas = fantasyPersonas.filter(p => {
    if (activeTab === "All") return true;
    return p.category === activeTab;
  });

  const goNext = () => {
    if (step === "name" && selectedPersona) setStep("title");
    else if (step === "title") setStep("companion");
    else if (step === "companion" && selectedCompanion) setStep("trait");
  };

  const goBack = () => {
    if (step === "title") setStep("name");
    else if (step === "companion") setStep("title");
    else if (step === "trait") setStep("companion");
  };

  const handleFinalize = () => {
    if (!selectedPersona || !selectedCompanion || !selectedTrait) return;

    let fullName = selectedPersona.name;
    let email = `${selectedPersona.name.toLowerCase().replace(/\s+/g, "")}@fantasy.com`;
    let password = "password123";

    const pendingStr = sessionStorage.getItem("pp_pending_registration");
    if (pendingStr) {
      try {
        const parsed = JSON.parse(pendingStr);
        if (parsed.fullName) fullName = parsed.fullName;
        if (parsed.email) email = parsed.email;
        if (parsed.password) password = parsed.password;
      } catch (e) {
        // fall back to persona-derived defaults
      }
      sessionStorage.removeItem("pp_pending_registration");
    }

    signupUser(fullName, email, password, selectedPersona, selectedTitle, selectedCompanion, selectedTrait);
    setStep("success");
  };

  // ---------- Success Screen ----------
  if (step === "success" && selectedPersona && selectedCompanion && selectedTrait) {
    const traitMeta = starterTraitsList.find(t => t.key === selectedTrait)!;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-b from-[#1F120C] via-[#2E1E16] to-[#0F0805] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,192,106,0.18),transparent_55%)] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 18, stiffness: 100 }}
          className="relative max-w-lg w-full bg-[#FAF5EC] rounded-3xl border-2 border-[#D4AF37] p-8 md:p-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden text-[#4A3428]"
        >
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37]" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#D4AF37]" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#D4AF37]" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37]" />

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
          <p className="text-sm font-mono uppercase tracking-widest text-[#4A3428]/60 font-bold mt-1">
            {selectedTitle}
          </p>

          <p className="font-serif italic text-sm text-[#4A3428]/80 max-w-sm mx-auto mt-4 leading-relaxed">
            "The first page of your chronicle has been written. Beyond the shifting fog of ancient portals, your legend awaits."
          </p>

          <div className="my-6 grid grid-cols-2 gap-3 text-left max-w-md mx-auto">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-[#D4AF37]/30 space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-700 flex items-center gap-1">
                {selectedCompanion.avatar} Companion
              </span>
              <p className="text-sm font-medieval font-black text-[#4A3428]">
                {selectedCompanion.name}
              </p>
              <p className="text-[10px] text-[#4A3428]/60">{selectedCompanion.type}</p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-[#D4AF37]/30 space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-700 flex items-center gap-1">
                {traitMeta.emoji} Starting Trait
              </span>
              <p className="text-sm font-medieval font-black text-[#4A3428]">
                {traitMeta.label}
              </p>
              <p className="text-[10px] text-[#4A3428]/60">+1 bonus applied</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-[#D4AF37]/30 text-left max-w-md mx-auto space-y-1">
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

  // ---------- Step Shell ----------
  const headerCopy: Record<Exclude<Step, "success">, { tag: string; title: string; sub: string }> = {
    name: {
      tag: "Chapter II: The Bound Ritual",
      title: "Choose Your Adventurer Identity",
      sub: `"Every traveler leaves a different mark upon the pages. Select your fantasy persona below."`
    },
    title: {
      tag: "Chapter II: The Bound Ritual",
      title: "Claim Your Adventurer Title",
      sub: `"An optional honorific that will precede your name across the realms."`
    },
    companion: {
      tag: "Chapter II: The Bound Ritual",
      title: "Choose Your Starting Companion",
      sub: `"Every traveler needs a loyal companion by their side through the portals."`
    },
    trait: {
      tag: "Chapter II: The Bound Ritual",
      title: "Select Your Starter Trait",
      sub: `"A +1 bonus to begin your journey. Nothing complicated."`
    }
  };

  const copy = headerCopy[step as Exclude<Step, "success">];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-b from-[#2E1E16] via-[#3E2B21] to-[#1F120C] flex flex-col justify-start items-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(230,192,106,0.1),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(103,141,198,0.06),transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-5xl mt-6 mb-12 relative">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {STEP_ORDER.map((s, i) => (
            <React.Fragment key={s.key}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-bold border-2 transition-all ${
                    i < stepIndex
                      ? "bg-[#D4AF37] border-[#D4AF37] text-[#2E1E16]"
                      : i === stepIndex
                      ? "border-[#D4AF37] text-[#E6C06A] bg-[#D4AF37]/15"
                      : "border-[#E6C06A]/25 text-[#E6C06A]/40"
                  }`}
                >
                  {i < stepIndex ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span
                  className={`text-[9px] font-mono uppercase tracking-widest ${
                    i <= stepIndex ? "text-[#E6C06A]" : "text-[#E6C06A]/30"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEP_ORDER.length - 1 && (
                <div
                  className={`w-8 md:w-16 h-0.5 mb-4 ${
                    i < stepIndex ? "bg-[#D4AF37]" : "bg-[#E6C06A]/15"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Header Hero Section */}
        <div className="text-center space-y-3 mb-8">
          <span className="font-mono text-[10px] tracking-widest uppercase bg-[#D4AF37]/20 text-[#E6C06A] border border-[#D4AF37]/35 px-3 py-1 rounded-full font-bold">
            {copy.tag}
          </span>
          <h1 className="font-medieval text-3xl md:text-5xl font-black text-white tracking-wide">
            {copy.title}
          </h1>
          <p className="text-sm font-serif italic text-[#E9DFD2]/80 max-w-xl mx-auto leading-relaxed">
            {copy.sub}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
          >
            {/* ---------- STEP: NAME ---------- */}
            {step === "name" && (
              <>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredPersonas.map((persona) => {
                    const isSelected = selectedPersona?.name === persona.name;
                    return (
                      <motion.div
                        key={persona.name}
                        whileHover={{ y: -6, scale: 1.02 }}
                        onClick={() => setSelectedPersona(persona)}
                        className={`relative bg-[#FAF5EC] rounded-2xl border-4 p-5 flex flex-col justify-between shadow-xl cursor-pointer transition-all overflow-hidden text-[#4A3428] ${
                          isSelected
                            ? "border-[#D4AF37] ring-4 ring-[#D4AF37]/30 bg-[#FAF1E3]"
                            : "border-transparent hover:border-[#D4AF37]/30"
                        }`}
                      >
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
                          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-[#D4AF37]/20 mt-1">
                            <Sparkle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span className="text-[10px] font-mono text-amber-800 font-extrabold leading-tight">
                              {persona.specialtyTrait}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-gold-glow to-transparent" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}

            {/* ---------- STEP: TITLE ---------- */}
            {step === "title" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {adventurerTitles.map((title) => {
                  const isSelected = selectedTitle === title;
                  return (
                    <motion.div
                      key={title}
                      whileHover={{ y: -4, scale: 1.02 }}
                      onClick={() => setSelectedTitle(title)}
                      className={`relative bg-[#FAF5EC] rounded-2xl border-4 p-5 flex items-center gap-3 shadow-xl cursor-pointer transition-all text-[#4A3428] ${
                        isSelected
                          ? "border-[#D4AF37] ring-4 ring-[#D4AF37]/30 bg-[#FAF1E3]"
                          : "border-transparent hover:border-[#D4AF37]/30"
                      }`}
                    >
                      <Crown className={`w-6 h-6 shrink-0 ${isSelected ? "text-[#D4AF37]" : "text-[#4A3428]/40"}`} />
                      <span className="font-medieval text-sm font-extrabold tracking-wide">{title}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#D4AF37] ml-auto" />}
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* ---------- STEP: COMPANION ---------- */}
            {step === "companion" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {companionsList.map((companion) => {
                  const isSelected = selectedCompanion?.id === companion.id;
                  return (
                    <motion.div
                      key={companion.id}
                      whileHover={{ y: -6, scale: 1.02 }}
                      onClick={() => setSelectedCompanion(companion)}
                      className={`relative bg-[#FAF5EC] rounded-2xl border-4 p-5 flex flex-col items-center text-center gap-2 shadow-xl cursor-pointer transition-all text-[#4A3428] ${
                        isSelected
                          ? "border-[#D4AF37] ring-4 ring-[#D4AF37]/30 bg-[#FAF1E3]"
                          : "border-transparent hover:border-[#D4AF37]/30"
                      }`}
                    >
                      <span className="text-5xl select-none p-3 bg-[#E9DFD2] rounded-xl border border-gold-glow/20 shadow-sm">
                        {companion.avatar}
                      </span>
                      <h3 className="font-medieval text-base font-extrabold tracking-wide mt-1">
                        {companion.name}
                      </h3>
                      <p className="text-[10px] font-mono text-[#4A3428]/60 uppercase tracking-widest font-bold">
                        {companion.type}
                      </p>
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <Check className="w-4 h-4 text-[#D4AF37]" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* ---------- STEP: TRAIT ---------- */}
            {step === "trait" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {starterTraitsList.map((trait) => {
                  const isSelected = selectedTrait === trait.key;
                  return (
                    <motion.div
                      key={trait.key}
                      whileHover={{ y: -4, scale: 1.02 }}
                      onClick={() => setSelectedTrait(trait.key)}
                      className={`relative bg-[#FAF5EC] rounded-2xl border-4 p-5 flex flex-col items-center text-center gap-2 shadow-xl cursor-pointer transition-all text-[#4A3428] ${
                        isSelected
                          ? "border-[#D4AF37] ring-4 ring-[#D4AF37]/30 bg-[#FAF1E3]"
                          : "border-transparent hover:border-[#D4AF37]/30"
                      }`}
                    >
                      <span className="text-4xl select-none">{trait.emoji}</span>
                      <span className="font-medieval text-sm font-extrabold tracking-wide">{trait.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#D4AF37]" />}
                    </motion.div>
                  );
                })}
                <p className="col-span-2 md:col-span-4 text-center text-[11px] font-serif italic text-[#FAF5EC]/60 mt-1">
                  Just a +1 bonus at start. Nothing complicated.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Nav Buttons */}
        <div className="mt-10 flex items-center justify-center gap-4">
          {step !== "name" && (
            <button
              onClick={goBack}
              className="px-5 py-3.5 rounded-xl border border-[#E6C06A]/30 text-[#E6C06A]/80 font-mono text-xs uppercase tracking-widest font-bold hover:bg-white/5 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}

          {step !== "trait" ? (
            <button
              onClick={goNext}
              disabled={
                (step === "name" && !selectedPersona) ||
                (step === "companion" && !selectedCompanion)
              }
              className="px-8 py-3.5 bg-gradient-to-r from-[#4E2B1F] via-[#4A3428] to-[#1F120C] text-[#E6C06A] border border-[#D4AF37]/50 rounded-xl font-medieval text-base font-black tracking-widest shadow-lg hover:brightness-125 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer uppercase flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none disabled:hover:scale-100"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinalize}
              disabled={!selectedTrait}
              className="px-8 py-3.5 bg-gradient-to-r from-[#4E2B1F] via-[#4A3428] to-[#1F120C] text-[#E6C06A] border border-[#D4AF37]/50 rounded-xl font-medieval text-base font-black tracking-widest shadow-lg hover:brightness-125 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer uppercase flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none disabled:hover:scale-100"
            >
              <Sparkles className="w-4 h-4 text-gold-glow animate-pulse" />
              <span>Bind This Identity</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChooseIdentity;