<script setup>
import { RouterView } from "vue-router";
import Navbar from "./components/nav/Navbar.vue";
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
</script>
<template>
  <Navbar />

  <RouterView />
  <VueQueryDevtools />
</template>
