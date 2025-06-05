import type { CalendarForm } from "../types/calender";

// Pure functions for calendar operations - no store dependencies
export function useCalendarComposable() {
  const createCalendar = (
    calendar: Omit<CalendarForm, "id">,
    calendars: CalendarForm[]
  ): CalendarForm => {
    const newId = calendars.length > 0 ? Math.max(...calendars.map((c) => c.id)) + 1 : 1;
    return { ...calendar, id: newId } as CalendarForm;
  };

  const updateCalendar = (calendar: CalendarForm, calendars: CalendarForm[]): CalendarForm[] => {
    return calendars.map((c) => (c.id === calendar.id ? calendar : c));
  };

  const deleteCalendar = (id: number, calendars: CalendarForm[]): CalendarForm[] => {
    return calendars.filter((c) => c.id !== id);
  };

  const filterCalendars = (categoryId: number, calendars: CalendarForm[]): CalendarForm[] => {
    return calendars.filter((c) => c.calendarCategoryId === categoryId);
  };

  const getCalendarById = (id: number, calendars: CalendarForm[]): CalendarForm | undefined => {
    return calendars.find((c) => c.id === id);
  };

  return {
    createCalendar,
    updateCalendar,
    deleteCalendar,
    filterCalendars,
    getCalendarById,
  };
}
