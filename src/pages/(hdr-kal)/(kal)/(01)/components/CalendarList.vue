<template>
  <div class="p-4">
    <div class="border border-gray-300 rounded-lg p-6">
      <h2 class="text-lg font-semibold mb-6">Calendar Settings List</h2>

      <!-- Search Box and Action Buttons in one row -->
      <div class="mb-4 flex items-center justify-between">
        <!-- Search Box -->
        <div class="w-1/3">
          <div class="relative">
            <input
              type="text"
              v-model="searchText"
              placeholder="Search calendars..."
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              @input="onSearchChange"
            />
            <span class="absolute right-3 top-2.5 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2">
          <DxButton
            text="Create"
            icon="plus"
            type="success"
            stylingMode="contained"
            @click="onAddCalendar"
          />
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
      <div v-else-if="!filteredCalendars.length" class="text-center py-10 bg-gray-50 rounded-lg">
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
          <h3 class="text-lg font-medium">No Calendars Found</h3>
          <p class="text-sm">Try adjusting your filter criteria</p>
        </div>
        <DxButton
          text="Clear All Filters"
          type="normal"
          stylingMode="outlined"
          @click="resetFilters"
          class="mt-3"
        />
      </div>

      <!-- Data Grid -->
      <DxDataGrid
        v-else
        id="calendarsGrid"
        ref="dataGrid"
        :data-source="filteredCalendars"
        :show-borders="true"
        :column-auto-width="true"
        :allow-column-resizing="true"
        :row-alternation-enabled="true"
        :hover-state-enabled="true"
        :selection="{ mode: 'multiple' }"
        @selection-changed="onSelectionChanged"
      >
        <!-- Columns -->
        <DxSelection mode="multiple" show-check-boxes-mode="always" />
        <DxColumn data-field="id" caption="#" :width="80" alignment="center" />
        <DxColumn
          data-field="calendarName"
          caption="Calendar Name"
          :allow-sorting="true"
          :allow-filtering="true"
          :allow-header-filtering="true"
        />
        <DxColumn
          data-field="calendarCategoryId"
          caption="Calendar Category"
          :allow-sorting="true"
          :allow-filtering="true"
          :allow-header-filtering="true"
          :on-cell-click="onCategoryCellClick"
          :lookup="{
            dataSource: calendarCategoryOptions,
            valueExpr: 'id',
            displayExpr: 'name',
          }"
        />
        <DxColumn
          caption="Actions"
          :width="120"
          alignment="center"
          cell-template="actionTemplate"
        />

        <template #actionTemplate="{ data }">
          <div class="flex space-x-2 justify-center">
            <!-- <button
              class="text-blue-600 hover:text-blue-800"
              @click="onViewCalendar(data.data)"
              title="View"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button> -->
            <button
              class="text-green-600 hover:text-green-800"
              @click="onEditCalendar(data.data)"
              title="Edit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              class="text-red-600 hover:text-red-800"
              @click="showDeleteConfirmation(data.data)"
              title="Delete"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </template>

        <!-- Pagination -->
        <DxPaging :page-size="10" />
        <DxPager
          :visible="true"
          :show-page-size-selector="true"
          :allowed-page-sizes="[5, 10, 20]"
          :show-info="true"
          display-mode="full"
        />

        <!-- Sorting/Filtering -->
        <DxSorting mode="single" />
        <DxHeaderFilter :visible="true" />
        <DxFilterRow :visible="false" />
      </DxDataGrid>
    </div>

    <!-- Delete Confirmation Popup -->
    <DxPopup
      :visible="isDeletePopupVisible"
      :show-title="true"
      :show-close-button="true"
      :width="400"
      :height="260"
      position="center"
      @hiding="closeDeletePopup"
    >
      <div class="flex items-center justify-center">
        <div class="p-2 rounded-full bg-red-100 text-red-600 mr-2">
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
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
      </div>

      <div class="p-6 text-center">
        <p class="text-gray-700 mb-4">Are you sure you want to delete this calendar?</p>
        <div class="flex justify-center space-x-3">
          <DxButton text="Cancel" type="normal" stylingMode="outlined" @click="closeDeletePopup" />
          <DxButton text="Delete" type="danger" stylingMode="contained" @click="confirmDelete" />
        </div>
      </div>
    </DxPopup>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useCalendarStore } from "@/stores/calender/useCalenderStore";
import type { CalendarForm } from "@/types/calender";
import { calendarCategoryOptions } from "@/stores/calender/data";
import DxButton from "devextreme-vue/button";
import DxDataGrid, {
  DxColumn,
  DxPaging,
  DxPager,
  DxSorting,
  DxHeaderFilter,
  DxFilterRow,
  DxSelection,
} from "devextreme-vue/data-grid";
import DxPopup from "devextreme-vue/popup";
import "devextreme/dist/css/dx.light.css";
import { useRouter } from "vue-router";

