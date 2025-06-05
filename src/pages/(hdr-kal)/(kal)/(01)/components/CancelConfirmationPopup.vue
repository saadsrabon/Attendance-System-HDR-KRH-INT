<template>
  <DxPopup
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :show-title="false"
    width="400"
    height="200"
    :show-close-button="false"
    :drag-enabled="true"
  >
    <div class="p-6">
      <div class="mb-6 text-center">
        <p class="text-lg">Are you sure you want to remove the calendar setting?</p>
      </div>

      <div class="flex justify-center space-x-4">
        <DxButton
          text="NO"
          type="normal"
          stylingMode="outlined"
          @click="$emit('update:visible', false)"
        />
        <DxButton text="YES" type="danger" stylingMode="contained" @click="confirmCancel" />
      </div>
    </div>
  </DxPopup>
</template>

<script setup lang="ts">
import DxPopup from "devextreme-vue/popup";
import DxButton from "devextreme-vue/button";

defineProps({
  visible: { type: Boolean, required: true },
});

const emit = defineEmits(["update:visible", "confirm"]);

const confirmCancel = () => {
  emit("confirm");
  emit("update:visible", false);
};
</script>
