<template>
  <DxPopup
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    title="Public Holidays"
    width="600"
    height="500"
    :show-close-button="true"
    :drag-enabled="true"
  >
    <div class="p-4">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 px-3 py-2 text-left">#</th>
            <th class="border border-gray-300 px-3 py-2 text-left">Holiday Name</th>
            <th class="border border-gray-300 px-3 py-2 text-left">Day</th>
            <th class="border border-gray-300 px-3 py-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(holiday, index) in holidays" :key="index" class="hover:bg-gray-50">
            <td class="border border-gray-300 px-3 py-2">{{ index + 1 }}</td>
            <td class="border border-gray-300 px-3 py-2">{{ holiday.name }}</td>
            <td class="border border-gray-300 px-3 py-2">{{ holiday.dayName }}</td>
            <td class="border border-gray-300 px-3 py-2">{{ holiday.date }}</td>
          </tr>
          <tr v-if="!holidays.length">
            <td colspan="4" class="border border-gray-300 px-3 py-2 text-center text-gray-500">
              No public holidays available
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="p-3 flex justify-end">
      <DxButton text="Close" @click="closePopup" />
    </div>
  </DxPopup>
</template>

<script setup lang="ts">
import DxPopup from "devextreme-vue/popup";
import DxButton from "devextreme-vue/button";
import type { PublicHoliday } from "@/types/calender";

defineProps({
  visible: { type: Boolean, required: true },
  holidays: { type: Array as () => PublicHoliday[], required: true },
});

const emit = defineEmits(["update:visible"]);

const closePopup = () => {
  emit("update:visible", false);
};
</script>
