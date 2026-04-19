import dayjs from 'dayjs';

export const won = (n) => `${Number(n || 0).toLocaleString()}원`;
export const toDateLabel = (v) => (v ? dayjs(v).format('YYYY-MM-DD') : '-');
export const truncate = (v, len = 36) => (v?.length > len ? `${v.slice(0, len)}...` : v || '-');
