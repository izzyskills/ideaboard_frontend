<script setup>
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AvatarFallback, AvatarImage } from "../ui/avatar";
import Avatar from "../ui/avatar/Avatar.vue";
const { comment } = defineProps({
  comment: Object,
});
</script>
<template>
  <Card>
    <CardContent className="p-4">
      <div className="flex items-start">
        <Avatar
          size="sm"
          shape="circle"
          className="inline-flex items-center justify-center font-normal text-foreground select-none shrink-0 bg-secondary overflow-hidden rounded-full h-10 w-10 text-xs mr-4"
        >
          <AvatarImage
            :src="`https://api.dicebear.com/6.x/initials/svg?seed=${comment.author}`"
            :alt="comment.author"
          />
          <AvatarFallback>{{ comment.author.substring(0, 2) }}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <p className="font-semibold">{{ comment.author }}</p>
          <p className="text-gray-700 mt-1">{{ comment.body }}</p>
          <!-- <div className="flex items-center mt-2"> -->
          <!--   <Button variant="ghost" size="icon" onClick="{()" =""> -->
          <!--     handleCommentVote(comment.id, 1)} aria-label="Like comment" > -->
          <!--     <ThumbsUp className="h-4 w-4" /> -->
          <!--   </Button> -->
          <!--   <span className="text-sm text-gray-500 ml-2" -->
          <!--     >{comment.likes} likes</span -->
          <!--   > -->
          <!-- </div> -->
        </div>
      </div>
    </CardContent>
  </Card>
</template>
