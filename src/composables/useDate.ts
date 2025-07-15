export const getTodayStr = (): string => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const getYesterdayStr = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yyyy = yesterday.getFullYear();
  const mm = String(yesterday.getMonth() + 1).padStart(2, "0");
  const dd = String(yesterday.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const getWeekAgoStr = (): string => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const yyyy = weekAgo.getFullYear();
  const mm = String(weekAgo.getMonth() + 1).padStart(2, "0");
  const dd = String(weekAgo.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const getStartPrevPeriod = (start: string, end: string): string => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const diffMs = endDate.getTime() - startDate.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

  startDate.setDate(startDate.getDate() - days);

  const yyyy = startDate.getFullYear();
  const mm = String(startDate.getMonth() + 1).padStart(2, "0");
  const dd = String(startDate.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const getEndtPrevPeriod = (startCurrPeriod: string): string => {
  const date = new Date(startCurrPeriod);
  date.setDate(date.getDate() - 1);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const getAllPeriodByDays = (start: string, end: string): string[] => {
  const result: string[] = [];
  let current = new Date(start);
  const last = new Date(end);

  while (current <= last) {
    const yyyy = current.getFullYear();
    const mm = String(current.getMonth() + 1).padStart(2, "0");
    const dd = String(current.getDate()).padStart(2, "0");
    result.push(`${yyyy}-${mm}-${dd}`);

    current.setDate(current.getDate() + 1);
  }

  return result;
};
