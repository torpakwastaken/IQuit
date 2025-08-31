export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString();
};

export const formatDateShort = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export const getDaysAgo = (date: string | Date): number => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
};

export const isToday = (date: string | Date): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return d.toDateString() === today.toDateString();
};

export const getWeekDays = (): string[] => {
  return ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
};

export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};