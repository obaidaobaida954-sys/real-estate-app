export function relativeDate(isoString: string, lang: "ar" | "en"): string {
  const target = new Date(isoString).getTime();
  const diff = Date.now() - target;
  if (Number.isNaN(target) || diff < 0) {
    return lang === "ar" ? "الآن" : "Just now";
  }

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return lang === "ar" ? "الآن" : "Just now";
  if (minutes < 60)
    return lang === "ar"
      ? `منذ ${minutes} دقيقة`
      : `${minutes} min ago`;
  if (hours < 24)
    return lang === "ar"
      ? `منذ ${hours} ساعة`
      : `${hours} h ago`;

  if (days < 7) {
    return lang === "ar"
      ? days === 1
        ? "منذ يوم"
        : `منذ ${days} أيام`
      : `${days} d ago`;
  }

  if (days < 30) {
    const weeks = Math.floor(days / 7) || 1;
    return lang === "ar"
      ? weeks === 1
        ? "منذ أسبوع"
        : `منذ ${weeks} أسابيع`
      : `${weeks} w ago`;
  }

  const months = Math.floor(days / 30) || 1;
  return lang === "ar"
    ? months === 1
      ? "منذ شهر"
      : `منذ ${months} أشهر`
    : `${months} mo ago`;
}
