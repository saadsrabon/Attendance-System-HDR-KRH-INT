<template>
  <div class="p-4">
    <div class="border border-gray-300 rounded-lg p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold">{{ agencyName }} - Employee Attendance Records</h2>
        <NuxtLink to="/agency" class="text-blue-600 flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
            />
          </svg>
          <span>Back to Agencies</span>
        </NuxtLink>
      </div>

      <!-- Search Box and Print/Export Buttons in one row -->
      <div class="mb-4 flex items-center">
        <div class="w-full max-w-sm mr-auto">
          <DxTextBox
            placeholder="Search records..."
            mode="search"
            :show-clear-button="true"
            v-model="searchValue"
            @value-changed="onSearchValueChanged"
            value-change-mode="keyup"
            class="w-full"
          />
        </div>

        <!-- Print and Export Buttons -->
        <div class="ml-auto flex gap-2">
          <DxButton
            text="Print"
            icon="print"
            type="default"
            stylingMode="outlined"
            @click="printGrid"
          />
          <DxButton
            text="Export"
            icon="export"
            type="default"
            stylingMode="outlined"
            @click="onExportToExcel"
          />
        </div>
      </div>

      <!-- Loading Indicator -->
      <div v-if="loading" class="flex justify-center my-10">
        <div class="spinner"></div>
      </div>

      <!-- No Results Message -->
      <div
        v-else-if="filteredEmployees.length === 0"
        class="text-center py-10 bg-gray-50 rounded-lg"
      >
        <div class="text-gray-500 mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-12 w-12 mx-auto mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 class="text-lg font-medium">No Employee Records Found</h3>
          <p class="text-sm">No employee data available for this agency</p>
        </div>
      </div>

      <!-- Employee Data Grid -->
      <DxDataGrid
        v-else
        id="employees"
        ref="dataGrid"
        :data-source="filteredEmployees"
        :show-borders="false"
        :column-auto-width="true"
        :word-wrap-enabled="true"
        key-expr="id"
        class="rounded-lg overflow-hidden shadow-lg w-full"
        @selection-changed="onSelectionChanged"
      >
        <DxSearchPanel :visible="false" />
        <DxHeaderFilter :visible="true" />
        <DxSelection mode="multiple" show-check-boxes-mode="always" />
        <DxScrolling mode="standard" />
        <DxPaging :enabled="true" :page-size="20" />
        <DxPager
          :visible="true"
          :show-page-size-selector="true"
          :allowed-page-sizes="[5, 10, 20]"
          :show-info="true"
          :display-mode="'full'"
          position="bottom"
        />
        <DxColumn type="selection" :width="40" />

        <DxColumn data-field="employee_name" caption="Name" :width="180" />
        <DxColumn data-field="identification_number" caption="ID" :width="120" />
        <DxColumn data-field="date_time_get_to_work" caption="Get To Work" :width="160" />
        <DxColumn data-field="date_time_out_of_office" caption="Leave Office" :width="160" />
        <DxColumn data-field="date_time_reenter_office" caption="Reenter Office" :width="160" />
        <DxColumn data-field="date_time_back_to_work" caption="Back To Work" :width="160" />
        <DxColumn
          data-field="status_presence"
          caption="Status"
          :width="120"
          :cell-template="statusCellTemplate"
        />
        <DxColumn
          data-field="integrationStatus"
          caption="Integration Status"
          :width="120"
          :cell-template="statusIntCellTemplate"
        />
      </DxDataGrid>

      <!-- Review Status Section -->
      <div
        v-if="selectedEmployees.length > 0"
        class="overflow-x-hidden mt-6 border border-gray-300 rounded-lg p-4"
      >
        <h3 class="text-lg font-medium mb-4">Review Status</h3>

        <div class="gap-6">
          <div>
            <DxRadioGroup
              :items="['Perfect Integration', 'Imperfect Integration']"
              v-model="reviewStatus"
              layout="horizontal"
            />
          </div>

          <div>
            <p class="font-medium mb-2">Notes</p>
            <DxTextArea v-model="notes" :height="100" placeholder="Enter review notes here" />
          </div>
        </div>

        <div class="flex justify-end mt-4 gap-3">
          <DxButton
            icon="save"
            text="Save"
            type="default"
            stylingMode="contained"
            @click="handleSave"
          />
          <DxButton
            icon="undo"
            text="Return"
            type="normal"
            stylingMode="outlined"
            @click="goBack"
          />
        </div>
      </div>

      <!-- Notification Popup -->
      <DxPopup
        :visible="isPopupVisible"
        :show-title="true"
        :show-close-button="true"
        :width="500"
        :height="200"
        position="center"
        @hiding="closePopup"
      >
        <div class="flex items-center justify-center">
          <div slot="title" class="flex flex-col items-center justify-center">
            <template v-if="popupType === 'success'">
              <div class="p-2 rounded-full bg-green-100 text-green-600 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
            </template>
            <template v-else-if="popupType === 'info'">
              <div class="p-2 rounded-full bg-blue-100 text-blue-600 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
            </template>
          </div>

          <div class="p-6 text-center">
            <p class="text-gray-700">{{ popupMessage }}</p>
          </div>
        </div>

        <div slot="bottom" class="px-6 py-3 flex justify-end border-t hidden">
          <DxButton text="OK" type="default" stylingMode="contained" @click="closePopup" />
        </div>
      </DxPopup>
    </div>
  </div>
