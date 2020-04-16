/**
 * Histogram by timestamp of an array of objects
 * @param items
 * @returns byMonth = [ { month: 4, value: 29 },
 *  { month: 5, value: 19 },
 *  { month: 6, value: 13 },
 *  { month: 7, value: 10 },
 *  { month: 8, value: 26 },
 *  { month: 9, value: 24 },
 *  { month: 10, value: 53 },
 *  { month: 11, value: 38 },
 *  { month: 0, value: 38 },
 *  { month: 1, value: 21 },
 *  { month: 2, value: 14 },
 *  { month: 3, value: 12 }
 * ]
 */
export function aggregateLast12Months<T extends { timestamp?: number }>(
  items: T[]
) {
  const getFullMonth = (date: Date) =>
    date.getFullYear() * 12 + date.getMonth();

  const byTime: { [fullMonth: number]: number } = {};
  for (const item of items)
    if (item.timestamp) {
      const fullMonth = getFullMonth(new Date(item.timestamp * 1000));
      byTime[fullMonth] = (byTime[fullMonth] || 0) + 1;
    }

  const currentFullMonth = getFullMonth(new Date());
  const aggregate: { month: number; count: number }[] = [];
  for (let i = currentFullMonth - 11; i <= currentFullMonth; i++)
    aggregate.push({ month: i % 12, count: byTime[i] || 0 });

  return aggregate;
}
