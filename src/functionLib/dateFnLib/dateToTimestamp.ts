import dayjs from "dayjs";

export function dateToTimestamp(date: Date) {
  return dayjs(date).valueOf();
}

export function timeStampToStrDate(timestamp: number) {
  return dayjs(timestamp).format("DD/MM/YYYY");
}
