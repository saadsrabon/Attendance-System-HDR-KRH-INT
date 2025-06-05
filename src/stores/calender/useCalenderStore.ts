import { defineStore } from "pinia";
import { calendars as initialCalendars } from "./data";
import type { CalendarForm } from "../../types/calender";
import { useCalendarComposable } from "@/composables/useCalender";

export const useCalendarStore = defineStore("calendar", {
  state: () => ({
    calendars: [...initialCalendars] as CalendarForm[],
    filteredCalendars: [...initialCalendars] as CalendarForm[],
    currentFilter: null as number | null,
  }),

  getters: {
    getFilteredCalendars(): CalendarForm[] {
      return this.filteredCalendars;
    },
  },

  actions: {
    create(calendar: Omit<CalendarForm, "id">) {
      const { createCalendar } = useCalendarComposable();
      const newCalendar = createCalendar(calendar, this.calendars);
      this.calendars.unshift(newCalendar);
      this.applyFilter();
      return newCalendar;
    },

    update(calendar: CalendarForm) {
      const { updateCalendar } = useCalendarComposable();
      this.calendars = updateCalendar(calendar, this.calendars);
      this.applyFilter();
      return calendar;
    },

    remove(id: number) {
      const { deleteCalendar } = useCalendarComposable();
      this.calendars = deleteCalendar(id, this.calendars);
      this.applyFilter();
    },

    getById(id: number) {
      const { getCalendarById } = useCalendarComposable();
      return getCalendarById(id, this.calendars);
    },

    setFilter(categoryId: number | null) {
      this.currentFilter = categoryId;
      this.applyFilter();
    },

    applyFilter() {
      const { filterCalendars } = useCalendarComposable();
      if (this.currentFilter === null) {
        this.filteredCalendars = [...this.calendars];
      } else {
        this.filteredCalendars = filterCalendars(this.currentFilter, this.calendars);
      }
    },

    resetFilter() {
      this.currentFilter = null;
      this.filteredCalendars = [...this.calendars];
    },
  },
});
