import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Trash2,
  Edit2,
  BarChart2,
  LogOut,
  Loader as Loader2,
} from "lucide-react";
import {
  supabase,
  Property,
  Notification,
  signIn,
  signOut,
  getSession,
  onAuthStateChange,
} from "@/lib/supabase";
import { validateProperty } from "@/lib/validators";
import { useAppContext } from "../context/AppContext";
import { toast } from "sonner";
import logger from "@/lib/logger";
import { motion, AnimatePresence } from "motion/react";

type PropertyFormData = Omit<Property, "id" | "created_at" | "is_favorite">;

interface FormState {
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  type: "sale" | "rent";
  category: "house" | "apartment" | "commercial" | "land";
  price: number;
  rooms: number;
  bathrooms: number;
  area: number;
  phone: string;
  location_ar: string;
  location_en: string;
  agent_name_ar: string;
  agent_name_en: string;
  image_url: string;
  image_urls: string[];
  lat?: number;
  lng?: number;
}

const emptyProperty = (): FormState => ({
  title_ar: "",
  title_en: "",
  description_ar: "",
  description_en: "",
  type: "sale",
  category: "house",
  price: 0,
  rooms: 0,
  bathrooms: 0,
  area: 0,
  phone: "",
  location_ar: "",
  location_en: "",
  agent_name_ar: "",
  agent_name_en: "",
  image_url: "",
  image_urls: [],
  lat: undefined,
  lng: undefined,
});

interface PropertyFormProps {
  data: FormState;
  onChange: (data: FormState) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isEditing: boolean;
  isLoading: boolean;
}

function UrlPreview({ url }: { url: string }) {
  const { t } = useAppContext();
  const [valid, setValid] = useState<boolean | null>(null);
  const debounceRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!url) {
      setValid(null);
      return;
    }
    setValid(null);
    debounceRef.current = window.setTimeout(() => {
      const img = new Image();
      img.onload = () => setValid(true);
      img.onerror = () => setValid(false);
      img.src = url;
    }, 600);
    return () => {
      if (debounceRef.current !== null) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [url]);
  if (!url) return null;
  if (valid === true)
    return (
      <img
        src={url}
        alt="preview"
        className="h-32 rounded-lg object-cover"
        loading="lazy"
        decoding="async"
      />
    );
  return (
    <div className="h-32 rounded-lg bg-surface-2 border border-border-subtle flex items-center justify-center text-sm text-red-500">
      {t("admin_image_invalid")}
    </div>
  );
}

