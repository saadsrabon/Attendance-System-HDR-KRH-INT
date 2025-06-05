import type { Agency, Status, AgencyData, AgencyDataFilters } from "@/types/agency";
import { defineStore } from "pinia";
import type { AgencyActions, AgencyState } from "./types/types";

export const useAgencyStore = defineStore<"agency", AgencyState, {}, AgencyActions>("agency", {
  state: () => ({
    agencies: [],
    statusList: [],
    loading: false,
    agencyData: [],
    filteredAgencyData: [],
    originalAgencyData: [],
    filters: {
      agency: null,
      integrationDate: null,
      attendanceSystemDataDate: null,
      status: null,
      isFiltered: false,
    },
  }),
  actions: {
    setLoading(isLoading: boolean) {
      this.loading = isLoading;
    },
    resetLoading() {
      this.loading = false;
    },
    setAgencies(agencies: Agency[]) {
      this.agencies = agencies;
    },
    resetAgencies() {
      this.agencies = [];
    },
    setStatusList(statusList: Status[]) {
      this.statusList = statusList;
    },
    resetStatusList() {
      this.statusList = [];
    },
    setAgencyData(data: AgencyData[]) {
      this.agencyData = data;
      this.filteredAgencyData = [...data];
      if (this.originalAgencyData.length === 0) {
        this.originalAgencyData = [...data];
      }
    },
    resetAgencyData() {
      this.agencyData = [...this.originalAgencyData];
      this.filteredAgencyData = [...this.originalAgencyData];
    },
    backupOriginalData() {
      if (this.originalAgencyData.length === 0 && this.agencyData.length > 0) {
        this.originalAgencyData = [...this.agencyData];
      }
    },
    filterAgencyData(filters: Partial<AgencyDataFilters>) {
      this.setLoading(true);

      // Update filter state
      Object.assign(this.filters, filters);

      // Start with original data
      let filteredData = [...this.originalAgencyData];

      // Apply filters
      if (this.filters.agency) {
        const agencyName = this.agencies.find((a) => a.id === this.filters.agency)?.name || "";
        filteredData = filteredData.filter((item) => item.agency.includes(agencyName));
      }

      if (this.filters.integrationDate) {
        const dateString = this.filters.integrationDate;
        filteredData = filteredData.filter((item) => {
          const itemDate = this.formatDateToString(item.integrationDate);
          return itemDate === dateString;
        });
      }

      if (this.filters.attendanceSystemDataDate) {
        const dateString = this.filters.attendanceSystemDataDate;
        filteredData = filteredData.filter((item) => {
          const itemDate = this.formatDateToString(item.attendanceDate);
          return itemDate === dateString;
        });
      }

      if (this.filters.status) {
        filteredData = filteredData.filter(
          (item) => item.status.toLowerCase() === this.filters.status?.toLowerCase()
        );
      }

      // Update filtered flag
      this.filters.isFiltered = this.hasActiveFilters();

      // Update filtered data
      this.filteredAgencyData = filteredData;
      this.agencyData = filteredData;

      this.setLoading(false);
    },
    resetFilters() {
      this.filters = {
        agency: null,
        integrationDate: null,
        attendanceSystemDataDate: null,
        status: null,
        isFiltered: false,
      };

      this.resetAgencyData();
    },
    // Helper method to check if any filters are active
    hasActiveFilters(): boolean {
      return !!(
        this.filters.agency ||
        this.filters.integrationDate ||
        this.filters.attendanceSystemDataDate ||
        this.filters.status
      );
    },
    // Helper method to format date consistently
    formatDateToString(date: Date): string {
      return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
    },
    // Search functionality for the text search box
    searchAgencyData(searchText: string) {
      if (!searchText) {
        // If no search text, use filtered data if filters are active, otherwise original data
        this.agencyData = this.filters.isFiltered
          ? [...this.filteredAgencyData]
          : [...this.originalAgencyData];
        return;
      }

      const searchLower = searchText.toLowerCase();

      // Search within already filtered data if filters are active, otherwise search original data
      const sourceData = this.filters.isFiltered
        ? [...this.filteredAgencyData]
        : [...this.originalAgencyData];

      this.agencyData = sourceData.filter(
        (item) =>
          item.agency.toLowerCase().includes(searchLower) ||
          item.status.toLowerCase().includes(searchLower) ||
          this.formatDateToString(item.integrationDate).includes(searchLower) ||
          this.formatDateToString(item.attendanceDate).includes(searchLower)
      );
    },
  },
});
