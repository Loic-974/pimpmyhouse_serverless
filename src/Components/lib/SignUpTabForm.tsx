import {
  Alert,
  Button,
  FormControl,
  Grid,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import React, { Dispatch, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccountCircle } from "@mui/icons-material";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import StoreIcon from "@mui/icons-material/Store";
import CallIcon from "@mui/icons-material/Call";
import httpCommon from "../../http.common";
import styled from "styled-components";
import { AsyncLoader } from "./GenericComponent/AsyncLoader";
import { TabPanel, TabPanelProps } from "./GenericComponent/TabPanel";
import { apiErrorConvertor } from "../../functionLib/apiErrorConvertor";
import { IUtilisateur } from "../../types/utilisateur";

export interface IFormData {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  tel: string;
  siren?: string;
  adresseSociale?: string;
  codePostal?: string;
}

interface ITabPanelForm extends TabPanelProps {
  ispresta: boolean;
  setUser: Dispatch<React.SetStateAction<IUtilisateur | null>>;
}

export function SignUpTabForm(props: ITabPanelForm) {
  const navigate = useNavigate();

  const { value, index, ispresta, setUser } = props;
  // ------- Default User -------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // ---------- Standard user ------------
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [tel, setTel] = useState("");
  // ------------ Presta User -------------
  const [siren, setSiren] = useState("");
  const [adresseSociale, setAdresseSociale] = useState("");

  const [codePostal, setCodePostal] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const formData = useMemo(() => {
    const userBasic = {
      email,
      password,
      nom,
      prenom,
      tel,
    };
    const userPresta = {
      siren,
      adresseSociale,
      codePostal,
    };
    return ispresta ? { ...userBasic, ...userPresta } : userBasic;
  }, [
    email,
    password,
    nom,
    prenom,
    tel,
    siren,
    adresseSociale,
    codePostal,
    ispresta,
  ]);

  async function handleSignUp() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const attempt = await httpCommon.post("/signUp", formData);
      console.log(attempt);
      if (attempt?.data) {
        const data = attempt?.data;

        window.localStorage.setItem("email", data?.email);
        window.localStorage.setItem("token", data?.token);
        setIsLoading(false);
        setUser(data);
        navigate("/", {
          state: data,
          replace: true,
          preventScrollReset: true,
        });
      }
    } catch (error: any) {
      setIsLoading(false);
      console.log(error);
      setErrorMessage(apiErrorConvertor(error));
    }
  }

  // ------------------------------------------- Template --------------------------------------- //
  return (
    <TabPanel props={{ ...props }}>
      <>
        {errorMessage && (
          <StyledAlert severity="error">{errorMessage}</StyledAlert>
        )}
        <AsyncLoader isLoading={isLoading} label="Inscription en cours" />
        {value === index && (
          <Grid container justifyContent={"space-around"}>
            <Grid
              container
              item
              xs={12}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <StyledGrid item md={4} xs={6}>
                <StyledTextField
                  id="email"
                  variant="standard"
                  label="Adresse Email"
                  placeholder="Saisir votre Email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                  error={email ? !_checkEmail(email) : false}
                  helperText={!_checkEmail(email) ? "Email invalide" : ""}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                />
              </StyledGrid>
              <StyledGrid item md={4} xs={6}>
                <StyledTextField
                  id="password"
                  type="password"
                  label="Mot de passe"
                  variant="standard"
                  placeholder="Saisir votre mot de passe"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <KeyIcon />
                      </InputAdornment>
                    ),
                  }}
                  error={
                    !!password.length &&
                    !_checkPassword(formData.password, confirmPassword)
                  }
                  helperText={
                    !!password.length &&
                    !_checkPassword(formData.password, confirmPassword)
                      ? "Mot de passe différent"
                      : ""
                  }
                  onChange={(e) => setPassword(e.currentTarget.value)}
                />
              </StyledGrid>
              <StyledGrid item md={4} xs={6}>
                <StyledTextField
                  id="confirPassword"
                  type="password"
                  variant="standard"
                  label="Confirmation Mot de passe"
                  placeholder="Confirmer votre mot de passe"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <KeyIcon />
                      </InputAdornment>
                    ),
                  }}
                  error={
                    !!confirmPassword.length &&
                    !_checkPassword(formData.password, confirmPassword)
                  }
                  helperText={
                    !!confirmPassword.length &&
                    !_checkPassword(formData.password, confirmPassword)
                      ? "Mot de passe différent"
                      : ""
                  }
                  onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                />
              </StyledGrid>
            </Grid>
            <StyledPart>Qui êtes-vous?</StyledPart>
            <Grid container item xs={12}>
              <StyledGrid item md={4} xs={6}>
                <FormControl variant="standard">
                  <StyledLabel htmlFor="name">Nom</StyledLabel>
                  <StyledInput
                    id="name"
                    placeholder="Saisir votre nom"
                    startAdornment={
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    }
                    onChange={(e) => setNom(e.currentTarget.value)}
                  />
                </FormControl>
              </StyledGrid>
              <StyledGrid item md={4} xs={6}>
                <FormControl variant="standard">
                  <StyledLabel htmlFor="firstName">Prenom</StyledLabel>
                  <StyledInput
                    id="firstName"
                    placeholder="Saisir votre prenom"
                    startAdornment={
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    }
                    onChange={(e) => setPrenom(e.currentTarget.value)}
                  />
                </FormControl>
              </StyledGrid>
              <StyledGrid item md={4} xs={6}>
                <StyledTextField
                  id="tel"
                  variant="standard"
                  label="Numéro Téléphone"
                  placeholder="Saisir votre numéro de téléphone"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CallIcon />
                      </InputAdornment>
                    ),
                  }}
                  error={tel.length && tel.length !== 10 ? true : false}
                  helperText={
                    tel.length && tel.length !== 10
                      ? "Numéro incorrect (10 Chiffres nécessaire)"
                      : ""
                  }
                  onChange={(e) => setTel(e.currentTarget.value)}
                />
              </StyledGrid>
            </Grid>
            {ispresta && (
              <>
                <StyledPart>Votre Société</StyledPart>
                <Grid container item xs={12}>
                  <StyledGrid item md={4} xs={6}>
                    <StyledTextField
                      id="siren"
                      placeholder="Saisir votre numero siren"
                      label="Siren"
                      variant="standard"
                      error={siren.length < 9 && siren.length ? true : false}
                      helperText={
                        siren.length && siren.length < 9
                          ? "Siren incorrect (9 Chiffres nécessaire)"
                          : ""
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <StoreIcon />
                          </InputAdornment>
                        ),
                      }}
                      onChange={(e) => setSiren(e.currentTarget.value)}
                    />
                  </StyledGrid>
                  <StyledGrid item md={4} xs={6}>
                    <FormControl variant="standard">
                      <StyledLabel htmlFor="adress">
                        Adresse Sociale
                      </StyledLabel>
                      <StyledInput
                        id="adress"
                        placeholder="Saisir votre adresse sociale"
                        startAdornment={
                          <InputAdornment position="start">
                            <StoreIcon />
                          </InputAdornment>
                        }
                        onChange={(e) =>
                          setAdresseSociale(e.currentTarget.value)
                        }
                      />
                    </FormControl>
                  </StyledGrid>
                  <StyledGrid item md={4} xs={6}>
                    <FormControl variant="standard">
                      <StyledLabel htmlFor="statut">Code Postal</StyledLabel>
                      <StyledInput
                        id="statut"
                        placeholder="Saisir votre code postal"
                        startAdornment={
                          <InputAdornment position="start">
                            <StoreIcon />
                          </InputAdornment>
                        }
                        onChange={(e) => setCodePostal(e.currentTarget.value)}
                      />
                    </FormControl>
                  </StyledGrid>
                </Grid>
              </>
            )}
            <StyledBtnGrid item xs={12}>
              <StyledButton
                variant="contained"
                disabled={!_checkFormData(formData, confirmPassword)}
                onClick={handleSignUp}
              >
                S'inscrire
              </StyledButton>
            </StyledBtnGrid>
          </Grid>
        )}
      </>
    </TabPanel>
  );
}

