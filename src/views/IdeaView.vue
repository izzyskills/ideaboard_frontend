<script setup>
import IdeaCard from "@/components/cards/IdeaCard.vue";
import { useRoute } from "vue-router";
import CommentCard from "@/components/cards/CommentCard.vue";
import { useGetIdeabyId } from "@/composables/requests";
import GoBack from "@/components/nav/GoBack.vue";

const idea_id = useRoute().params.id;
const { getIdeabyId, error } = useGetIdeabyId(idea_id);
</script>
<template>
  <div class="container mx-auto p-4 max-w-4xl">
    <GoBack />
    <h1 class="text-3xl font-bold mb-6">Idea Board</h1>

    <h2 v-if="error" class="text-xl font-semibold text-destructive">
      Idea not found
      <RouterLink to="\" class="text-primary">Click here to go back</RouterLink>
    </h2>

    <div v-if="getIdeabyId.data.value && !error" class="space-y-4 mb-4">
      <IdeaCard
        :idea="getIdeabyId.data.value.data"
        :should-show-comments="false"
      />
    </div>
    <h2 className="text-xl font-semibold mb-4">Comments</h2>
    <div className="space-y-4" v-if="getIdeabyId.data.value?.data.comments">
      <CommentCard
        v-for="comment in getIdeabyId.data.value?.data.comments"
        :key="comment.id"
        :comment="comment"
        class="p-4"
      />
    </div>
  </div>
</template>
