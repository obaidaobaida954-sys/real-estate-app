import React, { useState } from "react";
import { useNavigate } from "react-router";
import { House, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { signIn, signUp } from "@/lib/supabase";
import { useAppContext } from "../context/AppContext";

type AuthMode = "signin" | "signup";

export function AuthPage() {
  const { t, lang } = useAppContext();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmBanner, setShowConfirmBanner] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};

    if (!isValidEmail(email)) {
      nextErrors.email =
        lang === "ar" ? "البريد الإلكتروني غير صحيح" : "Invalid email address";
    }
    if (password.length < 8) {
      nextErrors.password =
        lang === "ar"
          ? "كلمة المرور 8 أحرف على الأقل"
          : "Password must be at least 8 characters";
    }
    if (mode === "signup" && password !== confirmPassword) {
      nextErrors.confirmPassword =
        lang === "ar" ? "كلمات المرور غير متطابقة" : "Passwords do not match";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success(
          lang === "ar" ? "تم تسجيل الدخول" : "Signed in successfully",
        );
        navigate("/home");
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        toast.success(t("auth_signup_success"), { duration: 6000 });
        setMode("signin");
        setPassword("");
        setConfirmPassword("");
        setShowConfirmBanner(true);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const continueAsGuest = () => {
    localStorage.setItem("aqari_guest", "1");
    navigate("/home");
  };

  return (
    <motion.div className="min-h-[100dvh] w-full flex flex-col items-center justify-center relative overflow-hidden bg-black max-w-md mx-auto p-6">
      <motion.div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
      <motion.div className="absolute top-1/3 inset-x-0 h-[40vh] bg-amber-500/20 blur-[120px] z-0 mix-blend-screen" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-sm glass-floating border border-white/10 rounded-[2rem] p-8"
      >
        <motion.div className="flex flex-col items-center mb-8">
          <motion.div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-transparent border border-white/10 flex items-center justify-center mb-4">
            <House className="w-8 h-8 text-amber-400" strokeWidth={1.5} />
          </motion.div>
          <h1 className="text-2xl font-extrabold text-white">
            {t("app_name")}
          </h1>
        </motion.div>

        <motion.div className="flex gap-2 mb-6 bg-surface-1/50 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
              mode === "signin"
                ? "bg-gradient-to-r from-amber-400 to-amber-500 text-stone-900"
                : "text-text-muted"
            }`}
          >
            {t("auth_sign_in")}
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
              mode === "signup"
                ? "bg-gradient-to-r from-amber-400 to-amber-500 text-stone-900"
                : "text-text-muted"
            }`}
          >
            {t("auth_sign_up")}
          </button>
        </motion.div>

        {showConfirmBanner && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <p className="text-amber-500 text-xs text-center font-medium">
              {lang === "ar"
                ? "تم إرسال رسالة تأكيد إلى بريدك — تحقق منها قبل تسجيل الدخول"
                : "A confirmation email was sent — check your inbox before signing in"}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div>
            <label className="block text-sm text-gray-300 mb-2">
              {t("auth_email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 bg-surface-1 border border-border-subtle rounded-xl px-4 text-text-main focus:outline-none focus:border-amber-500/50"
              required
            />
            {errors.email ? (
              <p className="mt-2 text-xs text-red-400">{errors.email}</p>
            ) : null}
          </motion.div>
          <motion.div>
            <label className="block text-sm text-gray-300 mb-2">
              {t("auth_password")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 bg-surface-1 border border-border-subtle rounded-xl px-4 text-text-main focus:outline-none focus:border-amber-500/50"
              required
            />
            {errors.password ? (
              <p className="mt-2 text-xs text-red-400">{errors.password}</p>
            ) : null}
          </motion.div>
          {mode === "signup" && (
            <motion.div>
              <label className="block text-sm text-gray-300 mb-2">
                {t("auth_confirm_password")}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 bg-surface-1 border border-border-subtle rounded-xl px-4 text-text-main focus:outline-none focus:border-amber-500/50"
                required
              />
              {errors.confirmPassword ? (
                <p className="mt-2 text-xs text-red-400">
                  {errors.confirmPassword}
                </p>
              ) : null}
            </motion.div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold btn-premium disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin inline" />
            ) : mode === "signin" ? (
              t("auth_sign_in")
            ) : (
              t("auth_sign_up")
            )}
          </button>
        </form>

        <button
          type="button"
          onClick={continueAsGuest}
          className="w-full mt-4 py-3 text-sm text-white/70 hover:text-white transition-colors"
        >
          {t("auth_continue_guest")}
        </button>
      </motion.div>
    </motion.div>
  );
}
