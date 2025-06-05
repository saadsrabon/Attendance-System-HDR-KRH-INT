import { useAgencyStore } from "@/stores/agency/agency";
import { storeToRefs } from "pinia";
import type { AgencyData } from "@/types/agency";
import { onMounted, ref, watch } from "vue";
import notify from "devextreme/ui/notify";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import type { ValueChangedEvent as DxValueChangedEvent } from "devextreme/ui/text_box";
import { useRouter } from "vue-router";

export const useAgencyList = () => {
  const agencyStore = useAgencyStore();
  const { loading, agencyData, originalAgencyData, filters } = storeToRefs(agencyStore);
  const router = useRouter();

  // DataGrid reference
  const dataGrid = ref<{ instance: unknown } | null>(null);
  const searchValue = ref("");

  // Sample data 
  const sampleAgencyData: AgencyData[] = [
    {
      id: 1,
      agency: "Federal Civil Service (PAP)",
      integrationDate: new Date("2025-01-15"),
      attendanceDate: new Date("2025-01-20"),
      status: "Successful",
    },
    {
      id: 2,
      agency: "State Civil Service (PAN)",
      integrationDate: new Date("2025-04-02"),
      attendanceDate: new Date("2025-05-20"),
      status: "Successful",
    },
    {
      id: 3,
      agency: "Federal Statutory Body Authority (BBP)",
      integrationDate: new Date("2025-02-10"),
      attendanceDate: new Date("2025-02-15"),
      status: "Unsuccessful",
    },
    {
      id: 4,
      agency: "State Statutory Body Authority (BBN)",
      integrationDate: new Date("2025-03-22"),
      attendanceDate: new Date("2025-03-25"),
      status: "Successful",
    },
    {
      id: 5,
      agency: "Local Authorities (PBT)",
      integrationDate: new Date("2025-03-01"),
      attendanceDate: new Date("2025-03-05"),
      status: "Unsuccessful",
    },
    {
      id: 6,
      agency: "Ministry of Finance",
      integrationDate: new Date("2025-05-05"),
      attendanceDate: new Date("2025-05-10"),
      status: "Successful",
    },
    {
      id: 7,
      agency: "Department of Housing",
      integrationDate: new Date("2025-05-15"),
      attendanceDate: new Date("2025-05-20"),
      status: "Unsuccessful",
    },
  ];

  // Initialize store with data if not already set
  onMounted(() => {
    if (originalAgencyData.value.length === 0) {
      agencyStore.setAgencyData(sampleAgencyData);
    }
  });

  // Watch for search value changes
  watch(searchValue, (newValue) => {
    agencyStore.searchAgencyData(newValue);
  });

  // Cell templates and formatters

  // Format date to dd/MM/yyyy
  const formatDate = (data: { data: AgencyData; value?: Date }) => {
    if (!data.value) return "";
    return agencyStore.formatDateToString(data.value);
  };

  // Status cell template with colored badges
  const statusCellTemplate = (cellElement: HTMLElement, cellInfo: { data: AgencyData }) => {
    const status = cellInfo.data.status;
    const className =
      status === "Successful" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";

    cellElement.innerHTML = `
      <div class="px-2 py-1 rounded-full text-xs font-medium ${className}">
        ${status}
      </div>
    `;
  };

  // Action cell template
  const actionCellTemplate = (cellElement: HTMLElement, cellInfo: { data: AgencyData }) => {
    const button = document.createElement("button");
    button.classList.add("rounded-full", "p-2", "hover:bg-gray-100", "transition");
    button.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>';
    button.addEventListener("click", () => navigateToEmployees(cellInfo.data));
    cellElement.appendChild(button);
  };

  // Search implementation for text box value change
  const onSearchValueChanged = (e: DxValueChangedEvent) => {
    searchValue.value = e.value?.toString() || "";
  };

  // Handle row double click
  const onRowDoubleClick = (e: { data: AgencyData }) => {
    viewDetails(e.data);
  };

  // View details
  const viewDetails = (data: AgencyData) => {
    notify({
      message: `Viewing details for ${data.agency}`,
      type: "info",
      displayTime: 2000,
    });
  };

  // Navigate to employees view
  const navigateToEmployees = (data: AgencyData) => {
    router.push(`/attendence/${data.id}`);
  };

  // Print grid
  const printGrid = () => {
    if (!dataGrid.value) return;

    // Create a printable version of the grid
    const gridElement = document.getElementById("gridContainer");
    if (gridElement) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Agency Integration Information</title>
              <style>
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .badge-success { background-color: #d1fae5; color: #065f46; padding: 3px 8px; border-radius: 12px; }
                .badge-error { background-color: #fee2e2; color: #991b1b; padding: 3px 8px; border-radius: 12px; }
              </style>
            </head>
            <body>
              <h2>Agency Attendance System Integration Information</h2>
              <table>
                <thead>
                  <tr>
                    <th>Agency</th>
                    <th>Integration Date</th>
                    <th>Attendance System Data Date</th>
                    <th>Integration Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${agencyData.value
                    .map(
                      (item: AgencyData) => `
                    <tr>
                      <td>${item.agency}</td>
                      <td>${agencyStore.formatDateToString(item.integrationDate)}</td>
                      <td>${agencyStore.formatDateToString(item.attendanceDate)}</td>
                      <td>
                        <span class="badge-${item.status === "Successful" ? "success" : "error"}">
                          ${item.status}
                        </span>
                      </td>
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
  };

  // Export to Excel
  const onExportToExcel = () => {
    if (!dataGrid.value?.instance) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Attendance Records");

    // Add headers
    worksheet.addRow([
      "Agency",
      "Integration Date",
      "Attendance System Data Date",
      "Integration Status",
    ]);

    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.eachCell((cell: ExcelJS.Cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFf8fafc" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Add data rows - use the current filtered data
    agencyData.value.forEach((item: AgencyData) => {
      worksheet.addRow([
        item.agency,
        agencyStore.formatDateToString(item.integrationDate),
        agencyStore.formatDateToString(item.attendanceDate),
        item.status,
      ]);
    });

    // Auto fit columns
    worksheet.columns.forEach((column: Partial<ExcelJS.Column>) => {
      column.width = 20;
    });

    // Generate and download Excel file
    workbook.xlsx
      .writeBuffer()
      .then((buffer: ArrayBuffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "AgencyAttendanceRecords.xlsx");
        notify("Excel export complete", "success", 2000);
      })
      .catch(() => {
        notify("Error exporting to Excel", "error", 2000);
      });
  };

  return {
    dataSource: agencyData,
    dataGrid,
    searchValue,
    loading,
    formatDate,
    statusCellTemplate,
    actionCellTemplate,
    onSearchValueChanged,
    onRowDoubleClick,
    viewDetails,
    printGrid,
    onExportToExcel,
    isFiltered: filters,
    navigateToEmployees,
  };
};
