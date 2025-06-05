<template>
  <div class="p-4">
    <div class="border border-gray-300 rounded-lg p-6">
      <div class="flex justify-between">
        <h2 class="text-lg font-semibold mb-6">
          {{ $route.params.id ? "Edit Calendar Settings" : "Create Calendar Settings" }}
        </h2>
        <button
          class="flex items-center text-gray-600 hover:text-gray-800"
          @click="openDeterminationModal = true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <DxForm
        @submit.prevent
        @field-data-changed="onFieldDataChanged"
        :formData="formData"
        :colCount="1"
      >
        <!-- Calendar Info Section -->
        <DxGroupItem caption="Calendar Information" :colCount="2">
          <DxSimpleItem
            dataField="calendarName"
            editorType="dxTextBox"
            :label="{ text: 'Calendar Name' }"
          />
          <DxSimpleItem
            dataField="calendarCategoryId"
            editorType="dxSelectBox"
            :editorOptions="{
              items: calendarCategoryOptions,
              displayExpr: 'name',
              valueExpr: 'id',
            }"
            :label="{ text: 'Calendar Category' }"
          />

          <DxSimpleItem
            dataField="calendarGroupId"
            editorType="dxSelectBox"
            :editorOptions="{
              items: groupOptions,
              displayExpr: 'name',
              valueExpr: 'id',
            }"
            :label="{ text: 'Calendar Group' }"
          />
          <DxSimpleItem
            dataField="shiftTypeId"
            editorType="dxSelectBox"
            :editorOptions="{ items: shiftTypeOptions, displayExpr: 'name', valueExpr: 'id' }"
            :label="{ text: 'Shift Type' }"
          />
        </DxGroupItem>

        <DxGroupItem :colCount="2">
          <DxSimpleItem>
            <div
              class="text-blue-600 cursor-pointer hover:underline"
              @click="openHolidayPopup = true"
            >
              View Public Holidays
            </div>
          </DxSimpleItem>
          <DxSimpleItem>
            <div
              class="text-blue-600 cursor-pointer hover:underline"
              @click="openShiftTypePopup = true"
            >
              View Shift Type
            </div>
          </DxSimpleItem>
        </DxGroupItem>

        <!-- Rest Break Section -->
        <DxGroupItem caption="Rest Break" :colCount="2">
          <DxSimpleItem :label="{ text: 'Start Date' }">
            <DxDateBox
              v-model="formData.restBreak.startDate"
              type="date"
              displayFormat="yyyy-MM-dd"
            />
          </DxSimpleItem>
          <DxSimpleItem :label="{ text: 'End Date' }">
            <DxDateBox
              v-model="formData.restBreak.endDate"
              type="date"
              displayFormat="yyyy-MM-dd"
            />
          </DxSimpleItem>
        </DxGroupItem>
        <DxGroupItem :colCount="2">
          <!-- Term Breaks in New Row -->
          <DxGroupItem caption="Term Breaks" :colCount="2">
            <DxGroupItem>
              <DxSimpleItem :label="{ text: formData.termBreaks[0].title + ' Start Date' }">
                <DxDateBox
                  v-model="formData.termBreaks[0].startDate"
                  type="date"
                  displayFormat="yyyy-MM-dd"
                />
              </DxSimpleItem>
              <DxSimpleItem :label="{ text: formData.termBreaks[0].title + ' End Date' }">
                <DxDateBox
                  v-model="formData.termBreaks[0].endDate"
                  type="date"
                  displayFormat="yyyy-MM-dd"
                />
              </DxSimpleItem>
            </DxGroupItem>
            <DxGroupItem>
              <DxSimpleItem :label="{ text: formData.termBreaks[1].title + ' Start Date' }">
                <DxDateBox
                  v-model="formData.termBreaks[1].startDate"
                  type="date"
                  displayFormat="yyyy-MM-dd"
                />
              </DxSimpleItem>
              <DxSimpleItem :label="{ text: formData.termBreaks[1].title + ' End Date' }">
                <DxDateBox
                  v-model="formData.termBreaks[1].endDate"
                  type="date"
                  displayFormat="yyyy-MM-dd"
                />
              </DxSimpleItem>
            </DxGroupItem>
          </DxGroupItem>

          <!-- Holiday Events in New Row -->
          <DxGroupItem caption="Holiday Events" :colCount="1">
            <template v-for="(event, index) in formData.holidayEvents" :key="index">
              <DxGroupItem :colCount="2">
                <DxSimpleItem :label="{ text: event.title }">
                  <DxDateBox v-model="event.date" type="date" displayFormat="yyyy-MM-dd" />
                </DxSimpleItem>
              </DxGroupItem>
            </template>
          </DxGroupItem>
        </DxGroupItem>

        <!-- Weekly Days -->
        <DxGroupItem caption="Weekly Days" :colCount="2">
          <DxSimpleItem
            dataField="weeklyRestDay"
            editorType="dxSelectBox"
            :editorOptions="{ items: weekDays, displayExpr: 'name', valueExpr: 'id' }"
            :label="{ text: 'Weekly Rest Day' }"
          />
          <DxSimpleItem
            dataField="weeklyHoliday"
            editorType="dxSelectBox"
            :editorOptions="{ items: weekDays, displayExpr: 'name', valueExpr: 'id' }"
            :label="{ text: 'Weekly Holiday' }"
          />
        </DxGroupItem>
        <!-- State and Agency Selectors -->
        <DxSimpleItem :label="{ text: 'States' }">
          <div class="flex items-center">
            <span class="mr-2">{{ selectedStateIds.length }} selected</span>
            <DxButton text="Select States" @click="openStatePopup = true" />
          </div>
        </DxSimpleItem>

        <DxSimpleItem :label="{ text: 'Agencies' }">
          <div class="flex items-center">
            <span class="mr-2">{{ selectedAgencyIds.length }} selected</span>
            <DxButton text="Select Agencies" @click="openAgencyPopup = true" />
          </div>
        </DxSimpleItem>

        <!-- Special Holiday Toggle -->
        <DxSimpleItem
          dataField="isSpecialHoliday"
          editorType="dxCheckBox"
          :label="{ text: 'Is Special Holiday?' }"
        />
        <DxSimpleItem
          v-if="formData.isSpecialHoliday"
          :label="{ text: 'Special Holiday Agencies' }"
        >
          <div class="flex items-center">
            <span class="mr-2">{{ specialHolidayAgencyIds.length }} selected</span>
            <DxButton text="Select Special Agencies" @click="openSpecialAgencyPopup = true" />
          </div>
        </DxSimpleItem>
      </DxForm>
    </div>

    <!-- Popups for multi-select components -->
    <DxPopup v-model:visible="openStatePopup" title="Select States" width="400" height="500">
      <div class="p-4">
        <div v-for="option in stateOptions" :key="option.id" class="flex items-center mb-2">
          <DxCheckBox
            :value="selectedStateIds.includes(Number(option.id))"
            @valueChanged="(e) => toggleStateSelection(Number(option.id), e.value)"
          />
          <span @click="toggleStateSelection(Number(option.id))" class="ml-2 cursor-pointer">
            {{ option.name }}
          </span>
        </div>
      </div>
      <div class="p-3 flex justify-end">
        <DxButton text="Close" @click="closeStatePopup" />
      </div>
    </DxPopup>

    <DxPopup v-model:visible="openAgencyPopup" title="Select Agencies" width="400" height="500">
      <div class="p-4">
        <div v-for="option in agencyOptions" :key="option.id" class="flex items-center mb-2">
          <DxCheckBox
            :value="selectedAgencyIds.includes(Number(option.id))"
            @valueChanged="(e) => toggleAgencySelection(Number(option.id), e.value)"
          />
          <span @click="toggleAgencySelection(Number(option.id))" class="ml-2 cursor-pointer">
            {{ option.name }}
          </span>
        </div>
      </div>
      <div class="p-3 flex justify-end">
        <DxButton text="Close" @click="closeAgencyPopup" />
      </div>
    </DxPopup>

    <!-- Special Holiday Agencies Popup -->
    <DxPopup
      v-model:visible="openSpecialAgencyPopup"
      title="Select Special Holiday Agencies"
      width="400"
      height="500"
    >
      <div class="p-4">
        <div v-for="option in agencyOptions" :key="option.id" class="flex items-center mb-2">
          <DxCheckBox
            :value="specialHolidayAgencyIds.includes(Number(option.id))"
            @valueChanged="(e) => toggleSpecialAgencySelection(Number(option.id), e.value)"
          />
          <span
            @click="toggleSpecialAgencySelection(Number(option.id))"
            class="ml-2 cursor-pointer"
          >
            {{ option.name }}
          </span>
        </div>
      </div>
      <div class="p-3 flex justify-end">
        <DxButton text="Close" @click="closeSpecialAgencyPopup" />
      </div>
    </DxPopup>

    <!-- Holiday Popup -->
    <HolidayPopup
      :visible="openHolidayPopup"
      @update:visible="openHolidayPopup = $event"
      :holidays="malaysianPublicHolidays"
    />

    <!-- Shift Type Popup -->
    <ShiftTypePopup
      :visible="openShiftTypePopup"
      :initial-shift-type-id="selectedShiftTypeId"
      :shift-type-options="shiftTypeOptions"
      :shift-type-time-range="shiftTypeTimeRange"
      @update:visible="openShiftTypePopup = $event"
      @update:selected-shift-type-id="selectedShiftTypeId = $event"
      @edit-shift-day="editShiftDay"
    />

    <!-- Edit Shift Day Popup -->
    <EditShiftDayPopup
      :visible="openEditShiftDayPopup"
      :shift-day="editingShiftDay"
      @update:visible="openEditShiftDayPopup = $event"
      @save="saveShiftDayEdit"
    />

    <!-- Determination Settings Modal -->
    <DeterminationSettingsModal
      :visible="openDeterminationModal"
      :initialItems="determinationItems"
      @update:visible="openDeterminationModal = $event"
      @update:items="updateDeterminationItems"
      @open-cancel-confirmation="openCancelConfirmation = true"
      @save="saveDeterminationSettings"
    />

    <!-- Confirmation Dialog -->
    <CancelConfirmationPopup
      :visible="openCancelConfirmation"
      @update:visible="openCancelConfirmation = $event"
      @confirm="confirmCancelSettings"
    />

    <!-- Action Buttons -->
    <div class="mt-6 flex justify-end space-x-4">
      <DxButton text="Return" type="normal" stylingMode="outlined" @click="goBack" />
      <DxButton
        :text="isEditMode ? 'Update' : 'Save'"
        type="success"
        stylingMode="contained"
        @click="saveCalendar"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import DxForm from "devextreme-vue/form";
