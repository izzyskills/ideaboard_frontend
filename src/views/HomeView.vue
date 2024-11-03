<script setup>
import { ref, reactive, computed, watch } from "vue";
import IdeaCard from "@/components/cards/IdeaCard.vue";
import { useGetIdeas } from "@/composables/requests";
import { useRoute } from "vue-router";
import { Loader2 } from "lucide-vue-next";

const route = useRoute();
const searchText = ref(route.query.text || "");
const { ideas, error } = useGetIdeas();
const newComments = reactive({});

// Compute flattened ideas using computed property
const displayedIdeas = ref([]);
const handleVote = (id, isUpvote) => {
  const idea = displayedIdeas.value.find((idea) => idea.id === id);
  if (idea) {
    if (isUpvote) {
      idea.upvotes++;
    } else {
      idea.downvotes++;
    }
  }
};

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

// Debug watcher for ideas data
watch(
  () => ideas.data,
  (newData) => {
    displayedIdeas.value = newData.value.pages[0].data;
  },
  { deep: true },
);
</script>
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Ideas Board</h1>

    <div v-if="error" class="text-red-500">{{ error.message }}</div>

    <!-- Show ideas when data is available -->
    <template v-if="ideas.data">
      <div class="space-y-4">
        <IdeaCard
          v-for="idea in displayedIdeas"
          :key="idea.id"
          :idea="idea"
          :handle-vote="handleVote"
          :handle-add-comment="handleAddComment"
          :new-comments="newComments"
        />
      </div>

      <button
        v-if="ideas.hasNextPage"
        @click="() => ideas.fetchNextPage()"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        :disabled="ideas.isFetchingNextPage"
      >
        {{ ideas.isFetchingNextPage ? "Loading more..." : "Load More" }}
      </button>
    </template>

    <!-- Show loader for initial load only -->
    <div
      v-if="ideas.isLoading && !ideas.data"
      class="flex w-full justify-center items-center text-center"
    >
      <Loader2 class="h-10 w-10 animate-spin" />
    </div>
  </div>
</template>
