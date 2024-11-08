import { ref } from "vue";
import { defineStore } from "pinia";

export const useCategoryStore = defineStore("category", () => {
  const categories = ref([
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
  ]);
  return { categories };
});
