import React, { useState, useEffect, useRef } from "react";
import { useStory } from "../context/StoryContext";
import { ChoiceCard } from "./ChoiceCard";
import { Scroll, Sparkles, MessageCircle, AlertCircle, History, Star, HelpCircle } from "lucide-react";
import Button from "./Button";
import { motion, AnimatePresence } from "motion/react";

export const AdventurePanel: React.FC = () => {
  const { activeStory, chooseOption, completeAdventure } = useStory();
  const [feedback, setFeedback] = useState<{ msg: string; success: boolean } | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Immersion State Variables
  const [interacted, setInteracted] = useState(false);
  const [smallProgression, setSmallProgression] = useState<{ text: string; stat?: string } | null>(null);
  const [majorMilestone, setMajorMilestone] = useState<{ active: boolean; stageName: string; stepNumber: number } | null>(null);
  const [lastChoice, setLastChoice] = useState<any | null>(null);

  if (!activeStory) return null;

  const { graph, currentNodeId, world } = activeStory;
  const currentNode = graph.find((node) => node.id === currentNodeId);

  // Monitor scene transformations
  useEffect(() => {
    setInteracted(false);
    setFeedback(null);
    setLastChoice(null);
  }, [currentNodeId]);

  // Smooth local journal scroll box without window jump
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTo({
        top: logContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [activeStory.log]);

  if (!currentNode) {
    return (
      <div className="bg-[#F8EAE5] rounded-xl p-8 border border-red-200 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto animate-pulse" />
        <h3 className="text-xl font-medieval text-red-800">Coordinate Fracture!</h3>
        <p className="text-sm font-sans">
          This portal thread is fractured. The destination node <strong>"{currentNodeId}"</strong> could not be consolidated.
        </p>
        <Button onClick={() => completeAdventure()}>Close Broken Gate</Button>
      </div>
    );
  }

  const handleChoice = (choice: any) => {
    setInteracted(true);
    setLastChoice(choice);
    const outcome = chooseOption(choice);
    
    if (outcome.success) {
      const isFailedChallenge = outcome.feedbackMsg.toLowerCase().includes("failed");
      
      if (!isFailedChallenge) {
        // Trigger small progression overlay celebration!
        let rewardsLabel = "✨ Path Discovered";
        if (choice.statReward) {
          rewardsLabel += ` • Raise ${choice.statReward.stat.toUpperCase()} +${choice.statReward.value}`;
        }
        if (choice.itemReward) {
          rewardsLabel += ` • 🎒 Found ${choice.itemReward}`;
        }
        
        setSmallProgression({
          text: rewardsLabel,
          stat: choice.statReward?.stat
        });
        
        // Auto dismiss small bubble
        const timer = setTimeout(() => {
          setSmallProgression(null);
        }, 1600);

        // Check if we reached a major milestone (choicesMade length modulo 3 === 0)
        const nextChoicesCount = activeStory.choicesMade.length + 1;
        if (nextChoicesCount > 0 && nextChoicesCount % 3 === 0) {
          setMajorMilestone({
            active: true,
            stageName: currentNode.title,
            stepNumber: nextChoicesCount
          });
        }
      }
      
      setFeedback({ msg: outcome.feedbackMsg, success: !isFailedChallenge });
    } else {
      setFeedback({ msg: outcome.feedbackMsg, success: false });
    }
  };

  // Dynamic Companion advice reactions
  const getCompanionDialogue = () => {
    const companionName = world.companionName;
    
    // 1. Check if challenge/choice failed
    if (feedback && !feedback.success) {
      return {
        icon: "⚠️",
        expression: "CONCERNED",
        intro: `${companionName} looks concerned`,
        text: `"Oh dear! Spacetime coordinates are warping unexpectedly. That didn't go quite as planned, but do not fear—we can discover alternate timelines!"`,
        style: "border-orange-300 bg-orange-50 text-orange-950 shadow-orange-100/40 animate-pulse"
      };
    }
    
    // 2. Check if a successful choice was just completed
    if (feedback && feedback.success && lastChoice) {
      if (lastChoice.statReward) {
        const stat = lastChoice.statReward.stat.toLowerCase();
        if (stat === "courage") {
          return {
            icon: "🦁",
            expression: "APPROVING",
            intro: `${companionName} approves your boldness`,
            text: `"Magnificent! Your courage is highly inspiring. ${companionName} loves seeing you make bold choices that drive the dark forces away!"`,
            style: "border-amber-400 bg-amber-50/90 text-amber-950 shadow-md animate-pulse"
          };
        }
        if (stat === "wisdom") {
          return {
            icon: "🦉",
            expression: "WISE",
            intro: `${companionName} values your wisdom`,
            text: `"Incredible intellect! Seeking knowledge and pathing through wisdom is the safest way to decrypt the archives. ${companionName} is highly impressed."`,
            style: "border-blue-400 bg-blue-50/90 text-blue-950 shadow-md animate-pulse"
          };
        }
        if (stat === "resilience") {
          return {
            icon: "🛡️",
            expression: "STEADY",
            intro: `${companionName} stands steady with you`,
            text: `"Pure fortitude! Choosing resilience keeps our timeline aligned flawlessly. ${companionName} feels safer with your unbreakable defense!"`,
            style: "border-teal-400 bg-teal-50/90 text-teal-950 shadow-md animate-pulse"
          };
        }
        if (stat === "magic") {
          return {
            icon: "🐉",
            expression: "ASTONISHED",
            intro: `${companionName} glows outline-magic`,
            text: `"The magical leylines are responding to your command! ${companionName} is astonished by your seamless flow of raw spellweaving!"`,
            style: "border-purple-400 bg-purple-50/90 text-purple-950 shadow-md animate-pulse"
          };
        }
      }
      
      if (lastChoice.itemReward) {
        return {
          icon: "🎁",
          expression: "EXCITED",
          intro: `${companionName} is ecstatic`,
          text: `"Look at that sparkle! A cosmic relic item is ours! ${companionName} can already feel its coordinates stabilising inside your Arcane Backpack."`,
          style: "border-yellow-400 bg-yellow-50/90 text-yellow-950 shadow-md animate-pulse"
        };
      }
    }

    // 3. Check if an item reward is incoming (pre-selection clue)
    const hasItemNearby = currentNode.choices.some(c => c.itemReward);
    if (hasItemNearby) {
      return {
        icon: "🦅",
        expression: "EXCITED",
        intro: `${companionName} notices an artifact`,
        text: `"Ah! I notice the unmistakable scent of relic essence nearby. Make sure your Arcane Backpack is ready to capture this artifact when you act!"`,
        style: "border-gold-glow bg-gold-glow/10 text-soft-espresso shadow-amber-150/20"
      };
    }
    
    // 4. Default idle attentive state
    return {
      icon: "💬",
      expression: "ATTENTIVE",
      intro: `${companionName} watches closely`,
      text: currentNode.companionComment || `"${world.companionMessage}"`,
      style: "border-navy/15 bg-[#E9DFD2]/60 text-soft-espresso shadow-md"
    };
  };

  const dialog = getCompanionDialogue();

  return (
    <div className="space-y-6 w-full relative">
      
      {/* A. Small Portal Placement Progression Overlay */}
      {smallProgression && (
        <div className="fixed top-20 right-4 z-[9999] bg-[#4A3428] text-white border-2 border-gold-glow p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-fadeIn border-b-6 max-w-sm">
          <div className="w-8 h-8 rounded-full bg-gold-glow text-[#4A3428] flex items-center justify-center text-md select-none animate-spin">
            ✨
          </div>
          <div>
            <h5 className="font-medieval text-[10px] font-black tracking-widest text-[#E6C06A] uppercase leading-none">
              Corridor Consolidating
            </h5>
            <p className="font-sans text-[11px] font-semibold text-neutral-200 mt-1">
              {smallProgression.text}
            </p>
          </div>
        </div>
      )}

      {/* B. Major Page-Turn Milestone Celebration Screen */}
      {majorMilestone?.active && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#4A3428]/95 backdrop-blur-md p-4 animate-fadeIn">
          {/* Back rotating space dust radial glow */}
          <div className="absolute w-[450px] h-[450px] bg-gold-glow/5 animate-spin blur-3xl pointer-events-none rounded-full" />
          
          <div className="bg-[#FAF0ED] text-soft-espresso border-2 border-gold-glow rounded-3xl p-6 md:p-8 max-w-lg w-full text-center space-y-6 relative overflow-hidden book-shadow animate-fadeIn">
            {/* Curving Elegant Corners */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-gold-glow/50 rounded-tl-xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-gold-glow/50 rounded-tr-xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-gold-glow/50 rounded-bl-xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-gold-glow/50 rounded-br-xl pointer-events-none" />

            <div className="space-y-1.5 pt-2">
              <span className="text-[9.5px] font-mono tracking-widest text-[#678DC6] uppercase bg-[#678DC6]/10 px-3 py-1 rounded-full font-bold inline-block">
                🏆 Chronicle Milestone Reached
              </span>
              <h2 className="font-medieval text-2.5xl font-black text-[#4A3428] tracking-widest leading-none">
                JOURNEY PROGRESSED!
              </h2>
              <div className="h-0.5 bg-gradient-to-r from-transparent via-[#E6C06A] to-transparent w-full my-2" />
            </div>

            <div className="p-5 bg-[#E9DFD2]/40 rounded-2xl border border-[#4a3428]/10 space-y-1.5 text-left italic font-serif">
              <span className="text-[8.5px] font-mono not-italic uppercase tracking-widest text-[#4A3428]/60 block font-bold">landmark portal zone:</span>
              <p className="text-sm font-black text-[#4A3428] not-italic">
                "{currentNode.title}"
              </p>
              <p className="text-xs text-soft-espresso/80 font-normal leading-relaxed">
                Your footsteps solidify in parchment memory. A legendary milestone line is written down on your spatial vector index map after settling {majorMilestone.stepNumber} corridor junctions!
              </p>
            </div>

            {/* Companion Dialogue inside Chapter screen */}
            <div className="p-3 bg-[#4A3428] text-[#F4F1EC] rounded-xl flex items-center gap-3 text-xs leading-normal relative border border-[#E6C06A]/30">
              <div className="w-8 h-8 rounded-full bg-gold-glow text-[#4A3428] font-bold flex items-center justify-center flex-shrink-0 animate-bounce">
                🦅
              </div>
              <p className="italic font-sans text-left text-neutral-300">
                <strong className="text-gold-glow not-italic">{world.companionName} ({dialog.expression}): </strong>
                "Remarkable! We have resolved {majorMilestone.stepNumber} space corridors already. Let's write down this segment."
              </p>
            </div>

            <div>
              <button
                onClick={() => setMajorMilestone(null)}
                className="w-full py-4 bg-[#4A3428] text-gold-glow font-medieval font-extrabold rounded-xl shadow-xl transition-all border border-[#E6C06A] hover:bg-neutral-800 hover:scale-102 cursor-pointer tracking-wider text-xs uppercase"
              >
                📖 INSCRIBE CHAPTER & FACE NEXT ROOM
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Atmospheric Alert Banner */}
      {currentNode.worldEvent && (
        <div className="relative bg-[#E6C06A]/15 border border-[#E6C06A]/50 rounded-xl px-4 py-3 text-xs md:text-sm text-soft-espresso flex items-start gap-2.5 shadow-sm overflow-hidden animate-pulse">
          <div className="absolute top-0 left-0 h-full w-1 bg-gold-glow" />
          <Sparkles className="w-4 h-4 text-gold-glow flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold font-medieval tracking-wide">Atmospheric Shift: </span>
            <span className="italic font-sans">{currentNode.worldEvent}</span>
          </div>
        </div>
      )}

      {/* 2. Primary Narrative Card mimicking a rich Storybook with horizontal page-turn flip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentNodeId}
          initial={{ rotateY: -110, rotateX: 3, transformOrigin: "left center", opacity: 0, scale: 0.94 }}
          animate={{ rotateY: 0, rotateX: 0, transformOrigin: "left center", opacity: 1, scale: 1 }}
          exit={{ rotateY: 110, rotateX: -3, transformOrigin: "right center", opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1] }}
          style={{ perspective: 1500, transformStyle: "preserve-3d" }}
          className="bg-[#F8EAE5] border-2 border-navy/20 rounded-2xl p-6 md:p-8 relative book-shadow overflow-hidden"
        >
          
          {/* Animated Flying Ambient Portal Swirl effect inside active scene */}
          <div className="absolute right-4 top-4 w-16 h-16 rounded-full border-2 border-dashed border-gold-glow/30 animate-spin pointer-events-none opacity-45 flex items-center justify-center">
            <div className="w-9 h-9 rounded-full bg-[radial-gradient(circle_at_center,rgba(230,192,106,0.35),transparent)] animate-pulse" />
          </div>

          {/* Intricate Corner Decorative Accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold-glow/40 rounded-tl-lg pointer-events-none" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold-glow/40 rounded-tr-lg pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold-glow/40 rounded-bl-lg pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold-glow/40 rounded-br-lg pointer-events-none" />

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-navy/10 pb-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[9px] font-mono tracking-widest font-extrabold bg-[#4A3428] text-gold-glow border border-gold-glow/30">
                  🚀 ROOM {activeStory.choicesMade.length + 1} COORDINATES
                </span>
                <h2 className="font-medieval text-2xl md:text-3xl text-soft-espresso tracking-wide font-extrabold leading-tight">
                  {currentNode.title}
                </h2>
              </div>
              
              {/* Live Adventure Progress Track */}
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#678DC6] bg-white/70 px-3 py-1 rounded-xl border border-[#678DC6]/25 font-bold">
                Journey Progress: {Math.min(99, (activeStory.choicesMade.length + 1) * 12)}%
              </div>
            </div>

            <p className="text-soft-espresso/90 text-sm md:text-[15.5px] leading-relaxed font-serif first-letter:text-5xl first-letter:font-medieval first-letter:font-black first-letter:mr-2.5 first-letter:float-left first-letter:text-[#678DC6] italic pt-2">
              {currentNode.description}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 3. Fully Interactive Reactive Companion Advice dialogue balloon */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={dialog.text}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35 }}
          className={`relative flex gap-4 rounded-2xl p-4.5 border transition-all duration-500 shadow-lg ${dialog.style}`}
        >
          {/* Gentle floating companion character avatar with small idle wobble */}
          <div className="flex-shrink-0">
            <motion.div 
              animate={{ y: [0, -5, 0], rotate: [0, 2, -2, 0] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="w-11 h-11 bg-[#4A3428] border-2 border-gold-glow rounded-xl flex items-center justify-center text-2xl select-none shadow-[0_4px_12px_rgba(230,192,106,0.3)] animate-float"
            >
              {dialog.icon}
            </motion.div>
          </div>
          
          <div className="space-y-1">
            <p className="text-[9.5px] uppercase font-mono tracking-widest font-black text-[#4A3428]/60 flex items-center gap-1.5 font-extrabold">
              <Sparkles className="w-3.5 h-3.5 text-gold-glow animate-pulse" />
              {dialog.intro}
            </p>
            <p className="font-medieval italic text-xs md:text-[13.5px] text-soft-espresso leading-relaxed">
              {dialog.text}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 4. Active Feedback Banner */}
      {feedback && (
        <div className={`p-4 rounded-xl border text-xs leading-normal flex items-center gap-2.5 animate-bounce ${
          feedback.success 
            ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
            : "bg-orange-50 text-orange-800 border-orange-200"
        }`}>
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* 5. Choices Selectors Section with active quest mark on index 0 */}
      <div id="choices-section" className="space-y-4">
        <h3 className="text-xs uppercase font-mono tracking-widest text-soft-espresso/50 mb-1 font-bold">
          What action will you perform?
        </h3>
        
        {currentNode.isEnding ? (
          <div className="bg-gradient-to-r from-[#4A3428] to-navy/70 text-white rounded-xl p-6 border-2 border-gold-glow/70 shadow-lg space-y-4 text-center">
            <Star className="w-10 h-10 text-gold-glow mx-auto animate-spin" />
            <div>
              <h4 className="font-medieval text-xl font-bold tracking-wide">
                Threshold of Consolidating Chronicle reached!
              </h4>
              <p className="text-xs text-white/80 max-w-md mx-auto block font-sans mt-1">
                You have reached an ending destination of this branching world path. Press button below to save your achievements in the Archives.
              </p>
            </div>
            <div>
              <Button 
                variant="magic" 
                size="lg" 
                onClick={() => completeAdventure(currentNode.endingId)}
              >
                Pen the Chronicle Page
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {currentNode.choices.map((choice, i) => {
              // Only trigger the active quest helper label for index 0 of a fresh un-interacted room loading
              const matchesFirstFocus = i === 0 && !interacted;
              return (
                <ChoiceCard 
                  key={i} 
                  choice={choice} 
                  isFirstAction={matchesFirstFocus}
                  onSelect={() => handleChoice(choice)} 
                />
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Chronological Story Logs Redesigned: Chronicle Pages */}
      <motion.div 
        id="journal-section" 
        initial={{ scaleX: 0.9, opacity: 0, transformOrigin: "left center" }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="scroll-mt-6 bg-[#FAF6EE] rounded-2xl border-2 border-[#D4AF37]/55 relative overflow-hidden shadow-[0_12px_28px_rgba(74,52,40,0.18)] p-0.5"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(230,192,106,0.11),transparent)] pointer-events-none" />
        
        <div className="bg-[#F3EFE0] px-5 py-3 border-b-2 border-[#D4AF37]/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs uppercase font-medieval tracking-widest text-[#4A3428] font-black">
            <Scroll className="w-4.5 h-4.5 text-[#D4AF37] animate-pulse" />
            <span>Chronicle Pages • Adventure Journal</span>
          </div>
          <span className="text-[10px] font-mono text-[#5A453A]/70 font-bold uppercase tracking-wider bg-[#4A3428]/5 px-2 py-0.5 rounded-md">
            {activeStory.choicesMade.length} Records Inscribed
          </span>
        </div>
        
        {/* Scrollable Parchment Container */}
        <div 
          ref={logContainerRef} 
          className="p-6 max-h-[220px] overflow-y-auto space-y-3.5 text-xs leading-relaxed text-[#4A3428]/95 scrollbar-none relative" 
          style={{ boxShadow: "inset 0 0 24px rgba(74, 52, 40, 0.08)" }}
        >
          {/* Subtle Page center fold/crease line simulation */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-gradient-to-b from-[#4A3428]/15 via-[#4A3428]/5 to-transparent pointer-events-none z-0" />
          
          <AnimatePresence initial={false}>
            {activeStory.log.map((line, index) => {
              let isChoice = line.startsWith("[Choice]");
              let isFail = line.startsWith("[Fallen Attempt]");
              return (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: -12, filter: "blur(2px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className={`py-2 px-1 relative z-10 transition-all ${
                    isChoice 
                      ? "font-bold text-navy border-l-4 border-[#D4AF37] pl-4 italic bg-[#D4AF37]/5 rounded-r-lg" 
                      : isFail 
                        ? "text-red-900 border-l-4 border-red-500 pl-4 bg-red-500/5 rounded-r-lg font-semibold"
                        : "text-[#4A3428] pl-4 font-serif text-[13px] italic border-l-2 border-[#4A3428]/25"
                  }`}
                >
                  {/* Subtle Ink Bleed Dot */}
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 -ml-[2px] w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping opacity-25" />
                  {line}
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={logEndRef} />
        </div>
      </motion.div>

    </div>
  );
};
export default AdventurePanel;
