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
  { value: 1, label: "AI/ML" },
  { value: 2, label: "FrontEnd" },
  { value: 3, label: "Backend" },
  { value: 4, label: "FullStack" },
  { value: 5, label: "Mobile" },
  { value: 6, label: "GameDev" },
  { value: 7, label: "DevOps" },
  { value: 8, label: "Cloud" },
  { value: 9, label: "DataScience" },
  { value: 10, label: "Security" },
  { value: 11, label: "IoT" },
  { value: 12, label: "Blockchain" },
  { value: 13, label: "AR/VR" },
  { value: 14, label: "Other" },
];

const modelValue = ref([]);
const open = ref(false);
const searchTerm = ref("");
const selectedIds = ref([]);

const filteredFrameworks = computed(() =>
  categories.filter((i) => !modelValue.value.includes(i.label)),
);

const selectedCategories = computed(() =>
  categories
    .filter((i) => modelValue.value.includes(i.label))
    .map((i) => i.value),
);

console.log(filteredFrameworks);
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