function PropertyForm({
  data,
  onChange,
  onSubmit,
  onCancel,
  isEditing,
  isLoading,
}: PropertyFormProps) {
  const { t } = useAppContext();

  const set = <K extends keyof PropertyFormData>(
    key: K,
    value: PropertyFormData[K],
  ) => onChange({ ...data, [key]: value });

  const [mainImageValid, setMainImageValid] = useState<boolean | null>(null);
  const debounceRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const url = data.image_url;
    if (!url) {
      setMainImageValid(null);
      return;
    }
    setMainImageValid(null);
    debounceRef.current = window.setTimeout(() => {
      const img = new Image();
      img.onload = () => setMainImageValid(true);
      img.onerror = () => setMainImageValid(false);
      img.src = url;
    }, 600);
    return () => {
      if (debounceRef.current !== null) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [data.image_url]);

  const addExtraImage = () => {
    if ((data.image_urls?.length || 0) < 5) {
      set("image_urls", [...(data.image_urls || []), ""]);
    }
  };

  const updateExtra = (index: number, value: string) => {
    const urls = [...(data.image_urls || [])];
    urls[index] = value;
    set("image_urls", urls);
  };

  const removeExtra = (index: number) => {
    set(
      "image_urls",
      (data.image_urls || []).filter((_, i) => i !== index),
    );
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="grid grid-cols-2 gap-4 mb-6 p-5 bg-surface-1 rounded-2xl border border-border-subtle"
    >
      <div className="col-span-2">
        <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-[0.2em]">
          {isEditing ? t("admin_form_edit_title") : t("admin_form_add_title")}
        </label>
      </div>

      <input
        type="text"
        placeholder={t("admin_ph_title_ar")}
        value={data.title_ar}
        onChange={(e) => set("title_ar", e.target.value)}
        className="px-3 py-2 bg-surface-0 border border-border-subtle rounded-lg text-text-main text-sm focus:outline-none focus:border-amber-500"
      />
      <input
        type="text"
        placeholder={t("admin_ph_title_en")}
        value={data.title_en}
        onChange={(e) => set("title_en", e.target.value)}
        className="px-3 py-2 bg-surface-0 border border-border-subtle rounded-lg text-text-main text-sm focus:outline-none focus:border-amber-500"
      />

      <textarea
        placeholder={t("admin_ph_desc_ar")}
        value={data.description_ar}
        onChange={(e) => set("description_ar", e.target.value)}
        className="col-span-2 px-3 py-3 bg-surface-0 border border-border-subtle rounded-lg text-text-main text-sm focus:outline-none focus:border-amber-500 h-auto"
        rows={3}
      />
      <textarea
        placeholder={t("admin_ph_desc_en")}
        value={data.description_en}
        onChange={(e) => set("description_en", e.target.value)}
        className="col-span-2 px-3 py-3 bg-surface-0 border border-border-subtle rounded-lg text-text-main text-sm focus:outline-none focus:border-amber-500 h-auto"
        rows={3}
      />

      <select
        value={data.type}
        onChange={(e) => set("type", e.target.value as "sale" | "rent")}
        className="px-3 py-2 bg-surface-0 border border-border-subtle rounded-lg text-text-main text-sm focus:outline-none focus:border-amber-500"
      >
        <option value="sale">{t("admin_type_sale")}</option>
        <option value="rent">{t("admin_type_rent")}</option>
      </select>
      <select
        value={data.category}
        onChange={(e) =>
          set(
            "category",
            e.target.value as "house" | "apartment" | "commercial" | "land",
          )
        }
        className="px-3 py-2 bg-surface-0 border border-border-subtle rounded-lg text-text-main text-sm focus:outline-none focus:border-amber-500"
      >
        <option value="house">{t("admin_cat_house")}</option>
        <option value="apartment">{t("admin_cat_apartment")}</option>
        <option value="commercial">{t("admin_cat_commercial")}</option>
        <option value="land">{t("admin_cat_land")}</option>
      </select>

      <input
        type="number"
        min="1"
        placeholder={t("admin_ph_price")}
        value={data.price}
        onChange={(e) => set("price", Number(e.target.value))}
        className="px-3 py-2 bg-surface-0 border border-border-subtle rounded-lg text-text-main text-sm focus:outline-none focus:border-amber-500"
      />
      <input
        type="number"
        min="1"
        placeholder={t("admin_ph_area")}
        value={data.area}
        onChange={(e) => set("area", Number(e.target.value))}
        className="px-3 py-2 bg-surface-0 border border-border-subtle rounded-lg text-text-main text-sm focus:outline-none focus:border-amber-500"
      />

      <input
        type="number"
        min="0"
        max="100"
        step="1"
        placeholder={t("admin_ph_rooms")}
        value={data.rooms}
        onChange={(e) => set("rooms", Number(e.target.value))}
        className="px-3 py-2 bg-surface-0 border border-border-subtle rounded-lg text-text-main text-sm focus:outline-none focus:border-amber-500"
      />
      <input
        type="number"
        min="0"
        max="30"
        step="1"
        placeholder={t("admin_ph_bathrooms")}
        value={data.bathrooms}
        onChange={(e) => set("bathrooms", Number(e.target.value))}
        className="px-3 py-2 bg-surface-0 border border-border-subtle rounded-lg text-text-main text-sm focus:outline-none focus:border-amber-500"
      />

      <input
        type="text"
        placeholder={t("admin_ph_location_ar")}
        value={data.location_ar}
        onChange={(e) => set("location_ar", e.target.value)}
        className="col-span-2 px-3 py-2 bg-surface-0 border border-border-subtle rounded-lg text-text-main text-sm focus:outline-none focus:border-amber-500"
      />
      <input
        type="text"
        placeholder={t("admin_ph_location_en")}
        value={data.location_en}
        onChange={(e) => set("location_en", e.target.value)}
        className="col-span-2 px-3 py-2 bg-surface-0 border border-border-subtle rounded-lg text-text-main text-sm focus:outline-none focus:border-amber-500"
      />

      <input
        type="text"
        placeholder={t("admin_ph_agent_ar")}
        value={data.agent_name_ar}
        onChange={(e) => set("agent_name_ar", e.target.value)}
        className="col-span-2 px-3 py-2 bg-surface-0 border border-border-subtle rounded-lg text-text-main text-sm focus:outline-none focus:border-amber-500"
      />
      <input
        type="text"
        placeholder={t("admin_ph_agent_en")}
        value={data.agent_name_en}
        onChange={(e) => set("agent_name_en", e.target.value)}
        className="col-span-2 px-3 py-2 bg-surface-0 border border-border-subtle rounded-lg text-text-main text-sm focus:outline-none focus:border-amber-500"
      />

      <input
        type="tel"
        placeholder={t("admin_ph_phone")}
        value={data.phone}
        onChange={(e) => set("phone", e.target.value)}
        className="col-span-2 px-3 py-2 bg-surface-0 border border-border-subtle rounded-lg text-text-main text-sm focus:outline-none focus:border-amber-500"
      />

      <input
        type="text"
        placeholder={t("admin_ph_image_url")}
        value={data.image_url}
        onChange={(e) => set("image_url", e.target.value)}
        className="col-span-2 px-3 py-2 bg-surface-0 border border-border-subtle rounded-lg text-text-main text-sm focus:outline-none focus:border-amber-500"
      />
      {data.image_url ? (
        <div className="col-span-2 mb-4">
          {mainImageValid === true ? (
            <img
              src={data.image_url}
              alt="preview"
              className="h-32 rounded-lg object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : mainImageValid === false ? (
            <div className="h-32 rounded-lg bg-surface-2 border border-border-subtle flex items-center justify-center text-sm text-red-500">
              {t("admin_image_invalid")}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="col-span-2">
        <div className="text-xs text-text-muted mb-2 font-semibold">
          {t("admin_extra_images")} ({data.image_urls?.length || 0}/5)
        </div>
        {data.image_urls?.map((url, idx) => (
          <div key={url || idx} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder={`${t("admin_extra_image")} ${idx + 1}`}
              value={url}
              onChange={(e) => updateExtra(idx, e.target.value)}
              className="flex-1 px-3 py-2 bg-surface-0 border border-border-subtle rounded-lg text-text-main text-sm focus:outline-none focus:border-amber-500"
            />
            <div className="flex items-center gap-2">
              <div className="w-24">
                <UrlPreview url={url} />
              </div>
              <button
                type="button"
                onClick={() => removeExtra(idx)}
                className="px-3 py-2 bg-red-500/10 text-red-500 rounded-lg text-sm font-bold hover:bg-red-500/20"
              >
                ×
              </button>
            </div>
          </div>
        ))}
        {(data.image_urls?.length || 0) < 5 && (
          <button
            type="button"
            onClick={addExtraImage}
            className="w-full py-2 text-sm text-amber-500 border border-amber-500/30 rounded-lg hover:bg-amber-500/10 transition-colors"
          >
            {t("admin_add_image")}
          </button>
        )}
      </div>

      <input
        type="number"
        step="any"
        min="-90"
        max="90"
        placeholder={t("admin_ph_lat")}
        value={data.lat ?? ""}
        onChange={(e) =>
          set("lat", e.target.value ? Number(e.target.value) : undefined)
        }
        className="px-3 py-2 bg-surface-0 border border-border-subtle rounded-lg text-text-main text-sm focus:outline-none focus:border-amber-500"
      />
      <input
        type="number"
        step="any"
        min="-180"
        max="180"
        placeholder={t("admin_ph_lng")}
        value={data.lng ?? ""}
        onChange={(e) =>
          set("lng", e.target.value ? Number(e.target.value) : undefined)
        }
        className="px-3 py-2 bg-surface-0 border border-border-subtle rounded-lg text-text-main text-sm focus:outline-none focus:border-amber-500"
      />

      <div className="col-span-2 flex gap-3 mt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-stone-900 font-bold hover:shadow-lg transition-shadow disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin inline" />
          ) : isEditing ? (
            t("admin_save")
          ) : (
            t("admin_add_property")
          )}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-lg bg-surface-1 border border-border-subtle text-text-main font-bold hover:bg-surface-2 transition-colors"
          >
            {t("admin_cancel")}
          </button>
        )}
      </div>
    </form>
  );
}

