import { apiClientPrivate } from "./apiClient";
import { useAuth } from "./useAuth";

export function useRefreshToken() {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await apiClientPrivate.get("auth/refresh_token", {
        withCredentials: true,
      });
      setAuth((prev) => ({
        ...prev,
        token: response.data.accessToken,
      }));
      return response.data.accessToken;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  };

  return refresh;
}
