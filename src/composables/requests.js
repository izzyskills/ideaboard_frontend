import { useAuth } from "@/composables/useAuth";
import { apiClient, apiClientPrivate, queryClient } from "./apiClient";
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
import { useProject } from "./useProject";
import { handleErrors } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

function useLogin() {
  const router = useRouter();
  const route = useRoute();
  const from = route.query.from || "/";
  const { setAuth } = useAuth();
  const { toast } = useToast();
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
      toast({ description: "Login successful" });
      router.push(from, { replace: true });
    },
    onError: (err) => {
      console.log("Login error:", err);
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
      handleErrors(err);
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
  const { toast } = useToast();
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
      queryClient.invalidateQueries();
      // Note: You'll need to implement a toast notification system for Vue
      toast({ description: "Signup successful" });
      router.push("/login");
    },
    onError: (err) => {
      handleErrors(err);
      error.value =
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
      localStorage.removeItem("authState");
    },
    onError: (err) => {
      console.error("Lougout error: ", err);
      error.value =
        err.response?.data?.error_code || "an arror occured during logging out";
      handleErrors(err);
    },
  });
  return { error, logout };
}

//TODO: fix when a text is entered in the search bar and the results are not displayed
//TODO: triggering get new ideas fetch if there is a next cursor and the user scrolls to the bottom of the page

function useGetIdeas(searchParams = null, project_id = null) {
  const error = ref(null);

  const { isLoggedIn } = useAuth();
  const apiSpecialClient = isLoggedIn.value ? useAxiosPrivate() : apiClient;

  const getIdeas = useInfiniteQuery({
    queryKey: ["ideas", project_id, searchParams], // Add project_id and searchParams to queryKey to react to changes
    queryFn: async ({ pageParam = null }) => {
      try {
        const params = new URLSearchParams();
        if (pageParam) {
          params.set("cursor", pageParam);
        }
        params.set("limit", 5);
        if (project_id) {
          params.set("project_id", project_id); // Include project_id in the query parameters if provided
        }
        if (searchParams?.value) {
          params.set("text", searchParams.value);
        }

        const response = await apiSpecialClient.get("/ideas", {
          params: params,
        });
        // Map the response data to the expected format
        const mappedData = response.data?.items.map((idea) => ({
          id: idea.id,
          title: idea.title,
          body: idea.description,
          upvotes: idea.votes.upvotes,
          downvotes: idea.votes.downvotes,
          author: idea.creator_username, // Assuming creator_id is the author
          created_at: idea.created_at,
          comments: idea.comments,
          comments_count: idea.comments_count,
          has_commented: idea.has_commented,
          project_name: idea.project_name,
          project_id: idea.project_id,
          has_voted: idea.user_vote?.has_voted,
          is_upvote: idea.user_vote?.is_upvote,
          category_names: idea.category_names,
        }));

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
  const { isLoggedIn } = useAuth();
  const apiSpecialClient = isLoggedIn.value ? useAxiosPrivate() : apiClient;
  const getIdeabyId = useQuery({
    queryKey: ["idea", id],
    queryFn: async () => {
      const res = await apiSpecialClient.get(`ideas/${id}`);
      const idea = res.data;
      const mappedData = {
        id: idea.id,
        title: idea.title,
        body: idea.description,
        upvotes: idea.votes.upvotes,
        downvotes: idea.votes.downvotes,
        author: idea.creator_username, // Assuming creator_id is the author
        created_at: idea.created_at,
        comments: idea.comments,
        comments_count: idea.comments_count,
        has_commented: idea.has_commented,
        project_name: idea.project_name,
        project_id: idea.project_id,
        has_voted: idea.user_vote?.has_voted,
        is_upvote: idea.user_vote?.is_upvote,
        category_names: idea.category_names,
      };
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
      handleErrors(err);
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
      // Invalidate and refetch projects list
      queryClient.invalidateQueries({
        queryKey: ["project", "all"],
        exact: true,
        refetchType: "active",
      });
    },
    onError: (err) => {
      err.response?.data?.error_code ||
        "An error occurred during project creation";
      handleErrors(err);
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
  const apiSpecialClient = isLoggedIn.value ? useAxiosPrivate() : apiClient;
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
      return res.data; // This becomes the mutation data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["idea", idea_id]);
      queryClient.invalidateQueries(["ideas"]);
      return data;
    },
    onError: (err) => {
      error.value =
        err.response?.data?.error_code || "An error occurred during voting";
      handleErrors(err);
    },
  });

  return {
    postLike,
    error,
  };
}

function usePostComment(idea_id) {
  const error = ref(null);
  const apiClientPrivate = useAxiosPrivate();
  const postComment = useMutation({
    mutationFn: async (formData) => {
      const res = await apiClientPrivate.post(
        `ideas/${idea_id}/comment`,
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
      queryClient.invalidateQueries(["idea", idea_id]);
      queryClient.invalidateQueries(["ideas"]);
    },
    onError: (err) => {
      err.response?.data?.error_code ||
        "An error occurred during comment creation";
    },
  });
  return { postComment, error };
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
  usePostComment,
};
