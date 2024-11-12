<script setup>
import IdeaCard from "@/components/cards/IdeaCard.vue";
import ProjectDescriptionCard from "@/components/cards/ProjectDescriptionCard.vue";
import CategorySelectionForm from "@/components/Forms/CategorySelectionForm.vue";
import SortButton from "@/components/filters/SortButton.vue";
import { Separator } from "@/components/ui/separator";
import { onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { useGetIdeas, useGetProjectByid } from "@/composables/requests";
import { useRoute } from "vue-router";
import { Loader2 } from "lucide-vue-next";
import GoBack from "@/components/nav/GoBack.vue";
const project_id = useRoute().params.id;
const { project, error: projectError } = useGetProjectByid(project_id);
const newComments = reactive({});

const route = useRoute();
const searchText = ref(route.query.text || "");
const { ideas, error: ideasError } = useGetIdeas(searchText, project_id);
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
    <GoBack />
    <h1 class="text-3xl font-bold mb-6">Idea Board</h1>
    <ProjectDescriptionCard
      v-if="project.data.value"
      :id="project.data.value.id"
      :project_name="project.data.value.name"
      :description="project.data.value.description"
      :open_soure_link="project.data.value.url"
    />
    <!-- <div class="flex mb-4 gap-4"> -->
    <!--   <CategorySelectionForm /> -->
    <!--   <SortButton /> -->
    <!-- </div> -->
    <Separator class="mb-4" />
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
      v-if="
        ideas.isLoading ||
        (ideas.isFetchingNextPage.value && ideas.hasNextPage.value)
      "
      class="flex w-full justify-center items-center text-center mt-4"
    >
      <Loader2 class="h-10 w-10 animate-spin" />
    </div>
    <div v-if="!ideas.isLoading || !ideas.hasNextPage.value">
      <p class="text-center mt-4">No more ideas to load</p>
    </div>
  </div>
</template>
