import { ReactNode, createContext, useEffect, useState } from "react";
import httpCommon from "../../http.common";
import { useAsync } from "react-use";

export const authContext = createContext({ user: null });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setEmail, setToken]);

  const userData = useAsync(async () => {
    setIsLoading(true);
    if (email && token) {
      const userBdd = await httpCommon.post("/findUserByEmail", {
        email,
      });
      setIsLoading(false);
      return userBdd.data.token === token ? userBdd?.data : null;
    }
  }, [email, token, setEmail, setToken]);

  useEffect(() => {
    setUser(userData?.value);
  }, [setIsLoading, setUser, userData]);

  const AuthProvider = ({ children }: { children: ReactNode }) => {
    return (
      <authContext.Provider value={{ user: userData?.value }}>
        {children}
      </authContext.Provider>
    );
  };

  return { AuthProvider };
};