import { DxSimpleItem, DxGroupItem } from "devextreme-vue/form";
import DxDateBox from "devextreme-vue/date-box";
import DxButton from "devextreme-vue/button";
import DxPopup from "devextreme-vue/popup";
import DxCheckBox from "devextreme-vue/check-box";
import notify from "devextreme/ui/notify";
import {
  calendarCategoryOptions,
  groupOptions,
  shiftTypeOptions,
  weekDays,
  stateOptions,
  agencyOptions,
  malaysianPublicHolidays,
  shiftTypeTimeRange,
  determinationItems as determinationItemsData,
} from "@/stores/calender/data";
import type { CalendarForm, ShiftDaySchedule, DeterminationItem } from "@/types/calender";
import { useCalendarStore } from "@/stores/calender/useCalenderStore";
import HolidayPopup from "./HolidayPopup.vue";
import DeterminationSettingsModal from "./DeterminationSettingsModal.vue";
import CancelConfirmationPopup from "./CancelConfirmationPopup.vue";
import ShiftTypePopup from "./ShiftTypePopup.vue";
import EditShiftDayPopup from "./EditShiftDayPopup.vue";

// Router for navigation
const router = useRouter();
const route = useRoute();
const calendarId = computed(() => {
  const id = route.params.id;
  return id ? Number(id) : undefined;
});
const isEditMode = computed(() => !!calendarId.value);

