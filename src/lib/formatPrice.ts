const formatter = new Intl.NumberFormat("bs-BA", {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function formatPriceKM(value: number): string {
  return formatter.format(Math.round(value)) + " KM";
}
