import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useSignupMutation,
} from "./../../store/api/authApi";
import { handleApiError } from "../utils/errorHandling";

export const useAuth = () => {
  const navigate = useNavigate();
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const [signupMutation, { isLoading: isSigningUp }] = useSignupMutation();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

  const token = localStorage.getItem("authToken");

  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useGetCurrentUserQuery(undefined, {
    skip: !token,
  });

  const isAuthenticated = useMemo(() => {
    return Boolean(token && user && !userError);
  }, [token, user, userError]);

  const login = async (emailID: string, password: string) => {
    try {
      const result = await loginMutation({ emailID, password }).unwrap();
      navigate("/");
      return result;
    } catch (error: any) {
      handleApiError(error);
      throw error;
    }
  };

  const signup = async (
    emailID: string,
    name: string,
    password: string,
    passwordConfirm: string
  ) => {
    try {
      const result = await signupMutation({
        emailID,
        name,
        password,
        passwordConfirm,
      }).unwrap();
      navigate("/");
      return result;
    } catch (error: any) {
      handleApiError(error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error: any) {
      // Handle error but still proceed with logout
      handleApiError(error);
    } finally {
      navigate("/login");
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading: isLoadingUser || isLoggingIn || isLoggingOut || isSigningUp,
    login,
    logout,
    isLoggingIn,
    isLoggingOut,
    signup,
    isSigningUp,
  };
};
