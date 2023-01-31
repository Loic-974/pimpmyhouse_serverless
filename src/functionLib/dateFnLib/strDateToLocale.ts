import dayjs from "dayjs";
/**
 * Convert Str date to locale Js Date
 * @param strDate - Format DD/MM/YYYY
 */
export function strDateToLocale(strDate: string) {
  return dayjs(strDate).toDate();
}

export function jsDateToYYYYMMDD(date: Date) {
  return dayjs(date).format("YYYY-MM-DD");
}
