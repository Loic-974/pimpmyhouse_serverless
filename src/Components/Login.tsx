import {
  Alert,
  Button,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import React, { Dispatch, useState } from "react";
import { Visibility } from "@mui/icons-material";
import { AccountCircle } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import PageWrapper from "./lib/PageWrapper";
import styled from "styled-components";
import { IUtilisateur } from "../types/utilisateur";
import httpCommon from "../http.common";
import { AsyncLoader } from "./lib/GenericComponent/AsyncLoader";
import { apiErrorConvertor } from "../functionLib/apiErrorConvertor";

export default function Login({
  setUser,
}: {
  setUser: Dispatch<React.SetStateAction<IUtilisateur | null>>;
}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  async function signInCredential(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.preventDefault();
    setIsLoading(true);
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
        setIsLoading(false);
        setUser(data);
        navigate("/", {
          state: data,
          replace: true,
          preventScrollReset: true,
        });
      } else {
        setErrorMessage("");
      }
    } catch (error: any) {
      console.log(error);
      setErrorMessage(apiErrorConvertor(error));
      setIsLoading(false);
    }
  }

  return (
    <PageWrapper isUserConnected={false}>
      <AsyncLoader isLoading={isLoading} label="Connexion en cours" />
      <StyledLoginContainer>
        <h1>Pimp My House</h1>
        {errorMessage && (
          <StyledAlert severity="error">{errorMessage || ""}</StyledAlert>
        )}
        <StyledForm method="post" action="/api/auth/signin/email">
          <StyledFormControl variant="standard">
            <StyledLabel htmlFor="email">Identifiant</StyledLabel>
            <StyledInput
              id="email"
              type="email"
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              }
              placeholder="Votre Identifiant"
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
          </StyledFormControl>
          <StyledFormControl variant="standard">
            <StyledLabel htmlFor="password">Mot de passe</StyledLabel>
            <StyledInput
              id="password"
              type="password"
              placeholder="Votre mot de passe"
              startAdornment={
                <InputAdornment position="start">
                  <Visibility />
                </InputAdornment>
              }
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
          </StyledFormControl>

          <StyledButton
            variant="contained"
            onClick={(e) => signInCredential(e)}
          >
            Connexion
          </StyledButton>
          <StyledLink to={"/signUp"}>inscription</StyledLink>
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
    color: #eaecee;
  }
`;

const StyledAlert = styled(Alert)`
  width: 40%;
  margin-bottom: 8px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify: space-around;
  padding: 16px;
  background-color: #121213f6;
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
    color: white;
  }
`;

const StyledInput = styled(Input)`
  &.MuiInputBase-root {
    color: white;
  }
  &.MuiInputBase-root:before {
    border-bottom: 2px solid #5e5e5e;
  }
  svg {
    color: white;
  }
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #1f1f20f8 inset;
    transition: background-color 5000s ease-in-out 0s;
    -webkit-text-fill-color: white;
  }
`;

const StyledButton = styled(Button)`
  &.MuiButton-root {
    background-color: #ca6f06;
    width: 60%;
  }
`;

const StyledLink = styled(Link)`
  margin-top: 12px;
  width: 60%;
  text-decoration: none;
  padding: 8px 0;
  background-color: #257a94;
  border-radius: 4px;
  text-align: center;
  text-transform: uppercase;
  color: white;
  :hover {
    background-color: #4a9eb8;
  }
`;
