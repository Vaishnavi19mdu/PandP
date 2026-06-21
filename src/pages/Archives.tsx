import React, { useState } from "react";
import { useStory } from "../context/StoryContext";
import { Archive, Trash2, Library, Award, FileText, ChevronRight, HelpCircle, FlameKindling, Info } from "lucide-react";
import Button from "../components/Button";
import Modal from "../components/Modal";

export const Archives: React.FC = () => {
  const { archives, clearArchives, setPage, startAdventure, worldSeedsList } = useStory();
  const [filterGenre, setFilterGenre] = useState<string>("All");
  const [clearModalOpen, setClearModalOpen] = useState(false);

  // Filter archives by genre
  const filtered = filterGenre === "All" 
    ? archives 
    : archives.filter(item => item.genre === filterGenre);

  // Compute stats
  const totalChronicles = archives.length;
  const maxScore = archives.reduce((max, cur) => cur.score > max ? cur.score : max, 0);
  const totalCustomRealms = archives.filter(a => a.isCustom).length;

  const genres = ["All", "Fantasy", "Mystery", "Sci-Fi", "Adventure", "Educational"];

  const handleClear = () => {
    clearArchives();
    setClearModalOpen(false);
  };

  const handleReplayHandcrafted = (worldId: string) => {
    const found = worldSeedsList.find(w => w.id === worldId);
    if (found) {
      startAdventure(found);
    } else {
      // Direct back to Open Portal for custom or default
      setPage("CreatePortal");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      
      {/* 1. Header titles */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-navy/15 pb-4">
        <div className="space-y-1">
          <h1 className="font-medieval text-3xl md:text-5xl font-black text-soft-espresso tracking-wide flex items-center gap-2">
            <Library className="w-9 h-9 text-navy" />
            The Scriptorium Archives
          </h1>
          <p className="text-xs text-soft-espresso/60 font-sans">
            Review completed adventure runs, compiled chronicles, unlocked rewards, and historical scribe scores.
          </p>
        </div>

        {archives.length > 0 && (
          <Button
            variant="secondary"
            onClick={() => setClearModalOpen(true)}
            className="text-xs py-2 px-3 border border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-1 font-bold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Vaporize Vault logs
          </Button>
        )}
      </div>

      {/* 2. Top Cumulative Stat Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-[#FAF0ED] p-5 rounded-2xl border border-navy/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center text-navy shadow-sm">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase text-[#678DC6] leading-none">Chronicles Logged</p>
            <h3 className="font-medieval text-2xl font-bold text-soft-espresso mt-1">{totalChronicles} Stories</h3>
          </div>
        </div>

        <div className="bg-[#FAF0ED] p-5 rounded-2xl border border-navy/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gold-glow/20 flex items-center justify-center text-gold-glow shadow-sm">
            <Award className="w-6 h-6 text-gold-glow animate-pulse-gold" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase text-[#678DC6] leading-none">Highest Recorded XP</p>
            <h3 className="font-medieval text-2xl font-bold text-soft-espresso mt-1">{maxScore} pts</h3>
          </div>
        </div>

        <div className="bg-[#FAF0ED] p-5 rounded-2xl border border-navy/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 shadow-sm">
            <FlameKindling className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase text-[#678DC6] leading-none">Custom Realms Manifested</p>
            <h3 className="font-medieval text-2xl font-bold text-soft-espresso mt-1">{totalCustomRealms} Sectors</h3>
          </div>
        </div>

      </div>

      {/* 3. Genre Filtering Tab Layout */}
      <div className="flex flex-wrap items-center gap-2 border-b border-navy/10 pb-3">
        {genres.map((g) => {
          const isActive = filterGenre === g;
          return (
            <button
              key={g}
              onClick={() => setFilterGenre(g)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                isActive 
                  ? "bg-[#4A3428] text-white font-medieval shadow-sm" 
                  : "bg-[#E9DFD2]/60 text-soft-espresso hover:bg-[#E9DFD2]"
              }`}
            >
              {g}
            </button>
          );
        })}
      </div>

      {/* 4. Bookshelf list columns */}
      {filtered.length === 0 ? (
        <div className="bg-[#FAF0ED] border border-navy/15 rounded-2xl p-12 text-center text-soft-espresso/60 space-y-4 max-w-xl mx-auto">
          <Library className="w-12 h-12 mx-auto text-[#cbd5e1] opacity-65 animate-bounce" />
          <div className="space-y-1">
            <p className="font-medieval text-base font-bold text-soft-espresso/80">The Scriptorium lies empty.</p>
            <p className="text-xs font-sans">No completed archives found in local memory caches match this category.</p>
          </div>
          <div className="pt-2">
            <Button variant="magic" onClick={() => setPage("CreatePortal")}>
              Manifest Your First World Portal
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <div 
              key={item.id}
              className="bg-[#F8EAE5] border border-navy/25 rounded-2xl p-5 md:p-6 shadow-md relative book-shadow overflow-hidden group flex flex-col justify-between"
            >
              {/* Top Details bar */}
              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-[10px] font-mono text-soft-espresso/60">
                  <span className="bg-[#E9DFD2] font-semibold text-soft-espresso px-2 py-0.5 rounded border border-[#cbd5e1]/10 uppercase">
                    🔑 {item.genre}
                  </span>
                  <span>{item.createdDate}</span>
                </div>

                {/* World Title & Sub */}
                <div>
                  <h3 className="font-medieval text-lg md:text-xl text-soft-espresso group-hover:text-navy font-bold leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[11px] font-semibold text-navy/80 mt-1 uppercase font-mono">
                    Unlocked Ending: {item.endingUnlocked}
                  </p>
                </div>

                {/* Score bar */}
                <div className="bg-white/45 p-3 rounded-xl border border-navy/5 flex justify-between items-center text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono text-[#678DC6] uppercase">Scribe Score Achieve</span>
                    <p className="font-bold font-medieval text-soft-espresso leading-none">{item.score} XP Points</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 font-bold font-mono text-[9px] uppercase px-2 py-1 bg-[#4A3428] text-gold-glow rounded-lg border border-gold-glow/40 shadow">
                    Rank Certificate Verified
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="border-t border-[#cbd5e1]/15 mt-5 pt-3 flex justify-between items-center text-xs">
                <span className="text-[10px] uppercase font-mono text-emerald-700 font-bold">
                  Status: 100% Complete
                </span>
                <button
                  onClick={() => handleReplayHandcrafted(item.worldId)}
                  className="text-navy hover:text-[#AAB2FF] flex items-center gap-0.5 font-bold font-medieval cursor-pointer"
                >
                  Replay Gates Corridor
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Scribe Advice box */}
      <div className="p-4 bg-[#F8EAE5]/60 rounded-2xl border border-navy/10 flex gap-3 text-xs leading-relaxed text-soft-espresso shadow-inner">
        <Info className="w-5 h-5 text-navy flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-medieval font-semibold">Archivist Footnote</h4>
          <p className="text-[11px] font-sans text-soft-espresso/80">Every session is written directly into local browser cookies. Re-running directories resets current layouts but adds incremental records. Clearing storage purges registries permanently.</p>
        </div>
      </div>

      {/* Vaporize Logs modal dialog confirmation */}
      <Modal
        isOpen={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        title="Burn Scriptorium Logs?"
        footerButtons={
          <>
            <Button variant="secondary" onClick={() => setClearModalOpen(false)}>
              Spare Archives (Cancel)
            </Button>
            <Button 
              variant="magic" 
              onClick={handleClear}
              className="bg-red-700 hover:bg-red-800 text-white font-medieval uppercase border-red-500"
            >
              Incinerate Logs (Purge)
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm">
            Are you absolutely sure you want to vaporize all compiled chronicles?
          </p>
          <div className="p-3 bg-red-100/50 border border-red-200 rounded-lg text-xs leading-normal text-red-800">
            ⛔ WARNING: This operation is irreversible. This will instantly incinerate all logged experience tables, highest recorded XP scores, and completed chronicle card statistics, restoring the platform back to default catalog settings.
          </div>
        </div>
      </Modal>

    </div>
  );
};
export default Archives;
