import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
  useCallback,
} from "react";
import { i18n, Language, Theme, type TranslationKey } from "../i18n";
import {
  supabase,
  Property,
  Notification as SupabaseNotification,
  ContactInfo,
  getSession,
  onAuthStateChange,
} from "@/lib/supabase";
import { toast } from "sonner";
import logger from "@/lib/logger";
import { validateContactInfo } from "@/lib/validators";
import { useLocalStorage } from "../hooks/useLocalStorage";

type Currency = "usd" | "syp";

interface AppNotification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
  t: (key: TranslationKey) => string;
  favorites: Set<string>;
  toggleFavorite: (id: string) => void;
  properties: Property[];
  notifications: AppNotification[];
  addNotification: (title: string, message: string) => void;
  contactInfo: ContactInfo | null;
  loading: boolean;
  isLoadingMore: boolean;
  user: { id: string; email?: string } | null;
  isLoggedIn: boolean;
  refreshProperties: (
    page?: number,
    perPage?: number,
    append?: boolean,
  ) => Promise<void>;
  refreshNotifications: (opts?: { limit?: number }) => Promise<void>;
  refreshContactInfo: () => Promise<void>;
  loadMoreProperties: (page?: number, perPage?: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const isValidPropertyArray = (data: unknown): data is Property[] => {
  if (!Array.isArray(data) || data.length > 1000) return false;
  return data.every(
    (item) =>
      item !== null &&
      typeof item === "object" &&
      typeof (item as Property).id === "string" &&
      typeof (item as Property).title_ar === "string" &&
      typeof (item as Property).price === "number" &&
      (item as Property).price > 0 &&
      ["sale", "rent"].includes((item as Property).type) &&
      ["house", "apartment", "commercial", "land"].includes(
        (item as Property).category,
      ),
  );
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useLocalStorage<Language>("aqari_lang", "ar");
  const [theme, setThemeState] = useLocalStorage<Theme>("aqari_theme", "dark");
  const [currency, setCurrencyState] = useLocalStorage<Currency>(
    "aqari_currency",
    "usd",
  );
  const [favoriteIds, setFavoriteIds] = useLocalStorage<string[]>(
    "aqari_favorites",
    [],
  );
  const [properties, setProperties] = useState<Property[]>([]);
  const [notifications, setNotifications] = useLocalStorage<AppNotification[]>(
    "aqari_notifications",
    [],
  );
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);

  const favorites = useMemo(() => new Set(favoriteIds), [favoriteIds]);
  const formatters = useMemo(
    () => ({
      usd: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
      syp: new Intl.NumberFormat("ar-SY", {
        style: "decimal",
        maximumFractionDigits: 0,
      }),
    }),
    [],
  );

  const setLang = (newLang: Language) => {
    setLangState(newLang);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
  };

  const formatPrice = useCallback(
    (price: number): string => {
      if (currency === "usd") return formatters.usd.format(price);
      return `${formatters.syp.format(price)} ل.س`;
    },
    [currency, formatters],
  );

  useEffect(() => {
    getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    const {
      data: { subscription },
    } = onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        localStorage.removeItem("aqari_guest");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("dir", lang === "en" ? "ltr" : "rtl");
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const t = useCallback(
    (key: TranslationKey) => {
      return i18n[lang][key] || key;
    },
    [lang],
  );

  const refreshProperties = useCallback(async (page = 1, perPage = 12, append = false) => {
    setLoading(true);
    const start = (page - 1) * perPage;
    const end = start + perPage - 1;
    let attempts = 0;
    const maxAttempts = 2;
    

    while (attempts < maxAttempts) {
      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .order("created_at", { ascending: false })
          .range(start, end);
        if (error) throw error;
        const list = data || [];
        setLoading(false);
        setProperties(prev => {
          const next = append ? [...prev, ...list] : list;
          try {
            localStorage.setItem(
              "properties_cache",
              JSON.stringify({ ts: Date.now(), data: next }),
            );
          } catch (e) {
            logger.warn("cache write failed", e);
          }
          return next;
        });
        return;
      } catch (err) {
        attempts += 1;
        logger.error("refreshProperties failed", err);
        if (attempts >= maxAttempts) {
          try {
            const cached = localStorage.getItem("properties_cache");
            if (cached) {
              const parsed = JSON.parse(cached) as { data?: Property[] };
              setProperties(isValidPropertyArray(parsed.data) ? parsed.data : []);
              toast.error(t("properties_cache_fallback"));
            } else {
              setProperties([]);
              toast.error(t("properties_load_error"));
            }
          } catch (e) {
            logger.error("Failed to load properties from cache", e);
            setProperties([]);
            toast.error(t("properties_load_error"));
          }
        } else {
          await new Promise((r) => setTimeout(r, 400 * attempts));
        }
      }
    }
    setLoading(false);
  }, [t]);

  const refreshNotifications = useCallback(async (opts?: { limit?: number }) => {
    const limit = opts?.limit ?? 10;
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      const mapped = (data || []).map((notification: SupabaseNotification) => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        createdAt: notification.created_at,
        read: false,
      }));
      setNotifications(mapped.slice(0, 20));
    } catch (err) {
      logger.error("refreshNotifications failed", err);
    }
  }, [setNotifications]);

  const addNotification = (title: string, message: string) => {
    const nextNotification: AppNotification = {
      id:
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`,
      title,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [nextNotification, ...prev].slice(0, 20));
  };

  const refreshContactInfo = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("contact_info")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        const valid = validateContactInfo({
          whatsapp: data.whatsapp,
          phone: data.phone,
          email: data.email,
        });
        if (!valid.valid) {
          logger.warn(
            "Contact info from server failed validation",
            valid.errors,
          );
        }
        setContactInfo(data);
        try {
          localStorage.setItem("contact_cache", JSON.stringify(data));
        } catch {
          /* ignore */
        }
      }
    } catch (err) {
      logger.error("refreshContactInfo failed", err);
      try {
        const cached = localStorage.getItem("contact_cache");
        if (cached) {
          const parsed = JSON.parse(cached) as ContactInfo;
          setContactInfo(parsed);
        }
      } catch (e) {
        logger.error("Failed to load contact cache", e);
      }
    }
  }, []);

  const loadMoreProperties = async (page = 1, perPage = 12) => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      await refreshProperties(page, perPage, true);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([
        refreshProperties(),
        refreshNotifications(),
        refreshContactInfo(),
      ]);
      setLoading(false);
    };
    init();
  }, [refreshProperties,
      refreshNotifications,
      refreshContactInfo,
  ]);

  const toggleFavorite = (id: string) => {
    if (!user) {
      toast.error(t("login_to_save_fav"), {
        action: {
          label: t("login"),
          onClick: () => {
            window.location.href = "/auth";
          },
        },
      });
      return;
    }

    const nextFavorites = new Set(favoriteIds);
    if (nextFavorites.has(id)) {
      nextFavorites.delete(id);
      toast.success(t("fav_removed"), {
        style: {
          background: "var(--toast-bg)",
          color: "var(--toast-color)",
          borderColor: "var(--toast-border)",
        },
      });
    } else {
      nextFavorites.add(id);
      toast.success(t("fav_added"), {
        style: {
          background: "var(--toast-bg)",
          color: "var(--toast-color)",
          borderColor: "var(--toast-border)",
        },
      });
    }
    setFavoriteIds(Array.from(nextFavorites));
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        theme,
        setTheme,
        currency,
        setCurrency,
        formatPrice,
        t,
        favorites,
        toggleFavorite,
        properties,
        notifications,
        addNotification,
        contactInfo,
        loading,
        isLoadingMore,
        user,
        isLoggedIn: !!user,
        refreshProperties,
        refreshNotifications,
        refreshContactInfo,
        loadMoreProperties,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
