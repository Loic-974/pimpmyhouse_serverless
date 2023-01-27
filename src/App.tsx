import React, { useState } from "react";
import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import PageWrapper from "./Components/lib/PageWrapper";
import { useAuth } from "./Components/lib/AuthProvider";
import { CircularProgress } from "@mui/material";
import styled from "styled-components";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { state } = useLocation();

  useAuth(setUser, setIsLoading);

  return (
    <>
      {isLoading && !user && !state && (
        <PageWrapper>
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
          <Route path="/" index element={<PageWrapper>toto</PageWrapper>} />
          <Route path="/home" element={<PageWrapper>toto</PageWrapper>} />
        </Routes>
      )}
    </>
  );
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
