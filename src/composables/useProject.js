import { useProjectStore } from "@/stores/projecState";
import { storeToRefs } from "pinia";

export function useProject() {
  const projectStore = useProjectStore();

  // Use storeToRefs for reactive state and computed properties
  const { projects } = storeToRefs(projectStore);
  // Destructure methods directly
  const { setProjects } = projectStore;

  return {
    projects,
    setProjects,
  };
}