// ----------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------- HELPER ---------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------

function _checkEmail(email: string) {
  const regex = new RegExp(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );
  if (!email) {
    return true;
  }
  return !!email && regex.test(email);
}

function _checkPassword(password: string, confirmPassword: string) {
  if (password.length && confirmPassword.length) {
    return password === confirmPassword;
  }
}

function _checkFormData(formData: IFormData, confirmPassword: string) {
  const isEmailCheck = _checkEmail(formData.email);
  const isPasswordSame = formData.password === confirmPassword;
  let isSirenCheck = formData?.siren ? formData?.siren?.length >= 9 : true;
  const isTelCheck = formData.tel.length === 10;

  return (
    isEmailCheck &&
    isPasswordSame &&
    isSirenCheck &&
    isTelCheck &&
    Object.values(formData).every((item) => item)
  );
}

// ----------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------- Style ---------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------

const StyledGrid = styled(Grid)`
  display: flex;
  justify-content: center;
`;

const StyledBtnGrid = styled(Grid)`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

const StyledLabel = styled(InputLabel)`
  &.MuiInputLabel-root {
    top: unset;
    font-size: 1.1rem;
    font-weight: 500;
    color: white;
  }
  svg {
    color: white;
  }
`;

const StyledInput = styled(Input)`
  &.MuiInputBase-root {
    color: white;
  }
  &.MuiInputBase-root:before {
    border-bottom: 1px solid #444444;
  }
  svg {
    color: white;
  }
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #121213 inset;
    transition: background-color 5000s ease-in-out 0s;
    -webkit-text-fill-color: white;
  }
  .MuiInput-input {
    color: white;
  }
`;

const StyledTextField = styled(TextField)`
  .MuiInputLabel-root {
    color: white;
    font-size: 1.1rem;
  }
  .MuiInput-root {
    color: white;
  }

  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #121213 inset;
    transition: background-color 5000s ease-in-out 0s;
    -webkit-text-fill-color: white;
  }
  svg {
    color: white;
  }
  input {
    &::placeholder {
      color: white;
    }
  }
`;

const StyledButton = styled(Button)`
  &.MuiButton-root {
    background-color: #ca6f06;
    width: 40%;
    :disabled {
      background-color: grey;
    }
  }
`;

const StyledPart = styled.div`
  text-align: center;
  width: 100%;
  color: white;
  margin: 24px 0px;
  padding: 3px 0;
  border-radius: 6px;
  background-color: grey;
`;

const StyledAlert = styled(Alert)`
  align-self: center;
  width: 95%;
  margin-bottom: 24px;
`;
