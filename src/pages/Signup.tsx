import React, { useState } from "react";
import { useStory } from "../context/StoryContext";
import { Mail, Lock, User as UserIcon, BookOpen, Sparkles, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export const Signup: React.FC = () => {
  const { setPage } = useStory();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMsg("Please populate all Scriptorium registration lines.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Portal entry password coordinates do not match.");
      return;
    }

    if (password.length < 5) {
      setErrorMsg("Security password must be at least 5 symbols strong.");
      return;
    }

    // Save registration lines transiently in sessionStorage for the next identity stage
    sessionStorage.setItem(
      "pp_pending_registration",
      JSON.stringify({ fullName, email, password })
    );

    // Redirect to character selection page
    setPage("ChooseIdentity");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-b from-[#2E1E16] via-[#3E2B21] to-[#1F120C] flex items-center justify-center p-4">
      {/* Decorative Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(230,192,106,0.1),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(103,141,198,0.08),transparent_60%)] pointer-events-none" />

      {/* Primary Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md bg-[#FAF5EC] rounded-3xl border-2 border-[#D4AF37] shadow-2xl overflow-hidden p-8 md:p-10 text-[#4A3428]"
      >
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#4E2B1F] via-[#E6C06A] to-[#678DC6]" />

        {/* Back Button */}
        <button
          type="button"
          onClick={() => setPage("Landing")}
          className="absolute top-5 left-5 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#4A3428]/60 hover:text-[#4A3428] cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex p-3 bg-[#4A3428] rounded-2xl border border-gold-glow shadow-md animate-float">
            <BookOpen className="w-7 h-7 text-[#E6C06A]" />
          </div>
          <div>
            <h1 className="font-medieval text-3xl font-extrabold text-[#4A3428] tracking-wide">
              Begin Your Chronicle
            </h1>
            <p className="text-xs font-serif italic text-soft-espresso/80 mt-1 leading-relaxed">
              "Every great adventure starts with a single page."
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-sans flex items-start gap-2 animate-pulse">
              <span className="select-none text-sm">⚠️</span>
              <div>
                <strong className="font-bold">Chronicle Error:</strong> {errorMsg}
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[#4A3428]/70 block font-bold">
              Full Scribe Name:
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-[#4A3428]/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                value={fullName}
                autoFocus
                onChange={(e) => setFullName(e.target.value)}
                placeholder="E.g., Alistair Vance"
                className="w-full pl-10 pr-4 py-3 text-xs bg-white rounded-xl border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 shadow-inner font-sans text-[#4A3428]"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[#4A3428]/70 block font-bold">
              Email coordinate:
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#4A3428]/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="traveler@portals.com"
                className="w-full pl-10 pr-4 py-3 text-xs bg-white rounded-xl border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 shadow-inner font-sans text-[#4A3428]"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[#4A3428]/70 block font-bold">
              Create Password Seal:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#4A3428]/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 text-xs bg-white rounded-xl border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 shadow-inner font-sans text-[#4A3428]"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[#4A3428]/70 block font-bold">
              Confirm Password Seal:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#4A3428]/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 text-xs bg-white rounded-xl border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 shadow-inner font-sans text-[#4A3428]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 mt-3 bg-gradient-to-r from-[#4A3428] via-[#4E2B1F] to-[#D4AF37] text-white border border-[#D4AF37]/45 rounded-xl font-medieval text-sm font-black tracking-widest shadow-xl hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer uppercase flex items-center justify-center gap-1.5"
          >
            <span>Continue</span>
          </button>

          <div className="pt-4 border-t border-[#4A3428]/10 text-center text-xs font-sans">
            <span className="text-[#4A3428]/60">Already have password coordinates? </span>
            <button
              type="button"
              onClick={() => setPage("Login")}
              className="text-[#4A3428] font-bold underline hover:text-[#D4AF37] cursor-pointer transition-colors"
            >
              Log In
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;