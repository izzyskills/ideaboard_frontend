<script setup>
import IdeaCard from "@/components/cards/IdeaCard.vue";
import ProjectDescriptionCard from "@/components/cards/ProjectDescriptionCard.vue";
import CategorySelectionForm from "@/components/Forms/CategorySelectionForm.vue";
import SortButton from "@/components/filters/SortButton.vue";
import { Separator } from "@/components/ui/separator";
import { reactive, ref } from "vue";
import { useGetIdeas, useGetProjectByid } from "@/composables/requests";
import { useRoute } from "vue-router";
const project_id = useRoute().params.id;
const { project, error: projectError } = useGetProjectByid(project_id);
const { ideas, error: ideasError } = useGetIdeas(project_id);
const newComments = reactive({});

const handleVote = (id, isUpvote) => {
  const idea = ideas.value.pages
    .flatMap((page) => page.data)
    .find((idea) => idea.id === id);
  if (idea) {
    isUpvote ? idea.upvotes++ : idea.downvotes++;
  }
};

const handleAddComment = (id) => {
  if (newComments[id]?.trim()) {
    const idea = ideas.value.pages
      .flatMap((page) => page.data)
      .find((idea) => idea.id === id);
    if (idea) {
      idea.comments.push(newComments[id]);
      newComments[id] = "";
    }
  }
};
</script>
<template>
  <div class="container mx-auto p-4">
    <ProjectDescriptionCard
      v-if="project.data.value"
      :id="project.data.value.id"
      :project_name="project.data.value.name"
      :description="project.data.value.description"
      :open_soure_link="project.data.value.url"
    />
    <div class="flex mb-4 gap-4">
      <CategorySelectionForm />
      <SortButton />
    </div>
    <Separator class="mb-4" />
    <div v-if="ideas.data.value" class="space-y-4">
      <IdeaCard
        v-for="idea in ideas.data.value.pages.flatMap((page) => page.data)"
        :key="idea.id"
        :idea="idea"
        :handle-vote="handleVote"
        :handle-add-comment="handleAddComment"
        :new-comments="newComments"
      />
    </div>
  </div>
</template>
