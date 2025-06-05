<template>
  <div class="p-4">
    <div class="border border-gray-300 rounded-lg p-6">
      <h2 class="text-lg font-semibold mb-6">Agency Attendance System Integration Information</h2>

      <!-- Search Box and Print Button in one row -->
      <div class="mb-4 flex items-center">
        <div class="w-full max-w-sm mr-auto">
          <DxTextBox
            placeholder="Search..."
            mode="search"
            :show-clear-button="true"
            v-model="searchValue"
            @value-changed="onSearchValueChanged"
            @keyup="onSearchValueChanged"
            value-change-mode="keyup"
            class="w-full"
          />
        </div>

        <!-- Print Button -->
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

      <!-- Active Filters Indicator -->
      <div
        v-if="isFiltered.isFiltered"
        class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md"
      >
        <div class="flex items-center justify-between">
          <div>
            <span class="text-blue-800 font-medium">Filters applied: </span>
            <span v-if="isFiltered.agency" class="mr-2 text-sm">Agency</span>
            <span v-if="isFiltered.integrationDate" class="mr-2 text-sm">Integration Date</span>
            <span v-if="isFiltered.attendanceSystemDataDate" class="mr-2 text-sm"
              >Attendance Date</span
            >
            <span v-if="isFiltered.status" class="mr-2 text-sm">Status</span>
          </div>
          <!-- <DxButton
            text="Clear Filters"
            icon="clear"
            type="normal"
            stylingMode="text"
            @click="onClearFilters"
          /> -->
        </div>
      </div>

      <!-- Loading Indicator -->
      <div v-if="loading" class="flex justify-center my-10">
        <div class="spinner"></div>
      </div>

      <!-- No Results Message -->
      <div
        v-else-if="dataSource && dataSource.length === 0"
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
          <h3 class="text-lg font-medium">No Results Found</h3>
          <p class="text-sm">Try adjusting your search or filter criteria</p>
        </div>
        <DxButton
          text="Clear All Filters"
          type="normal"
          stylingMode="outlined"
          @click="onClearFilters"
          class="mt-3"
        />
      </div>

      <!-- Data Grid -->
      <DxDataGrid
        v-else
        id="gridContainer"
        ref="dataGrid"
        :data-source="dataSource"
        :show-borders="true"
        :column-auto-width="true"
        :allow-column-resizing="true"
        :row-alternation-enabled="true"
        :hover-state-enabled="true"
        :selection="{ mode: 'multiple' }"
        :search-panel="{ visible: false }"
        :filterRow="{ visible: false }"
        :headerFilter="{ visible: true }"
        @row-dbl-click="onRowDoubleClick"
      >
        <DxSelection mode="multiple" show-check-boxes-mode="always" />

        <DxColumn
          data-field="agency"
          caption="Agency"
          :allow-sorting="true"
          :allow-filtering="true"
          :allow-header-filtering="true"
        />

        <DxColumn
          data-field="integrationDate"
          caption="Integration Date"
          :allow-sorting="false"
          :allow-filtering="false"
          :allow-header-filtering="false"
          data-type="date"
          :calculated-cell-template="formatDate"
        />

        <DxColumn
          data-field="attendanceDate"
          caption="Attendance System Data Date"
          :allow-sorting="false"
          :allow-filtering="false"
          :allow-header-filtering="false"
          data-type="date"
          :calculated-cell-template="formatDate"
        />

        <DxColumn
          data-field="status"
          caption="Integration Status"
          :allow-sorting="true"
          :allow-filtering="true"
          :allow-header-filtering="true"
          :cell-template="statusCellTemplate"
        />

        <DxColumn type="buttons" caption="Action" :width="80" :cell-template="actionCellTemplate" />

        <DxSorting mode="single" :visible="true" />
        <DxHeaderFilter :visible="true" />
        <DxPaging :page-size="5" />
        <DxPager
          :visible="true"
          :show-page-size-selector="true"
          :allowed-page-sizes="[5, 10, 20]"
          :show-info="true"
          :display-mode="'full'"
          position="bottom"
        />
      </DxDataGrid>
    </div>
  </div>
</template>

<script setup lang="ts">
import DxDataGrid, {
  DxColumn,
  DxPaging,
  DxPager,
  DxSorting,
  DxHeaderFilter,
  DxSelection,
} from "devextreme-vue/data-grid";
import DxTextBox from "devextreme-vue/text-box";
import DxButton from "devextreme-vue/button";
import "devextreme/dist/css/dx.light.css";
import { useAgencyList } from "@/composables/useAgencyList";
import { useAgencyStore } from "@/stores/agency/agency";

// Use the composable to get all the functionality
const {
  dataSource,
  dataGrid,
  searchValue,
  loading,
  formatDate,
  statusCellTemplate,
  actionCellTemplate,
  onSearchValueChanged,
  onRowDoubleClick,
  printGrid,
  onExportToExcel,
  isFiltered,
} = useAgencyList();

// Get agency store for additional actions
const agencyStore = useAgencyStore();

// Clear filters handler
const onClearFilters = () => {
  agencyStore.resetFilters();
};
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

/* Completely hide the filter row */
:deep(.dx-datagrid-filter-row) {
  display: none !important;
}

/* Fix pagination alignment */
:deep(.dx-pager) {
  padding: 0.75rem 1rem;
}

/* Fix textbox search icon */
:deep(.dx-texteditor-with-icon.dx-show-clear-button .dx-icon-clear) {
  right: 2.5rem;
}

/* Header filter popup styles to match mockup */
:deep(.dx-header-filter-menu) {
  /* Increase padding for better spacing */
  padding: 10px;
}

:deep(.dx-header-filter) {
  /* Make filter icon more prominent */
  color: #6b7280;
}

:deep(.dx-list-item-before-bag .dx-list-select-checkbox) {
  /* Align checkboxes to the left */
  margin-right: 10px;
}

:deep(.dx-list-select-all) {
  /* Style "Select All" similar to mockup */
  padding: 10px 15px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 5px;
}

:deep(.dx-list-select-all-checkbox) {
  /* Match checkbox styling */
  margin-right: 10px;
}

:deep(.dx-header-filter-menu .dx-popup-bottom) {
  /* Style OK/Cancel buttons area */
  padding: 10px;
  border-top: 1px solid #e5e7eb;
}

:deep(.dx-header-filter-menu .dx-button) {
  /* Style buttons similar to mockup */
  margin: 0 5px;
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
