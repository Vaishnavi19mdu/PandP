import React, { useState } from "react";
import { useStory } from "../context/StoryContext";
import { Mail, Lock, Sparkles, BookOpen } from "lucide-react";
import { motion } from "motion/react";

export const Login: React.FC = () => {
  const { loginUser, setPage } = useStory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Please fill in all coordinate vectors.");
      return;
    }

    const res = loginUser(email, password);
    if (res.success) {
      setPage("Landing");
    } else {
      setErrorMsg(res.error || "An unexplained fracture has occurred.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-b from-[#2E1E16] via-[#3E2B21] to-[#1F120C] flex items-center justify-center p-4">
      {/* Immersive Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(230,192,106,0.1),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(103,141,198,0.08),transparent_60%)] pointer-events-none" />
      
      {/* Decorative Runic Frame wrapper */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md bg-[#FAF5EC] rounded-3xl border-2 border-[#D4AF37] shadow-2xl overflow-hidden p-8 md:p-10 text-[#4A3428]"
      >
        {/* Magic gold line ornament */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#4E2B1F] via-[#E6C06A] to-[#678DC6]" />
        
        {/* Logo and Greeting */}
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex p-3.5 bg-[#4A3428] rounded-2xl border-2 border-[#D4AF37] shadow-lg animate-float">
            <BookOpen className="w-8 h-8 text-[#E6C06A]" />
          </div>
          <div>
            <h1 className="font-medieval text-3xl md:text-4xl font-extrabold text-[#4A3428] tracking-wide">
              Welcome Back, Traveler
            </h1>
            <p className="text-sm font-serif italic text-soft-espresso/80 mt-2 leading-relaxed">
              "Your chronicles await beyond the portal."
            </p>
          </div>
        </div>

        {/* Form area */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-sans flex items-start gap-2.5 animate-pulse">
              <span className="select-none text-sm">⚠️</span>
              <div>
                <strong className="font-bold">Portal Blocked:</strong> {errorMsg}
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase tracking-widest text-[#4A3428]/70 block font-bold">
              Email coordinate:
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#4A3428]/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="email"
                value={email}
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
                placeholder="traveler@portals.com"
                className="w-full pl-10 pr-4 py-3.5 text-sm bg-white rounded-xl border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 shadow-inner font-sans text-[#4A3428]"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase tracking-widest text-[#4A3428]/70 block font-bold">
              Password Seal:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#4A3428]/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3.5 text-sm bg-white rounded-xl border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 shadow-inner font-sans text-[#4A3428]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-2 bg-gradient-to-r from-[#4E2B1F] via-[#4A3428] to-[#1F120C] text-[#E6C06A] border border-[#D4AF37]/60 rounded-xl font-medieval text-base font-black tracking-widest shadow-xl hover:brightness-125 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer text-center uppercase flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 animate-pulse text-[#E6C06A]" />
            <span>Enter Portal</span>
          </button>

          <div className="pt-5 border-t border-[#4A3428]/10 text-center text-xs font-sans">
            <span className="text-[#4A3428]/60">Don't have an account? </span>
            <button
              type="button"
              onClick={() => setPage("Signup")}
              className="text-[#4A3428] font-bold underline hover:text-[#D4AF37] cursor-pointer transition-colors"
            >
              Sign Up
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