</template>

<script setup lang="ts">
import DxDataGrid, {
  DxColumn,
  DxPaging,
  DxPager,
  DxSelection,
  DxScrolling,
  DxSearchPanel,
  DxHeaderFilter,
} from "devextreme-vue/data-grid";
import DxRadioGroup from "devextreme-vue/radio-group";
import DxTextArea from "devextreme-vue/text-area";
import DxButton from "devextreme-vue/button";
import DxPopup from "devextreme-vue/popup";
import DxTextBox from "devextreme-vue/text-box";
import "devextreme/dist/css/dx.light.css";
import { useAgencyEmployees } from "@/composables/useAgencyEmployees";
import { ref } from "vue";
import { exportDataGrid } from "devextreme/excel_exporter";
import type { ValueChangedEvent } from "devextreme/ui/text_box";
import type { ExcelExportDataGridProps } from "devextreme/excel_exporter";

// Define the DataGrid type
import type DataGrid from "devextreme/ui/data_grid";

// Import EmployeeData type from the composable
import type { EmployeeData } from "../../../../../types/employees";

// Excel export types
interface ExcelWorksheet {
  worksheet: string;
  dataSource: EmployeeData[];
}

interface ExcelExportWorkbook {
  fileName: string;
  worksheets: ExcelWorksheet[];
}

