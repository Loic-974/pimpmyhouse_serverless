import {
  Alert,
  Button,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import React, { useState } from "react";
import { Visibility } from "@mui/icons-material";
import { AccountCircle } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import PageWrapper from "./lib/PageWrapper";
import styled from "styled-components";
import { IUtilisateur } from "../types/utilisateur";
import httpCommon, { expressAxios } from "../http.common";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function signInCredential(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.preventDefault();
    setErrorMessage("");
    try {
      const attempt = await httpCommon.post<IUtilisateur>("/signIn", {
        email,
        password,
      });

      if (attempt.data) {
        const data = attempt.data;
        window.localStorage.setItem("email", data.email);
        window.localStorage.setItem("token", data.token || "");
        navigate("/", {
          state: data,
          replace: true,
          preventScrollReset: true,
        });
      } else {
        setErrorMessage("");
      }
    } catch (error: any) {
      setErrorMessage(error?.response?.data);
    }
  }

  return (
    <PageWrapper>
      <StyledLoginContainer>
        <h1>Pimp My House</h1>
        {errorMessage && <Alert severity="error">{errorMessage || ""}</Alert>}
        <StyledForm method="post" action="/api/auth/signin/email">
          <StyledFormControl variant="standard">
            <StyledLabel htmlFor="email">Identifiant</StyledLabel>
            <StyledInput
              id="email"
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              }
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
          </StyledFormControl>
          <StyledFormControl variant="standard">
            <StyledLabel htmlFor="password">Mot de passe</StyledLabel>
            <StyledInput
              id="password"
              type="password"
              startAdornment={
                <InputAdornment position="start">
                  <Visibility />
                </InputAdornment>
              }
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
          </StyledFormControl>

          <Link to={"/signUp"}>Cliquez ici pour vous inscrire</Link>

          <StyledButton
            variant="contained"
            onClick={(e) => signInCredential(e)}
          >
            Connexion
          </StyledButton>
        </StyledForm>
      </StyledLoginContainer>
    </PageWrapper>
  );
}

const StyledLoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h1 {
    color: #d1d5da;
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify: space-around;
  padding: 16px;
  background-color: #9ba0a5;
  border-radius: 8px;
  width: 40%;
`;

const StyledFormControl = styled(FormControl)`
  &.MuiFormControl-root {
    margin-top: 24px;
    margin-bottom: 24px;
    width: 60%;
    display: flex;
    flex-direction: column;
  }
`;

const StyledLabel = styled(InputLabel)`
  &.MuiInputLabel-root {
    bottom: 24px;
    top: unset;
    font-size: 1.3rem;
    font-weight: 500;
  }
`;

const StyledInput = styled(Input)`
  &.MuiInputBase-root {
    color: #424242;
  }
  &.MuiInputBase-root:before {
    border-bottom: 2px solid #5e5e5e;
  }
`;

const StyledButton = styled(Button)`
  &.MuiButton-root {
    margin-top: 8px;
  }
`;
