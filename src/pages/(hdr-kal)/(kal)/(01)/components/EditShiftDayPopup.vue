<template>
  <DxPopup
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    title="Edit Shift Day"
    width="400"
    height="300"
  >
    <div class="p-4">
      <div v-if="shiftDay">
        <div class="mb-4">
          <label class="block mb-2 font-medium">{{ shiftDay.dayName }}</label>
        </div>

        <div class="mb-4">
          <label class="block mb-2">Day Type</label>
          <DxRadioGroup v-model="dayType" :items="['Working Day', 'Off Day']" layout="horizontal" />
        </div>

        <div v-if="dayType === 'Working Day'" class="mb-4">
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block mb-2">Start Time</label>
              <DxTextBox v-model="startTime" mask="00:00" placeholder="09:00" />
            </div>
            <div class="flex-1">
              <label class="block mb-2">End Time</label>
              <DxTextBox v-model="endTime" mask="00:00" placeholder="17:00" />
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <DxButton text="Cancel" @click="$emit('update:visible', false)" />
          <DxButton text="Save" type="success" @click="saveChanges" />
        </div>
      </div>
    </div>
  </DxPopup>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import DxPopup from "devextreme-vue/popup";
import DxButton from "devextreme-vue/button";
import DxRadioGroup from "devextreme-vue/radio-group";
import DxTextBox from "devextreme-vue/text-box";
import type { ShiftDaySchedule } from "@/types/calender";

const props = defineProps({
  visible: { type: Boolean, required: true },
  shiftDay: { type: Object as () => ShiftDaySchedule | null, required: false, default: null },
});

const emit = defineEmits(["update:visible", "save"]);

// Local state
const dayType = ref("Working Day");
const startTime = ref("");
const endTime = ref("");

// Watch for changes in the shiftDay prop and update local state
watch(
  () => props.shiftDay,
  (newVal) => {
    if (newVal) {
      dayType.value = newVal.start && newVal.end ? "Working Day" : "Off Day";
      startTime.value = newVal.start || "";
      endTime.value = newVal.end || "";
    }
  },
  { immediate: true }
);

const saveChanges = () => {
  if (props.shiftDay) {
    const updatedDay = { ...props.shiftDay };
    updatedDay.start = dayType.value === "Working Day" ? startTime.value : null;
    updatedDay.end = dayType.value === "Working Day" ? endTime.value : null;

    emit("save", updatedDay);
    emit("update:visible", false);
  }
};
</script>
