<script setup lang="ts">
import { reactive, onMounted } from "vue";

import CalendarSearch from "../(01)/components/CalendarSearch.vue";
import CalendarList from "../(01)/components/CalendarList.vue";
import { useCalendarStore } from "@/stores/calender/useCalenderStore";


// Initialize calendar store
const calendarStore = useCalendarStore();

// Calendar search parameters
const searchParams = reactive({
  category: null as number | null,
});

// Handle search from search component
const handleSearch = (params: { category: number | null }) => {
  // Update search params
  Object.assign(searchParams, params);

  // Apply category filter to the store
  if (params.category !== null) {
    calendarStore.setFilter(params.category);
  } else {
    calendarStore.resetFilter();
  }
};

// Handle reset from search component
const handleReset = () => {
  // Reset search parameters
  searchParams.category = null;

  // Reset store filters
  calendarStore.resetFilter();
};

// Load data on component mount
onMounted(() => {
  // Reset filters initially to ensure all data is loaded
  calendarStore.resetFilter();
});
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6">Calendar Settings Management</h1>

    <!-- Search Component -->
    <CalendarSearch @search="handleSearch" @reset="handleReset" />

    <!-- List Component -->
    <CalendarList :search-params="searchParams" />
  </div>
</template>