<script setup>
import { computed, ref, watch } from "vue";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { RouterLink, useRoute } from "vue-router";
import DarkMode from "@/components/nav/DarkMode.vue";
import MenuIcon from "@/components/icons/MenuIcon.vue";
import MountainIcon from "@/components/icons/MountainIcon.vue";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@radix-icons/vue";
import CreateIdeaForm from "@/components/Forms/CreateIdeaForm.vue";
import { useAuth } from "@/composables/useAuth";
import { useGetIdeas, useLogout } from "@/composables/requests";
import { Loader2 } from "lucide-vue-next";
import { useRouter } from "vue-router";
import debounce from "lodash/debounce";

const searchText = ref("");
const router = useRouter();
const route = useRoute();
const isNotLoginOrRegister = computed(() => {
  return route.path !== "/login" && route.path !== "/signup";
});
const updateQuery = debounce((text) => {
  if (route.name === "idea") {
    router.push({ path: "/", query: { text } });
  } else {
    router.push({ query: { text } });
  }
}, 1000);

searchText.value = route.query.text || "";
watch(
  () => route.query.text,
  (newText) => {
    searchText.value = newText || "";
  },
);

watch(searchText, (newText) => {
  updateQuery(newText);
});
// Watch searchText and update searchParams in useGetIdeas
const { isLoggedIn } = useAuth();
const { logout } = useLogout();
const handleLogout = async () => {
  try {
    await logout.mutateAsync();
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
        <RouterLink to="/" class="mr-6 flex mb-4">
          <MountainIcon class="h-6 w-6" />
          <span class="sr-only">Idea Board</span>
        </RouterLink>
        <div v-if="isNotLoginOrRegister" class="relative w-full items-center">
          <Input
            id="search"
            type="text"
            v-model="searchText"
            placeholder="Search..."
            class="pl-10"
          />
          <span
            class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
          >
            <MagnifyingGlassIcon class="size-6 text-muted-foreground" />
          </span>
        </div>

        <div v-if="isLoggedIn" class="grid gap-2 py-6">
          <Button @click="handleLogout" variant="destructive" size="sm">
            <Loader2
              v-if="logout.isLoading"
              class="mr-2 h-4 w-4 animate-spin"
            />
            {{ logout.isLoading ? "Logging out..." : "Logout" }}
          </Button>
        </div>

        <div v-else="isLoggedIn" class="grid gap-2 py-6">
          <Button variant="outline" size="sm">
            <RouterLink to="login"> Login </RouterLink>
          </Button>
          <Button class="text-left" size="sm">
            <RouterLink class="text-left" to="signup"> Register </RouterLink>
          </Button>
        </div>
        <DarkMode />
      </SheetContent>
    </Sheet>
    <RouterLink to="/" class="flex items-center">
      <div class="hidden lg:inline-flex min-w-40 gap-2 mr-6">
        <MountainIcon class="h-6 w-6" />
        <span class="">Idea Board</span>
      </div>
    </RouterLink>
    <!-- serach bar -->
    <div class="flex w-full content-between">
      <nav class="w-3/5 hidden gap-x-28 lg:flex">
        <div v-if="isNotLoginOrRegister" class="relative w-full items-center">
          <Input
            id="search"
            type="text"
            v-model="searchText"
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
        <CreateIdeaForm />
        <Button @click="handleLogout" variant="destructive" size="sm">
          <Loader2 v-if="logout.isLoading" class="mr-2 h-4 w-4 animate-spin" />
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
