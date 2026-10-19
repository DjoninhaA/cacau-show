export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

// Checks both CNPJ check digits.
export function isValidCnpj(value: string): boolean {
  const d = onlyDigits(value);
  if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false;
  const checkDigit = (base: string) => {
    const weights = base.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum = weights.reduce((acc, weight, i) => acc + Number(base[i]) * weight, 0);
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };
  const d1 = checkDigit(d.slice(0, 12));
  const d2 = checkDigit(d.slice(0, 12) + d1);
  return d.endsWith(`${d1}${d2}`);
}
