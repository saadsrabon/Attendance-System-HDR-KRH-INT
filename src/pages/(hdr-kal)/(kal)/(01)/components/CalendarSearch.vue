<template>
  <div class="p-4">
    <div class="border border-gray-300 rounded-lg p-6">
      <h2 class="text-lg font-semibold mb-6">Calendar Settings Search </h2>

      <DxForm id="search-form" :formData="formData">
        <DxSimpleItem
          dataField="category"
          editorType="dxSelectBox"
          :label="{ text: 'Calendar Category' }"
          :editorOptions="{
            dataSource: categories,
            placeholder: 'Please Select',
            searchEnabled: true,
            valueExpr: 'id',
            displayExpr: 'name',
          }"
        />
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
import DxForm, { DxSimpleItem } from "devextreme-vue/form";
import DxButton from "devextreme-vue/button";
import { ref, reactive, onMounted } from "vue";
import { calendarCategoryOptions } from "@/stores/calender/data";

// Define emits
const emit = defineEmits(["search", "reset"]);

// Form data object
const formData = reactive({
  category: null,
});

// Data for dropdowns
const categories = ref(calendarCategoryOptions);

// Initialize the search form
const initForm = () => {
  formData.category = null;
};

// Search handler
const onSearch = () => {
  const searchParams = {
    category: formData.category,
  };

  // Emit search event to parent component with the actual chosen category
  emit("search", searchParams);
};

// Reset form handler
const onReset = () => {
  // Reset form data first
  initForm();

  // Then emit reset event to parent component
  emit("reset");
};

// Initialize form on component mount
onMounted(() => {
  initForm();
});
</script>

<style scoped>
/* Ensure responsive behavior */
@media (max-width: 768px) {
  :deep(#search-form) {
    display: flex;
    flex-direction: column;
  }
}
</style>
