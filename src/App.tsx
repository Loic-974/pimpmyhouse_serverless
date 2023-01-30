import React, { useState } from "react";
import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
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

const APP_ID = "application-0-wgnei";
export const APP = new Realm.App({ id: APP_ID });

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [apiConnection, setApiConnection] = useAsyncFn(apiConnectionFn);

  useEffect(() => {
    setApiConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { state } = useLocation();

  useAuth(setUser, setIsLoading);

  return (
    <>
      {isLoading && !user && !state && (
        <PageWrapper isUserConnected={false}>
          <StyledLoader>
            <CircularProgress size={100} />
            <p>Chargement.....</p>
          </StyledLoader>
        </PageWrapper>
      )}

      {!isLoading && !user && !state && (
        <Routes>
          <Route path="/" index element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
        </Routes>
      )}

      {((!isLoading && user) || state) && (
        <Routes>
          <Route path="/" index element={<Home />} />
        </Routes>
      )}
    </>
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
