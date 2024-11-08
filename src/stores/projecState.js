import { defineStore } from "pinia";
import { ref } from "vue";

export const useProjectStore = defineStore("projects", () => {
  const projects = ref([]);
  const setProjects = (data) => {
    projects.value = data;
  };
  return { projects, setProjects };
});
