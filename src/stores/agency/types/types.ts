import type { Agency, Status, AgencyData, AgencyDataFilters } from "@/types/agency";

export interface AgencyState {
  agencies: Agency[] | [];
  statusList: Status[] | [];
  loading: boolean;
  agencyData: AgencyData[] | [];
  filteredAgencyData: AgencyData[] | [];
  originalAgencyData: AgencyData[] | [];
  filters: AgencyDataFilters;
}

export interface AgencyActions {
  setLoading(isLoading: boolean): void;
  resetLoading(): void;
  setAgencies(agencies: Agency[]): void;
  resetAgencies(): void;
  setStatusList(statusList: Status[]): void;
  resetStatusList(): void;
  setAgencyData(data: AgencyData[]): void;
  resetAgencyData(): void;
  backupOriginalData(): void;
  filterAgencyData(filters: Partial<AgencyDataFilters>): void;
  resetFilters(): void;
  searchAgencyData(searchText: string): void;
  hasActiveFilters(): boolean;
  formatDateToString(date: Date): string;
}