type AdminTab = "add" | "list" | "stats" | "notifications";

export function AdminPage() {
  const { t, formatPrice, lang, refreshProperties, refreshNotifications } =
    useAppContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>("add");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormState>(emptyProperty());
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingTab, setPendingTab] = useState<AdminTab | null>(null);
  const [adminNotifications, setAdminNotifications] = useState<Notification[]>(
    [],
  );
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const editFormRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(2);
  const limit = 20;

  const handleApiError = (err: unknown, userFacingKey: string) => {
    console.error("FULL ADMIN ERROR:");
    logger.error("Admin API error", err);
    toast.error(t(userFacingKey));
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await getSession();
        const session = data.session;
        if (!session) {
          setIsAuthenticated(false);
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", session.user.id)
          .single();

        if (error) {
          logger.error("Failed to verify admin profile", error);
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(profile?.is_admin === true);
      } catch (err) {
        logger.error("Failed to check admin authentication", err);
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();

    const {
      data: { subscription },
    } = onAuthStateChange(async (_event, session) => {
      const user = session?.user;
      if (!user) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();

        if (error) {
          logger.error("Failed to verify admin profile on auth change", error);
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(profile?.is_admin === true);
      } catch (err) {
        logger.error("Failed to handle auth state change", err);
        setIsAuthenticated(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadProperties = useCallback(async () => {
    setLoading(true);
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .range(from, to)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setProperties(data || []);
    } catch (err) {
      logger.error("Failed to load properties", err);
      toast.error(t("admin_err_load_properties"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const loadAdminNotifications = useCallback(async () => {
    setNotificationsLoading(true);
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setAdminNotifications(data || []);
    } catch (err) {
      logger.error("Failed to load notifications", err);
      toast.error(t("admin_err_load_notifications"));
    } finally {
      setNotificationsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (isAuthenticated) {
      loadProperties();
    }
  }, [isAuthenticated, loadProperties]);

  useEffect(() => {
    if (isAuthenticated && activeTab === "notifications") {
      loadAdminNotifications();
    }
  }, [isAuthenticated, activeTab, loadAdminNotifications]);

  useEffect(() => {
    if (editingProperty && activeTab === "list") {
      editFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [editingProperty, activeTab]);

  const stats = useMemo(() => {
    const acc = {
      total: 0,
      saleCount: 0,
      rentCount: 0,
      saleSum: 0,
      rentSum: 0,
      latestDate: 0,
      catCounts: {
        house: 0,
        apartment: 0,
        commercial: 0,
        land: 0,
      } as Record<Property["category"], number>,
    };

    for (const p of properties) {
      acc.total++;
      if (p.type === "sale") {
        acc.saleCount++;
        acc.saleSum += p.price;
      } else {
        acc.rentCount++;
        acc.rentSum += p.price;
      }

      const t = new Date(p.created_at).getTime();
      if (t > acc.latestDate) acc.latestDate = t;

      if (p.category in acc.catCounts) {
        acc.catCounts[p.category]++;
      }
    }

    return {
      ...acc,
      avgSalePrice: acc.saleCount ? Math.round(acc.saleSum / acc.saleCount) : 0,
      avgRentPrice: acc.rentCount ? Math.round(acc.rentSum / acc.rentCount) : 0,
    };
  }, [properties]);

  const populateFormFromProperty = (prop: Property): FormState => ({
    title_ar: prop.title_ar,
    title_en: prop.title_en,
    description_ar: prop.description_ar ?? "",
    description_en: prop.description_en ?? "",
    type: prop.type,
    category: prop.category,
    price: prop.price,
    rooms: prop.rooms,
    bathrooms: prop.bathrooms,
    area: prop.area,
    phone: prop.phone,
    location_ar: prop.location_ar,
    location_en: prop.location_en,
    agent_name_ar: prop.agent_name_ar,
    agent_name_en: prop.agent_name_en,
    image_url: prop.image_url,
    image_urls: prop.image_urls ?? [],
    lat: prop.lat ?? undefined,
    lng: prop.lng ?? undefined,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast.error(t("admin_err_login"));
    }
    setAuthLoading(false);
  };

  const applyTabSwitch = (tab: AdminTab) => {
    setPendingTab(null);
    setPendingDeleteId(null);
    if (tab === "add") {
      setEditingProperty(null);
      setFormData(emptyProperty());
    }
    setActiveTab(tab);
  };

  const handleTabSwitch = (tab: AdminTab) => {
    const isDirty =
      formData.title_ar !== "" ||
      formData.title_en !== "" ||
      formData.price !== 0;
    if (isDirty && tab !== "add" && !editingProperty) {
      setPendingTab(tab);
      return;
    }
    applyTabSwitch(tab);
  };

  const handleLogout = async () => {
    await signOut();
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
    toast.info(t("admin_logged_out"));
  };

  const handleSubmit = async () => {
    const validation = validateProperty(formData);
    if (!validation.valid) {
      toast.error(validation.errors[0]?.message || t("admin_err_validation"));
      return;
    }

    setLoading(true);
    try {
      if (editingProperty) {
        const { error } = await supabase
          .from("properties")
          .update(formData)
          .eq("id", editingProperty.id);
        if (error) throw error;
        toast.success(t("admin_success_updated"));
        setEditingProperty(null);
      } else {
        const { error } = await supabase.from("properties").insert([formData]);
        if (error) throw error;
        toast.success(t("admin_success_added"));
      }
      setFormData(emptyProperty());
      await loadProperties();
      await refreshProperties();
    } catch (err: unknown) {
      handleApiError(err, "admin_err_operation");
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      const { error } = await supabase.from("properties").delete().eq("id", id);
      if (error) throw error;
      toast.success(t("admin_success_deleted_property"));
      setPendingDeleteId(null);
      await loadProperties();
      await refreshProperties();
    } catch (err) {
      logger.error("Delete failed", err);
      toast.error(t("admin_err_delete_property"));
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast.success(t("admin_success_deleted_notification"));
      await loadAdminNotifications();
      await refreshNotifications();
    } catch (err) {
      logger.error("Delete notification failed", err);
      toast.error(t("admin_err_delete_notification"));
    }
  };
  const createNotification = async () => {
  if (!notificationTitle.trim() || !notificationMessage.trim()) {
    toast.error("يرجى إدخال العنوان والرسالة");
    return;
  }

  try {
    const { error } = await supabase.from("notifications").insert([
      {
        title: notificationTitle.trim(),
        message: notificationMessage.trim(),
      },
    ]);

    if (error) throw error;

    toast.success("تم إرسال الإشعار");

    setNotificationTitle("");
    setNotificationMessage("");

    await loadAdminNotifications();
    await refreshNotifications();
  } catch (err) {
    console.error("Notification error", err);
    logger.error("Create notification failed", err);
    toast.error("فشل إرسال الإشعار");
  }
};


  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-surface-0 rounded-3xl p-8 border border-border-subtle shadow-2xl"
        >
          <h1 className="text-3xl font-bold text-text-main mb-2">
            {t("admin_login_title")}
          </h1>
          <p className="text-text-muted mb-8">{t("admin_login_subtitle")}</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text-main mb-2">
                {t("admin_email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-surface-1 border border-border-subtle rounded-xl text-text-main focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-main mb-2">
                {t("admin_password")}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-surface-1 border border-border-subtle rounded-xl text-text-main focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-stone-900 font-bold hover:shadow-lg transition-shadow disabled:opacity-50"
            >
              {authLoading ? (
                <Loader2 className="w-4 h-4 animate-spin inline" />
              ) : (
                t("admin_login_btn")
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="flex items-center justify-between mb-8 pt-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-extrabold text-text-main">
            {t("admin_title")}
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 font-bold hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {t("admin_logout")}
          </button>
        </motion.div>

        {pendingTab && (
          <div className="mb-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-text-main">{t("admin_unsaved_warning")}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => applyTabSwitch(pendingTab)}
                className="px-4 py-2 rounded-lg bg-amber-500 text-stone-900 text-sm font-bold"
              >
                {t("admin_yes")}
              </button>
              <button
                type="button"
                onClick={() => setPendingTab(null)}
                className="px-4 py-2 rounded-lg bg-surface-2 border border-border-subtle text-text-main text-sm font-bold"
              >
                {t("admin_no")}
              </button>
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2 mb-8 bg-surface-1 p-1 rounded-2xl border border-border-subtle flex-wrap"
        >
          {(
            [
              { id: "add", labelKey: "admin_tab_add" as const },
              { id: "list", labelKey: "admin_tab_list" as const },
              {
                id: "stats",
                labelKey: "admin_tab_stats" as const,
                icon: BarChart2,
              },
              {
                id: "notifications",
                labelKey: "admin_tab_notifications" as const,
              },
            ] as Array<{
              id: AdminTab;
              labelKey:
                | "admin_tab_add"
                | "admin_tab_list"
                | "admin_tab_stats"
                | "admin_tab_notifications";
              icon?: LucideIcon;
            }>
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabSwitch(tab.id)}
              className={`relative flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === tab.id
                  ? "text-stone-900"
                  : "text-text-muted hover:text-text-main"
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="admin-tab"
                  className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl shadow-md"
                />
              )}
              {tab.icon && <tab.icon className="w-4 h-4" />}
              <span className="relative z-10">{t(tab.labelKey)}</span>
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === "add" && (
            <motion.div
              key="add"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <PropertyForm
                data={formData}
                onChange={setFormData}
                onSubmit={handleSubmit}
                onCancel={() => setEditingProperty(null)}
                isEditing={!!editingProperty}
                isLoading={loading}
              />
            </motion.div>
          )}

          {activeTab === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  {editingProperty && (
                    <div
                      ref={editFormRef}
                      className="mb-6 rounded-2xl border border-amber-500/30 bg-surface-1 p-5 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div>
                          <p className="text-amber-500 font-semibold">
                            {t("admin_edit_property")}
                          </p>
                          <p className="text-text-muted text-sm">
                            {t("admin_edit_hint")}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingProperty(null)}
                          className="px-4 py-2 rounded-xl bg-surface-2 border border-border-subtle text-text-main hover:bg-surface-3 transition-colors"
                        >
                          ✕ {t("admin_cancel")}
                        </button>
                      </div>
                      <PropertyForm
                        data={formData}
                        onChange={setFormData}
                        onSubmit={handleSubmit}
                        onCancel={() => setEditingProperty(null)}
                        isEditing={true}
                        isLoading={loading}
                      />
                    </div>
                  )}
                  {properties.map((prop) => (
                    <motion.div
                      key={prop.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 bg-surface-1 rounded-xl border border-border-subtle hover:border-amber-500/30 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-text-main truncate">
                            {prop.title_ar}
                          </p>
                          <p className="text-xs text-text-muted">
                            {formatPrice(prop.price)}
                          </p>
                        </div>
                        {pendingDeleteId === prop.id ? (
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <p className="text-sm text-red-500 font-semibold">
                              {t("admin_confirm_delete")}
                            </p>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => deleteProperty(prop.id)}
                                className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold"
                              >
                                {t("admin_yes")}
                              </button>
                              <button
                                type="button"
                                onClick={() => setPendingDeleteId(null)}
                                className="px-3 py-1.5 rounded-lg bg-surface-2 border border-border-subtle text-text-main text-xs font-bold"
                              >
                                {t("admin_no")}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => {
                                setFormData(populateFormFromProperty(prop));
                                setEditingProperty(prop);
                                setActiveTab("list");
                              }}
                              className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
                              title={t("admin_edit")}
                              aria-label={t("admin_edit")}
                            >
                              <Edit2 className="w-4 h-4" aria-hidden="true" />
                            </button>
                            <button
                              onClick={() => setPendingDeleteId(prop.id)}
                              className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                              title={t("admin_delete")}
                              aria-label={t("admin_delete")}
                            >
                              <Trash2 className="w-4 h-4" aria-hidden="true" />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="mb-6 space-y-3">
  <input
    type="text"
    placeholder="عنوان الإشعار"
    value={notificationTitle}
    onChange={(e) => setNotificationTitle(e.target.value)}
    className="w-full px-4 py-3 bg-surface-1 border border-border-subtle rounded-xl text-text-main"
  />

  <textarea
    placeholder="نص الإشعار"
    value={notificationMessage}
    onChange={(e) => setNotificationMessage(e.target.value)}
    className="w-full px-4 py-3 bg-surface-1 border border-border-subtle rounded-xl text-text-main min-h-[120px]"
  />

  <button
    type="button"
    onClick={createNotification}
    className="px-5 py-3 rounded-xl bg-amber-500 text-stone-900 font-bold"
  >
    إرسال إشعار
  </button>
</div>
              {notificationsLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                </div>
              ) : adminNotifications.length === 0 ? (
                <p className="text-center text-text-muted py-12">
                  {t("admin_no_notifications")}
                </p>
              ) : (
                <div className="space-y-3">
                  {adminNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start justify-between gap-3 p-4 bg-surface-1 rounded-xl border border-border-subtle"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-text-main text-sm mb-1">
                          {notification.title}
                        </p>
                        <p className="text-xs text-text-muted leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-text-muted mt-2">
                          {new Date(notification.created_at).toLocaleString(
                            lang === "ar" ? "ar-SY" : "en-US",
                          )}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors shrink-0"
                        title={t("admin_delete")}
                        aria-label={t("admin_delete")}
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "stats" && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-4 bg-surface-2 rounded-xl border border-border-subtle">
                  <p className="text-xs text-text-muted font-semibold mb-1">
                    {t("admin_stat_total")}
                  </p>
                  <p className="text-2xl font-bold text-amber-500">
                    {stats.total}
                  </p>
                </div>
                <div className="p-4 bg-surface-2 rounded-xl border border-border-subtle">
                  <p className="text-xs text-text-muted font-semibold mb-1">
                    {t("admin_stat_sale")}
                  </p>
                  <p className="text-2xl font-bold text-amber-500">
                    {stats.saleCount}
                  </p>
                </div>
                <div className="p-4 bg-surface-2 rounded-xl border border-border-subtle">
                  <p className="text-xs text-text-muted font-semibold mb-1">
                    {t("admin_stat_rent")}
                  </p>
                  <p className="text-2xl font-bold text-amber-500">
                    {stats.rentCount}
                  </p>
                </div>
                <div className="p-4 bg-surface-2 rounded-xl border border-border-subtle">
                  <p className="text-xs text-text-muted font-semibold mb-1">
                    {t("admin_stat_latest")}
                  </p>
                  <p className="text-2xl font-bold text-amber-500">
                    {stats.latestDate > 0
                      ? new Date(stats.latestDate).toLocaleDateString(
                          lang === "ar" ? "ar-SY" : "en-US",
                        )
                      : "-"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-4 bg-surface-1 rounded-xl border border-border-subtle">
                  <p className="text-xs text-text-muted font-semibold mb-1">
                    {t("admin_stat_avg_sale")}
                  </p>
                  <p className="text-lg font-bold text-amber-500">
                    {stats.avgSalePrice > 0
                      ? formatPrice(stats.avgSalePrice)
                      : "-"}
                  </p>
                </div>
                <div className="p-4 bg-surface-1 rounded-xl border border-border-subtle">
                  <p className="text-xs text-text-muted font-semibold mb-1">
                    {t("admin_stat_avg_rent")}
                  </p>
                  <p className="text-lg font-bold text-amber-500">
                    {stats.avgRentPrice > 0
                      ? formatPrice(stats.avgRentPrice)
                      : "-"}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-surface-1 rounded-3xl border border-border-subtle">
                <p className="text-xs text-text-muted font-semibold mb-4">
                  {t("admin_stat_by_category")}
                </p>
                <div className="space-y-4">
                  {[
                    {
                      key: "house",
                      labelKey: "admin_stat_houses" as const,
                      count: stats.catCounts.house,
                    },
                    {
                      key: "apartment",
                      labelKey: "admin_stat_apartments" as const,
                      count: stats.catCounts.apartment,
                    },
                    {
                      key: "commercial",
                      labelKey: "admin_stat_commercial" as const,
                      count: stats.catCounts.commercial,
                    },
                    {
                      key: "land",
                      labelKey: "admin_stat_land" as const,
                      count: stats.catCounts.land,
                    },
                  ].map((cat) => (
                    <div key={cat.key} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-main font-medium">
                          {t(cat.labelKey)}
                        </span>
                        <span className="text-amber-500 font-semibold">
                          {cat.count}
                        </span>
                      </div>
                      <div className="h-3 rounded-full bg-surface-2 overflow-hidden">
                        <div
                          className="h-full bg-amber-500 transition-all duration-700"
                          style={{
                            width: `${stats.total > 0 ? (cat.count / stats.total) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
