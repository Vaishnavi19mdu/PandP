import React, { useState, useEffect } from "react";
import { useStory } from "../context/StoryContext";
import { WorldSeedCard } from "../components/WorldSeedCard";
import MagicParticles from "../components/MagicParticles";
import { 
  Sparkles, 
  Compass, 
  BookOpen, 
  Scroll, 
  ShieldCheck, 
  Milestone, 
  ArrowRight, 
  Award, 
  ChevronRight, 
  HelpCircle, 
  Info, 
  AlertCircle, 
  Footprints,
  UserCheck
} from "lucide-react";
import Button from "../components/Button";

export const Landing: React.FC = () => {
  const { startAdventure, worldSeedsList, setPage } = useStory();
  
  // Interactive Hero Animation Steps Loop
  const [animationStep, setAnimationStep] = useState(0);
  const animationSteps = [
    {
      title: "Ancient Book Is Closed",
      narrative: "A legendary story lies dormant inside the Scriptorium archives, waiting to be summoned.",
      tip: "Start with any fantasy, mystery, or custom idea seed..."
    },
    {
      title: "1. The Book Opens",
      narrative: "The leather straps unbuckle. Faded ink hums with kinetic energy, ready to absorb your concepts.",
      tip: "You enter coordinate: 'A magical library under the sea where books are living starfish'..."
    },
    {
      title: "2. Celestial Portal Emerges",
      narrative: "The air crackles! Dynamic coordinates map a secure, branching constellation matrix of paths.",
      tip: "Portal stabilization active... Level rating compiled."
    },
    {
      title: "3. Interactive Choices Appear",
      narrative: "Three parallel corridors unfold, checking your Coded Attributes for safe passage.",
      tip: "Knowledge, Courage, Creativity, and Luck variables are established."
    },
    {
      title: "4. Glowing Path Selection",
      narrative: "You choose your corridor: 'Decipher the Sea-Spell Cipher' (+2 Knowledge required).",
      tip: "Attribute check successful! Your companion Corvus points the path."
    },
    {
      title: "5. Dimension Matrix Expands",
      narrative: "The portal shimmers as the world morphs around your decision, rewriting the outcome in ink.",
      tip: "A new story node is written! Trajectory updated on space chart."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % animationSteps.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Demo Adventure Simulator State
  const [demoChoice, setDemoChoice] = useState<string | null>(null);
  const [demoFeedback, setDemoFeedback] = useState<string>("");

  const handleDemoSelect = (choice: string) => {
    setDemoChoice(choice);
    if (choice === "Investigate") {
      setDemoFeedback(
        "🔊 Clank! You step into the dusty records stack. A clockwork guardian turns, but your companion sparks an overload signal! You discover an 'Ancient Key of Gears' (+2 Creativity!)."
      );
    } else if (choice === "Hide") {
      setDemoFeedback(
        "🤫 Shhh! You pull back into the shadow of a gargoyle. Footsteps fade away safely. Your companion whispers historical lore about the ceiling scripts, recording +3 Knowledge!"
      );
    } else {
      setDemoFeedback(
        "🐈 The Raven flaps its glossy silver wings, diving into a shifting bookcase slit. You scramble behind. A secret stairs chute bypasses the trap safely, boosting your Luck +3!"
      );
    }
  };

  const handlePlayDemoAdventure = () => {
    // Look up handcrafted Hollow Archives preset
    const hollowWord = worldSeedsList.find((w) => w.id === "hollow-archives");
    if (hollowWord) {
      startAdventure(hollowWord);
    } else {
      setPage("CreatePortal");
    }
  };

  const handleOpenPortalCTA = () => {
    setPage("CreatePortal");
  };

  const handleExploreArchives = () => {
    setPage("Archives");
  };

  return (
    <div className="relative pb-20 overflow-x-hidden font-sans text-soft-espresso min-h-screen bg-gradient-to-b from-[#FCFAF6] via-[#FAF5EC] to-[#F1EAE0]">
      <MagicParticles />
      
      {/* 1. MOCHA HERO CHRONICLE UNIT - Rich Dark Mocha-to-Espresso Header for Immersive Fantasy Intro */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2E1E16] via-[#3E2B21] to-[#281912] text-white pt-20 md:pt-32 pb-36 md:pb-44 px-4 md:px-8 mt-0">
        
        {/* Background visual light and coordinates overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(230,192,106,0.15),transparent_50%)] pointer-events-none" />
        <div className="absolute -left-10 bottom-10 w-96 h-96 bg-amber-50/5 blur-3xl pointer-events-none" />

        {/* Bottom bleed-out: fades the dark hero into the cream page background below so the transition feels intentional, not cut off */}
        <div className="absolute bottom-0 left-0 right-0 h-40 md:h-56 bg-gradient-to-b from-transparent via-[#3E2B21]/70 to-[#FCFAF6] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
          
          {/* Hero text descriptor cluster */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gold-glow/15 text-[#F0D597] text-xs font-semibold tracking-wider font-mono border border-[#D4AF37]/45 uppercase animate-bounce mt-4 lg:mt-0">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-gold-glow" />
              Every Story Opens a Door
            </span>
            
            <h1 className="font-medieval text-4.5xl md:text-7xl font-black tracking-wide leading-none select-none text-white">
              Turn Any Idea Into A <br className="hidden md:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F0D597] via-[#D4AF37] to-white font-black drop-shadow-sm font-medieval">
                Playable Adventure
              </span>
            </h1>

            <p className="text-sm md:text-lg text-white/90 max-w-2xl mx-auto lg:mx-0 font-sans leading-relaxed">
              Enter any prompt, make decisive choices, shape your sandbox coordinates, track unique attributes, and document your historical chronicles in the Library Scriptorium.
            </p>

            {/* Micro User Guidance Tip */}
            <div className="text-[11px] font-mono text-gold-glow/85 uppercase tracking-widest flex items-center justify-center lg:justify-start gap-1.5 pt-1 font-bold">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold-glow animate-ping" />
              Start with a story idea • Choose your path • Discover your destination
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Button 
                variant="magic" 
                size="lg" 
                onClick={handleOpenPortalCTA}
                className="w-full sm:w-auto text-base py-4 px-10 tracking-widest font-medieval font-bold shadow-2xl relative group overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gold-glow via-[#fff]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <Compass className="w-5 h-5 text-gold-glow animate-spin mr-1" />
                Open a Portal
              </Button>
              <button 
                onClick={() => {
                  const el = document.getElementById("demo-prev");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto text-sm py-4 px-8 border border-white/20 rounded-xl flex items-center justify-center gap-2.5 bg-white/5 hover:bg-white/10 text-white font-bold transition-all hover:scale-102 transform cursor-pointer font-medieval shadow-sm"
              >
                <Scroll className="w-4.5 h-4.5 text-[#E6C06A] animate-pulse" />
                Watch a Demo Journey
              </button>
            </div>
          </div>

          {/* 2. LOOPING ACTIVE HERO STORY ANIMATION */}
          <div className="lg:col-span-5 flex justify-center items-center">
            
            <div className="w-full max-w-md bg-[#FAF5EE] border-2 border-[#D4AF37]/50 rounded-3xl p-5 md:p-6 shadow-2xl space-y-4 relative overflow-hidden book-shadow text-soft-espresso">
              {/* Back ambient portal rings */}
              <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-gold-glow/10 animate-pulse blur-xl pointer-events-none" />
              
              <div className="flex justify-between items-center border-b border-[#4A3428]/10 pb-2.5 text-[9px] font-mono text-[#8C6D3E] font-bold">
                <span>PORTAL FORGE ENGINE v2.6</span>
                <span className="bg-navy px-1.5 py-0.5 rounded text-white animate-pulse">CYCLING</span>
              </div>

              {/* Looping Graphics Card Container */}
              <div className="h-56 bg-[#FCFAF7] rounded-2xl border border-[#D2B29A]/40 p-4.5 flex flex-col justify-between relative overflow-hidden text-xs md:text-sm shadow-inner">
                
                {/* Step indicator bubbles */}
                <div className="flex gap-1.5 absolute top-3.5 right-3.5">
                  {animationSteps.map((_, idx) => (
                    <span 
                      key={idx} 
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        animationStep === idx ? "bg-[#D4AF37] scale-120 shadow-md shadow-gold-glow" : "bg-black/10"
                      }`}
                    />
                  ))}
                </div>

                {/* Simulated visuals block based on step index */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-glow/15 border border-gold-glow/40 flex items-center justify-center text-xl animate-float">
                    {animationStep === 0 && "📘"}
                    {animationStep === 1 && "📖"}
                    {animationStep === 2 && "🌀"}
                    {animationStep === 3 && "🗂️"}
                    {animationStep === 4 && "🌟"}
                    {animationStep === 5 && "💥"}
                  </div>
                  <div>
                    <h4 className="font-medieval text-xs font-bold text-[#8C6D3E] uppercase tracking-wider">
                      {animationSteps[animationStep].title}
                    </h4>
                    <span className="text-[8px] font-mono text-soft-espresso/60 uppercase">
                      Visualization Simulator Step {animationStep + 1}
                    </span>
                  </div>
                </div>

                {/* Simulated narrative scroll */}
                <p className="font-sans text-soft-espresso/90 text-xs italic leading-relaxed py-2 p-3 bg-white/60 rounded-lg border border-[#D2B29A]/15 shadow-inner">
                  "{animationSteps[animationStep].narrative}"
                </p>

                {/* Inline info tip */}
                <span className="text-[10px] font-semibold text-[#8C6D3E] flex items-center gap-1 bg-[#FCFAF7] p-1 px-2 rounded font-mono border border-[#D2B29A]/10">
                  💡 Choose your corridor wisely
                </span>

              </div>

              {/* Manual toggle buttons allowing user to step-control */}
              <div className="grid grid-cols-6 gap-1 pt-1.5">
                {animationSteps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAnimationStep(idx)}
                    className={`py-1.5 text-[9px] font-mono font-bold rounded-md border transition-all cursor-pointer ${
                      animationStep === idx
                        ? "bg-[#8C6D3E] text-white border-[#8C6D3E]" 
                        : "bg-[#FCFAF7] hover:bg-[#FAF0E6] text-[#4A3428]/75 border-[#D2B29A]/30"
                    }`}
                  >
                    S{idx + 1}
                  </button>
                ))}
              </div>

              {/* Scribe footnote prompt */}
              <div className="text-[10.5px] text-soft-espresso/60 leading-normal text-center italic pt-1 border-t border-[#4a3428]/10">
                Each choice rewrites the constellation map in real time.
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION (Direct, Unmissable glowing cards) */}
      <section className="mt-24 max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        <div className="text-center space-y-2">
          <span className="inline-block text-[10px] uppercase font-mono tracking-widest text-[#678DC6] font-extrabold bg-[#678DC6]/10 px-3 py-1 rounded">
            The Scribe Ritual
          </span>
          <h2 className="font-medieval text-3xl md:text-5xl font-black text-[#4A3428] tracking-wider uppercase">
            How The Storyforge Manifests
          </h2>
          <p className="text-xs md:text-sm text-soft-espresso/70 max-w-lg mx-auto font-sans leading-relaxed">
            Your words establish coordinate vectors, building infinite branches. Use Coded Attributes to locate safety before portal displacement.
          </p>
        </div>

        {/* 3 Glowing Interactive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Create */}
          <div className="group bg-[#FCFAF7] p-7 rounded-2xl border border-[#E6DFD3] relative overflow-hidden hover:shadow-2xl hover:border-gold-glow hover:-translate-y-1.5 transition-all duration-300 shadow-md">
            {/* Corner border trace highlight */}
            <div className="absolute top-0 right-0 h-10 w-10 border-t-2 border-r-2 border-transparent group-hover:border-gold-glow transition-colors" />
            <div className="absolute bottom-0 left-0 h-10 w-10 border-b-2 border-l-2 border-transparent group-hover:border-gold-glow transition-colors" />
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#4A3428] border border-[#D4AF37] rounded-xl flex items-center justify-center text-gold-glow text-2xl shadow-md group-hover:animate-bounce">
                ✨
              </div>
              <h3 className="font-medieval text-lg font-bold text-soft-espresso flex items-center gap-1">
                Create
                <span className="text-[11px] font-mono text-[#D4AF37] uppercase bg-gold-glow/10 px-2 py-0.5 rounded ml-2">Level 1</span>
              </h3>
              <p className="text-xs md:text-sm text-soft-espresso/80 leading-relaxed font-sans">
                Describe your setting in any length. The Scriptorium instantly coordinates starting attributes, companion profiles, and core target objectives matching your genre variables.
              </p>
              <span className="text-[11px] font-mono block text-[#678DC6] font-bold">"Start with a story idea..."</span>
            </div>
          </div>

          {/* Card 2: Choose */}
          <div className="group bg-[#FCFAF7] p-7 rounded-2xl border border-[#E6DFD3] relative overflow-hidden hover:shadow-2xl hover:border-gold-glow hover:-translate-y-1.5 transition-all duration-300 shadow-md">
            {/* Corner border trace highlight */}
            <div className="absolute top-0 right-0 h-10 w-10 border-t-2 border-r-2 border-transparent group-hover:border-gold-glow transition-colors" />
            <div className="absolute bottom-0 left-0 h-10 w-10 border-b-2 border-l-2 border-transparent group-hover:border-gold-glow transition-colors" />
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#4A3428] border border-[#D4AF37] rounded-xl flex items-center justify-center text-gold-glow text-2xl shadow-md group-hover:animate-spin">
                🌀
              </div>
              <h3 className="font-medieval text-lg font-bold text-soft-espresso flex items-center gap-1">
                Choose
                <span className="text-[11px] font-mono text-[#678DC6] uppercase bg-[#678DC6]/15 px-2 py-0.5 rounded ml-2">Level 2</span>
              </h3>
              <p className="text-xs md:text-sm text-soft-espresso/80 leading-relaxed font-sans">
                Make complex decisions checking your Knowledge, Courage, Creativity, and Luck levels. Discover hidden item artifacts and bypass locks inside dangerous room intersections.
              </p>
              <span className="text-[11px] font-mono block text-navy font-bold">"Choose your path and companion..."</span>
            </div>
          </div>

          {/* Card 3: Discover */}
          <div className="group bg-[#FCFAF7] p-7 rounded-2xl border border-[#E6DFD3] relative overflow-hidden hover:shadow-2xl hover:border-gold-glow hover:-translate-y-1.5 transition-all duration-300 shadow-md">
            {/* Corner border trace highlight */}
            <div className="absolute top-0 right-0 h-10 w-10 border-t-2 border-r-2 border-transparent group-hover:border-gold-glow transition-colors" />
            <div className="absolute bottom-0 left-0 h-10 w-10 border-b-2 border-l-2 border-transparent group-hover:border-gold-glow transition-colors" />
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#4A3428] border border-[#D4AF37] rounded-xl flex items-center justify-center text-gold-glow text-2xl shadow-md group-hover:animate-pulse">
                🏆
              </div>
              <h3 className="font-medieval text-lg font-bold text-soft-espresso flex items-center gap-1">
                Discover
                <span className="text-[11px] font-mono text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded ml-2">Final</span>
              </h3>
              <p className="text-xs md:text-sm text-soft-espresso/80 leading-relaxed font-sans">
                Unlock distinct, visual ending certificates depending on your milestones. Log successful scores in the global archives and re-run corridors to discover other pathways.
              </p>
              <span className="text-[11px] font-mono block text-emerald-700 font-bold">"Discover where your choices lead."</span>
            </div>
          </div>

        </div>

      </section>

      {/* 3. INTERACTIVE DEMO PREVIEW (Large Showcase Card) */}
      <section id="demo-prev" className="mt-24 max-w-4xl mx-auto px-4 scroll-mt-24 space-y-8">
        
        <div className="text-center space-y-2">
          <span className="inline-block text-[10px] uppercase font-mono tracking-widest text-[#678DC6] font-extrabold">
            Hands-on Sandbox Simulation
          </span>
          <h2 className="font-medieval text-2xl md:text-3xl font-bold text-[#4A3428]">
            Preview An Active Chronicle Layout
          </h2>
        </div>

        <div className="bg-[#FCFAF7] border-2 border-[#D4AF37]/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
          
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#4A3428] via-[#E6C06A] to-[#678DC6]" />
          
          {/* Header block info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-[#4a3428]/10 pb-4">
            <div className="space-y-1">
              <span className="inline-flex px-2 py-0.5 rounded text-[9px] uppercase font-mono tracking-wider font-semibold bg-gold-glow/20 text-[#4A3428] border border-[#E6C06A]/30">
                ⭐ Interactive Demo Sandbox Mode
              </span>
              <h3 className="font-medieval text-xl font-bold text-[#4A3428]">
                The Hollow Archives (Mystery Genre)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
              🔑 Companion: Corvus the Raven
            </span>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-mono text-soft-espresso/50 uppercase tracking-wider">
              Primary Objective: Recover a forgotten manuscript before the library scrolls disappear.
            </p>
            <div className="p-5 bg-white/75 rounded-2xl border border-[#E6DFD3] shadow-inner space-y-3">
              <span className="text-[9.5px] font-mono uppercase text-[#678DC6]">Active Scene Paragraph:</span>
              <p className="italic text-xs md:text-sm leading-relaxed text-[#4A3428] font-medium font-serif">
                "You hear heavy metal footsteps echoing beyond the sealed oak bookshelf racks. Black smoke begins to seep through floor board grates. The Sarcastic Raven companion tilts its shiny neck toward a narrow slit in the shifting mahogany case. What will you proceed with, Initiate?"
              </p>
            </div>
          </div>

          {/* Simulated three clickable choice buttons */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-[#4A3428]/70 block font-bold">
              Click a corridor pathway to test variables:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => handleDemoSelect("Investigate")}
                className={`p-3.5 rounded-xl border text-left transition-all text-xs font-bold font-medieval cursor-pointer flex items-center justify-between ${
                  demoChoice === "Investigate" 
                    ? "bg-[#4A3428] text-gold-glow border-[#4E2B1F]" 
                    : "bg-white/50 border-[#E6DFD3] text-soft-espresso hover:bg-white"
                }`}
              >
                <span>⚔️ Investigate clank</span>
                {demoChoice === "Investigate" && <span>⚡</span>}
              </button>

              <button
                onClick={() => handleDemoSelect("Hide")}
                className={`p-3.5 rounded-xl border text-left transition-all text-xs font-bold font-medieval cursor-pointer flex items-center justify-between ${
                  demoChoice === "Hide" 
                    ? "bg-[#4A3428] text-gold-glow border-[#4E2B1F]" 
                    : "bg-white/50 border-[#E6DFD3] text-soft-espresso hover:bg-white"
                }`}
              >
                <span>🤫 Hide in shadow</span>
                {demoChoice === "Hide" && <span>⚡</span>}
              </button>

              <button
                onClick={() => handleDemoSelect("Follow")}
                className={`p-3.5 rounded-xl border text-left transition-all text-xs font-bold font-medieval cursor-pointer flex items-center justify-between ${
                  demoChoice === "Follow" 
                    ? "bg-[#4A3428] text-gold-glow border-[#4E2B1F]" 
                    : "bg-white/50 border-[#E6DFD3] text-soft-espresso hover:bg-white"
                }`}
              >
                <span>🐦 Follow the Raven</span>
                {demoChoice === "Follow" && <span>⚡</span>}
              </button>
            </div>
          </div>

          {/* Interactive narration response popup block */}
          {demoFeedback && (
            <div className="p-4 bg-gold-glow/10 border-2 border-[#E6C06A]/40 rounded-2xl text-xs space-y-1.5 animate-fadeIn">
              <span className="font-bold text-soft-espresso uppercase font-mono tracking-widest text-[9.5px] block">
                ✦ Simulation Result Feedback:
              </span>
              <p className="font-sans leading-relaxed text-[#4A3428] font-medium font-medium">
                {demoFeedback}
              </p>
            </div>
          )}

          {/* Large CTA Play Demo Adventure Button */}
          <div className="pt-4 border-t border-[#4a3428]/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-[11px] text-soft-espresso/60 font-sans italic">
              Ready to experience this exact live puzzle with real attributes?
            </span>
            <Button
              variant="magic"
              onClick={handlePlayDemoAdventure}
              className="w-full sm:w-auto text-xs py-3 px-6 shadow-md uppercase tracking-wider font-medieval"
            >
              Play Handcrafted Demo
              <ArrowRight className="w-3.5 h-3.5 ml-1 animate-pulse" />
            </Button>
          </div>

        </div>

      </section>

      {/* 4. DEDICATED PORTAL MAP SHOWCASE Section */}
      <section className="relative bg-gradient-to-b from-[#FCFAF6] via-[#FAF5EC] to-[#FCFAF6] py-20 px-4 md:px-8 border-y border-[#DCD3C9]/60 text-soft-espresso mt-24 shadow-inner">
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Legend instructions */}
          <div className="lg:col-span-5 space-y-5">
            <span className="text-[#8C6D3E] text-[10px] font-mono uppercase tracking-widest block font-bold">
              Dimensional Map Constellation
            </span>
            <h2 className="font-medieval text-2xl md:text-3.5xl font-black text-soft-espresso leading-tight">
              Your Choices Shape <br />
              The Constellation Journey
            </h2>
            <p className="text-xs md:text-sm text-soft-espresso/80 leading-relaxed font-sans">
              Every decision you take branches out dynamically on our live coordinate graph. Double-check your pathing chart to map where active corridors diverge and discover stable endpoints.
            </p>
            <div className="p-4 bg-white/60 border border-[#DCD3C9] rounded-xl space-y-2 text-xs">
              <p className="font-serif italic text-[#8C6D3E] font-medium">"There are no dead-ends, only alternate endings ready to write your name in parchment."</p>
            </div>
          </div>

          {/* Animated Branching Map Node Visual block */}
          <div className="lg:col-span-7 flex justify-center">
            
            <div className="w-full max-w-lg bg-white/75 rounded-3xl p-6 border-2 border-[#D2B29A] relative overflow-hidden min-h-[290px] flex flex-col justify-between shadow-lg text-soft-espresso">
              
              <div className="flex justify-between items-center text-[9px] font-mono text-[#8C6D3E] font-bold">
                <span>SIMULATED SPACE VECTOR</span>
                <span>ALIGNMENT: SECURE</span>
              </div>

              {/* Node Network Map Graphic */}
              <div className="my-auto relative h-40 flex items-center justify-center select-none">
                
                {/* SVG glowing connections pathing */}
                <svg className="absolute inset-0 w-full h-full text-gold-glow opacity-60" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 50,80 Q 150,30 250,80 T 450,80" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="5, 3" className="animate-pulse" />
                  <path d="M 50,80 Q 150,130 250,80 T 450,110" fill="none" stroke="rgba(103,141,198,0.7)" strokeWidth="2" strokeDasharray="4, 4" />
                </svg>

                {/* Nodes with custom names and pulse markers */}
                {/* Starting Hub */}
                <div className="absolute left-4 top-16 flex flex-col items-center">
                  <span className="w-8 h-8 rounded-full bg-[#E6C06A] border-2 border-white flex items-center justify-center text-xs font-bold text-soft-espresso shadow-lg animate-pulse z-10">
                    S
                  </span>
                  <span className="text-[8px] font-mono text-[#8C6D3E] uppercase mt-1 font-bold">Summon hub</span>
                </div>

                {/* Branch Node Upper */}
                <div className="absolute left-1/3 top-6 flex flex-col items-center">
                  <span className="w-7 h-7 rounded-full bg-navy border border-gold-glow flex items-center justify-center text-[9.5px] font-bold text-white shadow animate-bounce z-10">
                    A
                  </span>
                  <span className="text-[7.5px] font-mono text-soft-espresso/80 mt-1 uppercase font-bold">Knowledge check</span>
                </div>

                {/* Branch Node Lower */}
                <div className="absolute left-1/3 bottom-2 flex flex-col items-center">
                  <span className="w-7 h-7 rounded-full bg-[#678DC6] border border-white flex items-center justify-center text-[9.5px] font-bold text-white shadow z-10">
                    B
                  </span>
                  <span className="text-[7.5px] font-mono text-soft-espresso/80 mt-1 uppercase font-bold">Courage gate</span>
                </div>

                {/* Shifting Center Node */}
                <div className="absolute left-2/3 top-16 flex flex-col items-center">
                  <span className="w-8 h-8 rounded-full bg-[#3E2B21] border-2 border-[#D2B29A] flex items-center justify-center text-xs font-medieval font-bold text-gold-glow shadow-xl z-10 animate-bounce">
                    C
                  </span>
                  <span className="text-[8px] font-mono text-[#8C6D3E] uppercase mt-1 font-bold">Vault corridor</span>
                </div>

                {/* Ending Outpost */}
                <div className="absolute right-4 top-20 flex flex-col items-center">
                  <span className="w-8 h-8 rounded-full bg-emerald-700 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-lg animate-pulse z-10">
                    Ω
                  </span>
                  <span className="text-[8px] font-mono text-emerald-800 uppercase mt-1 font-bold">Stabilized Ending</span>
                </div>

              </div>

              <div className="text-[10px] text-center text-[#8C6D3E] font-mono uppercase tracking-widest pt-2 border-t border-[#D2B29A]/15 font-bold">
                ✦ Connections hum with soft light when selected ✦
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* 5. ENDINGS SHOWCASE (Shows visual variety and replayability outcomes) */}
      <section className="mt-8 max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        
        <div className="text-center space-y-2">
          <span className="inline-block text-[10px] uppercase font-mono tracking-widest text-[#678DC6] font-extrabold bg-[#678DC6]/10 px-3 py-1 rounded">
            Branching Outcomes
          </span>
          <h2 className="font-medieval text-2xl md:text-3.5xl font-black text-[#4A3428] tracking-widest uppercase">
            Unlock Destiny Certificates
          </h2>
          <p className="text-xs text-soft-espresso/60 font-sans max-w-sm mx-auto">
            Choose your companion, raise your affinity stats, and unlock unique chronicle endings.
          </p>
        </div>

        {/* Endings Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card: Wise Scholar */}
          <div className="bg-[#FCFAF7] p-5 rounded-2xl border border-[#E6DFD3] hover:border-gold-glow hover:shadow-xl transition-all duration-300 text-center space-y-4">
            <span className="text-4xl block select-none">🧙‍♂️</span>
            <div className="space-y-1">
              <span className="text-[9px] font-mono tracking-wider uppercase text-gold-glow bg-[#4A3428] px-2 py-0.5 rounded font-bold">
                Affinity: Knowledge
              </span>
              <h4 className="font-medieval text-md font-bold text-soft-espresso">
                Wise Scholar
              </h4>
            </div>
            <p className="text-xs text-soft-espresso/80 leading-relaxed font-sans">
              Deciphered ancient spatial rifts safely with intelligence levels of 8+. Written in golden history ink.
            </p>
            <div className="h-1.5 w-12 bg-[#4A3428] mx-auto rounded-full" />
          </div>

          {/* Card: Master Explorer */}
          <div className="bg-[#FCFAF7] p-5 rounded-2xl border border-[#E6DFD3] hover:border-gold-glow hover:shadow-xl transition-all duration-300 text-center space-y-4">
            <span className="text-4xl block select-none">🗺️</span>
            <div className="space-y-1">
              <span className="text-[9px] font-mono tracking-wider uppercase text-[#678DC6] bg-navy px-2 py-0.5 rounded font-bold">
                Affinity: Luck
              </span>
              <h4 className="font-medieval text-md font-bold text-soft-espresso">
                Master Explorer
              </h4>
            </div>
            <p className="text-xs text-soft-espresso/80 leading-relaxed font-sans">
              Bypassed ancient safety locks on parallel boards safely, tracking 100% of rooms in the coordinate.
            </p>
            <div className="h-1.5 w-12 bg-navy mx-auto rounded-full" />
          </div>

          {/* Card: Lost Wanderer */}
          <div className="bg-[#FCFAF7] p-5 rounded-2xl border border-[#E6DFD3] hover:border-gold-glow hover:shadow-xl transition-all duration-300 text-center space-y-4">
            <span className="text-4xl block select-none">🍂</span>
            <div className="space-y-1">
              <span className="text-[9px] font-mono tracking-wider uppercase text-[#CBD5E1]/90 bg-neutral-600 px-2 py-0.5 rounded font-bold">
                Affinity: None / Low Luck
              </span>
              <h4 className="font-medieval text-md font-bold text-soft-espresso">
                Lost Wanderer
              </h4>
            </div>
            <p className="text-xs text-soft-espresso/80 leading-relaxed font-sans">
              Entropy check failed or alignment collapsed prior to coordinate stability. Safe return via Scriptorium.
            </p>
            <div className="h-1.5 w-12 bg-neutral-600 mx-auto rounded-full" />
          </div>

        </div>

      </section>

      {/* 6. FEATURED WORLD SEEDS SECTION */}
      <section className="mt-24 max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 border-b border-navy/15 pb-4">
          <div className="space-y-1">
            <h2 className="font-medieval text-2xl md:text-3xl font-extrabold text-[#4A3428] tracking-wider uppercase">
              Featured Gates
            </h2>
            <p className="text-xs text-soft-espresso/60 font-sans">
              Embark on high-fidelity, handcrafted sandbox worlds containing pre-loaded branches
            </p>
          </div>
          <div>
            <Button 
              variant="accent" 
              onClick={handleOpenPortalCTA}
              className="text-xs py-2 px-4 hover:brightness-105 transition-all font-medieval uppercase"
            >
              Custom-Design a world
            </Button>
          </div>
        </div>

        {/* Seeds grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {worldSeedsList.slice(0, 3).map((world) => (
            <WorldSeedCard 
               key={world.id} 
               seed={world} 
               onSelect={() => startAdventure(world)} 
            />
          ))}
        </div>
      </section>

      {/* 7. REVOLPTIONARY ONBOARDING FOOTER CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 text-center mt-24 space-y-6">
        
        <div className="bg-[#FCFAF7] p-8 md:p-12 border-2 border-gold-glow shadow-xl rounded-3xl space-y-6 relative overflow-hidden">
          
          {/* Subtle light effects */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-gold-glow/5 rounded-full pointer-events-none blur-xl" />
          
          <div className="space-y-2">
            <h3 className="font-medieval text-2xl md:text-4.5xl font-black text-[#4A3428] leading-tight">
              Ready To Manifest Your First Universe?
            </h3>
            <p className="text-xs md:text-md text-[#4A3428]/80 max-w-lg mx-auto font-sans leading-relaxed">
              Every coordinate inputted writes another legend. Define your environment, select your guide entity, list objectives, and enter your path.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              variant="magic" 
              size="lg" 
              onClick={handleOpenPortalCTA}
              className="w-full sm:w-auto text-sm py-4 px-10 tracking-widest font-medieval font-bold shadow-lg"
            >
              <Compass className="w-5 h-5 text-gold-glow animate-spin mr-1" />
              Open a Portal
            </Button>
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={handleExploreArchives}
              className="w-full sm:w-auto text-sm py-4 px-8 border border-navy/15 font-medieval flex items-center justify-center gap-2.5 hover:bg-[#E9DFD2]"
            >
              <Scroll className="w-5 h-5 text-soft-espresso" />
              Explore Chronicles
            </Button>
          </div>

        </div>

      </section>

    </div>
  );
};
export default Landing;