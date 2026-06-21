import React, { useState, useRef, useEffect } from "react";
import { useStory, PageName } from "../context/StoryContext";
import { 
  BookOpen, Compass, Archive, Scroll, Menu, X, Sparkles, 
  User, Award, LogOut, ChevronDown, Landmark
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { currentPage, setPage, activeStory, currentUser, logoutUser } = useStory();
  const [isOpen, setIsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const navItems: { name: string; page: PageName; icon: React.ReactNode }[] = [
    { name: "Home", page: "Landing", icon: <BookOpen className="w-4 h-4" /> },
    { name: "Open Portal", page: "CreatePortal", icon: <Compass className="w-4 h-4" /> },
    { name: "World Lore", page: "Chronicle", icon: <Scroll className="w-4 h-4" /> },
    { name: "Archives", page: "Archives", icon: <Archive className="w-4 h-4" /> },
  ];

  // If there's an active running adventure, allow jumping straight back to Adventure
  if (activeStory) {
    navItems.splice(2, 0, { name: "Active Adventure", page: "Adventure", icon: <Sparkles className="w-4 h-4 text-gold-glow animate-pulse" /> });
  }

  const handleNav = (page: PageName) => {
    setPage(page);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#4A3428] backdrop-blur-md border-b-2 border-gold-glow/40 shadow-xl text-[#F4F1EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div 
            onClick={() => handleNav("Landing")} 
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gold-glow/30 blur-md rounded-full group-hover:scale-120 transition-transform duration-300"></div>
              <div className="relative p-2 bg-navy rounded-lg border border-gold-glow">
                <BookOpen className="w-5 h-5 text-gold-glow" />
              </div>
            </div>
            <div>
              <span className="font-medieval text-xl font-bold tracking-wide text-gold-glow group-hover:text-white transition-colors">
                Pages & Portals
              </span>
              <p className="text-[9px] font-mono tracking-widest text-[#E9DFD2]/70 uppercase block">
                P&P Storyforge
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1.5">
            {navItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNav(item.page)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-gold-glow/15 text-gold-glow shadow-md border border-gold-glow/40"
                      : "text-[#E9DFD2] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span className={`${isActive ? "font-bold font-medieval" : "font-normal"}`}>
                    {item.name}
                  </span>
                </button>
              );
            })}
            
            {/* Manifest Portal Quick Trigger */}
            <button
              onClick={() => handleNav("CreatePortal")}
              className="ml-4 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-navy hover:bg-opacity-80 text-white shadow border border-gold-glow/40 text-xs font-semibold font-medieval cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-glow animate-pulse" />
              Manifest Portal
            </button>

            {/* Account authentication experience block */}
            <div className="border-l border-white/10 h-6 mx-3" />

            {currentUser ? (
              /* LOGGED IN USER EXPERIENCE */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-300 cursor-pointer bg-[#3E2B21] hover:brightness-110 text-gold-glow border border-gold-glow/30"
                >
                  <span className="text-md select-none">{currentUser.persona.avatar}</span>
                  <span className="font-medieval text-xs font-bold whitespace-nowrap">✨ Welcome, {currentUser.persona.name}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${userDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu popover */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-56 rounded-xl bg-[#FAF0ED] text-soft-espresso shadow-2xl border-2 border-[#D4AF37] overflow-hidden z-50 animate-fadeIn">
                    <div className="p-3 bg-[#F8EAE5] border-b border-[#4A3428]/10 text-left">
                      <p className="text-[8.5px] font-mono tracking-widest uppercase text-[#678DC6] font-extrabold leading-none">Title Rank Description</p>
                      <p className="font-medieval text-xs font-black text-soft-espresso mt-1">🏅 {currentUser.title}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setPage("Profile");
                        }}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-left text-xs text-soft-espresso hover:bg-[#E9DFD2] font-semibold transition-colors cursor-pointer"
                      >
                        <User className="w-4 h-4 text-soft-espresso/60" />
                        <span>Profile Settings</span>
                      </button>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setPage("Archives");
                        }}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-left text-xs text-soft-espresso hover:bg-[#E9DFD2] font-semibold transition-colors cursor-pointer"
                      >
                        <Archive className="w-4 h-4 text-soft-espresso/60" />
                        <span>Archives</span>
                      </button>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setPage("Achievements");
                        }}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-left text-xs text-soft-espresso hover:bg-[#E9DFD2] font-semibold transition-colors cursor-pointer"
                      >
                        <Award className="w-4 h-4 text-soft-espresso/60" />
                        <span>Achievements</span>
                      </button>
                      <div className="border-t border-[#4A3428]/10 my-1" />
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logoutUser();
                          setPage("Landing");
                        }}
                        className="flex items-center gap-2.5 w-full px-4 py-2 text-left text-xs text-red-700 hover:bg-red-50 font-extrabold transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Logout Chronicle</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* GUEST RECONGITION STATE */
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage("Login")}
                  className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider font-medieval text-gold-glow hover:text-white transition-all cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => setPage("Signup")}
                  className="px-4 py-2.5 bg-gradient-to-r from-gold-glow to-[#E6C06A] text-[#4A3428] text-xs font-black uppercase tracking-wider font-medieval rounded-lg shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer border border-[#D4AF37]/50"
                >
                  Sign Up
                </button>
              </div>
            )}

          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {currentUser && (
              <span className="text-xl select-none" title={currentUser.persona.name}>{currentUser.persona.avatar}</span>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-lg text-gold-glow hover:bg-white/5 transition-colors focus:outline-none focus:ring-1 focus:ring-gold-glow/40 w-11 h-11 flex items-center justify-center cursor-pointer"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="w-6 h-6 animate-spin-once" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#3E2B21] border-b border-gold-glow/30 px-3 pt-2 pb-5 space-y-1 shadow-inner animate-fadeIn">
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.name}
                onClick={() => handleNav(item.page)}
                className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-left text-base font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-gold-glow/15 text-gold-glow border-l-4 border-gold-glow"
                    : "text-[#E9DFD2] hover:bg-white/5"
                }`}
              >
                {item.icon}
                <span className="font-medieval">{item.name}</span>
              </button>
            );
          })}
          
          <div className="pt-3 border-t border-white/5 my-2 px-1 space-y-2">
            {currentUser ? (
              <>
                <div className="p-3 bg-[#4A3428] rounded-xl border border-gold-glow/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{currentUser.persona.avatar}</span>
                    <div className="text-left leading-tight">
                      <p className="font-medieval text-gold-glow font-bold text-xs">{currentUser.persona.name}</p>
                      <p className="text-[8.5px] font-mono text-[#E9DFD2]/60">{currentUser.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      logoutUser();
                      setPage("Landing");
                    }}
                    className="p-1 px-2.5 bg-red-800 hover:bg-red-900 border border-red-500 rounded-lg text-[9px] uppercase font-mono text-white cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setPage("Profile");
                    }}
                    className="py-2.5 text-center bg-[#4A3428] text-[#E9DFD2] border border-white/10 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Profile Settings
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setPage("Achievements");
                    }}
                    className="py-2.5 text-center bg-[#4A3428] text-gold-glow border border-gold-glow/20 rounded-lg text-xs font-semibold cursor-pointer font-medieval"
                  >
                    🏅 Achievements
                  </button>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setPage("Login");
                  }}
                  className="py-2.5 text-center bg-[#4A3428] text-gold-glow border border-gold-glow/25 rounded-xl text-sm font-bold font-medieval cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setPage("Signup");
                  }}
                  className="py-2.5 text-center bg-gradient-to-r from-gold-glow to-[#E6C06A] text-[#332219] rounded-xl text-sm font-black font-medieval cursor-pointer shadow"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
