import { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import type { TranslationKey } from "../i18n";

export function usePageTitle(titleKey: TranslationKey) {
  const { t } = useAppContext();

  useEffect(() => {
    document.title = `${t(titleKey)} — عقاري`;
  }, [t, titleKey]);
}
