import { useAppContext } from "../context/AppContext";

export function AppLoadingFallback() {
  const { t } = useAppContext();
  return (
    <div className="w-full min-h-screen flex items-center justify-center text-text-muted">
      {t("loading")}
    </div>
  );
}
