import React from "react";
import { useStory, PageName } from "../context/StoryContext";
import { BookOpen, HelpCircle, Shield, Key } from "lucide-react";

export const Footer: React.FC = () => {
  const { setPage } = useStory();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#4A3428] text-[#F4F1EC] pt-12 pb-8 px-4 border-t-2 border-gold-glow mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Branding */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-[#E6C06A]" />
            <span className="font-medieval text-xl font-bold tracking-wide text-[#E6C06A]">
              Pages & Portals
            </span>
          </div>
          <p className="text-xs text-[#E9DFD2]/70 max-w-sm leading-relaxed">
            Every idea, lesson, or whisper holds a latent world inside. P&P is an interactive storyforge where your words coalesce into coordinates, establishing portals to branching paths of wisdom and companion journeys.
          </p>
          <div className="pt-2 text-xs text-[#E9DFD2]/40 font-mono">
            &copy; {currentYear} Pages & Portals. Written in silver dust. All rights preserved.
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-medieval text-base text-[#E6C06A] mb-4 tracking-wider">
            Explore Registry
          </h4>
          <ul className="space-y-2 text-xs text-[#E9DFD2]/80">
            <li>
              <button 
                onClick={() => setPage("Landing")} 
                className="hover:text-[#AAB2FF] hover:underline"
              >
                The Great Hall (Home)
              </button>
            </li>
            <li>
              <button 
                onClick={() => setPage("CreatePortal")} 
                className="hover:text-[#AAB2FF] hover:underline"
              >
                Summon Gate (Manifest Portal)
              </button>
            </li>
            <li>
              <button 
                onClick={() => setPage("Archives")} 
                className="hover:text-[#AAB2FF] hover:underline"
              >
                The Dusty Scriptorium (Archives)
              </button>
            </li>
          </ul>
        </div>

        {/* Magical Credits */}
        <div>
          <h4 className="font-medieval text-base text-[#E6C06A] mb-4 tracking-wider">
            Scribe Rules
          </h4>
          <div className="space-y-2.5 text-xs text-[#E9DFD2]/70 leading-normal">
            <div className="flex items-center gap-2">
              <Key className="w-3.5 h-3.5 text-[#E6C06A]" />
              <span>Offline-First Sandboxed Magic</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-[#E6C06A]" />
              <span>Zero-Telemetry Privacy Gland</span>
            </div>
            <div className="flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-[#E6C06A]" />
              <span>D20 Runic Calibration Systems</span>
            </div>
          </div>
        </div>

      </div>
      
      {/* Decorative separator line */}
      <div className="mt-8 pt-6 border-t border-[#F4F1EC]/10 text-center text-[10px] text-[#E9DFD2]/30 uppercase tracking-widest font-mono">
        "No volume is truly finalized until it is read by brave eyes."
      </div>
    </footer>
  );
};
export default Footer;
