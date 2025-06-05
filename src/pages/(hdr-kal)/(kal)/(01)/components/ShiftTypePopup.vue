<template>
  <DxPopup
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    title="Shift Type Schedule"
    width="700"
    height="500"
  >
    <div class="p-4">
      <div class="mb-4">
        <label class="block mb-2 font-medium">Shift Type:</label>
        <DxSelectBox
          v-model="selectedShiftTypeId"
          :items="shiftTypeOptions"
          displayExpr="name"
          valueExpr="id"
          class="w-full"
        />
      </div>

      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 px-3 py-2 text-left">Day</th>
            <th class="border border-gray-300 px-3 py-2 text-left">Start Time</th>
            <th class="border border-gray-300 px-3 py-2 text-left">End Time</th>
            <th class="border border-gray-300 px-3 py-2 text-left">Status</th>
            <th class="border border-gray-300 px-3 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="day in currentShiftTypeSchedule" :key="day.dayId" class="hover:bg-gray-50">
            <td class="border border-gray-300 px-3 py-2">{{ day.dayName }}</td>
            <td class="border border-gray-300 px-3 py-2">{{ day.start || "-" }}</td>
            <td class="border border-gray-300 px-3 py-2">{{ day.end || "-" }}</td>
            <td class="border border-gray-300 px-3 py-2">
              <span v-if="!day.start && !day.end" class="text-red-500 font-medium">Off Day</span>
              <span v-else class="text-green-500 font-medium">Working Day</span>
            </td>
            <td class="border border-gray-300 px-3 py-2">
              <button class="text-blue-500 hover:text-blue-700" @click="editShiftDay(day)">
                <i class="dx-icon-edit"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="p-3 flex justify-end">
      <DxButton text="Close" @click="$emit('update:visible', false)" />
    </div>
  </DxPopup>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import DxPopup from "devextreme-vue/popup";
import DxButton from "devextreme-vue/button";
import DxSelectBox from "devextreme-vue/select-box";
import type { ShiftDaySchedule, Option, ShiftTypeTimeRange } from "@/types/calender";

const props = defineProps({
  visible: { type: Boolean, required: true },
  initialShiftTypeId: { type: Number, required: true },
  shiftTypeOptions: { type: Array as () => Option[], required: true },
  shiftTypeTimeRange: { type: Array as () => ShiftTypeTimeRange[], required: true },
});

const emit = defineEmits(["update:visible", "edit-shift-day", "update:selectedShiftTypeId"]);

// Use a local copy of selectedShiftTypeId
const selectedShiftTypeId = ref(props.initialShiftTypeId);

// Watch for changes in the initialShiftTypeId prop
watch(
  () => props.initialShiftTypeId,
  (newVal) => {
    selectedShiftTypeId.value = newVal;
  }
);

// Watch for changes in the local selectedShiftTypeId and emit updates
watch(selectedShiftTypeId, (newVal) => {
  emit("update:selectedShiftTypeId", newVal);
});

// Computed property to get the current shift type schedule
const currentShiftTypeSchedule = computed(() => {
  const selectedShiftType = props.shiftTypeTimeRange.find(
    (item) => item.id === selectedShiftTypeId.value
  );
  return selectedShiftType ? selectedShiftType.schedule : [];
});

const editShiftDay = (day: ShiftDaySchedule) => {
  emit("edit-shift-day", day);
};
</script>
