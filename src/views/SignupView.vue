<script setup>
import RegisterForm from "@/components/Forms/RegisterForm.vue";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { RouterLink } from "vue-router";
import { MountainIcon } from "lucide-vue-next";
</script>

<template>
  <div class="md:hidden">
    <!--   <VPImage -->
    <!--     alt="Authentication" -->
    <!--     width="1280" -->
    <!--     height="1214" -->
    <!--     class="block" -->
    <!--     :image="{ -->
    <!--       dark: '/examples/authentication-dark.png', -->
    <!--       light: '/examples/authentication-light.png', -->
    <!--     }" -->
    <!--   /> -->
  </div>

  <div
    class="container relative h-[800px] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-2"
  >
    <div
      class="relative h-full hidden flex-col bg-muted p-10 text-white dark:border-r lg:flex"
    >
      <div class="absolute inset-0 bg-bg-image bg-cover bg-center" />
      <div
        class="relative z-20 flex items-center text-lg font-medium text-primary"
      >
        <MountainIcon class="h-8 w-8 mr-2" />
        Idea Board
      </div>
      <div class="relative z-20 mt-auto text-primary">
        <blockquote class="space-y-2">
          <p class="text-lg">
            &ldquo;Welcome to ideaboard where you can share opensource ideas
            easily &rdquo;
          </p>
          <footer class="text-sm">Omola Israel</footer>
        </blockquote>
      </div>
    </div>
    <div class="lg:p-8">
      <div
        class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
      >
        <RegisterForm />
      </div>
    </div>
  </div>
</template>
