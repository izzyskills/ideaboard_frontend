<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from "vue";
import IdeaCard from "@/components/cards/IdeaCard.vue";
import {
  useGetAllProjects,
  useGetIdeas,
  usePostLike,
} from "@/composables/requests";
import { useRoute } from "vue-router";
import { Loader2 } from "lucide-vue-next";

const route = useRoute();
const searchText = ref(route.query.text || "");
const { ideas, error } = useGetIdeas(searchText, null);
const newComments = reactive({});

const triggerEl = ref();
const timer = ref(null);

const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      clearTimeout(timer.value);
      timer.value = setTimeout(() => {
        if (ideas.hasNextPage.value) {
          ideas.fetchNextPage();
        }
      }, 300);
    }
  },
  { threshold: 1 },
);

onMounted(() => {
  observer.observe(triggerEl.value);
});
onUnmounted(() => {
  observer.disconnect();
});

// Compute flattened ideas using computed property

const handleAddComment = (id) => {
  console.log("Adding comment for idea:", id);
};

// Watch for route changes
watch(
  () => route.query,
  (newQuery) => {
    searchText.value = newQuery.text || "";
  },
  { deep: true },
);
</script>
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Ideas Board</h1>

    <div v-if="error" class="text-red-500">{{ error.message }}</div>

    <!-- Show ideas when data is available -->
    <div v-if="ideas.data.value" class="space-y-4">
      <IdeaCard
        v-for="idea in ideas.data.value.pages.flatMap((page) => page.data)"
        :key="idea.id"
        :idea="idea"
        :handle-add-comment="handleAddComment"
        :new-comments="newComments"
      />
    </div>

    <div ref="triggerEl"></div>
    <div
      v-if="ideas.isFetchingNextPage.value && ideas.hasNextPage.value"
      class="flex w-full justify-center items-center text-center mt-4"
    >
      <Loader2 class="h-10 w-10 animate-spin" />
    </div>
    <div v-if="!ideas.hasNextPage.value">
      <p class="text-center mt-4">No more ideas to load</p>
    </div>
  </div>
</template>