// Calendar store for saving data
const calendarStore = useCalendarStore();

// Selected states and agencies
const selectedStateIds = ref<number[]>([]);
const selectedAgencyIds = ref<number[]>([]);
const specialHolidayAgencyIds = ref<number[]>([]);

// Form data with default values
const formData = ref<CalendarForm>({
  id: 0, // ID will be generated by the store when saving
  calendarName: "",
  calendarCategoryId: 1,
  calendarGroupId: 1,
  shiftTypeId: 1,
  restBreak: { startDate: "", endDate: "" },
  termBreaks: [
    { title: "Term 1", startDate: "", endDate: "" },
    { title: "Term 2", startDate: "", endDate: "" },
  ],
  holidayEvents: [
    { title: "National Day", date: "" },
    { title: "Labour Day", date: "" },
  ],
  weeklyRestDay: "1",
  weeklyHoliday: "7",
  selectedStateIds: [],
  selectedAgencyIds: [],
  isSpecialHoliday: false,
  specialHolidayAgencyIds: [],
  generalHolidays: [],
});

// Popup visibility control
const openStatePopup = ref(false);
const openAgencyPopup = ref(false);
const openSpecialAgencyPopup = ref(false);
const openHolidayPopup = ref(false);
const openShiftTypePopup = ref(false);
const openEditShiftDayPopup = ref(false);
const openDeterminationModal = ref(false);
const openCancelConfirmation = ref(false);

