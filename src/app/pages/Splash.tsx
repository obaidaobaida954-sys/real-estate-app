import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { House } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";

export function Splash() {
  const { t } = useAppContext();
  const navigate = useNavigate();
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      setInstallPrompt(null);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center relative overflow-hidden bg-black max-w-md mx-auto shadow-2xl">
      {/* Cinematic Background Image with slow zoom */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.1 }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200")',
        }}
      />

      {/* Overlays for contrast */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#000000] via-black/70 to-transparent opacity-90" />
      <div className="absolute top-1/3 inset-x-0 h-[40vh] bg-amber-500/20 blur-[120px] z-0 mix-blend-screen" />

      {/* Content Container */}
      <div className="z-10 flex flex-col items-center px-8 w-full">
        {/* Glassmorphism Logo */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-28 h-28 rounded-[2rem] glass-floating border border-white/10 flex items-center justify-center mb-8 relative"
        >
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-amber-400/20 to-transparent pointer-events-none" />
          <House
            className="w-12 h-12 text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
            strokeWidth={1.5}
          />
        </motion.div>

        {/* Typography */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="text-center space-y-5"
        >
          <h1 className="text-7xl font-black leading-tight pb-2">
            <span className="block text-transparent bg-clip-text bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 drop-shadow-[0_4px_20px_rgba(245,158,11,0.6)]">
              {t("splash_title")}
            </span>
          </h1>
          <div className="h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          <p className="text-white/90 text-xl font-semibold tracking-wide">
            {t("splash_subtitle")}
          </p>
        </motion.div>

        {/* Call to action */}
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          onClick={() => navigate("/auth")}
          className="w-full mt-20 py-4 rounded-[20px] font-bold text-[17px] btn-premium relative overflow-hidden group"
        >
          {/* Shine effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
          <span className="relative z-10">{t("splash_cta")}</span>
        </motion.button>

        {installPrompt && (
          <button
            type="button"
            onClick={handleInstall}
            className="w-full mt-3 py-3 rounded-[20px] font-medium text-sm text-white/90 border border-white/20 hover:bg-white/10 transition-colors"
          >
            {t("install_app")}
          </button>
        )}
      </div>
    </div>
  );
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}
