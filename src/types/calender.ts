// types.ts

export type TermBreak = {
  title: string;
  startDate: string;
  endDate: string;
};

export type HolidayEvent = {
  title: string;
  date: string;
};

export type ShiftDaySchedule = {
  dayId: number;
  dayName: string;
  start: string | null;
  end: string | null;
};

export type ShiftTypeTimeRange = {
  id: number;
  schedule: ShiftDaySchedule[];
};

export type CalendarForm = {
  id: number;
  calendarName: string;
  calendarCategoryId: number;
  calendarGroupId: number;
  shiftTypeId: number;
  restBreak: {
    startDate: string;
    endDate: string;
  };
  generalHolidays: number[];
  termBreaks: TermBreak[];
  holidayEvents: HolidayEvent[];
  weeklyRestDay: string;
  weeklyHoliday: string;
  selectedStateIds: number[];
  selectedAgencyIds: number[];
  isSpecialHoliday: boolean;
  specialHolidayAgencyIds?: number[];
};

export type Option = {
  id: number | string;
  name: string;
};

export type DeterminationItem = {
  id: number;
  name: string;
  field: string;
  isActive: boolean;
};

export interface PublicHoliday {
  name: string;
  date: string;
  dayName: string;
}
