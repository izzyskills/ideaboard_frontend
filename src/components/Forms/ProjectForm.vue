<script setup>
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { CaretDownIcon, CheckIcon } from "@radix-icons/vue";
import { cn } from "@/lib/utils";

const { previousProjects, setFieldValue, values } = defineProps({
  previousProjects: Array,
  setFieldValue: Function,
  values: Object,
});
</script>

<template>
  <FormField name="project_id">
    <FormItem class="flex flex-col mb-2 -mt-2">
      <FormLabel>Project Name</FormLabel>
      <Popover>
        <PopoverTrigger as-child>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              :class="
                cn(
                  'w-40 justify-between',
                  !values.project_id && 'text-muted-foreground',
                )
              "
            >
              {{
                values.project_id
                  ? previousProjects.find(
                      (project) => project.id === values.project_id,
                    )?.name
                  : "Select a Project"
              }}
              <CaretDownIcon class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent class="w-[10rem] p-0">
          <Command>
            <CommandInput placeholder="Select Projects..." />
            <CommandEmpty>
              <RouterLink to="#"> Create Project </RouterLink></CommandEmpty
            >
            <CommandList>
              <CommandGroup>
                <CommandItem
                  v-for="previousProject in previousProjects"
                  :key="previousProject.id"
                  :value="previousProject.name"
                  @select="
                    () => {
                      setFieldValue('project_id', previousProject.id);
                    }
                  "
                >
                  <CheckIcon
                    :class="
                      cn(
                        'mr-2 h-4 w-4',
                        previousProject.id == values.project_id
                          ? 'opacity-100'
                          : 'opacity-0',
                      )
                    "
                  />
                  {{ previousProject.name }}
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
