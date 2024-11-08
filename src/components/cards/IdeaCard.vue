<script setup>
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-vue-next";
import { RouterLink } from "vue-router";
import { usePostLike } from "@/composables/requests";
const { idea, handleAddComment, newComments, shouldShowComments } = defineProps(
  {
    idea: Object,
    handleAddComment: Function,
    newComments: Object,
    shouldShowComments: {
      type: Boolean,
      default: true,
    },
  },
);

console.log(idea);
//TODO: implement a way to show if a user liked an idea
//TODO: implement a way to update the number of likes and dislikes on the UI
//TODO: implement way to show a popup if a user is not authenticated and tries to like an idea
const { postLike, error } = usePostLike(idea.id);
const handleVote = async (isUpvote) => {
  const formData = JSON.stringify({ is_upvote: isUpvote });
  const res = await postLike.mutateAsync(formData);
  console.log(res);
};
</script>
<template>
  <Card class="w-full">
    <RouterLink :to="`/idea/${idea.id}`">
      <CardHeader class="gap-0">
        <RouterLink :to="`/project/${idea.project_id}`"
          ><CardTitle class="text-xs">{{
            idea.project_name
          }}</CardTitle></RouterLink
        >
        <CardDescription class="text-[0.7rem]"
          >Posted by {{ idea.author }}</CardDescription
        >
      </CardHeader>

      <CardContent class="">
        <div class="flex">
          <div class="flex-grow">
            <h2 class="text-xl font-semibold mb-2">{{ idea.title }}</h2>
            <p class="text-gray-600 mb-4">{{ idea.body }}</p>
            <div class="flex flex-row items-center gap-4 mr-4 mb-4">
              <Button
                variant="secondary"
                class="p-2"
                @click="handleVote(true)"
                aria-label="Upvote"
              >
                <ThumbsUp class="h-4 w-4 mr-2" />
                <span class="text-xl font-bold">{{ idea.upvotes }}</span>
              </Button>
              <Button
                variant="secondary"
                class="p-2"
                @click="handleVote(false)"
                aria-label="Downvote"
              >
                <ThumbsDown class="h-4 w-4 mr-2" />
                <span class="text-xl font-bold">{{ idea.downvotes }}</span>
              </Button>
              <Button variant="secondary" class="p-2">
                <MessageSquare class="h-4 w-4 mr-1" />
                <span>{{ idea.comments.length }} comments</span>
              </Button>
            </div>
            <Separator class="my-4" />
            <div v-if="shouldShowComments" class="space-y-2">
              <div
                v-for="(comment, index) in idea.comments"
                :key="index"
                class="bg-secondary p-2 rounded-md"
              >
                {{ comment }}
              </div>
            </div>
            <div class="flex gap-2 mt-4">
              <Input
                type="text"
                v-model="newComments[idea.id]"
                placeholder="Add a comment..."
                class="flex-grow"
              />
              <Button @click="handleAddComment(idea.id)">Comment</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </RouterLink>
  </Card>
</template>
