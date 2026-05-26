import React from "react";
import { useNavigate } from "react-router";
import {
  Info,
  ChevronLeft,
  Moon,
  Sun,
  Languages,
  User,
  DollarSign,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { toast } from "sonner";
import { motion } from "motion/react";
import { AnimatedPage } from "../components/AnimatedPage";
import { signOut } from "@/lib/supabase";

export function SettingsPage() {
  const {
    t,
    lang,
    setLang,
    theme,
    setTheme,
    currency,
    setCurrency,
    user,
    isLoggedIn,
  } = useAppContext();
  const navigate = useNavigate();

  const handleLangToggle = (newLang: "ar" | "en") => {
    if (newLang !== lang) {
      setLang(newLang);
      toast.success(t("lang_changed"));
    }
  };

  const handleThemeToggle = (newTheme: "light" | "dark") => {
    if (newTheme !== theme) {
      setTheme(newTheme);
      toast.success(t(`theme_${newTheme}_on`));
    }
  };

  const handleCurrencyToggle = (newCurrency: "usd" | "syp") => {
    if (newCurrency !== currency) {
      setCurrency(newCurrency);
      toast.success(
        t(
          newCurrency === "usd"
            ? "currency_changed_usd"
            : "currency_changed_syp",
        ),
      );
    }
  };

  const handleLogout = async () => {
    await signOut();
    localStorage.removeItem("aqari_guest");
    toast.info(t("logout"));
    navigate("/");
  };

  return (
    <AnimatedPage className="pt-2">
      <header className="glass sticky top-0 z-40 border-b border-border-subtle backdrop-blur-xl">
        <motion.div className="flex items-center px-6 py-5">
          <h2 className="text-2xl font-extrabold text-text-main">
            {t("nav_settings")}
          </h2>
        </motion.div>
      </header>

      <main className="flex-1 px-5 pt-8 overflow-y-auto w-full">
        <section className="mb-10">
          <motion.div className="flex items-center gap-2 mb-4 px-1">
            <User className="w-4 h-4 text-amber-500" />
            <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em]">
              {t("settings_account")}
            </h3>
          </motion.div>
          {isLoggedIn && user?.email ? (
            <motion.div className="bg-surface-1 rounded-[20px] border border-border-subtle p-5 space-y-4">
              <p className="text-text-main text-sm font-mono" dir="ltr">
                {user.email}
              </p>
              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-xl bg-red-500/10 text-red-500 font-bold text-sm hover:bg-red-500/20 transition-colors"
              >
                {t("logout")}
              </button>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => navigate("/auth")}
                className="w-full py-4 rounded-[20px] bg-surface-1 border border-border-subtle text-text-main font-bold hover:border-amber-500/50 transition-colors"
              >
                {t("account_login")}
              </button>
              <p className="text-xs text-text-muted">
                {t("settings_auth_hint")}
              </p>
            </div>
          )}
        </section>

        <section className="mb-10">
          <motion.div className="flex items-center gap-2 mb-4 px-1">
            <Languages className="w-4 h-4 text-amber-500" />
            <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em]">
              {t("settings_language")}
            </h3>
          </motion.div>
          <motion.div className="flex gap-3 bg-surface-1 p-1.5 rounded-[20px] border border-border-subtle shadow-sm">
            <button
              onClick={() => handleLangToggle("ar")}
              className={`relative flex-1 py-3.5 rounded-[14px] text-sm font-bold transition-all ${lang === "ar" ? "text-stone-900" : "text-text-sub hover:text-text-main"}`}
            >
              {lang === "ar" && (
                <motion.div
                  layoutId="lang-active"
                  className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-[14px] shadow-md"
                />
              )}
              <span className="relative z-10">العربية</span>
            </button>
            <button
              onClick={() => handleLangToggle("en")}
              className={`relative flex-1 py-3.5 rounded-[14px] text-sm font-bold transition-all ${lang === "en" ? "text-stone-900" : "text-text-sub hover:text-text-main"}`}
            >
              {lang === "en" && (
                <motion.div
                  layoutId="lang-active"
                  className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-[14px] shadow-md"
                />
              )}
              <span className="relative z-10">English</span>
            </button>
          </motion.div>
        </section>

        <section className="mb-10">
          <motion.div className="flex items-center gap-2 mb-4 px-1">
            {theme === "dark" ? (
              <Moon className="w-4 h-4 text-amber-500" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
            <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em]">
              {t("settings_theme")}
            </h3>
          </motion.div>
          <motion.div className="flex gap-3 bg-surface-1 p-1.5 rounded-[20px] border border-border-subtle shadow-sm">
            <button
              onClick={() => handleThemeToggle("dark")}
              className={`relative flex-1 py-3.5 rounded-[14px] text-sm font-bold transition-all ${theme === "dark" ? "text-stone-900" : "text-text-sub hover:text-text-main"}`}
            >
              {theme === "dark" && (
                <motion.div
                  layoutId="theme-active"
                  className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-[14px] shadow-md"
                />
              )}
              <span className="relative z-10">{t("theme_dark")}</span>
            </button>
            <button
              onClick={() => handleThemeToggle("light")}
              className={`relative flex-1 py-3.5 rounded-[14px] text-sm font-bold transition-all ${theme === "light" ? "text-stone-900" : "text-text-sub hover:text-text-main"}`}
            >
              {theme === "light" && (
                <motion.div
                  layoutId="theme-active"
                  className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-[14px] shadow-md"
                />
              )}
              <span className="relative z-10">{t("theme_light")}</span>
            </button>
          </motion.div>
        </section>

        <section className="mb-10">
          <motion.div className="flex items-center gap-2 mb-4 px-1">
            <DollarSign className="w-4 h-4 text-amber-500" />
            <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em]">
              {t("settings_currency")}
            </h3>
          </motion.div>
          <motion.div className="flex gap-3 bg-surface-1 p-1.5 rounded-[20px] border border-border-subtle shadow-sm">
            <button
              onClick={() => handleCurrencyToggle("usd")}
              className={`relative flex-1 py-3.5 rounded-[14px] text-sm font-bold transition-all ${currency === "usd" ? "text-stone-900" : "text-text-sub hover:text-text-main"}`}
            >
              {currency === "usd" && (
                <motion.div
                  layoutId="currency-active"
                  className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-[14px] shadow-md"
                />
              )}
              <span className="relative z-10">{t("currency_usd_label")}</span>
            </button>
            <button
              onClick={() => handleCurrencyToggle("syp")}
              className={`relative flex-1 py-3.5 rounded-[14px] text-sm font-bold transition-all ${currency === "syp" ? "text-stone-900" : "text-text-sub hover:text-text-main"}`}
            >
              {currency === "syp" && (
                <motion.div
                  layoutId="currency-active"
                  className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-[14px] shadow-md"
                />
              )}
              <span className="relative z-10">{t("currency_syp_label")}</span>
            </button>
          </motion.div>
        </section>

        <section className="mb-10">
          <motion.div className="flex items-center gap-2 mb-4 px-1">
            <Info className="w-4 h-4 text-amber-500" />
            <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em]">
              {t("settings_about")}
            </h3>
          </motion.div>
          <motion.div className="flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => toast.info(t("about_toast"))}
              className="flex items-center justify-between w-full px-5 py-4 bg-surface-1 rounded-[20px] border border-border-subtle shadow-sm group"
            >
              <span className="font-bold text-text-main group-hover:text-amber-500 transition-colors">
                {t("about_info")}
              </span>
              <motion.div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center group-hover:bg-amber-500/10 transition-colors">
                <ChevronLeft
                  className={`w-4 h-4 text-text-muted ${lang === "en" ? "rotate-180" : ""}`}
                />
              </motion.div>
            </motion.button>
            <motion.div className="flex items-center justify-between w-full px-5 py-4 bg-surface-1 rounded-[20px] border border-border-subtle shadow-sm">
              <span className="font-bold text-text-main">
                {t("about_version")}
              </span>
              <span className="text-text-muted text-sm font-mono tracking-widest bg-surface-2 px-3 py-1 rounded-lg">
                1.0.0
              </span>
            </motion.div>
          </motion.div>
        </section>

        <section className="mb-10 pb-8">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              localStorage.clear();
              toast.success(t("data_cleared"));
              navigate("/");
            }}
            className="w-full py-4 rounded-[20px] bg-red-500/10 border border-red-500/30 text-red-500 font-bold text-sm hover:bg-red-500/20 transition-colors mb-6"
          >
            {t("settings_clear_data")}
          </motion.button>
          <p className="text-center text-sm text-text-muted">{t("app_version")}</p>
        </section>
      </main>
    </AnimatedPage>
  );
}
