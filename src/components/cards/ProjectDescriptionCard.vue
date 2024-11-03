<script setup>
const { project_name, description, id, open_soure_link } = defineProps({
  id: String,
  project_name: String,
  description: String,
  open_soure_link: String,
});
</script>
<template>
  <div class="flex flex-col mb-6">
    <h1 class="text-3xl font-bold mb-2">{{ project_name }}</h1>
    <span class="sr-only">{{ id }}</span>
    <h2 class="text-gray-800 dark:text-gray-200 text-base">
      Project Link:
      <RouterLink class="text-primary">{{ open_soure_link }}</RouterLink>
    </h2>
    <p class="text-gray-700 dark:text-gray-300 text-sm">{{ description }}</p>
  </div>
</template>
