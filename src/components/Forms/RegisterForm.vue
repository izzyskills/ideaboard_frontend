<script setup>
import { ref } from "vue";
import { Loader2 } from "lucide-vue-next";
import { EyeClosedIcon, EyeOpenIcon, GithubLogoIcon } from "@radix-icons/vue";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { signup_schema } from "./schemas";
import {
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "../ui/form";
import { useSignup } from "@/composables/requests";

const isLoading = ref(false);
const formSchema = toTypedSchema(signup_schema);
const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const { signup } = useSignup();
const passwordIsVisible = ref(false);

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true;
    await signup.mutateAsync(values);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="flex flex-col space-y-2 text-center">
    <h1 class="text-2xl font-semibold tracking-tight">Create an account</h1>
    <p class="text-sm text-muted-foreground">
      Enter your email below to create your account
    </p>
    <div :class="cn('grid gap-6 text-left', $attrs.class ?? '')">
      <form @submit="onSubmit">
        <div class="grid gap-2">
          <FormField v-slot="{ componentField }" name="username">
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="James"
                  autocomplete="cc-given-name"
                  v-bind="componentField"
                  :disabled="isLoading"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel> Email </FormLabel>
              <FormControl>
                <Input
                  placeholder="name@example.com"
                  auto-capitalize="none"
                  auto-complete="email"
                  auto-correct="off"
                  v-bind="componentField"
                  :disabled="isLoading"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel> Password </FormLabel>
              <FormControl>
                <div class="relative w-full items-center">
                  <Input
                    placeholder="Password"
                    :type="passwordIsVisible ? 'text' : 'password'"
                    auto-complete="new-password"
                    v-bind="componentField"
                    :disabled="isLoading"
                  />

                  <span
                    class="absolute end-0 -inset-y-0 flex items-center justify-self-center px-2"
                  >
                    <EyeOpenIcon
                      v-if="!passwordIsVisible"
                      @click="passwordIsVisible = true"
                      class="size-6" />
                    <EyeClosedIcon
                      v-else
                      @click="passwordIsVisible = false"
                      class="size-6"
                  /></span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password_confirmation">
            <FormItem>
              <FormLabel> Confirm Password </FormLabel>
              <FormControl>
                <Input
                  placeholder="Password"
                  :type="passwordIsVisible ? 'text' : 'password'"
                  autocomplete="new-password"
                  v-bind="componentField"
                  :disabled="isLoading"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button class="mt-4" type="submit" :disabled="isLoading">
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            {{ isLoading ? " Creating Account" : "Create Account" }}
          </Button>
        </div>
      </form>
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <span class="w-full border-t" />
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-6">
        <Button variant="outline">
          <GithubLogoIcon class="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <Button variant="outline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 48 48"
            class="h-4 w-4 mr-2"
          >
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            ></path>
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            ></path>
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
          </svg>
          Google
        </Button>
      </div>
    </div>
    <p class="px-8 text-center text-sm text-muted-foreground">
      By clicking continue, you agree to our
      <a href="/terms" class="underline underline-offset-4 hover:text-primary">
        Terms of Service
      </a>
      and
      <a
        href="/privacy"
        class="underline underline-offset-4 hover:text-primary"
      >
        Privacy Policy
      </a>
      .
    </p>
  </div>
</template>
