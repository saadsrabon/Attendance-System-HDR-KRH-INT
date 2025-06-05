export interface Agency {
  id: number;
  name: string;
}

export interface Status {
  id: string;
  name: string;
}

export interface AgencySearchFormData {
  agency: number | null;
  integrationDate: Date | null;
  attendanceSystemDataDate: Date | null;
  integrationStatus: string | null;
}

export interface AgencySearchSubmissionData {
  agency: number | null;
  integrationDate: string;
  attendanceSystemDataDate: string;
  integrationStatus: string | null;
}

export interface DateBoxValueChangedEvent {
  component: unknown;
  element: HTMLElement;
  model: unknown;
  value: Date | null;
  previousValue: Date | null;
}

export interface AgencyData {
  id: number;
  agency: string;
  integrationDate: Date;
  attendanceDate: Date;
  status: string;
}

export interface AgencyDataFilters {
  agency: number | null;
  integrationDate: string | null;
  attendanceSystemDataDate: string | null;
  status: string | null;
  isFiltered: boolean;
}
