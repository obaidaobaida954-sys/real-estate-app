import { useEffect, useMemo, useState } from "react";
import { Property } from "@/lib/supabase";
import { Language } from "../i18n";

export type PropertyType = "all" | "sale" | "rent";
export type CategoryId = "all" | "house" | "apartment" | "commercial" | "land";
export type SortType = "price" | "area" | "date" | null;
export type SortDir = "asc" | "desc";

const DEFAULT_PRICE_MAX = 10000000;
const PAGE_SIZE = 6;

export function usePropertyFilters(properties: Property[], lang: Language) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<PropertyType>("all");
  const [catFilter, setCatFilter] = useState<CategoryId>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0,
    DEFAULT_PRICE_MAX,
  ]);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortType, setSortType] = useState<SortType>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timeout = window.setTimeout(() => setIsLoading(false), 300);
    return () => window.clearTimeout(timeout);
  }, [search, typeFilter, catFilter, priceRange, sortType, sortDir]);

  useEffect(() => {
    setPage(1);
  }, [search, typeFilter, catFilter, priceRange, sortType, sortDir]);

  const filteredProperties = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    const list = properties.filter((p) => {
      const title = lang === "ar" ? p.title_ar : p.title_en;
      const location = lang === "ar" ? p.location_ar : p.location_en;
      const agentName = lang === "ar" ? p.agent_name_ar : p.agent_name_en;
      const matchSearch =
        searchTerm === "" ||
        title.toLowerCase().includes(searchTerm) ||
        location.toLowerCase().includes(searchTerm) ||
        agentName.toLowerCase().includes(searchTerm);
      const matchType = typeFilter === "all" || p.type === typeFilter;
      const matchCat = catFilter === "all" || p.category === catFilter;
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchSearch && matchType && matchCat && matchPrice;
    });

    if (sortType) {
      list.sort((a, b) => {
        let valA = 0;
        let valB = 0;
        if (sortType === "price") {
          valA = a.price;
          valB = b.price;
        } else if (sortType === "area") {
          valA = a.area;
          valB = b.area;
        } else if (sortType === "date") {
          valA = new Date(a.created_at).getTime();
          valB = new Date(b.created_at).getTime();
        }
        return sortDir === "asc" ? valA - valB : valB - valA;
      });
    }

    return list;
  }, [properties, search, typeFilter, catFilter, priceRange, sortType, sortDir, lang]);

  const visibleProperties = useMemo(
    () => filteredProperties.slice(0, page * PAGE_SIZE),
    [filteredProperties, page],
  );

  const hasMore = visibleProperties.length < filteredProperties.length;

  const handleSort = (type: SortType) => {
    if (sortType === type) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortType(type);
      setSortDir(type === "price" ? "asc" : "desc");
    }
    setSortMenuOpen(false);
  };

  const resetAllFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setCatFilter("all");
    setPriceRange([0, DEFAULT_PRICE_MAX]);
  };

  return {
    search,
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
    isLoading,
    handleSort,
    resetAllFilters,
  };
}
