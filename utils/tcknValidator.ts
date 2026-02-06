
export const validateTCKN = (tckn: string): boolean => {
  const rawTckn = tckn.replace(/[^0-9]/g, '');
  if (rawTckn.length !== 11) return false;
  if (rawTckn[0] === '0') return false;
  const digits = rawTckn.split('').map(Number);
  const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
  const evenSum = digits[1] + digits[3] + digits[5] + digits[7];
  const digit10 = ((oddSum * 7) - evenSum) % 10;
  const totalSumFirst10 = digits.slice(0, 10).reduce((acc, curr) => acc + curr, 0);
  const digit11 = totalSumFirst10 % 10;
  return digits[9] === digit10 && digits[10] === digit11;
};

export const sanitizeInput = (value: string): string => value.replace(/[^0-9]/g, '');

export const formatTCKN = (value: string): string => {
  const raw = value.replace(/\D/g, '').slice(0, 11);
  if (raw.length <= 3) return raw;
  if (raw.length <= 6) return `${raw.slice(0, 3)}-${raw.slice(3)}`;
  return `${raw.slice(0, 3)}-${raw.slice(3, 6)}-${raw.slice(6)}`;
};

// Fixed missing validateGsmNo
export const validateGsmNo = (value: string): boolean => {
  const raw = value.replace(/\D/g, '');
  return raw.length === 10 && raw.startsWith('5');
};

export const formatGsmNo = (value: string): string => {
  const raw = value.replace(/\D/g, '').slice(0, 10);
  if (raw.length <= 3) return raw;
  if (raw.length <= 6) return `${raw.slice(0, 3)} ${raw.slice(3)}`;
  if (raw.length <= 8) return `${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6)}`;
  return `${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6, 8)} ${raw.slice(8)}`;
};

// Fixed missing validateIban
export const validateIban = (value: string): boolean => {
  const raw = value.replace(/\s/g, '').toUpperCase();
  const ibanRegex = /^TR[0-9]{24}$/;
  return ibanRegex.test(raw);
};

export const formatIban = (value: string): string => {
  const raw = value.toUpperCase().replace(/\s/g, '').slice(0, 26);
  return raw.replace(/(.{4})/g, '$1 ').trim();
};

export const capitalize = (value: string): string => value.toLocaleUpperCase('tr-TR');

export const validatePlateNo = (plateNo: string): string | null => {
    const rawPlate = plateNo.toUpperCase().replace(/\s/g, '');
    const plateRegex = /^(0[1-9]|[1-7][0-9]|8[0-1])([A-Z]){1,3}(\d){2,4}$/;
    return plateRegex.test(rawPlate) ? null : 'Geçersiz plaka formatı.';
};

export const formatPlateNo = (value: string): string => {
    const raw = value.toUpperCase().replace(/\s/g, '');
    if (raw.length <= 2) return raw;
    const match = raw.match(/^(\d{2})([A-Z]{1,3})(\d{2,4})$/);
    return match ? `${match[1]} ${match[2]} ${match[3]}` : raw;
};
