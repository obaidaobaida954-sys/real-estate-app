import React from "react";
import { NavLink } from "react-router";
import { House, Heart, MessageCircle, Settings } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";

export function BottomNav() {
  const { t } = useAppContext();

  const navItems = [
    { to: "/home", icon: House, label: "nav_home" },
    { to: "/saved", icon: Heart, label: "nav_saved" },
    { to: "/contact", icon: MessageCircle, label: "nav_contact" },
    { to: "/settings", icon: Settings, label: "nav_settings" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[380px] pb-[env(safe-area-inset-bottom)]">
      <nav
        aria-label={t("nav_main_label")}
        className="glass-floating border border-border-subtle rounded-full shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] px-2 py-2 flex items-center justify-between"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            aria-label={t(item.label)}
            className="relative flex-1 flex flex-col items-center justify-center py-2 h-14"
          >
            {({ isActive }) => (
              <>
                {/* Active Indicator Background */}
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute inset-0 bg-surface-2 rounded-full border border-border-subtle/50"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <div
                  className={`relative z-10 flex flex-col items-center gap-1 transition-colors duration-300 ${isActive ? "text-amber-500" : "text-text-muted"}`}
                >
                  <item.icon
                    aria-hidden="true"
                    className={`w-[22px] h-[22px] ${isActive ? "drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]" : ""}`}
                    strokeWidth={isActive ? 2.5 : 2}
                    fill={isActive ? "currentColor" : "none"}
                  />
                  <span
                    className={`text-[10px] ${isActive ? "font-bold" : "font-medium"}`}
                  >
                    {t(item.label)}
                  </span>
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
