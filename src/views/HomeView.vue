<script setup>
import { ref, reactive } from "vue";
import IdeaCard from "@/components/cards/IdeaCard.vue";
import CreateIdeaForm from "@/components/Forms/CreateIdeaForm.vue";

const ideas = ref([
  {
    id: 1,
    title: "Create a mobile app",
    body: "We should develop a mobile app to reach more users on-the-go.",
    upvotes: 30,
    downvotes: 5,
    author: "Hunter Johnson",
    comments: [],
    project_name: "Ginuid api",
    project_id: "43500517-a0a4-4bcf-be5b-19863b496e55",
  },
  {
    id: 2,
    title: "Implement dark mode",
    body: "Adding a dark mode option would improve user experience, especially for night-time browsing.",
    upvotes: 9,
    downvotes: 2,
    comments: [],
    author: "John Doe",
    project_name: "Electora",
    project_id: "6e4e7280-7da2-4a36-b21b-50bde4f6b24e",
  },
  {
    id: 3,
    title: "Add a new payment gateway",
    body: "We should add a new payment gateway to support more payment options for our users.",
    upvotes: 15,
    downvotes: 3,
    comments: [],
    author: "Jane Street",
    project_name: "Fast API",
    project_id: "9e5d6a7e-5ba8-4301-b76d-d8194753d5e2",
  },
]);
const newComments = reactive({});
const handleVote = (id, isUpvote) => {
  const idea = ideas.value.find((idea) => idea.id === id);
  if (idea) {
    isUpvote ? idea.upvotes++ : idea.downvotes++;
  }
};

const handleAddComment = (id) => {
  if (newComments[id]?.trim()) {
    const idea = ideas.value.find((idea) => idea.id === id);
    if (idea) {
      idea.comments.push(newComments[id]);
      newComments[id] = "";
    }
  }
};
</script>
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Ideas Board</h1>
    <CreateIdeaForm />
    <div class="space-y-4">
      <IdeaCard
        v-for="idea in ideas"
        :key="idea.id"
        :idea="idea"
        :handle-vote="handleVote"
        :handle-add-comment="handleAddComment"
        :new-comments="newComments"
      />
    </div>
  </div>
</template>
