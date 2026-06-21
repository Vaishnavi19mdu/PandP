import React from "react";
import { StoryProvider, useStory } from "./context/StoryContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import CreatePortal from "./pages/CreatePortal";
import WorldOverview from "./pages/WorldOverview";
import Adventure from "./pages/Adventure";
import Archives from "./pages/Archives";
import Chronicle from "./pages/Chronicle";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChooseIdentity from "./pages/ChooseIdentity";
import Profile from "./pages/Profile";
import Achievements from "./pages/Achievements";
import MapExplorer from "./pages/MapExplorer";
import { Compass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function AppContent() {
  const { currentPage, setPage, newLoreToast } = useStory();

  const renderPage = () => {
    switch (currentPage) {
      case "Landing":
        return <Landing />;
      case "CreatePortal":
        return <CreatePortal />;
      case "WorldOverview":
        return <WorldOverview />;
      case "Adventure":
        return <Adventure />;
      case "Archives":
        return <Archives />;
      case "Chronicle":
        return <Chronicle />;
      case "Login":
        return <Login />;
      case "Signup":
        return <Signup />;
      case "ChooseIdentity":
        return <ChooseIdentity />;
      case "Profile":
        return <Profile />;
      case "Achievements":
        return <Achievements />;
      case "MapExplorer":
        return <MapExplorer />;
      default:
        return <Landing />;
    }
  };

  const isAuthPage = ["Login", "Signup", "ChooseIdentity"].includes(currentPage);

  if (isAuthPage) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-[#2D1A10]">
        {renderPage()}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col parchment-bg text-[#4A3428] relative">
      {/* Background ambient lighting overlays */}
      <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-[#F8EAE5]/40 to-transparent pointer-events-none" />
      
      {/* Universal navigation headers */}
      <Navbar />

      {/* Main viewport */}
      <main className={`flex-grow w-full relative z-10 ${currentPage === "Landing" || currentPage === "Profile" || currentPage === "Achievements" ? "pt-0 pb-6" : "py-6"}`}>
        {renderPage()}
      </main>

      {/* Toast Alert overlay for new lore discovered */}
      <AnimatePresence>
        {newLoreToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 right-6 z-50 max-w-sm bg-[#FAF5EC] border-4 border-[#D4AF37] p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden text-[#4A3428] relative"
          >
            {/* Ink Writing Effect line indicator */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-gold-glow to-amber-700 animate-pulse" />
            <div className="flex gap-3">
              <span className="text-3xl select-none">📜</span>
              <div className="text-left">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4AF37] block">
                  ✨ New Lore Recorded
                </span>
                <span className="text-sm font-medieval font-black text-[#5C3A21] block mt-0.5">
                  "{newLoreToast}"
                </span>
                <p className="text-[9.5px] font-sans text-stone-500 mt-1 uppercase font-semibold leading-none">
                  Added to World Lore Encyclopedia
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drag-repositionable map compass widget of the Scriptorium */}
      <motion.div
        drag
        dragMomentum={false}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 right-6 z-50 p-3.5 bg-gradient-to-r from-[#4E2B1F] to-[#1F120C] rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.4)] border-2 border-[#D4AF37] cursor-pointer group flex items-center justify-center touch-none select-none"
        onClick={() => setPage("MapExplorer")}
      >
        <div className="absolute inset-0 bg-gold-glow/25 blur-md rounded-full group-hover:scale-125 transition-transform duration-300 pointer-events-none" />
        <Compass className="w-6 h-6 text-[#E6C06A] animate-spin-slow group-hover:text-white" />
        
        {/* Hover coordinate notification tooltip */}
        <span className="absolute right-14 whitespace-nowrap bg-black/95 text-[#F4F1EC] border border-[#C5A880]/30 text-[9px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase font-mono tracking-wider shadow-lg">
          ✦ Open Realm Map (Drag to Move)
        </span>
      </motion.div>

      {/* Persistent ancient library custom footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <StoryProvider>
      <AppContent />
    </StoryProvider>
  );
}
