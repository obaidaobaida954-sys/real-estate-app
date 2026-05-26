export function relativeDate(isoString: string, lang: 'ar' | 'en'): string {
  const target = new Date(isoString).getTime();
  const diff = Date.now() - target;
  if (Number.isNaN(target) || diff < 0) return lang === 'ar' ? 'الآن' : 'Just now';

  const minutes = Math.floor(diff / 60000);
  const hours   = Math.floor(diff / 3600000);
  const days    = Math.floor(diff / 86400000);

  if (lang === 'en') {
    if (minutes < 1)  return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24)   return `${hours}h ago`;
    if (days < 7)     return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (days < 30)    return `${weeks}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
  }

  // Arabic — singular / dual / plural
  if (minutes < 1)  return 'الآن';
  if (minutes < 60) {
    if (minutes === 1) return 'منذ دقيقة';
    if (minutes === 2) return 'منذ دقيقتين';
    return `منذ ${minutes} دقائق`;
  }
  if (hours < 24) {
    if (hours === 1) return 'منذ ساعة';
    if (hours === 2) return 'منذ ساعتين';
    return `منذ ${hours} ساعات`;
  }
  if (days < 7) {
    if (days === 1) return 'منذ يوم';
    if (days === 2) return 'منذ يومين';
    return `منذ ${days} أيام`;
  }
  const weeks = Math.floor(days / 7);
  if (days < 30) {
    if (weeks === 1) return 'منذ أسبوع';
    if (weeks === 2) return 'منذ أسبوعين';
    return `منذ ${weeks} أسابيع`;
  }
  const months = Math.floor(days / 30);
  if (months === 1) return 'منذ شهر';
  if (months === 2) return 'منذ شهرين';
  return `منذ ${months} أشهر`;
}
