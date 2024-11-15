<script setup>
import { toTypedSchema } from "@vee-validate/zod";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { idea_schema } from "./schemas";
import { useForm } from "vee-validate";
import ProjectForm from "./ProjectForm.vue";
import { ref } from "vue";
import { PlusCircledIcon } from "@radix-icons/vue";
import { useProject } from "@/composables/useProject";
import { useCategory } from "@/composables/useCategory";
import { useAuth } from "@/composables/useAuth";
import { usePostIdea } from "@/composables/requests";

const isLoading = ref(false);
const formSchema = toTypedSchema(idea_schema);
const { categories } = useCategory();

const { handleSubmit, setFieldValue, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    project_id: "",
    category: "",
  },
});

const { postIdea } = usePostIdea();
const open = ref(false);
const { getUser } = useAuth();

const { projects: previousProjects } = useProject();

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true;
    values.category_id = Number(values.category_id);
    values.creator_id = getUser.value.user_id;
    console.log(values);

    await postIdea.mutateAsync(values);
    open.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});
</script>
<template>
  <div>
    <Dialog v-model:open="open">
      <DialogTrigger as-child>
        <Button class="gap-x-2 w-full">
          <PlusCircledIcon class="" />
          Create Idea
        </Button>
      </DialogTrigger>

      <DialogContent class="sm:max-w-[25rem] md:min-w-[40rem] min-h-[30rem]">
        <form @submit.prevent="onSubmit">
          <DialogHeader>
            <DialogTitle>Submit a New Idea</DialogTitle>
          </DialogHeader>
          <CardContent class="h-full mt-2">
            <ProjectForm
              :previous-projects="previousProjects"
              :set-field-value="setFieldValue"
              :values="values"
            />
            <FormField v-slot="{ componentField }" name="category_id">
              <FormItem>
                <FormLabel> Category </FormLabel>
                <Select v-bind="componentField">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="select a category..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem
                        v-for="category in categories"
                        :key="category.value"
                        :value="String(category.value)"
                      >
                        {{ category.label }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="title">
              <FormItem>
                <FormLabel> Title </FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    placeholder="Enter your idea title..."
                    class="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="description">
              <FormItem>
                <FormLabel aria-label=""> Description </FormLabel>
                <FormControl>
                  <Textarea
                    v-bind="componentField"
                    placeholder="Describe your idea..."
                    class="w-full min-h-60"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <DialogFooter class="mt-8">
              <Button :disabled="isLoading" type="submit">{{
                isLoading ? `Submitting Idea...` : `Submit Idea`
              }}</Button>
            </DialogFooter>
          </CardContent>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>
