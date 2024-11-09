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
import { RouterLink, useRouter } from "vue-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { usePostLike } from "@/composables/requests";
import { ref } from "vue";
import { useAuth } from "@/composables/useAuth";
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
const router = useRouter();

const { postLike, error } = usePostLike(idea.id);
const isAnimatingLike = ref(false);
const isAnimatingDislike = ref(false);
const votes = ref({
  upvotes: idea.upvotes,
  downvotes: idea.downvotes,
  is_upvote: idea.is_upvote,
  has_voted: idea.has_voted,
});
const { isLoggedIn } = useAuth();
const open = ref(false);

const redirectToLogin = () => {
  const currentPath = window.location.pathname;
  router.push({ name: "login", query: { from: currentPath } });
};
const handleVote = async (isUpvote) => {
  console.log(isLoggedIn.value);
  if (!isLoggedIn.value) {
    open.value = true;
    return;
  }
  const formData = JSON.stringify({ is_upvote: isUpvote });
  if (isUpvote) {
    isAnimatingLike.value = true;
    setTimeout(() => {
      isAnimatingLike.value = false;
    }, 1000);
  } else {
    isAnimatingDislike.value = false;

    setTimeout(() => {
      isAnimatingDislike.value = false;
    }, 1000);
  }

  const res = await postLike.mutateAsync(formData);
  console.log(res);
  // Update the votes state based on the response
  if (res) {
    votes.value.upvotes = res.upvotes;
    votes.value.downvotes = res.downvotes;
    votes.value.is_upvote = res.is_upvote;
    votes.value.has_voted = res.has_voted;
  }
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
                <ThumbsUp
                  :class="`h-4 w-4 mr-2 ${votes.has_voted && votes.is_upvote ? 'fill-secondary-foreground stroke-secondary-foreground ' : ''} ${isAnimatingLike ? 'animate-ping' : ''}`"
                />
                <span class="text-xl font-bold">{{ votes.upvotes }}</span>
              </Button>
              <Button
                variant="secondary"
                class="p-2"
                @click="handleVote(false)"
                aria-label="Downvote"
              >
                <ThumbsDown
                  :class="`h-4 w-4 mr-2 ${votes.has_voted && !votes.is_upvote ? 'fill-secondary-foreground stroke-secondary-foreground' : ''} ${isAnimatingDislike ? 'animate-ping' : ''}`"
                />

                <span class="text-xl font-bold">{{ votes.downvotes }}</span>
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
    <AlertDialog v-model:open="open">
      <AlertDialogTrigger class="opacity-0 hidden">opor</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>You are not Logged In</AlertDialogTitle>
          <AlertDialogDescription>
            You cannot interact with this idea without logging in. Please log in
            to continue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction @click="redirectToLogin"
            >Continue</AlertDialogAction
          >
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </Card>
</template>
