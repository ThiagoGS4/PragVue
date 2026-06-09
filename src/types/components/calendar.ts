export type CalendarType =
  | "month"
  | "week"
  | "day"
  | "category"
  | "4day"
  | "custom-daily"
  | "custom-weekly";

export interface ICalendarEvents {
  name: string;
  start: Date;
  end: Date;
  color: string;
  timed: boolean;
}
