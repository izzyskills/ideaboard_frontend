import { defineStore } from "pinia";

export const useProjectStore = defineStore("projects", () => {
  const projects = ref([]);
  const setProjects = (data) => {
    projects.value = data;
  };
  return { projects, setProjects };
});
