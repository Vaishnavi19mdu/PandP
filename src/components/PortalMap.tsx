import React, { useRef, useState, useEffect } from "react";
import { useStory } from "../context/StoryContext";
import { Sparkles, MapPin, Eye, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

export const PortalMap: React.FC = () => {
  const { activeStory } = useStory();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Drag-to-pan state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  if (!activeStory) return null;

  const { graph, currentNodeId, world } = activeStory;

  // Find all active connections so we can draw lines
  const lines: { x1: number; y1: number; x2: number; y2: number; active: boolean; isPath: boolean }[] = [];

  graph.forEach((node) => {
    node.choices.forEach((choice) => {
      const targetNode = graph.find((n) => n.id === choice.nextNodeId);
      if (targetNode) {
        const isSelectedPath = activeStory.log.some(line => line.includes(choice.logText));
        
        lines.push({
          x1: node.x,
          y1: node.y,
          x2: targetNode.x,
          y2: targetNode.y,
          active: currentNodeId === node.id || currentNodeId === targetNode.id,
          isPath: isSelectedPath
        });
      }
    });
  });

  // Calculate and update scroll bounds
  const checkScrollLimits = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollLimits);
      // Wait a short delay to let layout render and calculate scroll dimensions correctly
      const timer = setTimeout(checkScrollLimits, 150);
      window.addEventListener("resize", checkScrollLimits);

      return () => {
        container.removeEventListener("scroll", checkScrollLimits);
        window.removeEventListener("resize", checkScrollLimits);
        clearTimeout(timer);
      };
    }
  }, [graph, currentNodeId]);

  // Drag handles
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeftState(containerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // multiplier for drag sensitivity
    containerRef.current.scrollLeft = scrollLeftState - walk;
  };

  // Scroll functions for indicator arrows
  const scrollByAmount = (amount: number) => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      left: containerRef.current.scrollLeft + amount,
      behavior: "smooth"
    });
  };

  return (
    <div className="relative w-full bg-gradient-to-b from-[#4A3428] via-[#42301f] to-[#3a2a1c] overflow-visible rounded-2xl border-2 border-gold-glow/50 p-8 md:p-10 pb-16 md:pb-20 shadow-2xl">
      {/* Bottom bleed: fades the brown card edge outward so it doesn't end on a hard line */}
      <div className="absolute -bottom-8 left-4 right-4 h-16 bg-gradient-to-b from-[#3a2a1c]/60 to-transparent blur-xl pointer-events-none rounded-full" />
      <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Visual Decorative Grid Backdrop */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-color-dodge">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="astrolabeGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E6C06A" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#astrolabeGrid)" />
        </svg>
      </div>

      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gold-glow/20 pb-6 mb-8 gap-3 relative z-10">
        <div>
          <span className="font-medieval text-md tracking-wider text-gold-glow flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold-glow animate-pulse" />
            Portal Chart • {world.name}
          </span>
          <p className="text-[10px] font-mono text-white/50 tracking-wide">
            Drag to explore • Paths align with decision timelines
          </p>
        </div>
        
        {/* Legends */}
        <div className="flex items-center gap-5 text-[10px] font-mono text-[#F4F1EC]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gold-glow animate-ping" />
            <span>Presence</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-gold-glow animate-pulse" style={{ strokeWidth: 3 }} />
            <span>Path</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E9DFD2]/30" />
            <span>Uncharted</span>
          </div>
        </div>
      </div>

      {/* Map Interactive Arena Container with fading scroll boundaries and drag to pan indicators */}
      <div className="relative rounded-xl border border-[#FAF0ED]/15 overflow-hidden">
        
        {/* Left Fade Edge Indicator */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#4A3428] via-[#4A3428]/50 to-transparent pointer-events-none z-20 flex items-center justify-start pl-2">
            <button 
              onClick={() => scrollByAmount(-250)}
              className="bg-gold-glow/85 hover:bg-gold-glow text-[#4A3428] p-1.5 rounded-full shadow-lg pointer-events-auto cursor-pointer animate-pulse transition-transform active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* Right Fade Edge Indicator */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#4A3428] via-[#4A3428]/50 to-transparent pointer-events-none z-20 flex items-center justify-end pr-2">
            <button 
              onClick={() => scrollByAmount(250)}
              className="bg-gold-glow/85 hover:bg-gold-glow text-[#4A3428] p-1.5 rounded-full shadow-lg pointer-events-auto cursor-pointer animate-pulse transition-transform active:scale-95"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* The Map Arena */}
        <div 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`relative min-h-[340px] bg-[#35251c] p-8 overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-none select-none cursor-grab active:cursor-grabbing`}
          style={{ overscrollBehaviorX: "contain" }}
        >
          {/* SVG Drawing Layer */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none" 
            style={{ minWidth: "750px", minHeight: "260px" }}
          >
            {/* Connection Lines with glowing animation */}
            {lines.map((line, idx) => (
              <line
                key={idx}
                x1={`${line.x1}%`}
                y1={`${line.y1}%`}
                x2={`${line.x2}%`}
                y2={`${line.y2}%`}
                stroke={line.isPath ? "#E6C06A" : line.active ? "rgba(230, 192, 106, 0.45)" : "rgba(233, 223, 210, 0.1)"}
                strokeWidth={line.isPath ? "3" : "1.5"}
                strokeDasharray={line.isPath ? "none" : "3 3"}
                className={`transition-all duration-300 ${line.isPath ? "animate-pulse" : ""}`}
              />
            ))}
          </svg>

          {/* Nodes Layer */}
          <div className="absolute inset-0 w-full h-full" style={{ minWidth: "750px", minHeight: "260px" }}>
            {graph.map((node) => {
              const isCurrent = node.id === currentNodeId;
              const hasVisited = isCurrent || activeStory.choicesMade.some(c => c.sceneTitle === node.title) || activeStory.log.some(l => l.includes(node.title));
              const isEnding = !!node.isEnding;

              return (
                <div
                  key={node.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-all duration-300 z-10"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  {/* Visual node anchor */}
                  <div 
                    className={`flex items-center justify-center rounded-full transition-all duration-300 ${
                      isCurrent 
                        ? "w-10 h-10 bg-gold-glow text-[#4A3428] ring-4 ring-gold-glow/40 scale-110 shadow-lg glow-pulse"
                        : hasVisited
                          ? "w-8 h-8 bg-gold-glow/20 border-2 border-gold-glow text-gold-glow shadow hover:bg-gold-glow/30"
                          : "w-6 h-6 bg-[#3a291f] border border-white/10 text-white/40 hover:bg-[#4d3629]"
                    }`}
                    title={node.title}
                  >
                    {isCurrent ? (
                      <MapPin className="w-5 h-5 text-soft-espresso animate-bounce stroke-[2.5]" />
                    ) : hasVisited ? (
                      <CheckCircle2 className="w-4 h-4 text-gold-glow" />
                    ) : isEnding ? (
                      <Eye className="w-3.5 h-3.5 text-red-300 animate-pulse" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    )}
                  </div>

                  {/* Node Label Card */}
                  <div className={`mt-2 bg-[#F8EAE5] px-2.5 py-1.5 rounded-xl shadow-lg border-2 transition-all whitespace-nowrap overflow-hidden text-ellipsis ${
                    isCurrent ? "scale-105 border-gold-glow/80 bg-white shadow-[0_4px_12px_rgba(230,192,106,0.3)]" : "scale-95 border-transparent opacity-80"
                  }`}>
                    <p className="text-[9.5px] font-extrabold text-soft-espresso font-medieval leading-tight">
                      {node.title}
                    </p>
                    <p className="text-[7px] font-mono text-[#678DC6] uppercase tracking-wider font-extrabold">
                      {isEnding ? "🌌 Ending" : "📍 Chapter"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Helpful Hint */}
      <div className="mt-6 text-center text-[10px] text-white/50 italic font-sans">
        "Drag left or right to inspect alternate dimensions. Uncover alternate ending branches to achieve full completion."
      </div>
    </div>
  );
};

export default PortalMap;