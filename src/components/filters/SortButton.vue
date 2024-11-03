<script setup>
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MixerHorizontalIcon } from "@radix-icons/vue";
const options = ["popular", "newest", "oldest", "name"];
</script>

<template>
  <div class="w-40">
    <Select>
      <SelectTrigger>
        <MixerHorizontalIcon class="-mr-6" />
        <SelectValue placeholder="Sort By" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel> Sort</SelectLabel>
          <SelectItem v-for="option in options" :key="option" :value="option">
            {{ option }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>
