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
defineProps({
  idea: Object,
  handleVote: Function,
  handleAddComment: Function,
  newComments: Object,
});
</script>
<template>
  <Card class="w-full">
    <CardHeader class="gap-0">
      <RouterLink :to="`/project/${idea.project_id}`"
        ><CardTitle class="text-xs">{{
          idea.project_name
        }}</CardTitle></RouterLink
      >
      <CardDescription class="text-[0.7rem]">{{ idea.author }}</CardDescription>
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
              @click="handleVote(idea.id, true)"
              aria-label="Upvote"
            >
              <ThumbsUp class="h-4 w-4 mr-2" />
              <span class="text-xl font-bold">{{ idea.upvotes }}</span>
            </Button>
            <Button
              variant="secondary"
              class="p-2"
              @click="handleVote(idea.id, false)"
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
          <div class="space-y-2">
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
  </Card>
</template>
