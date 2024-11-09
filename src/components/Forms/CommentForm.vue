<script setup>
import { ref } from "vue";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { comment_schmea } from "./schemas";
import {
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "../ui/form";
import { useAuth } from "@/composables/useAuth";
import { usePostComment } from "@/composables/requests";
const isLoading = ref(false);
const formSchema = toTypedSchema(comment_schmea);
const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
});

const { idea_id, popupOpen } = defineProps({
  idea_id: String,
  popupOpen: Function,
});

const { isLoggedIn, getUser } = useAuth();
const { postComment } = usePostComment(idea_id);

const onSubmit = handleSubmit(async (values) => {
  if (!isLoggedIn.value) {
    popupOpen();
    return;
  }
  try {
    isLoading.value = true;
    values.idea_id = idea_id;
    values.user_id = getUser.value.user_id;
    await postComment.mutateAsync(values);
    resetForm();
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});
</script>
<template>
  <form
    @submit.prevent="onSubmit"
    class="flex items-center justify-center gap-2 w-full"
    @click.stop
  >
    <FormField v-slot="{ componentField }" name="content">
      <FormItem class="flex flex-col w-full">
        <FormLabel class="sr-only" aria-label="commnet">Comment</FormLabel>
        <FormControl>
          <Input
            placeholder="add a comment..."
            v-bind="componentField"
            :disabled="isLoading"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button class="mt-2" type="submit" :loading="isLoading" @click.stop>
      {{ isLoading ? "Commenting..." : "Comment" }}
    </Button>
  </form>
</template>
