<script setup>
import { useRouter } from "vue-router";
import { ChevronLeftIcon } from "@radix-icons/vue";
const router = useRouter();
const goBack = () => {
  router.go(-1);
};
</script>
<template>
  <ChevronLeftIcon @click="goBack" />
</template>