// Selected shift type for the popup
const selectedShiftTypeId = ref(1);

// Watchers for shift type id changes
watch(
  () => formData.value.shiftTypeId,
  (newVal) => {
    selectedShiftTypeId.value = newVal;
  }
);

// Edit Shift Day Popup methods
const editingShiftDay = ref<ShiftDaySchedule | null>(null);

const editShiftDay = (day: ShiftDaySchedule) => {
  editingShiftDay.value = day;
  openEditShiftDayPopup.value = true;
};

const saveShiftDayEdit = (updatedDay: ShiftDaySchedule) => {
  // Find the shift type in the original data
  const shiftTypeIndex = shiftTypeTimeRange.findIndex((st) => st.id === selectedShiftTypeId.value);
  if (shiftTypeIndex !== -1) {
    // Find the day in the schedule
    const dayIndex = shiftTypeTimeRange[shiftTypeIndex].schedule.findIndex(
      (d) => d.dayId === updatedDay.dayId
    );
    if (dayIndex !== -1) {
      // Update the day in the schedule (only local UI state, not persisted)
      shiftTypeTimeRange[shiftTypeIndex].schedule[dayIndex] = { ...updatedDay };
    }
  }

  // Show notification
  notify({
    message: `Updated schedule for ${updatedDay.dayName}`,
    position: { at: "bottom", my: "bottom", offset: "0 -20" },
    width: 300,
    type: "success",
  });
};

// Save or update the calendar
const saveCalendar = () => {
  try {
    // Format all dates to YYYY-MM-DD format
    const processedData = { ...formData.value };

    if (processedData.restBreak) {
      processedData.restBreak.startDate = formatDate(processedData.restBreak.startDate);
      processedData.restBreak.endDate = formatDate(processedData.restBreak.endDate);
    }

    if (processedData.termBreaks) {
      processedData.termBreaks.forEach((term) => {
        term.startDate = formatDate(term.startDate);
        term.endDate = formatDate(term.endDate);
      });
    }

    if (processedData.holidayEvents) {
      processedData.holidayEvents.forEach((event) => {
        event.date = formatDate(event.date);
      });
    }

    if (isEditMode.value) {
      // Update existing calendar
      calendarStore.update(processedData);
      notify({
        message: "Calendar updated successfully",
        position: { my: "center top", at: "center top" },
        width: 300,
        type: "success",
      });
    } else {
      // Create new calendar
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...newCalendarData } = processedData; // Remove id when creating
      calendarStore.create(newCalendarData);
      notify({
        message: "Calendar created successfully",
        position: { my: "center top", at: "center top" },
        width: 300,
        type: "success",
      });
    }

    // Go back to the calendar list page
    router.push("/test-kal-01");
  } catch (error) {
    console.error(`Error ${isEditMode.value ? "updating" : "creating"} calendar:`, error);
    notify({
      message: `Error ${isEditMode.value ? "updating" : "creating"} calendar`,
      position: { my: "center top", at: "center top" },
      width: 300,
      type: "error",
    });
  }
};

// Handle form field data changes
const onFieldDataChanged = (e: { dataField?: string; value?: unknown }) => {
  // The e.dataField contains the name of the changed field
  // The e.value contains the new value

  // You can add additional validation or processing here
  // For example, if one field should trigger changes in another field

  if (e.dataField === "isSpecialHoliday" && !e.value) {
    // Reset special holiday agencies if isSpecialHoliday is set to false
    specialHolidayAgencyIds.value = [];
    formData.value.specialHolidayAgencyIds = [];
  }

  // You can also validate fields here
  if (e.dataField === "calendarName" && e.value === "") {
    notify({
      message: "Calendar name cannot be empty",
      type: "warning",
      position: { at: "bottom", my: "bottom", offset: "0 -20" },
      width: 300,
    });
  }
};

// Format date to YYYY-MM-DD
const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr; // Return original if invalid

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Navigate back
const goBack = () => {
  router.push("/calender/list");
};

// Watch for changes to isSpecialHoliday
watch(
  () => formData.value.isSpecialHoliday,
  (newVal) => {
    // Reset specialHolidayAgencyIds if isSpecialHoliday is set to false
    if (!newVal) {
      specialHolidayAgencyIds.value = [];
      formData.value.specialHolidayAgencyIds = [];
    }
  }
);

