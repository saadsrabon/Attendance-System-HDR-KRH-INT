<template>
  <div class="p-4">
    <div class="border border-gray-300 rounded-lg p-6">
      <h2 class="text-lg font-semibold mb-6">
        Agency Attendance System Integration Information Search
      </h2>

      <DxForm id="search-form" :colCount="2" :formData="formData">
        <!-- Left Column -->
        <DxGroupItem :colCount="1">
          <DxSimpleItem
            dataField="agency"
            editorType="dxSelectBox"
            :label="{ text: 'Agency' }"
            :editorOptions="{
              dataSource: agencyList,
              placeholder: 'Please Select',
              searchEnabled: true,
              valueExpr: 'id',
              displayExpr: 'name',
            }"
          />

          <DxSimpleItem
            dataField="integrationDate"
            editorType="dxDateBox"
            :label="{ text: 'Integration Date' }"
            :editorOptions="{
              placeholder: 'XX/XX/XXXX',
              displayFormat: 'dd/MM/yyyy',
              pickerType: 'calendar',
              showClearButton: true,
              onValueChanged: onIntegrationDateChanged,
            }"
          />

          <DxSimpleItem
            dataField="attendanceSystemDataDate"
            editorType="dxDateBox"
            :label="{ text: 'Attendance System Data Date' }"
            :editorOptions="{
              placeholder: 'XX/XX/XXXX',
              displayFormat: 'dd/MM/yyyy',
              pickerType: 'calendar',
              showClearButton: true,
              onValueChanged: onAttendanceSystemDataDateChanged,
            }"
          />
        </DxGroupItem>

        <!-- Right Column -->
        <DxGroupItem :colCount="1">
          <DxSimpleItem
            dataField="integrationStatus"
            editorType="dxSelectBox"
            :label="{ text: 'Integration Status' }"
            :editorOptions="{
              dataSource: statusList,
              placeholder: 'Please Select',
              searchEnabled: true,
              valueExpr: 'id',
              displayExpr: 'name',
            }"
          />

          <!-- Empty items to align with left column -->
          <DxEmptyItem />
          <DxEmptyItem />
        </DxGroupItem>
      </DxForm>

      <!-- Buttons Container -->
      <div class="flex justify-center mt-6 gap-4">
        <DxButton
          text="Search"
          type="default"
          stylingMode="contained"
          @click="onSearch"
          :icon="'search'"
        />
        <DxButton
          text="Reset"
          type="normal"
          stylingMode="outlined"
          @click="onReset"
          :icon="'refresh'"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DxForm, { DxSimpleItem, DxGroupItem, DxEmptyItem } from "devextreme-vue/form";
import DxButton from "devextreme-vue/button";
import { useAgencySearch } from "@/composables/useAgencySearch";

// Use the composable to get all the functionality
const {
  formData,
  onIntegrationDateChanged,
  onAttendanceSystemDataDateChanged,
  agencyList,
  statusList,
  onReset,
  onSearch,
} = useAgencySearch();
</script>

<style scoped>
/* Add custom styles for date picker icons to match the wireframe */
:deep(.dx-datebox) {
  position: relative;
}

:deep(.dx-datebox .dx-icon-calendar) {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

/* Ensure responsive behavior */
@media (max-width: 768px) {
  :deep(#search-form) {
    display: flex;
    flex-direction: column;
  }
}
</style>
