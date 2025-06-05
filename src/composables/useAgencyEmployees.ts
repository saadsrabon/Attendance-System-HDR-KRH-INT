import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import type { EmployeeData } from "@/types/employees";

export const useAgencyEmployees = () => {
  const route = useRoute();
  const agencyId = Number(route.params.id);
  const loading = ref(false);
  const employees = ref<EmployeeData[]>([]);
  const filteredEmployees = ref<EmployeeData[]>([]);
  const dataGrid = ref<{ instance: unknown } | null>(null);
  const agencyName = ref<string>("");

  
  const sampleEmployeeData: EmployeeData[] = [
    {
      id: 1,
      employee_name: "John Doe",
      identification_number: "EMP001",
      date_time_get_to_work: "2025-04-04 08:00",
      date_time_out_of_office: "2025-04-04 17:00",
      date_time_reenter_office: "2025-04-04 13:00",
      date_time_back_to_work: "2025-04-04 14:00",
      status_presence: "Present",
      type_noncompliance: "None",
      agencyId: 1,
      agencyName: "Federal Civil Service (PAP)",
      integrationStatus: "Success",
    },
    {
      id: 2,
      employee_name: "Jane Smith",
      identification_number: "EMP002",
      date_time_get_to_work: "2025-04-04 08:30",
      date_time_out_of_office: "2025-04-04 17:30",
      date_time_reenter_office: "2025-04-04 12:30",
      date_time_back_to_work: "2025-04-04 13:30",
      status_presence: "Present",
      type_noncompliance: "None",
      agencyId: 1,
      agencyName: "Federal Civil Service (PAP)",
      integrationStatus: "Success",
    },
    {
      id: 3,
      employee_name: "Bob Johnson",
      identification_number: "EMP003",
      date_time_get_to_work: "2025-04-04 09:00",
      date_time_out_of_office: "2025-04-04 16:00",
      date_time_reenter_office: "2025-04-04 12:00",
      date_time_back_to_work: "2025-04-04 13:00",
      status_presence: "Late",
      type_noncompliance: "Tardiness",
      agencyId: 1,
      agencyName: "Federal Civil Service (PAP)",
      integrationStatus: "Success",
    },
    {
      id: 4,
      employee_name: "Sarah Williams",
      identification_number: "EMP004",
      date_time_get_to_work: "2025-04-04 08:15",
      date_time_out_of_office: "2025-04-04 16:45",
      date_time_reenter_office: "2025-04-04 12:15",
      date_time_back_to_work: "2025-04-04 13:15",
      status_presence: "Present",
      type_noncompliance: "None",
      agencyId: 2,
      agencyName: "State Civil Service (PAN)",
      integrationStatus: "Failed",
    },
    {
      id: 5,
      employee_name: "Michael Brown",
      identification_number: "EMP005",
      date_time_get_to_work: "2025-04-04 08:45",
      date_time_out_of_office: "2025-04-04 17:15",
      date_time_reenter_office: "2025-04-04 12:45",
      date_time_back_to_work: "2025-04-04 13:45",
      status_presence: "Absent",
      type_noncompliance: "Absence",
      agencyId: 2,
      agencyName: "State Civil Service (PAN)",
      integrationStatus: "Failed",
    },
    {
      id: 6,
      employee_name: "Emily Davis",
      identification_number: "EMP006",
      date_time_get_to_work: "2025-04-04 08:05",
      date_time_out_of_office: "2025-04-04 16:55",
      date_time_reenter_office: "2025-04-04 12:05",
      date_time_back_to_work: "2025-04-04 13:05",
      status_presence: "Present",
      type_noncompliance: "None",
      agencyId: 3,
      agencyName: "Federal Statutory Body Authority (BBP)",
      integrationStatus: "Failed",
    },
    {
      id: 7,
      employee_name: "David Miller",
      identification_number: "EMP007",
      date_time_get_to_work: "2025-04-04 08:20",
      date_time_out_of_office: "2025-04-04 17:10",
      date_time_reenter_office: "2025-04-04 12:20",
      date_time_back_to_work: "2025-04-04 13:20",
      status_presence: "Present",
      type_noncompliance: "None",
      agencyId: 3,
      agencyName: "Federal Statutory Body Authority (BBP)",
      integrationStatus: "Success",
    },
    {
      id: 8,
      employee_name: "Jessica Wilson",
      identification_number: "EMP008",
      date_time_get_to_work: "2025-04-04 09:30",
      date_time_out_of_office: "2025-04-04 17:45",
      date_time_reenter_office: "2025-04-04 12:30",
      date_time_back_to_work: "2025-04-04 13:30",
      status_presence: "Late",
      type_noncompliance: "Tardiness",
      agencyId: 4,
      agencyName: "State Statutory Body Authority (BBN)",
      integrationStatus: "Success",
    },
    {
      id: 9,
      employee_name: "Andrew Taylor",
      identification_number: "EMP009",
      date_time_get_to_work: "2025-04-04 08:10",
      date_time_out_of_office: "2025-04-04 16:50",
      date_time_reenter_office: "2025-04-04 12:10",
      date_time_back_to_work: "2025-04-04 13:10",
      status_presence: "Present",
      type_noncompliance: "None",
      agencyId: 5,
      agencyName: "Local Authorities (PBT)",
      integrationStatus: "Success",
    },
    {
      id: 10,
      employee_name: "Zayed Khan",
      identification_number: "EMP010",
      date_time_get_to_work: "2025-04-04 08:00",
      date_time_out_of_office: "2025-04-04 16:55",
      date_time_reenter_office: "2025-04-04 13:10",
      date_time_back_to_work: "2025-04-04 13:30",
      status_presence: "Present",
      type_noncompliance: "None",
      agencyId: 6,
      agencyName: "Ministry of Finance",
      integrationStatus: "Failed",
    },
  ];

  onMounted(() => {
    loading.value = true;

  
    setTimeout(() => {
      const filteredData = sampleEmployeeData.filter((employee) => employee.agencyId === agencyId);

      if (filteredData.length > 0) {
        agencyName.value = filteredData[0].agencyName;
      }

      employees.value = filteredData;
      filteredEmployees.value = filteredData;
      loading.value = false;
    }, 500); //  delay
  });

  // Status cell template with colored badges
  const statusCellTemplate = (cellElement: HTMLElement, cellInfo: { data: EmployeeData }) => {
    const status = cellInfo.data.status_presence;
    let className = "";

    switch (status) {
      case "Present":
        className = "bg-green-100 text-green-800";
        break;
      case "Late":
        className = "bg-yellow-100 text-yellow-800";
        break;
      case "Absent":
        className = "bg-red-100 text-red-800";
        break;
      default:
        className = "bg-gray-100 text-gray-800";
    }

    cellElement.innerHTML = `
      <div class="px-2 py-1 rounded-full text-xs font-medium ${className}">
        ${status}
      </div>
    `;
  };

  return {
    agencyId,
    agencyName,
    employees,
    filteredEmployees,
    loading,
    dataGrid,
    statusCellTemplate,
  };
};
