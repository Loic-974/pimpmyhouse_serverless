import { useEffect, useState } from "react";
import httpCommon, { REALM_APP_DEV_CREDENTIAL } from "../../http.common";
import { useAsync } from "react-use";

import * as Realm from "realm-web";

const APP_ID = "application-0-wgnei";
export const APP = new Realm.App({ id: APP_ID });
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
    try {
      // anonymous
      const credential = Realm.Credentials.emailPassword(
        REALM_APP_DEV_CREDENTIAL.email,
        REALM_APP_DEV_CREDENTIAL.password
      );
      // Realm.Credentials.anonymous())
      const user: Realm.User = await APP.logIn(credential);
    } catch (error) {
      console.log(error);
    }
    console.log("ok");
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
