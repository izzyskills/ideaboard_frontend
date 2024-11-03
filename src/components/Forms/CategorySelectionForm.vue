<script setup>
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from "@/components/ui/tags-input";
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxPortal,
  ComboboxRoot,
} from "radix-vue";
import { computed, ref } from "vue";

const categories = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "full_stack", label: "Full Stack" },
  { value: "ui_ux", label: "UI/UX" },
  { value: "devops", label: "DevOps" },
  { value: "mobile_development", label: "Mobile Development" },
  { value: "data_science", label: "Data Science" },
  { value: "ai_ml", label: "Artificial Intelligence / Machine Learning" },
  { value: "game_development", label: "Game Development" },
  { value: "security", label: "Security" },
  { value: "iot", label: "Internet of Things (IoT)" },
  { value: "cloud_computing", label: "Cloud Computing" },
  { value: "blockchain", label: "Blockchain" },
  { value: "networking", label: "Networking" },
  { value: "database_management", label: "Database Management" },
  { value: "embedded_systems", label: "Embedded Systems" },
  { value: "automation", label: "Automation" },
  { value: "testing", label: "Testing" },
  { value: "documentation", label: "Documentation" },
  { value: "tools_utilities", label: "Tools and Utilities" },
];

const modelValue = ref([]);
const open = ref(false);
const searchTerm = ref("");

const filteredFrameworks = computed(() =>
  categories.filter((i) => !modelValue.value.includes(i.label)),
);
</script>

<template>
  <TagsInput class="px-0 gap-0 min-w-80" :model-value="modelValue">
    <div class="flex gap-2 flex-wrap items-center px-3">
      <TagsInputItem v-for="item in modelValue" :key="item" :value="item">
        <TagsInputItemText />
        <TagsInputItemDelete />
      </TagsInputItem>
    </div>

    <ComboboxRoot
      v-model="modelValue"
      v-model:open="open"
      v-model:search-term="searchTerm"
      class="w-full"
    >
      <ComboboxAnchor as-child>
        <ComboboxInput placeholder="Select Categories..." as-child>
          <TagsInputInput
            class="w-full px-3"
            :class="modelValue.length > 0 ? 'mt-2' : ''"
            @keydown.enter.prevent
          />
        </ComboboxInput>
      </ComboboxAnchor>

      <ComboboxPortal>
        <ComboboxContent>
          <CommandList
            position="popper"
            class="w-[--radix-popper-anchor-width] rounded-md mt-2 border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          >
            <CommandEmpty />
            <CommandGroup>
              <CommandItem
                v-for="framework in filteredFrameworks"
                :key="framework.value"
                :value="framework.label"
                @select.prevent="
                  (ev) => {
                    if (typeof ev.detail.value === 'string') {
                      searchTerm = '';
                      modelValue.push(ev.detail.value);
                    }

                    if (filteredFrameworks.length === 0) {
                      open = false;
                    }
                  }
                "
              >
                {{ framework.label }}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>
  </TagsInput>
</template>
