import { useCategoryStore } from "@/stores/categoryState";
import { storeToRefs } from "pinia";

export function useCategory() {
  const categoryStore = useCategoryStore();

  // Use storeToRefs for reactive state and computed properties
  const { categories } = storeToRefs(categoryStore);

  return {
    categories,
  };
}
