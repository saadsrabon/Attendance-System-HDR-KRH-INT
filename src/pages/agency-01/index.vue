<template>
  <div class="p-4">
    <div class="border border-gray-300 rounded-lg p-6">
      <h2 class="text-lg font-semibold mb-6">Agency List</h2>

      <!-- Content -->
      <NuxtLink to="/agency" class="text-blue-600 flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
          />
        </svg>
        <span>Back to Dashboard</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  // Redirect to main page
  router.push("/");
});
</script>
