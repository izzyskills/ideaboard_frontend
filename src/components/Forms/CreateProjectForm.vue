<script setup>
import { ref } from "vue";
import {
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
  Form,
} from "../ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import { project_schema } from "./schemas";
import { toTypedSchema } from "@vee-validate/zod";
import { usePostProject } from "@/composables/requests";
import { useForm } from "vee-validate";
import { useAuth } from "@/composables/useAuth";

const isLoading = ref(false);
const { getUser } = useAuth();
const formSchema = toTypedSchema(project_schema);
const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const { postProject } = usePostProject();

const modelOpen = ref(false);

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true;
    values.creator_id = getUser.value.user_id;
    await postProject.mutateAsync(values);
    modelOpen.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});
</script>
<template>
  <Dialog v-model:open="modelOpen">
    <DialogTrigger>
      <Button>Create Project</Button>
    </DialogTrigger>
    <DialogContent class="">
      <form @submit="onSubmit">
        <DialogHeader>
          <DialogTitle>Create a new project</DialogTitle>
        </DialogHeader>
        <CardContent class="h-full mt-2">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input v-bind="componentField" />
                <FormMessage />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="url">
            <FormItem>
              <FormLabel>Project URL</FormLabel>
              <FormControl>
                <Input v-bind="componentField" />
                <FormMessage />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="description">
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea v-bind="componentField" />
                <FormMessage />
              </FormControl>
            </FormItem>
          </FormField>
          <DialogFooter class="mt-8">
            <Button :diabled="isLoading" type="submit">{{
              isLoading ? `Creating Project...` : `Create Project`
            }}</Button>
          </DialogFooter>
        </CardContent>
      </form>
    </DialogContent>
  </Dialog>
</template>
