export function monthDiff(dateFrom: Date, dateTo: Date): number {
  let years = dateTo.getFullYear() - dateFrom.getFullYear();
  let months = dateTo.getMonth() - dateFrom.getMonth();
  let days = dateTo.getDay() - dateFrom.getDay();
  return years * 12 + months + days / 30;
}