// Use the composable to get all the functionality
const { agencyName, filteredEmployees, loading } = useAgencyEmployees();

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
const statusIntCellTemplate = (cellElement: HTMLElement, cellInfo: { data: EmployeeData }) => {
  const status = cellInfo.data.integrationStatus || "Unknown";
  let className = "";

  switch (status) {
    case "Success":
      className = "bg-green-100 text-green-800";
      break;
    case "Failed":
      className = "bg-yellow-100 text-yellow-800";
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

// Search functionality
const searchValue = ref("");
const dataGrid = ref<{ instance: DataGrid } | null>(null);

const onSearchValueChanged = (e: ValueChangedEvent) => {
  if (dataGrid.value) {
    dataGrid.value.instance.searchByText(e.value);
  }
};

// Print grid functionality
const printGrid = () => {
  if (dataGrid.value) {
    // Create a printable version of the grid
    const gridElement = document.getElementById("employees");
    if (gridElement) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${agencyName.value} - Employee Attendance Records</title>
              <style>
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .badge-present { background-color: #d1fae5; color: #065f46; padding: 3px 8px; border-radius: 12px; }
                .badge-late { background-color: #fef3c7; color: #92400e; padding: 3px 8px; border-radius: 12px; }
                .badge-absent { background-color: #fee2e2; color: #991b1b; padding: 3px 8px; border-radius: 12px; }
              </style>
            </head>
            <body>
              <h2>${agencyName.value} - Employee Attendance Records</h2>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>ID</th>
                    <th>Get To Work</th>
                    <th>Leave Office</th>
                    <th>Reenter Office</th>
                    <th>Back To Work</th>
                    <th>Status</th>
                    <th>Integration Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredEmployees.value
                    .map(
                      (item) => `
                    <tr>
                      <td>${item.employee_name}</td>
                      <td>${item.identification_number}</td>
                      <td>${item.date_time_get_to_work}</td>
                      <td>${item.date_time_out_of_office}</td>
                      <td>${item.date_time_reenter_office}</td>
                      <td>${item.date_time_back_to_work}</td>
                      <td>
                        <span class="badge-${item.status_presence.toLowerCase()}">
                          ${item.status_presence}
                        </span>
                      </td>
                      <td>${item.integrationStatus || "N/A"}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  }
};

// Export to Excel functionality
const onExportToExcel = () => {
  if (dataGrid.value) {
    const workbook: ExcelExportWorkbook = {
      fileName: `${agencyName.value}_Attendance_${new Date().toISOString().split("T")[0]}.xlsx`,
      worksheets: [
        {
          worksheet: "Employees",
          dataSource: filteredEmployees.value,
        },
      ],
    };

    // Using proper typing for exportDataGrid
    exportDataGrid(workbook as unknown as ExcelExportDataGridProps);
  }
};

// Review Status Form
const selectedEmployees = ref<EmployeeData[]>([]);
const reviewStatus = ref("Perfect Integration");
const notes = ref("");

// Popup related properties
const isPopupVisible = ref(false);
const popupTitle = ref("");
const popupMessage = ref("");
const popupType = ref<"success" | "error" | "warning" | "info">("info");

// Handle selection changes
const onSelectionChanged = (e: { selectedRowsData: EmployeeData[] }) => {
  selectedEmployees.value = e.selectedRowsData;
};

// Handle save action
const handleSave = async () => {
  if (reviewStatus.value === "Imperfect Integration") {
    // Show popup for imperfect integration
    popupTitle.value = "Integration Administrator Notified";
    popupMessage.value =
      "Notification of incomplete integration has been sent to the Integration Administrator.";
    popupType.value = "info";
    isPopupVisible.value = true;
    selectedEmployees.value = [];
  } else {
    // Show popup for perfect integration
    popupTitle.value = "Success";
    popupMessage.value = "Review status saved successfully.";
    popupType.value = "success";
    isPopupVisible.value = true;
    selectedEmployees.value = [];
  }

  // Reset form after save
  resetForm();
};

// Reset form
const resetForm = () => {
  reviewStatus.value = "Perfect Integration";
  notes.value = "";
};

// Go back / close review form
const goBack = () => {
  selectedEmployees.value = [];
  resetForm();
};

// Close popup
const closePopup = () => {
  isPopupVisible.value = false;
  selectedEmployees.value = [];
};
</script>

<style scoped>
.dx-popup-content-scrollable {
  overflow: hidden !important; /* Prevent scrolling entirely */
}

/* OR if you want to allow scrolling but hide the scrollbar visually */
.dx-popup-content-scrollable {
  overflow: auto !important;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.dx-popup-content-scrollable::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}
/* Custom styling for the data grid */
:deep(.dx-datagrid) {
  border-radius: 0.5rem;
  overflow: hidden;
}

:deep(.dx-datagrid-headers) {
  background-color: #f8fafc;
  font-weight: 600;
  color: #1e293b;
}

:deep(.dx-row.dx-data-row.dx-state-hover) {
  background-color: #f1f5f9;
}

:deep(.dx-datagrid-rowsview .dx-row-alt) {
  background-color: #f8fafc;
}

/* Fix pagination alignment */
:deep(.dx-pager) {
  padding: 0.75rem 1rem;
}

/* Custom pagination styling to match the image */
:deep(.dx-pager .dx-page) {
  padding: 6px 12px;
  margin: 0 2px;
  border: 1px solid #ddd;
}

:deep(.dx-pager .dx-page.dx-state-active) {
  background-color: #6b7280;
  color: white;
}

:deep(.dx-pager .dx-pages .dx-page) {
  display: inline-block;
}

:deep(.dx-pager .dx-navigation-button) {
  border: 1px solid #ddd;
  padding: 6px 12px;
  margin: 0 2px;
}

:deep(.dx-pager .dx-info) {
  padding: 6px 12px;
}

:deep(.dx-pager .dx-page-sizes) {
  padding: 6px 12px;
}

/* Fix textbox search icon */
:deep(.dx-texteditor-with-icon.dx-show-clear-button .dx-icon-clear) {
  right: 2.5rem;
}

/* Spinner for loading state */
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #3498db;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
