import dayjs from "dayjs";

export function dateToStrDateFull(date: Date) {
  return dayjs(date).locale("fr").format("DD-MMMM-YYYY");
}
export function dateToStrDate(date: Date) {
  return dayjs(date).locale("fr").format("DD/MM/YYYY");
}
