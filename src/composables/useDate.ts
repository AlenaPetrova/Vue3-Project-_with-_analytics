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

export const getTwoWeeksAgoStr = (): string => {
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const yyyy = twoWeeksAgo.getFullYear();
  const mm = String(twoWeeksAgo.getMonth() + 1).padStart(2, "0");
  const dd = String(twoWeeksAgo.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const getEightDaysAgoStr = (): string => {
  const eightDaysAgo = new Date();
  eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);
  const yyyy = eightDaysAgo.getFullYear();
  const mm = String(eightDaysAgo.getMonth() + 1).padStart(2, "0");
  const dd = String(eightDaysAgo.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const getPrevPeriod = (): string =>
  `${getTwoWeeksAgoStr()} - ${getEightDaysAgoStr()}`;

export const getCurrPeriod = (): string =>
  `${getWeekAgoStr()} - ${getYesterdayStr()}`;
