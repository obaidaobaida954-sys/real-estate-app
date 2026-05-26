import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Map,
  House,
  Building2,
  Store,
  TreePine,
  ChevronDown,
  ChevronUp,
  Loader as Loader2,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { PropertyCard } from "../components/PropertyCard";
import { PropertyCardSkeleton } from "../components/PropertyCardSkeleton";
import { PropertyModal } from "../components/PropertyModal";
import { AnimatedPage } from "../components/AnimatedPage";
import { NotificationBell } from "../components/NotificationBell";
import { Property } from "@/lib/supabase";
import { usePropertyFilters } from "../hooks/usePropertyFilters";
import { usePageTitle } from "../hooks/usePageTitle";
import { useDebounce } from "../hooks/useDebounce";
import { motion, AnimatePresence } from "motion/react";

const DEFAULT_PRICE_MAX = 10000000;

export function HomePage() {
  const {
    t,
    properties,
    loading,
    lang,
    favorites,
    toggleFavorite,
    loadMoreProperties,
    formatPrice,
  } = useAppContext();
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput, 300);

  const {
    search: _,
    setSearch,
    typeFilter,
    setTypeFilter,
    catFilter,
    setCatFilter,
    priceRange,
    setPriceRange,
    sortMenuOpen,
    setSortMenuOpen,
    sortType,
    sortDir,
    filteredProperties,
    visibleProperties,
    page,
    setPage,
    hasMore,
    handleSort,
    resetAllFilters,
  } = usePropertyFilters(properties, lang);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [priceFilterOpen, setPriceFilterOpen] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  usePageTitle("page_home");

  useEffect(() => {
    if (!sortMenuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortMenuRef.current &&
        !sortMenuRef.current.contains(event.target as Node)
      ) {
        setSortMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sortMenuOpen, setSortMenuOpen]);

  React.useEffect(() => {
    setSearch(search);
  }, [search, setSearch]);

  const categories = [
    { id: "all", icon: Map, label: "cat_all" },
    { id: "house", icon: House, label: "cat_houses" },
    { id: "apartment", icon: Building2, label: "cat_apartments" },
    { id: "commercial", icon: Store, label: "cat_commercial" },
    { id: "land", icon: TreePine, label: "cat_land" },
  ];

  const handleResetAllFilters = () => {
    setSearchInput("");
    resetAllFilters();
  };

  const hasActiveFilters =
    search !== "" ||
    typeFilter !== "all" ||
    catFilter !== "all" ||
    priceRange[0] !== 0 ||
    priceRange[1] !== DEFAULT_PRICE_MAX;

  const categoryTitleKeys = {
    house: "title_cat_house",
    apartment: "title_cat_apartment",
    commercial: "title_cat_commercial",
    land: "title_cat_land",
  } as const;

  const getDynamicTitle = () => {
    if (typeFilter === "all" && catFilter === "all")
      return t("title_all_properties");
    if (typeFilter !== "all" && catFilter === "all")
      return typeFilter === "sale" ? t("title_sale") : t("title_rent");
    return t(categoryTitleKeys[catFilter]);
  };

  return (
    <AnimatedPage className="pt-2">
      <div className="px-5 pt-8 pb-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-extrabold text-text-main leading-snug mb-1"
            >
              {t("home_welcome_prefix")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
                {t("app_name")}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-text-muted text-sm"
            >
              {lang === "ar"
                ? "اكتشف العقار المثالي لك"
                : "Discover your ideal property"}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <NotificationBell />
          </motion.div>
        </div>
      </div>

      <main className="flex-1 px-5 pt-4 overflow-y-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative mb-6"
        >
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-text-muted" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t("search_placeholder")}
            className="w-full h-14 bg-surface-1/50 backdrop-blur-xl border border-border-subtle rounded-[20px] pr-12 pl-4 text-text-main placeholder:text-text-muted focus:outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 transition-all shadow-sm"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-2 mb-4 bg-surface-1 p-1 rounded-2xl border border-border-subtle shadow-sm"
        >
          {["all", "sale", "rent"].map((type) => {
            const isActive = typeFilter === type;
            return (
              <button
                key={type}
                onClick={() => setTypeFilter(type as "all" | "sale" | "rent")}
                className={`relative flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "text-stone-900"
                    : "text-text-muted hover:text-text-main"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="type-bg"
                    className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl shadow-md"
                  />
                )}
                <span className="relative z-10">{t(`filter_${type}`)}</span>
              </button>
            );
          })}
        </motion.div>

        {hasActiveFilters && (
          <button
            onClick={handleResetAllFilters}
            className="w-full mb-4 py-2 text-sm text-amber-500 border border-amber-500/30 rounded-xl hover:bg-amber-500/10 transition-colors"
          >
            {t("clear_filters")}
          </button>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-2 mb-6 justify-start"
        >
          {categories.map((cat) => {
            const isActive = catFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCatFilter(cat.id as typeof catFilter)}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-br from-amber-400 to-amber-600 text-stone-900 shadow-[0_8px_20px_-6px_rgba(245,158,11,0.5)] font-bold"
                    : "bg-surface-1 border border-border-subtle text-text-muted hover:bg-surface-2 hover:text-text-main shadow-sm font-medium"
                }`}
              >
                <cat.icon
                  className="w-4 h-4"
                  strokeWidth={isActive ? 2 : 1.5}
                />
                <span>{t(cat.label)}</span>
              </button>
            );
          })}
        </motion.div>

        <motion.div className="mb-6 bg-surface-1 border border-border-subtle rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => setPriceFilterOpen(!priceFilterOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-text-main"
          >
            <span>{t("filter_price")}</span>
            {priceFilterOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          <AnimatePresence>
            {priceFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 pb-4 overflow-hidden"
              >
                <div className="flex justify-between text-xs text-text-muted mb-3">
                  <span>
                    {t("price_min")}: {formatPrice(priceRange[0])}
                  </span>
                  <span>
                    {t("price_max")}: {formatPrice(priceRange[1])}
                  </span>
                </div>
                <div className="relative h-8 mb-2">
                  <input
                    type="range"
                    min={0}
                    max={DEFAULT_PRICE_MAX}
                    value={priceRange[0]}
                    onChange={(e) => {
                      const min = Number(e.target.value);
                      setPriceRange([
                        Math.min(min, priceRange[1]),
                        priceRange[1],
                      ]);
                    }}
                    className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-surface-2"
                  />
                  <input
                    type="range"
                    min={0}
                    max={DEFAULT_PRICE_MAX}
                    value={priceRange[1]}
                    onChange={(e) => {
                      const max = Number(e.target.value);
                      setPriceRange([
                        priceRange[0],
                        Math.max(max, priceRange[0]),
                      ]);
                    }}
                    className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-amber-500/30"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setPriceRange([0, DEFAULT_PRICE_MAX])}
                  className="text-xs text-amber-500 font-medium"
                >
                  {t("reset_filters")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-between mb-5"
        >
          <h3 className="text-xl font-bold text-text-main">
            {getDynamicTitle()}
          </h3>
          <div className="relative" ref={sortMenuRef}>
            <button
              onClick={() => setSortMenuOpen(!sortMenuOpen)}
              className="flex items-center gap-1.5 text-sm text-text-sub hover:text-text-main transition-colors bg-surface-1 border border-border-subtle shadow-sm px-3 py-1.5 rounded-xl"
            >
              <span className="text-[12px] font-medium">{t("sort_by")}</span>
              {sortMenuOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            <AnimatePresence>
              {sortMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-2 left-0 w-56 bg-surface-1/95 backdrop-blur-xl border border-border-subtle rounded-2xl shadow-2xl overflow-hidden z-30"
                >
                  {(["price", "area", "date"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => handleSort(type)}
                      className={`w-full text-right px-4 py-3 text-sm transition-colors flex justify-between items-center border-b border-border-subtle/30 last:border-0 ${
                        sortType === type
                          ? "bg-amber-500/10 text-amber-500"
                          : "text-text-main hover:bg-surface-2"
                      }`}
                    >
                      <span className="font-medium">{t(`sort_${type}`)}</span>
                      {sortType === type && (
                        <span className="text-xs px-2 py-0.5 bg-amber-500/20 rounded-md">
                          {sortDir === "asc"
                            ? `${t("sort_asc")} ↑`
                            : `${t("sort_desc")} ↓`}
                        </span>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="flex flex-col gap-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
              <p className="text-text-muted text-sm">{t("loading")}</p>
            </div>
          ) : filteredProperties.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {visibleProperties.map((p, index) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <PropertyCard
                    property={p}
                    onClick={() => setSelectedProperty(p)}
                    isFavorite={favorites.has(p.id)}
                    onToggleFavorite={toggleFavorite}
                    formattedPrice={formatPrice(p.price)}
                    lang={lang}
                    labels={{
                      badge: t(
                        p.type === "sale" ? "badge_sale" : "badge_rent",
                      ),
                      rooms: t("rooms"),
                      baths: t("baths"),
                      bath: t("bath"),
                      sqm: t("sqm"),
                      per_month: t("per_month"),
                      fav_add: t("fav_add"),
                      fav_remove: t("fav_remove"),
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-20 text-center"
            >
              <Search className="mx-auto mb-4 w-12 h-12 text-text-muted/70" />
              <p className="text-xl font-bold text-text-main mb-2">
                {t("no_results")}
              </p>
              <p className="text-sm text-text-muted mb-6">
                {t("no_results_hint")}
              </p>
              <button
                onClick={handleResetAllFilters}
                className="inline-flex items-center justify-center rounded-2xl bg-amber-500/10 px-5 py-3 text-sm font-semibold text-amber-500 hover:bg-amber-500/20 transition-colors"
              >
                {t("clear_filters")}
              </button>
            </motion.div>
          )}

          {!loading && filteredProperties.length > 0 && (
            <div className="mt-6 space-y-4">
              {hasMore ? (
                <div className="flex justify-center">
                  <button
                    onClick={async () => {
                      setLoadingMore(true);
                      await loadMoreProperties(page + 1);
                      setPage((current) => current + 1);
                      setLoadingMore(false);
                    }}
                    disabled={loadingMore}
                    aria-busy={loadingMore}
                    className={`px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-stone-900 font-semibold transition-all flex items-center gap-2 ${
                      loadingMore
                        ? "opacity-70 pointer-events-none"
                        : "hover:shadow-lg"
                    }`}
                  >
                    {loadingMore ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : null}
                    <span>{t("load_more")}</span>
                  </button>
                </div>
              ) : (
                properties.length > 0 && (
                  <p className="text-center text-sm text-text-muted py-4">
                    {t("all_properties_shown")}
                  </p>
                )
              )}
              {loadingMore && (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <PropertyModal
        property={selectedProperty}
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />
    </AnimatedPage>
  );
}
