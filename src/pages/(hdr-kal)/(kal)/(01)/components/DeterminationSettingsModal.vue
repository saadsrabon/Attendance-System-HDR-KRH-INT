<template>
  <DxPopup
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    title="Calendar Setting Information"
    width="600"
    height="550"
    :show-close-button="true"
    :drag-enabled="true"
  >
    <div class="p-6">
      <div class="mb-6">
        <div class="border-b border-gray-200 pb-4 mb-4">
          <h3 class="text-lg font-semibold">Determination Information</h3>
        </div>

        <!-- List of determination items with toggle switches -->
        <div class="mb-6">
          <div
            v-for="item in items"
            :key="item.id"
            class="flex justify-between items-center p-3 border-b border-gray-100"
          >
            <span class="font-medium">{{ item.name }}</span>
            <div class="flex items-center">
              <label class="switch">
                <input type="checkbox" v-model="item.isActive" />
                <span class="slider round"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex justify-end space-x-3">
        <DxButton text="Return" type="normal" stylingMode="outlined" @click="closeModal" />
        <DxButton
          text="Cancel"
          type="danger"
          stylingMode="outlined"
          @click="$emit('open-cancel-confirmation')"
        />
        <DxButton text="Save" type="success" stylingMode="contained" @click="saveSettings" />
      </div>
    </div>
  </DxPopup>
</template>

<script setup lang="ts">
import DxPopup from "devextreme-vue/popup";
import DxButton from "devextreme-vue/button";
import type { DeterminationItem } from "@/types/calender";
import { ref, watch, onMounted } from "vue";
import notify from "devextreme/ui/notify";

const props = defineProps({
  visible: { type: Boolean, required: true },
  initialItems: { type: Array as () => DeterminationItem[], required: true },
});

const emit = defineEmits(["update:visible", "open-cancel-confirmation", "save", "update:items"]);

// Create a local reactive copy of the items
const items = ref<DeterminationItem[]>([]);

// Initialize items when the component mounts or when initialItems change
onMounted(() => {
  updateLocalItems();
});

watch(
  () => props.initialItems,
  () => {
    updateLocalItems();
  }
);

function updateLocalItems() {
  // Make a deep copy to avoid direct mutation of props
  items.value = props.initialItems.map((item) => ({ ...item }));
}

const closeModal = () => {
  emit("update:visible", false);
};

const saveSettings = () => {
  // Update parent component with the new settings
  emit("update:items", items.value);
  emit("save");

  closeModal();

  notify({
    message: "Determination settings saved successfully",
    position: { my: "center top", at: "center top" },
    width: 300,
    type: "success",
  });
};
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 24px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
}
.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
}
input:checked + .slider {
  background-color: #4caf50;
}
input:checked + .slider:before {
  transform: translateX(36px);
}
.slider.round {
  border-radius: 24px;
}
.slider.round:before {
  border-radius: 50%;
}
</style>
