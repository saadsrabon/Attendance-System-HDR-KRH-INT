import { useAgencyStore } from "@/stores/agency/agency";
import { storeToRefs } from "pinia";
import type { Ref } from "vue";
import type {
  Agency,
  Status,
  AgencySearchFormData,
  DateBoxValueChangedEvent,
} from "@/types/agency";
import { reactive, ref } from "vue";
import notify from "devextreme/ui/notify";

export const useAgencySearch = (): {
  formData: AgencySearchFormData;
  formattedIntegrationDate: Ref<string>;
  formattedAttendanceDate: Ref<string>;
  onIntegrationDateChanged: (e: DateBoxValueChangedEvent) => void;
  onAttendanceSystemDataDateChanged: (e: DateBoxValueChangedEvent) => void;
  onSearch: () => void;
  onReset: () => void;
  getAgencyName: (id: number) => string;
  formatDate: (date: Date | string | null) => string;
  agencyList: Ref<Agency[]>;
  statusList: Ref<Status[]>;
  loading: Ref<boolean>;
} => {
  const agencyStore = useAgencyStore();
  const { loading, agencies, statusList } = storeToRefs(agencyStore);

  // Using the agencies from the store if available, else use mock data
  const agencyList = ref<Agency[]>([
    { id: 1, name: "Federal Civil Service (PAP)" },
    { id: 2, name: "State Civil Service (PAN)" },
    { id: 3, name: "Federal Statutory Body Authority (BBP)" },
    { id: 4, name: "State Statutory Body Authority (BBN)" },
    { id: 5, name: "Local Authorities (PBT)" },
  ]);

  // Set the store agencies if not already set
  if (agencies.value.length === 0) {
    agencyStore.setAgencies(agencyList.value);
  } else {
    agencyList.value = agencies.value as Agency[];
  }

  // Status options - using the store values if available
  const statusListData = ref<Status[]>([
    { id: "successful", name: "Successful" },
    { id: "unsuccessful", name: "Unsuccessful" },
  ]);

  // Set the store status list if not already set
  if (statusList.value.length === 0) {
    agencyStore.setStatusList(statusListData.value);
  } else {
    statusListData.value = statusList.value as Status[];
  }

  // Form data with simple types
  const formData = reactive<AgencySearchFormData>({
    agency: null,
    integrationDate: null,
    attendanceSystemDataDate: null,
    integrationStatus: null,
  });

  // Additional reactive refs to store formatted date strings
  const formattedIntegrationDate = ref<string>("");
  const formattedAttendanceDate = ref<string>("");

  // Helper function to get agency name from ID
  const getAgencyName = (id: number): string => {
    const agency = agencyList.value.find((a) => a.id === id);
    return agency ? agency.name : "Unknown";
  };

  // Helper function to format date for display
  const formatDate = (date: Date | string | null): string => {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
  };

  // Date value change handlers
  const onIntegrationDateChanged = (e: DateBoxValueChangedEvent) => {
    formData.integrationDate = e.value; // Store the actual Date object
    formattedIntegrationDate.value = e.value ? formatDate(e.value) : ""; // Store formatted string separately
  };

  const onAttendanceSystemDataDateChanged = (e: DateBoxValueChangedEvent) => {
    formData.attendanceSystemDataDate = e.value; // Store the actual Date object
    formattedAttendanceDate.value = e.value ? formatDate(e.value) : ""; // Store formatted string separately
  };

  // Search function
  const onSearch = () => {
    // Check if agency is selected
    if (!formData.agency) {
      notify({
        message: "Agency is not selected",
        type: "warning",
        displayTime: 3000,
        position: {
          my: "center top",
          at: "center top",
        },
      });
      return;
    }

    // Apply filters to the store
    agencyStore.filterAgencyData({
      agency: formData.agency,
      integrationDate: formattedIntegrationDate.value,
      attendanceSystemDataDate: formattedAttendanceDate.value,
      status: formData.integrationStatus,
    });

    // Notify success
    notify({
      message: "Search applied successfully",
      type: "success",
      displayTime: 2000,
    });
  };

  // Reset function
  const onReset = () => {
    // Reset all form fields
    formData.agency = null;
    formData.integrationDate = null;
    formData.attendanceSystemDataDate = null;
    formData.integrationStatus = null;

    // Reset formatted date strings
    formattedIntegrationDate.value = "";
    formattedAttendanceDate.value = "";

    // Reset filters in the store
    agencyStore.resetFilters();

    // Notify reset
    notify({
      message: "Filters reset successfully",
      type: "info",
      displayTime: 2000,
    });
  };

  return {
    formData,
    formattedIntegrationDate,
    formattedAttendanceDate,
    onIntegrationDateChanged,
    onAttendanceSystemDataDateChanged,
    onSearch,
    onReset,
    getAgencyName,
    formatDate,
    agencyList,
    statusList: statusListData,
    loading,
  };
};