// Define props for search params
const props = defineProps({
  searchParams: {
    type: Object,
    default: () => ({
      category: null,
    }),
  },
});

// Store setup
const calendarStore = useCalendarStore();
const { filteredCalendars } = storeToRefs(calendarStore);
const loading = ref(false);
const router = useRouter();

// Selected rows
const selectedRows = ref<number[]>([]);

// Search functionality
const searchText = ref("");
const onSearchChange = () => {
  if (dataGrid.value) {
    const instance = dataGrid.value.instance;
    instance.searchByText(searchText.value);
  }
};

// Delete popup state
const isDeletePopupVisible = ref(false);
const calendarToDelete = ref<number | null>(null);

const showDeleteConfirmation = (calendar: CalendarForm) => {
  calendarToDelete.value = calendar.id;
  isDeletePopupVisible.value = true;
};

const closeDeletePopup = () => {
  isDeletePopupVisible.value = false;
  calendarToDelete.value = null;
};

const confirmDelete = async () => {
  if (calendarToDelete.value !== null) {
    calendarStore.remove(calendarToDelete.value);
    closeDeletePopup();
  }
};

// DxDataGrid type definition
interface DxDataGridRef {
  instance: {
    exportToHtml: (options: { printMode: boolean }) => void;
    exportToExcel: (selectionOnly: boolean) => void;
    clearFilter: () => void;
    option: (key: string, value?: unknown) => unknown;
    getSelectedRowKeys: () => Array<number>;
    getDataSource: () => unknown;
    pageIndex: (newIndex?: number) => number;
    pageSize: (newSize?: number) => number;
    beginCustomLoading: (message?: string) => void;
    endCustomLoading: () => void;
    searchByText: (text: string) => void;
  };
}
const dataGrid = ref<DxDataGridRef | null>(null);

// Event handlers
const printGrid = () => {
  if (dataGrid.value) {
    // Use the built-in DevExtreme export to HTML for printing
    dataGrid.value.instance.exportToHtml({ printMode: true });
  }
};

const onExportToExcel = () => {
  if (dataGrid.value) {
    try {
      // Use filtered data directly from the store
      const data = [...filteredCalendars.value];

      // Create a workbook with the data
      import("exceljs").then((ExcelJS) => {
        const Workbook = ExcelJS.Workbook;
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet("Calendars");

        // Add headers
        worksheet.addRow(["ID", "Calendar Name", "Category"]);

        // Add data rows
        data.forEach((item) => {
          worksheet.addRow([item.id, item.calendarName, item.calendarCategoryId]);
        });

        // Style the worksheet
        worksheet.getColumn(1).width = 10;
        worksheet.getColumn(2).width = 30;
        worksheet.getColumn(3).width = 20;

        // Generate buffer
        workbook.xlsx.writeBuffer().then((buffer) => {
          const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "Calendars.xlsx";
          link.click();
          URL.revokeObjectURL(link.href);
        });
      });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Error exporting to Excel. See console for details.");
    }
  }
};

const onAddCalendar = () => {
  // Navigate to the calendar form page for creating a new calendar
  router.push("/calender/create");
};

// Event type definitions
interface SelectionChangedEvent {
  selectedRowKeys: number[];
  selectedRowsData: CalendarForm[];
  currentSelectedRowKeys: number[];
  currentDeselectedRowKeys: number[];
}

interface CellClickEvent {
  rowType: string;
  data: CalendarForm;
  column: {
    dataField: string;
  };
}

const onSelectionChanged = (e: SelectionChangedEvent) => {
  selectedRows.value = e.selectedRowKeys;
  console.error("Selected rows:", selectedRows.value);
};

const onCategoryCellClick = (e: CellClickEvent) => {
  if (e.rowType === "data" && e.column.dataField === "calendarCategoryId") {
    // Set filter by category ID
    calendarStore.setFilter(e.data.calendarCategoryId);
  }
};

// const onViewCalendar = (calendar: CalendarForm) => {
//   // Navigate to the calendar form for editing
//   router.push(`/calender/${calendar.id}`);
// };

const onEditCalendar = (calendar: CalendarForm) => {
  // Navigate to the calendar form for editing
  router.push(`/calender/${calendar.id}`);
};

// Modify resetFilters to use the store's resetFilter method
const resetFilters = () => {
  calendarStore.resetFilter();
};

// Watch for search parameter changes from parent component
watch(
  () => props.searchParams,
  (newParams) => {
    searchText.value = ""; // Reset search text when filters change
    if (newParams && newParams.category !== null) {
      // Update store filters
      calendarStore.setFilter(newParams.category);
    } else {
      calendarStore.resetFilter();
    }

    // Clear any DataGrid search when filters change
    if (dataGrid.value) {
      dataGrid.value.instance.searchByText("");
    }
  },
  { deep: true, immediate: true }
);

// Fetch data on component mount
onMounted(() => {
  // No need to fetch - the store already has the data
});
</script>

<style scoped>
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
