import { useAuth } from "@/composables/useAuth";
import { apiClient, queryClient } from "./apiClient";
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from "@tanstack/vue-query";
import { useRouter, useRoute } from "vue-router";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { computed, ref, watch } from "vue";
import { useAxiosPrivate } from "@/composables/useAxiosPrivate";
import { useUrlSearchParams } from "@vueuse/core";
import { useProjectStore } from "@/stores/projecState";
import { useProject } from "./useProject";

function useLogin() {
  const router = useRouter();
  const route = useRoute();
  const from = route.query.from || "/";
  const { setAuth } = useAuth();
  const error = ref(null);
  const login = useMutation({
    mutationFn: (formData) => {
      return apiClient.post("auth/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    },
    onSuccess: (res) => {
      const token = res.data.access_token;
      const decodedToken = jwtDecode(token);
      const user = decodedToken.user;
      setAuth({ user, token });
      queryClient.invalidateQueries(["userdata", user.uid]);
      router.push(from, { replace: true });
    },
    onError: (err) => {
      if (axios.isAxiosError(err) && err.response) {
        const { data } = err.response;
        if (data && data.error_code === "invalid_email_or_password") {
          error.value = "invalid mail or passowrd";
        } else if (data && data.error_code === "account_not_verified") {
          error.value = "Account not Verified \n check mail for details";
        } else {
          error.value = data.error_code || "An error occurred during login";
        }
      } else {
        error.value = "An unexpected error occurred";
      }
      console.error("Login error:", err);
    },
  });

  return {
    error,
    login,
  };
}

function useSignup() {
  const router = useRouter();
  const error = ref(null);

  const signup = useMutation({
    mutationFn: async (formData) => {
      const response = await apiClient.post(`auth/register`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (!data || !data.user.email) {
        console.error("Invalid data received:", data);
        error.value = "Invalid response from server";
        return;
      }
      queryClient.invalidateQueries("userdata");
      // Note: You'll need to implement a toast notification system for Vue
      err.response?.data?.error_code || "An error occurred during signup";
    },
  });

  return {
    signup,
    error,
  };
}

function useLogout() {
  const router = useRouter();
  const error = ref(null);
  const { setAuth } = useAuth();
  const apiClientPrivate = useAxiosPrivate();
  const logout = useMutation({
    mutationFn: async () => {
      try {
        const res = await apiClientPrivate.get("/auth/logout");
        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
    onSuccess: () => {
      setAuth({});
      queryClient.invalidateQueries();
      router.push("/", { replace: true });
    },
    onError: (err) => {
      console.error("Lougout error: ", err);
      error.value =
        err.response?.data?.error_code || "an arror occured during logging out";
    },
  });
  return { error, logout };
}

//TODO: fix when a text is entered in the search bar and the results are not displayed
//TODO: triggering get new ideas fetch if there is a next cursor and the user scrolls to the bottom of the page

function useGetIdeas(project_id = null) {
  const error = ref(null);
  const searchParams = useUrlSearchParams();

  const getIdeas = useInfiniteQuery({
    queryKey: ["ideas", project_id, searchParams], // Add project_id and searchParams to queryKey to react to changes
    queryFn: async ({ pageParam = null }) => {
      try {
        const params = new URLSearchParams(searchParams);
        if (pageParam) {
          params.set("cursor", pageParam);
        }
        params.set("limit", 5);
        if (project_id) {
          params.set("project_id", project_id); // Include project_id in the query parameters if provided
        }
        console.log("Making request with params:", Object.fromEntries(params));

        const response = await apiClient.get("/ideas", {
          params: params,
          withCredentials: true,
        });
        console.log("Response:", response);

        // Map the response data to the expected format
        const mappedData = response.data?.items.map((idea) => ({
          id: idea.id,
          title: idea.title,
          body: idea.description,
          upvotes: idea.votes.upvotes,
          downvotes: idea.votes.downvotes,
          author: idea.creator_username, // Assuming creator_id is the author
          comments: [], // Assuming comments are not included in the response
          project_name: idea.project_name,
          project_id: idea.project_id,
        }));
        console.log("Mapped data:", mappedData);

        return {
          data: mappedData,
          nextCursor: response.data.next_cursor,
        };
      } catch (err) {
        console.error("Request failed:", err);
        throw err;
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  watch(
    searchParams,
    () => {
      console.log("Search params changed, refetching...");
      getIdeas.refetch();
    },
    { deep: true },
  );

  return {
    ideas: getIdeas,
    error,
  };
}

function useGetIdeabyId(id) {
  const error = ref(null);
  const getIdeabyId = useQuery({
    queryKey: ["idea", id],
    queryFn: async () => {
      const res = await apiClient.get(`ideas/${id}`);
      const idea = res.data;
      console.log(idea);
      const mappedData = {
        id: idea.id,
        title: idea.title,
        body: idea.description,
        upvotes: idea.votes.upvotes,
        downvotes: idea.votes.downvotes,
        author: idea.creator_username, // Assuming creator_id is the author
        comments: [], // Assuming comments are not included in the response
        project_name: idea.project_name,
        project_id: idea.project_id,
      };
      console.log(mappedData);
      return { data: mappedData };
    },
    staleTime: 1000 * 60 * 5,
  });
  return {
    getIdeabyId,
    error,
  };
}
function usePostIdea() {
  const apiClientPrivate = useAxiosPrivate();
  const error = ref(null);
  const postIdea = useMutation({
    mutationFn: async (formData) => {
      const res = await apiClientPrivate.post("ideas", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["ideas"]);
    },
    onError: (err) => {
      err.response?.data?.error_code ||
        "An error occurred during idea creation";
    },
  });
  return {
    postIdea,
    error,
  };
}

function usePostProject() {
  const apiClientPrivate = useAxiosPrivate();
  const error = ref(null);
  const postProject = useMutation({
    mutationFn: async (formData) => {
      const res = await apiClientPrivate.post("project", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["prject", "all"]);
    },
    onError: (err) => {
      err.response?.data?.error_code ||
        "An error occurred during project creation";
    },
  });
  return {
    postProject,
    error,
  };
}

function useGetAllProjects() {
  const error = ref(null);
  const { setProjects } = useProject();
  const getAllProjects = useQuery({
    queryKey: ["project", "all"],
    queryFn: async () => {
      const res = await apiClient.get("project/");
      setProjects(res.data);
      return res.data;
    },
    staleTime: 1000 * 60 * 1000,
  });
  return {
    getAllProjects,
    error,
  };
}
function useGetProjectByid(project_id) {
  const error = ref(null);
  const getProject = useQuery({
    queryKey: ["project", project_id],
    queryFn: async () => {
      const res = await apiClient.get(`project/${project_id}`);
      console.log(res.data);
      return res.data;
    },
    staleTime: 1000 * 60 * 20,
  });
  return {
    project: getProject,
    error,
  };
}

function useGetVotesDetails(idea_id) {
  const error = ref(null);
  const { isLoggedIn } = useAuth();
  const apiSpecialClient = isLoggedIn ? useAxiosPrivate() : apiClient;
  const getVotesDetails = useQuery({
    queryKey: ["votes", idea_id],
    queryFn: async () => {
      const res = await apiSpecialClient.get(`ideas/${idea_id}/votes`);
      return res.data;
    },
  });
  return { getVotesDetails, error };
}

function usePostLike(idea_id) {
  const error = ref(null);
  const apiClientPrivate = useAxiosPrivate();
  const postLike = useMutation({
    mutationFn: async (formData) => {
      const res = await apiClientPrivate.post(
        `ideas/${idea_id}/votes`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["votes", idea_id]);
    },
    onError: (err) => {
      err.response?.data?.error_code || "An error occurred during signup";
    },
  });

  return {
    postLike,
    error,
  };
}
export {
  useSignup,
  useLogin,
  useLogout,
  useGetIdeas,
  useGetIdeabyId,
  usePostIdea,
  useGetAllProjects,
  useGetProjectByid,
  usePostProject,
  useGetVotesDetails,
  usePostLike,
};
