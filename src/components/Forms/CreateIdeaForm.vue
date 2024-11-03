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

import { idea_schema } from "./schemas";
import { useForm } from "vee-validate";
import ProjectForm from "./ProjectForm.vue";
import { ref } from "vue";
import { PlusCircledIcon } from "@radix-icons/vue";

const isLoading = ref(false);
const formSchema = toTypedSchema(idea_schema);

const { handleSubmit, setFieldValue, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    project_name: "",
    project_id: "",
  },
});

const previousProjects = ref([
  { name: "Ginuid api", id: "43500517-a0a4-4bcf-be5b-19863b496e55" },
  { name: "Electora", id: "6e4e7280-7da2-4a36-b21b-50bde4f6b24e" },
  { name: "Fast API", id: "9e5d6a7e-5ba8-4301-b76d-d8194753d5e2" },
]);

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true;
    // await createIdea.mutateAsync(values);
    console.log(values);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});
</script>
<template>
  <Form
    v-slot="{ submitForm }"
    as=""
    keep-values
    :validation-schema="formSchema"
    @submit="onSubmit"
  >
    <Dialog>
      <DialogTrigger as-child>
        <Button class="gap-x-2">
          <PlusCircledIcon class="" />
          Create Idea
        </Button>
      </DialogTrigger>

      <DialogContent class="sm:max-w-[25rem] md:min-w-[40rem] min-h-[30rem]">
        <form @submit.prevent="handleAddIdea" class="space-y-4">
          <DialogHeader>
            <DialogTitle>Submit a New Idea</DialogTitle>
          </DialogHeader>
          <CardContent class="h-full">
            <ProjectForm
              :previous-projects="previousProjects"
              :set-field-value="setFieldValue"
              :values="values"
            />
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
              <Button type="submit">Submit Idea</Button>
            </DialogFooter>
          </CardContent>
        </form>
      </DialogContent>
    </Dialog>
  </Form>
</template>