// Popup control methods
const closeStatePopup = () => {
  openStatePopup.value = false;
  // Update form data from selected IDs
  formData.value.selectedStateIds = [...selectedStateIds.value];
};

const closeAgencyPopup = () => {
  openAgencyPopup.value = false;
  // Update form data from selected IDs
  formData.value.selectedAgencyIds = [...selectedAgencyIds.value];
};

const closeSpecialAgencyPopup = () => {
  openSpecialAgencyPopup.value = false;
  // Update form data from selected IDs
  formData.value.specialHolidayAgencyIds = [...specialHolidayAgencyIds.value];
};

// Helper methods for multi-select components
const toggleStateSelection = (id: number, value?: boolean) => {
  if (value === undefined) {
    // Toggle the current state when clicking on the label
    const isSelected = selectedStateIds.value.includes(id);
    toggleStateSelection(id, !isSelected);
    return;
  }

  if (value) {
    if (!selectedStateIds.value.includes(id)) {
      selectedStateIds.value.push(id);
    }
  } else {
    selectedStateIds.value = selectedStateIds.value.filter((i) => i !== id);
  }
};

const toggleAgencySelection = (id: number, value?: boolean) => {
  if (value === undefined) {
    // Toggle the current state when clicking on the label
    const isSelected = selectedAgencyIds.value.includes(id);
    toggleAgencySelection(id, !isSelected);
    return;
  }

  if (value) {
    if (!selectedAgencyIds.value.includes(id)) {
      selectedAgencyIds.value.push(id);
    }
  } else {
    selectedAgencyIds.value = selectedAgencyIds.value.filter((i) => i !== id);
  }
};

const toggleSpecialAgencySelection = (id: number, value?: boolean) => {
  if (value === undefined) {
    // Toggle the current state when clicking on the label
    const isSelected = specialHolidayAgencyIds.value.includes(id);
    toggleSpecialAgencySelection(id, !isSelected);
    return;
  }

  if (value) {
    if (!specialHolidayAgencyIds.value.includes(id)) {
      specialHolidayAgencyIds.value.push(id);
    }
  } else {
    specialHolidayAgencyIds.value = specialHolidayAgencyIds.value.filter((i) => i !== id);
  }
};

// Load calendar data on component mount
onMounted(() => {
  if (isEditMode.value && calendarId.value) {
    // Get the calendar data by ID for edit mode
    const calendar = calendarStore.getById(calendarId.value);

    if (calendar) {
      // Update the form data with the calendar data
      formData.value = { ...calendar };

      // Initialize selected states and agencies
      selectedStateIds.value = [...(calendar.selectedStateIds || [])];
      selectedAgencyIds.value = [...(calendar.selectedAgencyIds || [])];
      specialHolidayAgencyIds.value = [...(calendar.specialHolidayAgencyIds || [])];
    } else {
      // Handle case where calendar is not found
      notify({
        message: "Calendar not found",
        position: { my: "center top", at: "center top" },
        width: 300,
        type: "error",
      });
      // Navigate back to the list
      router.push("/test-kal-01");
    }
  }
  // For create mode, the default values are already set
});

// Determination Settings - load from data file
const determinationItems = ref<DeterminationItem[]>(
  determinationItemsData.map((item) => ({ ...item }))
);

const saveDeterminationSettings = () => {
  // Update form fields based on active settings
  updateFormFieldsVisibility();

  notify({
    message: "Determination settings saved successfully",
    position: { my: "center top", at: "center top" },
    width: 300,
    type: "success",
  });
};

// Add this new method
const updateDeterminationItems = (items: DeterminationItem[]) => {
  determinationItems.value = items;
  // Update form fields visibility based on the new items
  updateFormFieldsVisibility();
};

const updateFormFieldsVisibility = () => {
  // This function would hide/show form fields based on determination settings
  // For demonstration purposes only
  const activeSettings = determinationItems.value
    .filter((item) => item.isActive)
    .map((item) => item.name);

  // In a real app, this would update UI components visibility
  return activeSettings;
};

const confirmCancelSettings = () => {
  //Reset all determination items to inactive
  determinationItems.value.forEach((item) => {
    item.isActive = false;
  });

  // Update form fields visibility
  updateFormFieldsVisibility();

  notify({
    message: "Calendar settings removed",
    position: { my: "center top", at: "center top" },
    width: 300,
    type: "warning",
  });
};
</script>

<style>
/* Any additional styles if needed */
</style>
