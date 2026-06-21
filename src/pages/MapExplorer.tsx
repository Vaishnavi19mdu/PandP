import React, { useState, useRef, useEffect } from "react";
import { useStory } from "../context/StoryContext";
import { 
  Compass, ZoomIn, ZoomOut, Maximize2, MapPin, Search, Sparkles, 
  BookOpen, HelpCircle, Navigation, Info, ArrowRight, ShieldAlert, Loader2
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue } from "motion/react";
import Button from "../components/Button";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

interface GeneratedLore {
  history: string;
  rumor: string;
  dangerRating: "Safe" | "Moderate" | "Perilous" | "Forbidden";
  hiddenSecret: string;
  notableFeature: string;
}

interface LandmarkNode {
  id: string;
  name: string;
  category: string;
  x: number;
  y: number;
  unlocked: boolean;
  lore: string;
  kingdom: string;
  color: string;
  glowColor: string;
  bgImage: string;
}

export const MapExplorer: React.FC = () => {
  const { archives, setPage, unlockedLoreIds, incrementQuestProgress, currentUser } = useStory();
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedLandmark, setSelectedLandmark] = useState<LandmarkNode | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const isDragging = useRef<boolean>(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Groq AI lore state
  const [groqLore, setGroqLore] = useState<GeneratedLore | null>(null);
  const [groqLoading, setGroqLoading] = useState(false);
  const [groqError, setGroqError] = useState<string | null>(null);
  const loreCache = useRef<Record<string, GeneratedLore>>({});
  
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Trigger daily quest when exploring
  useEffect(() => {
    incrementQuestProgress("read_lore");
  }, []);

  // ── Groq AI lore generator ────────────────────────────────────────────────
  const generateLore = async (landmark: LandmarkNode, force = false) => {
    // Return cached result unless forcing regenerate
    if (!force && loreCache.current[landmark.id]) {
      setGroqLore(loreCache.current[landmark.id]);
      return;
    }

    setGroqLoading(true);
    setGroqError(null);
    setGroqLore(null);

    const systemPrompt = `You are Pages & Portals, a fantasy world lore scribe.
Generate rich landmark lore in JSON only. No preamble, no markdown, no code fences.

Return this exact JSON shape and nothing else:
{
  "history": "",
  "rumor": "",
  "dangerRating": "Safe" | "Moderate" | "Perilous" | "Forbidden",
  "hiddenSecret": "",
  "notableFeature": ""
}

Rules:
- history: 2-3 sentences of deep lore about the location's origin and purpose.
- rumor: A short traveler's whisper or local legend about this place (1-2 sentences, mysterious tone).
- dangerRating: One of exactly: Safe, Moderate, Perilous, Forbidden.
- hiddenSecret: A secret fact only seasoned explorers would know (1-2 sentences, intriguing).
- notableFeature: The single most visually striking or unique feature of this location (short phrase, under 10 words).`;

    const userMessage = `Landmark: ${landmark.name}
Category: ${landmark.category}
Kingdom: ${landmark.kingdom}
Adventurer: ${currentUser?.persona?.name ?? "Traveler"} (${totalRunCompleted} completed runs)
Base lore hint: ${landmark.lore}

Generate immersive expanded lore for this location.`;

    try {
      const response = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          temperature: 0.9,
          max_tokens: 500,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Groq API error ${response.status}: ${err}`);
      }

      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content ?? "";
      const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

      let lore: GeneratedLore;
      try {
        lore = JSON.parse(cleaned);
      } catch (e) {
        throw new Error(`Invalid JSON from Groq: ${cleaned.slice(0, 150)}`);
      }

      loreCache.current[landmark.id] = lore;
      setGroqLore(lore);
    } catch (err: any) {
      setGroqError(err?.message ?? "Lore generation failed. Try again.");
    } finally {
      setGroqLoading(false);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

  const totalRunCompleted = archives.length;

  // Landmarks dictionary
  const landmarkNodes: LandmarkNode[] = [
    {
      id: "map-rowan",
      name: "The Great Woodland",
      category: "Ancient Grove",
      x: 150,
      y: 120,
      unlocked: true,
      lore: "A deep expanse of ancient woodland overflowing with raw temporal bark. It acts as the gateway sector for rookie portal seekers starting their path.",
      kingdom: "Sylvan Guild",
      color: "#2E7D32",
      glowColor: "rgba(46,125,50,0.5)",
      bgImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&q=70"
    },
    {
      id: "map-scriptorium",
      name: "The Scriptorium Vaults",
      category: "Sacred Archives",
      x: 380,
      y: 180,
      unlocked: true,
      lore: "The central headquarters of the chronicle keepers. Inside this heavy stone fortress, ink writes history onto living paper maps in real-time.",
      kingdom: "Scriptorium Gentry",
      color: "#D4AF37",
      glowColor: "rgba(212,175,55,0.5)",
      bgImage: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=900&q=70"
    },
    {
      id: "map-chronos",
      name: "The Chronos Breach",
      category: "Temporal Fault Line",
      x: 280,
      y: 350,
      unlocked: true,
      lore: "A high-frequency rift where reality bends back on itself. Traveling here requires a stable Portal Anchor unless you want to get lost in old coordinates.",
      kingdom: "The Anomaly Abyss",
      color: "#7E57C2",
      glowColor: "rgba(126,87,194,0.5)",
      bgImage: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=900&q=70"
    },
    {
      id: "map-astral",
      name: "Aria's Observatory",
      category: "Cosmic Spire",
      x: 580,
      y: 140,
      unlocked: totalRunCompleted >= 1,
      lore: "A glittering sky tower crafted from pure star-glass. Its heavy lens projects coordinates straight on celestial winds for fast ether-stepping.",
      kingdom: "Evermist Empire",
      color: "#29B6F6",
      glowColor: "rgba(41,182,246,0.5)",
      bgImage: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=900&q=70"
    },
    {
      id: "map-ember",
      name: "The Ember Sanctum",
      category: "Volcanic Rift Core",
      x: 490,
      y: 400,
      unlocked: totalRunCompleted >= 2,
      lore: "A high-entropy zone designed to synthesize portal heat filters. Deep lava canals flow with celestial plasma essence.",
      kingdom: "Pyre Realms",
      color: "#FF7043",
      glowColor: "rgba(255,112,67,0.5)",
      bgImage: "https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=900&q=70"
    },
    {
      id: "map-void",
      name: "The Outer Uncharted Rim",
      category: "Forbidden Core Node",
      x: 750,
      y: 310,
      unlocked: totalRunCompleted >= 3,
      lore: "The absolute coordinates of the raw Scriptorium matrix. This sector is heavily guarded and requires the legendary master portal keys.",
      kingdom: "The Grand Void",
      color: "#AB47BC",
      glowColor: "rgba(171,71,188,0.5)",
      bgImage: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=900&q=70"
    }
  ];

  // Drag Panning Event Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  // Zoom helpers
  const handleZoomIn = () => setZoom(z => Math.min(2.5, z + 0.25));
  const handleZoomOut = () => setZoom(z => Math.max(0.5, z - 0.25));
  const handleResetMap = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Quick jump jump coordinates
  const jumpToLandmark = (node: LandmarkNode) => {
    if (!node.unlocked) return;
    setSelectedLandmark(node);
    generateLore(node);
    
    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      const targetX = rect.width / 2 - node.x * zoom;
      const targetY = rect.height / 2 - node.y * zoom;
      setPan({ x: targetX, y: targetY });
    }
  };

  // Filters landmarks list by search criteria
  const searchedNodes = landmarkNodes.filter(node => {
    const query = searchQuery.toLowerCase();
    return node.unlocked && (
      node.name.toLowerCase().includes(query) || 
      node.kingdom.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 relative text-[#4A3428]">
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 text-center md:text-left">
          <span className="font-mono text-[9px] tracking-widest uppercase bg-[#D4AF37]/20 text-[#678DC6] border border-[#D4AF37]/30 px-3 py-1 rounded-full font-bold">
            Interactive Realm Navigation
          </span>
          <h1 className="font-medieval text-3xl md:text-5xl font-black text-[#4A3428] tracking-wide drop-shadow-sm">
            Scriptorium Portal Map
          </h1>
          <p className="text-sm font-serif italic text-[#4A3428]/70 max-w-xl mx-auto leading-relaxed">
            "Weave coordinate lines of unlocked dimensional kingdom boundaries and observe active placement anomalies."
          </p>
        </div>

        {/* Home navigation & Quick stats */}
        <div className="flex flex-wrap gap-2 justify-center shrink-0">
          <Button
            onClick={() => setPage("Landing")}
            variant="secondary"
            size="sm"
          >
            ← Return Scriptorium
          </Button>

          <Button
            onClick={() => setPage("Chronicle")}
            variant="accent"
            size="sm"
            className="border-2 border-[#C5A880]/30 text-gold-glow hover:brightness-110 font-medieval font-black text-xs"
          >
            📖 World Lore Codex
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar Controls Panel (1 column) */}
        <div className="space-y-6 lg:col-span-1 bg-[#1C0F0A]/95 p-5 rounded-3xl border-2 border-[#C5A880]/40 shadow-2xl">
          <div className="space-y-4">
            <h2 className="font-medieval text-lg text-gold-glow font-bold border-b border-[#C5A880]/20 pb-2">
              🗺️ Map Coordinates Scribe
            </h2>
            
            {/* Search Landmark */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search coordinates..."
                className="w-full py-2 pl-9 pr-4 rounded-xl bg-black/40 text-[#F4F1EC] border border-[#C5A880]/30 placeholder-[#E9DFD2]/40 text-xs focus:outline-none focus:border-gold-glow font-sans"
              />
              <Search className="w-3.5 h-3.5 text-[#C5A880] absolute left-3 top-3" />
            </div>

            {/* Quick Jumps Directory */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A880]/70 block">
                Jump to Realms:
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {searchedNodes.map((node) => {
                  return (
                    <button
                      key={node.id}
                      onClick={() => jumpToLandmark(node)}
                      className="w-full p-2 rounded-xl text-left text-xs bg-black/20 hover:bg-black/50 border border-[#C5A880]/10 hover:border-[#C5A880]/40 transition-all flex items-center justify-between text-[#E9DFD2] cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2.5 h-2.5 rounded-full shrink-0 animate-ping-slow"
                          style={{ backgroundColor: node.color }}
                        />
                        <div>
                          <span className="font-medieval font-bold block">{node.name}</span>
                          <span className="text-[9px] font-mono text-[#E9DFD2]/50 block">{node.kingdom}</span>
                        </div>
                      </div>
                      <Navigation className="w-3 h-3 text-gold-glow" />
                    </button>
                  );
                })}

                {searchedNodes.length === 0 && (
                  <p className="text-[11px] italic font-serif text-stone-500 py-4 text-center">
                    No active landmarks match query coordinates.
                  </p>
                )}
              </div>
            </div>

            {/* Instructions Help Card */}
            <div className="p-4 rounded-2xl bg-black/30 border border-[#C5A880]/15 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-[#C5A880] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                Navigation Grids
              </span>
              <p className="text-[11px] font-sans text-[#E9DFD2]/70 leading-relaxed">
                Click and drag directly on the map surface to pan. Use mousewheel or zoom controls in the corner to resize the parchment dimensions.
              </p>
              <div className="pt-1.5 border-t border-[#C5A880]/10 flex justify-between items-center text-[9px] font-mono text-[#E9DFD2]/40">
                <span>Archives Complete:</span>
                <span className="text-gold-glow font-bold">{totalRunCompleted} Runs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Map Parchment Area (3 columns) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative rounded-3xl border-4 border-[#C5A880] bg-[#FAF5EC] h-[480px] w-full overflow-hidden shadow-2xl relative select-none">
            
            {/* Ink drawing effect overlays */}
            <div className="absolute inset-0 bg-[#E8DEC9]/15 pointer-events-none mix-blend-multiply" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0),rgba(0,0,0,0.1))] pointer-events-none" />

            {/* In-Map Control Bar */}
            <div className="absolute top-4 left-4 z-20 flex gap-1.5 items-center bg-[#2D1B12]/90 border border-[#C5A880]/30 p-1.5 rounded-xl text-[#F4F1EC]">
              <button 
                onClick={handleZoomIn}
                className="p-1 px-1.5 bg-black/20 hover:bg-[#C5A880] hover:text-[#2D1B12] rounded transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button 
                onClick={handleZoomOut}
                className="p-1 px-1.5 bg-black/20 hover:bg-[#C5A880] hover:text-[#2D1B12] rounded transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button 
                onClick={handleResetMap}
                className="p-1 px-1.5 bg-black/20 hover:bg-[#C5A880] hover:text-[#2D1B12] rounded transition-colors cursor-pointer"
                title="Reset Fit"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <span className="text-[10px] px-1 bg-[#C5A880]/20 rounded font-mono font-bold">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* Draggable Active Map Component */}
            <div
              ref={mapContainerRef}
              className="absolute inset-0 cursor-grab active:cursor-grabbing overflow-hidden outline-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
            >
              <div 
                className="absolute origin-top-left transition-transform duration-75"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  width: "1000px",
                  height: "600px"
                }}
              >
                {/* SVG Route lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: "1000px", minHeight: "600px" }}>
                  <defs>
                    <linearGradient id="vector-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#C5A880" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#E6C06A" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>

                  {/* Draw connection pathways between unlocked adjacent zones */}
                  {landmarkNodes[0].unlocked && landmarkNodes[1].unlocked && (
                    <line 
                      x1={landmarkNodes[0].x} y1={landmarkNodes[0].y} 
                      x2={landmarkNodes[1].x} y2={landmarkNodes[1].y} 
                      stroke="url(#vector-grad)" strokeWidth="3" strokeDasharray="5,5" 
                    />
                  )}
                  {landmarkNodes[0].unlocked && landmarkNodes[2].unlocked && (
                    <line 
                      x1={landmarkNodes[0].x} y1={landmarkNodes[0].y} 
                      x2={landmarkNodes[2].x} y2={landmarkNodes[2].y} 
                      stroke="url(#vector-grad)" strokeWidth="3" strokeDasharray="5,5" 
                    />
                  )}
                  {landmarkNodes[1].unlocked && landmarkNodes[2].unlocked && (
                    <line 
                      x1={landmarkNodes[1].x} y1={landmarkNodes[1].y} 
                      x2={landmarkNodes[2].x} y2={landmarkNodes[2].y} 
                      stroke="#C5A880" strokeWidth="2" strokeOpacity="0.5" 
                    />
                  )}
                  {landmarkNodes[1].unlocked && landmarkNodes[3].unlocked && (
                    <line 
                      x1={landmarkNodes[1].x} y1={landmarkNodes[1].y} 
                      x2={landmarkNodes[3].x} y2={landmarkNodes[3].y} 
                      stroke="url(#vector-grad)" strokeWidth="3" strokeDasharray="5,5" 
                    />
                  )}
                  {landmarkNodes[2].unlocked && landmarkNodes[4].unlocked && (
                    <line 
                      x1={landmarkNodes[2].x} y1={landmarkNodes[2].y} 
                      x2={landmarkNodes[4].x} y2={landmarkNodes[4].y} 
                      stroke="url(#vector-grad)" strokeWidth="3" strokeDasharray="5,5" 
                    />
                  )}
                  {landmarkNodes[4].unlocked && landmarkNodes[5].unlocked && (
                    <line 
                      x1={landmarkNodes[4].x} y1={landmarkNodes[4].y} 
                      x2={landmarkNodes[5].x} y2={landmarkNodes[5].y} 
                      stroke="url(#vector-grad)" strokeWidth="3" strokeDasharray="5,5" 
                    />
                  )}
                </svg>

                {/* Render interactive coordinate pins */}
                {landmarkNodes.map((landmark) => {
                  const isSelected = selectedLandmark?.id === landmark.id;
                  
                  return (
                    <div
                      key={landmark.id}
                      className="absolute z-10 -translate-x-1/2 -translate-y-1/2 select-none group"
                      style={{ left: `${landmark.x}px`, top: `${landmark.y}px` }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (landmark.unlocked) {
                          setSelectedLandmark(landmark);
                          generateLore(landmark);
                        }
                      }}
                    >
                      {/* Interactive Pin Circle and Glowing rings */}
                      <div className="relative cursor-pointer">
                        {landmark.unlocked ? (
                          <>
                            {/* Glowing active outer ring */}
                            <div 
                              className="absolute -inset-2.5 rounded-full opacity-40 blur-sm scale-110 group-hover:scale-135 transition-transform duration-300"
                              style={{ backgroundColor: landmark.color }}
                            />
                            {/* Ping oscillator pulse */}
                            <div 
                              className="absolute inset-0 rounded-full animate-ping opacity-25"
                              style={{ backgroundColor: landmark.color }}
                            />
                            {/* Real pin */}
                            <div 
                              className="relative w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black z-10 shadow-lg"
                              style={{ 
                                backgroundColor: landmark.color,
                                boxShadow: `0 0 10px ${landmark.color}`
                              }}
                            >
                              ✨
                            </div>
                          </>
                        ) : (
                          <div className="relative w-5 h-5 rounded-full bg-stone-400 border-2 border-stone-500 flex items-center justify-center text-[9px] z-10 shadow-md">
                            🔒
                          </div>
                        )}

                        {/* Hover Name Badge Label */}
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-[#2D1B12] text-[#F4F1EC] border border-[#C5A880]/30 p-1.5 rounded-lg text-[10px] font-medieval font-bold shadow-lg whitespace-nowrap cursor-pointer opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all">
                          {landmark.unlocked ? landmark.name : "??? [Mystery Portal Location]"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Minimap Widget (placed inside bottom left corner of parchment map) */}
            <div className="absolute bottom-4 right-4 z-20 w-36 h-28 bg-[#1B0F0A]/95 p-2 rounded-xl border-2 border-[#C5A880]/40 shadow-xl pointer-events-none">
              <span className="text-[8px] font-mono tracking-widest text-[#C5A880]/70 uppercase block pb-1 border-b border-[#C5A880]/15">
                ✦ Minimap Radar
              </span>
              <div className="relative w-full h-20 bg-black/40 rounded overflow-hidden mt-1">
                
                {/* Scaled simplified landmark dots, positioned by percentage so they stay centered and proportional within the radar box regardless of its size */}
                {landmarkNodes.map((landmark) => (
                  <div
                    key={landmark.id}
                    className="absolute w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${8 + (landmark.x / 1000) * 84}%`,
                      top: `${10 + (landmark.y / 600) * 80}%`,
                      backgroundColor: landmark.unlocked ? landmark.color : "#555",
                      boxShadow: landmark.unlocked ? `0 0 4px ${landmark.color}` : "none"
                    }}
                  />
                ))}

                {/* Simulated radar pulse */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#C5A880]/5 to-[#C5A880]/10 animate-pulse pointer-events-none" />
              </div>
            </div>
          </div>

          {/* AI-Powered Lore Detail Panel */}
          <AnimatePresence mode="wait">
          {selectedLandmark && (
            <motion.div
              key={selectedLandmark.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="relative rounded-3xl border-2 border-[#C5A880]/40 shadow-2xl overflow-hidden"
            >
              {/* Scenic background */}
              <div
                className="absolute inset-0 bg-cover bg-center scale-105 transition-all duration-700"
                style={{ backgroundImage: `url(${selectedLandmark.bgImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#150B06] via-[#150B06]/90 to-[#150B06]/55" />
              <div
                className="absolute inset-0 opacity-25 mix-blend-overlay"
                style={{ background: `radial-gradient(circle at 30% 20%, ${selectedLandmark.color}, transparent 60%)` }}
              />
              <div
                className="absolute top-0 left-0 right-0 h-1.5 z-10"
                style={{ backgroundColor: selectedLandmark.color }}
              />

              <div className="relative z-10 p-5 md:p-6 pt-6 space-y-4">
                {/* Header row */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-amber-300 px-2 py-0.5 rounded bg-black/50 border border-[#C5A880]/25">
                        {selectedLandmark.kingdom}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">
                        {selectedLandmark.category}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500">
                        ({selectedLandmark.x}N, {selectedLandmark.y}W)
                      </span>
                    </div>
                    <h3 className="font-medieval text-xl font-extrabold text-[#F4F1EC] drop-shadow-md">
                      {selectedLandmark.name}
                    </h3>
                  </div>
                  <Button
                    onClick={() => { setSelectedLandmark(null); setGroqLore(null); }}
                    variant="secondary"
                    size="sm"
                    className="shrink-0"
                  >
                    Close Portal
                  </Button>
                </div>

                {/* AI Lore Body */}
                {groqLoading ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-8">
                    <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
                    <p className="font-medieval text-[#E6C06A] text-xs tracking-widest uppercase animate-pulse">
                      Scrying the ancient records...
                    </p>
                  </div>
                ) : groqError ? (
                  <div className="space-y-3 py-4">
                    <p className="text-red-400 text-xs font-mono">⛔ {groqError}</p>
                    {/* Fallback to static lore */}
                    <p className="text-xs text-[#F4F1EC]/80 font-sans leading-relaxed italic">
                      {selectedLandmark.lore}
                    </p>
                    <button
                      onClick={() => generateLore(selectedLandmark, true)}
                      className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#E6C06A]/60 hover:text-[#E6C06A] transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" /> Retry Scrying
                    </button>
                  </div>
                ) : groqLore ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                    {/* History */}
                    <div className="col-span-full p-4 bg-black/40 rounded-2xl border border-[#C5A880]/15 space-y-1">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> Ancient History
                      </span>
                      <p className="text-xs text-[#F4F1EC]/90 font-sans leading-relaxed">
                        {groqLore.history}
                      </p>
                    </div>

                    {/* Notable Feature + Danger Rating */}
                    <div className="p-3.5 bg-black/30 rounded-2xl border border-[#C5A880]/10 space-y-1">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#678DC6] font-bold flex items-center gap-1">
                        <Compass className="w-3 h-3" /> Notable Feature
                      </span>
                      <p className="text-xs text-[#F4F1EC]/85 font-serif italic leading-snug">
                        "{groqLore.notableFeature}"
                      </p>
                    </div>

                    <div className="p-3.5 bg-black/30 rounded-2xl border border-[#C5A880]/10 space-y-1">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#C5A880] font-bold flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> Danger Rating
                      </span>
                      <span className={`text-sm font-medieval font-black ${
                        groqLore.dangerRating === "Safe" ? "text-green-400" :
                        groqLore.dangerRating === "Moderate" ? "text-yellow-400" :
                        groqLore.dangerRating === "Perilous" ? "text-orange-400" :
                        "text-red-500"
                      }`}>
                        {groqLore.dangerRating === "Safe" ? "🟢" : groqLore.dangerRating === "Moderate" ? "🟡" : groqLore.dangerRating === "Perilous" ? "🟠" : "🔴"} {groqLore.dangerRating}
                      </span>
                    </div>

                    {/* Traveler's Rumor */}
                    <div className="p-3.5 bg-black/30 rounded-2xl border border-[#C5A880]/10 space-y-1">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1">
                        💬 Traveler's Rumor
                      </span>
                      <p className="text-xs text-[#F4F1EC]/80 font-serif italic leading-snug">
                        "{groqLore.rumor}"
                      </p>
                    </div>

                    {/* Hidden Secret — only shown if player has runs */}
                    <div className={`p-3.5 rounded-2xl border space-y-1 ${
                      totalRunCompleted >= 1
                        ? "bg-[#2A1A0E]/60 border-[#D4AF37]/30"
                        : "bg-black/20 border-[#C5A880]/10 opacity-50"
                    }`}>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold flex items-center gap-1">
                        🔮 Hidden Secret {totalRunCompleted < 1 && <span className="text-stone-500 normal-case">(complete a run to unlock)</span>}
                      </span>
                      {totalRunCompleted >= 1 ? (
                        <p className="text-xs text-[#E6C06A]/90 font-serif italic leading-snug">
                          "{groqLore.hiddenSecret}"
                        </p>
                      ) : (
                        <p className="text-xs text-stone-600 font-mono">??? ??? ???</p>
                      )}
                    </div>

                    {/* Regenerate */}
                    <div className="col-span-full flex justify-end pt-1 border-t border-white/5">
                      <button
                        onClick={() => generateLore(selectedLandmark, true)}
                        disabled={groqLoading}
                        className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#E6C06A]/50 hover:text-[#E6C06A] transition-colors cursor-pointer disabled:opacity-30"
                      >
                        <Sparkles className="w-3 h-3" /> Re-scry This Location
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};

export default MapExplorer;