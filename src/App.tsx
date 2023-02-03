import React, { useState } from "react";
import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import PageWrapper from "./Components/lib/PageWrapper";
import { useAuth } from "./Components/lib/AuthProvider";
import { CircularProgress } from "@mui/material";
import styled from "styled-components";
import { useAsyncFn } from "react-use";
import { REALM_APP_DEV_CREDENTIAL } from "./http.common";
import * as Realm from "realm-web";
import { useEffect } from "react";
import { Home } from "./Components/Home";
import { MyProjects } from "./Components/MyProjects";
import { IUtilisateur } from "./types/utilisateur";

const APP_ID = "application-0-wgnei";
export const APP = new Realm.App({ id: APP_ID });

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [apiConnection, setApiConnection] = useAsyncFn(apiConnectionFn);
  useEffect(() => {
    setApiConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [user, setUser] = useState<IUtilisateur | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { AuthProvider } = useAuth(setUser, setIsLoading);

  return (
    <AuthProvider>
      <HashRouter>
        <>
          {isLoading && !user && (
            <PageWrapper isUserConnected={false}>
              <StyledLoader>
                <CircularProgress size={100} />
                <p>Chargement.....</p>
              </StyledLoader>
            </PageWrapper>
          )}

          {!isLoading && !user && (
            <Routes>
              <Route path="/" index element={<Login setUser={setUser} />} />
              <Route path="/signUp" element={<SignUp setUser={setUser} />} />
            </Routes>
          )}

          {!isLoading && user && (
            <Routes>
              <Route path="/" index element={<Home />} />
              <Route path="/myProjects" element={<MyProjects />} />
            </Routes>
          )}
        </>
      </HashRouter>
    </AuthProvider>
  );
}

async function apiConnectionFn() {
  try {
    // anonymous
    const credential = Realm.Credentials.emailPassword(
      REALM_APP_DEV_CREDENTIAL.email,
      REALM_APP_DEV_CREDENTIAL.password
    );
    // Realm.Credentials.anonymous())
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user: Realm.User = await APP.logIn(credential);
    return user;
  } catch (error) {
    console.log(error);
  }
}

export default App;

const StyledLoader = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin-top: 20%;
  p {
    color: #e7e5e5;
    font-size: 1.5rem;
  }
`;
