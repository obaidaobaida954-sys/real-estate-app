import React, { useState } from "react";
import { ChevronRight, HeartCrack } from "lucide-react";
import { useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";
import { PropertyCard } from "../components/PropertyCard";
import { PropertyModal } from "../components/PropertyModal";
import { AnimatedPage } from "../components/AnimatedPage";
import { Property } from "@/lib/supabase";
import { motion, AnimatePresence } from "motion/react";

export function SavedPage() {
  const {
    t,
    properties,
    favorites,
    lang,
    isLoggedIn,
    toggleFavorite,
  } = useAppContext();

  const navigate = useNavigate();

  const [selectedProperty, setSelectedProperty] =
    useState<Property | null>(null);

  const savedProperties = properties.filter((p) => favorites.has(p.id));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <AnimatedPage className="pt-2">
      <header className="glass sticky top-0 z-40 border-b border-border-subtle backdrop-blur-xl">
        <div className="flex items-center gap-4 px-5 py-4">
          <button
            onClick={() => navigate("/home")}
            className="w-10 h-10 rounded-full bg-surface-1 border border-border-subtle flex items-center justify-center transition-all hover:bg-surface-2 active:scale-95 text-text-sub hover:text-text-main shadow-sm"
            aria-label={t("saved_back")}
          >
            <ChevronRight
              className={'w-5 h-5 ${lang === "en" ? "rotate-180" : ""}'}
            />
          </button>

          <h2 className="text-xl font-bold text-text-main">
            {t("nav_saved")}
          </h2>
        </div>
      </header>

      <main className="flex-1 px-5 pt-6 overflow-y-auto w-full">
        {isLoggedIn === false && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-text-main text-lg font-bold mb-4">
              {t("must_login_to_view_saved")}
            </p>

            <button
              onClick={() => navigate("/auth")}
              className="px-5 py-3 rounded-xl bg-emerald-500 text-white font-medium"
              aria-label={t("go_to_login")}
            >
              {t("login")}
            </button>
          </div>
        )}

        {isLoggedIn !== false && (
          <AnimatePresence mode="popLayout">
            {savedProperties.length > 0 ? (
              <div className="flex flex-col gap-6">
                {savedProperties.map((p, index) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      filter: "blur(4px)",
                    }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <PropertyCard
                      property={p}
                      onClick={() => setSelectedProperty(p)}
                      isFavorite={favorites.has(p.id)}
                      onToggleFavorite={toggleFavorite}
                      formattedPrice={formatPrice(p.price)}
                      lang={lang}
                      showContactButton={true}
                      labels={{
                        badge:
                          p.type === "sale"
                            ? lang === "ar"
                              ? "للبيع"
                              : "For Sale"
                            : lang === "ar"
                              ? "للإيجار"
                              : "For Rent",

                        rooms: lang === "ar" ? "غرف" : "rooms",

                        baths: lang === "ar" ? "حمامات" : "bathaas",

                        bath: lang === "ar" ? "حمام" : "bath",

                        sqm: lang === "ar" ? "م²" : "sqm",

                        per_month:
                          lang === "ar" ? "/شهريًا" : "/month",

                        fav_add:
                          lang === "ar"
                            ? "إضافة للمفضلة"
                            : "Add to favorites",

                        fav_remove:
                          lang === "ar"
                            ? "إزالة من المفضلة"
                            : "Remove from favorites",
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <div className="w-24 h-24 rounded-full bg-surface-1 border border-border-subtle flex items-center justify-center mb-6 shadow-[0_10px_30px_rgba(245,158,11,0.1)]">
                  <HeartCrack
                    className="w-10 h-10 text-text-muted"
                    strokeWidth={1.5}
                  />
                </div>

                <p className="text-text-main text-xl font-bold mb-2">
                  {t("saved_empty")}
                </p>

                <p className="text-text-muted text-sm max-w-[200px] leading-relaxed">
                  {t("saved_empty_hint")}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      <PropertyModal
        property={selectedProperty}
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />
    </AnimatedPage>
  );
}