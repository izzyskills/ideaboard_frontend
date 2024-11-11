<script setup>
import { RouterView } from "vue-router";
import Navbar from "./components/nav/Navbar.vue";
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
import { useGetAllProjects } from "./composables/requests";
import { Toaster } from "./components/ui/toast";

const { getAllProjects } = useGetAllProjects();
</script>
<template>
  <Navbar />
  <Toaster />
  <RouterView />
  <VueQueryDevtools />
</template>
