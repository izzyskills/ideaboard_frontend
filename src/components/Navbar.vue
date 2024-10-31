<script setup>
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { RouterLink } from "vue-router";
import DarkMode from "@/components/DarkMode.vue";
import MenuIcon from "@/components/icons/MenuIcon.vue";
import MountainIcon from "@/components/icons/MountainIcon.vue";
import { ref } from "vue";
import { Input } from "./ui/input";
import { MagnifyingGlassIcon } from "@radix-icons/vue";
const isLoggedIn = ref(false);
const handleLogout = async () => {
  try {
    // await logout.mutateAsync();
    console.log("Logging out...");
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <header class="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" class="lg:hidden">
          <MenuIcon class="h-6 w-6" />
          <span class="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <RouterLink to="#" class="mr-6 hidden lg:flex">
          <MountainIcon class="h-6 w-6" />
          <span class="sr-only">Acme Inc</span>
        </RouterLink>
        <div v-if="isLoggedIn" class="grid gap-2 py-6">
          <Button @click="handleLogout" variant="destructive" size="sm">
            {{ logout.isLoading ? "Logging out..." : "Logout" }}
          </Button>
          <DarkMode />
        </div>

        <div v-else="isLoggedIn" class="grid gap-2 py-6">
          <Button variant="outline" size="sm">
            <RouterLink to="login"> Login </RouterLink>
          </Button>
          <Button class="text-left" size="sm">
            <RouterLink class="text-left" to="signup"> Register </RouterLink>
          </Button>
          <RouterLink
            to="#"
            class="flex w-full items-center py-2 text-lg font-semibold"
          >
            Home
          </RouterLink>
          <RouterLink
            to="#"
            class="flex w-full items-center py-2 text-lg font-semibold"
          >
            About
          </RouterLink>
        </div>
        <DarkMode />
      </SheetContent>
    </Sheet>
    <RouterLink to="#" class="mr-6 hidden lg:flex gap-2">
      <MountainIcon class="h-6 w-6" />
      <span class="">Idea Board</span>
    </RouterLink>
    <!-- serach bar -->
    <div class="flex w-full content-between">
      <nav class="w-3/5 hidden gap-x-28 lg:flex">
        <div class="relative w-full items-center">
          <Input
            id="search"
            type="text"
            placeholder="Search..."
            class="pl-10"
          />
          <span
            class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
          >
            <MagnifyingGlassIcon class="size-6 text-muted-foreground" />
          </span>
        </div>
        <DarkMode />
      </nav>
      <nav v-if="isLoggedIn" class="ml-auto hidden lg:flex gap-6">
        <Button @click="handleLogout" variant="destructive" size="sm">
          {{ logout.isLoading ? "Logging out..." : "Logout" }}
        </Button>
      </nav>
      <nav v-else class="ml-auto hidden lg:flex gap-6">
        <RouterLink to="/login">
          <Button variant="outline" size="sm"> Login </Button>
        </RouterLink>
        <RouterLink to="/signup">
          <Button size="sm"> Register </Button>
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
