export function getRangeForPage(page = 1, perPage = 12) {
  const start = (page - 1) * perPage;
  const end = start + perPage - 1;
  return { start, end };
}

export function hasMoreFromLastFetch(lastFetchCount: number, perPage = 12) {
  return lastFetchCount >= perPage;
}
