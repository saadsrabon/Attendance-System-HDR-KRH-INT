// Define employee data type
export interface EmployeeData {
  id: number;
  employee_name: string;
  identification_number: string;
  date_time_get_to_work: string;
  date_time_out_of_office: string;
  date_time_reenter_office: string;
  date_time_back_to_work: string;
  status_presence: string;
  type_noncompliance: string;
  agencyId: number;
  agencyName: string;
  integrationStatus?: string;
}
