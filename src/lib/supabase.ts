import { createClient } from "@supabase/supabase-js";
import logger from "@/lib/logger";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  logger.error(
    `[Aqari] Missing Supabase environment variables. Copy .env.example to .env and fill in your credentials.`,
  );
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Property = {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar?: string;
  description_en?: string;
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
  image_urls?: string[];
  lat?: number | null;
  lng?: number | null;
  created_at: string;
  is_favorite?: boolean;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  created_at: string;
};

export type ContactInfo = {
  id: string;
  whatsapp: string;
  phone: string;
  email: string;
  created_at: string;
};

export const signIn = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password });

export const signUp = (email: string, password: string) =>
  supabase.auth.signUp({ email, password });

export const signOut = () => supabase.auth.signOut();

export const getSession = () => supabase.auth.getSession();

export const onAuthStateChange = (
  callback: Parameters<typeof supabase.auth.onAuthStateChange>[0],
) => supabase.auth.onAuthStateChange(callback);
