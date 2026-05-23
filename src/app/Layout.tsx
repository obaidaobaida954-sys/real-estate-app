import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { BottomNav } from "./components/BottomNav";
import { AnimatePresence } from "motion/react";

export function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center w-full">
    <div className="min-h-[100dvh] bg-canvas relative max-w-md mx-auto w-full shadow-2xl border-x border-border-subtle flex flex-col overflow-x-hidden">
      {/* Ambient Background Glows for Depth */}
      <div className="fixed top-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none opacity-60 mix-blend-screen" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none opacity-60 mix-blend-screen" />

      {/* Main Content Area - Animate on route change */}
      <div className="flex-1 flex flex-col z-10 relative pb-28">
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
    </div>
  );
}
