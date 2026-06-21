import React, { useState } from "react";
import { useStory, Persona, fantasyPersonas } from "../context/StoryContext";
import { 
  Sparkles, Save, User as UserIcon, Shield, Anchor, Landmark, 
  Map, Award, BookOpen, Clock, Heart 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  Tooltip, PolarGrid, PolarAngleAxis, Radar, RadarChart 
} from "recharts";

export const Profile: React.FC = () => {
  const { currentUser, updateProfile, archives, setPage } = useStory();

  // Handle case where user is not logged in
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto text-center p-8 bg-[#FAF5EC] border-2 border-[#D4AF37] rounded-3xl mt-12 shadow-xl">
        <h2 className="font-medieval text-2xl font-black text-[#4A3428] mb-3">Traveler Verification Required</h2>
        <p className="text-xs font-serif italic text-soft-espresso/80 mb-6">
          "The cosmic registry does not recognize your current frequency."
        </p>
        <button
          onClick={() => setPage("Login")}
          className="px-6 py-3 bg-[#4A3428] text-gold-glow rounded-xl font-medieval text-xs font-bold uppercase cursor-pointer"
        >
          Enter Scriptorium Login
        </button>
      </div>
    );
  }

  const [fullName, setFullName] = useState(currentUser.fullName);
  const [selectedPersona, setSelectedPersona] = useState<Persona>(currentUser.persona);
  const [showToast, setShowToast] = useState(false);

  // Calculate high quality stats from actual archives list
  const totalCompleted = archives.length;
  const cumulativeScore = archives.reduce((sum, item) => sum + (item.score || 0), 0);
  
  // Dynamic stats calculation for progress visualization
  const attributesData = [
    { name: "Knowledge", value: 60 + totalCompleted * 10, fullMark: 150 },
    { name: "Courage", value: 55 + totalCompleted * 12, fullMark: 150 },
    { name: "Creativity", value: 70 + totalCompleted * 8, fullMark: 150 },
    { name: "Luck", value: 50 + totalCompleted * 15, fullMark: 150 },
  ];

  // Genre Mastery Stats
  const genreTally: { [key: string]: number } = {};
  archives.forEach(item => {
    genreTally[item.genre] = (genreTally[item.genre] || 0) + 1;
  });
  
  const genreData = Object.keys(genreTally).map(genre => ({
    name: genre,
    chronicles: genreTally[genre]
  }));

  if (genreData.length === 0) {
    genreData.push({ name: "Uncharted", chronicles: 0 });
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(fullName, selectedPersona);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-[#4A3428]">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 right-4 z-50 bg-[#4A3428] text-gold-glow px-5 py-3 rounded-xl border border-gold-glow shadow-2xl flex items-center gap-2 font-medieval text-xs"
          >
            <Sparkles className="w-4 h-4 text-gold-glow animate-spin-once" />
            <span>✨ Persona chronicle updated successfully! ✨</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8 space-y-2">
        <span className="font-mono text-[9px] tracking-widest uppercase bg-[#D4AF37]/20 text-[#678DC6] border border-[#D4AF37]/30 px-3 py-1 rounded-full font-bold">
          Account Archives & Custom Ledger
        </span>
        <h1 className="font-medieval text-3xl md:text-5xl font-black text-[#4A3428]">
          Traveler Profile Settings
        </h1>
        <p className="text-sm font-serif italic text-soft-espresso/80">
          "Amend your cosmic titles, shift your fantasy vessel, and monitor your global journey metrics."
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Ledger Modifying Forms */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSave} className="bg-[#FAF5EC] border-2 border-[#D4AF37]/40 rounded-3xl p-6 md:p-8 shadow-md space-y-6">
            <h2 className="font-medieval text-xl font-bold border-b border-[#4A3428]/10 pb-3 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-gold-glow" />
              <span>Modify Traveler Attributes</span>
            </h2>

            {/* Edit Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-soft-espresso/70 block font-bold">
                Edit Display Name:
              </label>
              <div className="relative">
                <UserIcon className="w-4.5 h-4.5 text-[#4A3428]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/40 shadow-inner text-sm font-sans text-[#4A3428]"
                  required
                />
              </div>
            </div>

            {/* Edit Persona Selector */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono uppercase tracking-widest text-soft-espresso/70 block font-bold">
                Re-align Adventurer Identity:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                {fantasyPersonas.map((persona) => {
                  const isChecked = selectedPersona.name === persona.name;
                  return (
                    <div
                      key={persona.name}
                      onClick={() => setSelectedPersona(persona)}
                      className={`p-3 bg-white rounded-xl border border-[#D4AF37]/25 flex items-start gap-3 cursor-pointer transition-all hover:bg-[#FAF1E3] ${
                        isChecked ? "bg-[#FAF1E3] border-[#D4AF37] ring-1 ring-[#D4AF37]" : ""
                      }`}
                    >
                      <span className="text-3xl p-1 bg-[#FAF5EC] rounded-lg shadow-sm shrink-0">
                        {persona.avatar}
                      </span>
                      <div className="text-left mt-0.5 min-w-0">
                        <span className="font-medieval text-xs font-bold block truncate text-[#4A3428]">
                          {persona.name}
                        </span>
                        <span className="text-[7.5px] font-mono text-[#678DC6] uppercase font-bold tracking-wider block">
                          {persona.category}
                        </span>
                        <p className="text-[9.5px] font-serif text-soft-espresso/80 leading-snug mt-1 line-clamp-2">
                          {persona.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#4A3428] via-[#4E2B1F] to-[#1F120C] text-[#E6C06A] border border-[#D4AF37]/50 rounded-xl font-medieval text-sm font-black tracking-widest shadow-md hover:brightness-125 transform hover:-translate-y-0.5 transition-all text-center uppercase flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4 text-gold-glow" />
              <span>Save Ledger Changes</span>
            </button>
          </form>
        </div>

        {/* Right Side: Fantasy Stats and Recharts visualization panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FAF5EC] border-2 border-[#D4AF37]/40 rounded-3xl p-6 shadow-md space-y-6">
            <h2 className="font-medieval text-xl font-bold border-b border-[#4A3428]/10 pb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-gold-glow" />
              <span>Adventurer Statistics</span>
            </h2>

            {/* High Impact Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#F8EAE5] border border-navy/10 rounded-2xl p-4 text-center">
                <span className="text-[8px] font-mono text-[#678DC6] uppercase tracking-wider font-extrabold block">Current Rank Title</span>
                <span className="font-medieval text-xs font-black text-soft-espresso mt-1 block">🏅 {currentUser.title}</span>
              </div>
              <div className="bg-[#F8EAE5] border border-navy/10 rounded-2xl p-4 text-center">
                <span className="text-[8px] font-mono text-[#678DC6] uppercase tracking-wider font-extrabold block">Portals Closed</span>
                <span className="font-medieval text-sm font-black text-soft-espresso mt-1 block">📖 {totalCompleted} Logs</span>
              </div>
              <div className="bg-[#F8EAE5] border border-navy/10 rounded-2xl p-4 text-center">
                <span className="text-[8px] font-mono text-[#678DC6] uppercase tracking-wider font-extrabold block">Chronicle Score</span>
                <span className="font-medieval text-sm font-black text-soft-espresso mt-1 block">✨ {cumulativeScore} pts</span>
              </div>
              <div className="bg-[#F8EAE5] border border-navy/10 rounded-2xl p-4 text-center">
                <span className="text-[8px] font-mono text-[#678DC6] uppercase tracking-wider font-extrabold block">Bound Vessel</span>
                <span className="font-medieval text-xs font-black text-soft-espresso mt-1 block">{currentUser.persona.avatar} {currentUser.persona.name}</span>
              </div>
            </div>

            {/* Recharts Attribute Matrix */}
            <div className="pt-4 border-t border-[#4A3428]/10">
              <p className="text-[10px] font-mono uppercase tracking-widest text-soft-espresso/80 block font-bold mb-3 text-center">Character Attribute Matrix</p>
              
              <div className="h-48 md:h-56 flex items-center justify-center bg-white/50 rounded-xl border border-[#D4AF37]/15 p-2 overflow-hidden">
                <ResponsiveContainer width="99%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={attributesData}>
                    <PolarGrid stroke="#4A3428" strokeOpacity={0.12} />
                    <PolarAngleAxis dataKey="name" tick={{ fill: "#4A3428", fontSize: 10, fontWeight: "bold" }} />
                    <Radar name="Attributes" dataKey="value" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Genre Mastery BarChart */}
            <div className="pt-4 border-t border-[#4A3428]/10">
              <p className="text-[10px] font-mono uppercase tracking-widest text-soft-espresso/80 block font-bold mb-3 text-center">Chronicle Genre Mastery</p>
              <div className="h-40 flex items-center justify-center bg-white/50 rounded-xl border border-[#D4AF37]/15 p-2 overflow-hidden">
                <ResponsiveContainer width="99%" height="100%">
                  <BarChart data={genreData}>
                    <XAxis dataKey="name" stroke="#4A3428" strokeOpacity={0.6} tick={{ fontSize: 9 }} />
                    <Tooltip cursor={{ fill: "transparent" }} />
                    <Bar dataKey="chronicles" fill="#678DC6" radius={[4, 4, 0, 0]} barSize={25} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Meta Registration details */}
            <div className="text-center pt-3 text-[9px] font-mono text-[#4A3428]/60 flex items-center justify-center gap-1.5 border-t border-[#4A3428]/10">
              <Clock className="w-3 h-3 text-[#4A3428]/50" />
              <span>Traveler session bound at {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
