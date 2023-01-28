import { useEffect, useState } from "react";
import httpCommon from "../../http.common";
import { useAsync } from "react-use";

/**
 * Check if user is already connected
 * Check email and token before fetch data emial and token
 * @returns
 */
export const useAuth = (setUser: any, setIsLoading: any) => {
  const [email, setEmail] = useState<string | null>("");
  const [token, setToken] = useState<string | null>("");

  useEffect(() => {
    setIsLoading(true);
    const email = window.localStorage.getItem("email");
    const token = window.localStorage.getItem("token");
    setEmail(email);
    setToken(token);
  }, []);

  const userData = useAsync(async () => {
    const userBdd = await httpCommon.post("/findUserByEmail", {
      email,
    });
    return userBdd.data.token === token ? userBdd : null;
  }, [email, token]);

  useEffect(() => {
    setIsLoading(userData.loading);
    setUser(userData?.value);
  }, [setIsLoading, setUser, userData]);
};
