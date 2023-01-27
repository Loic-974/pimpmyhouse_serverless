import {
  Button,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccountCircle } from "@mui/icons-material";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import StoreIcon from "@mui/icons-material/Store";
import BalanceIcon from "@mui/icons-material/Balance";
import CallIcon from "@mui/icons-material/Call";
import httpCommon, { expressAxios } from "../../http.common";

export interface IFormData {
  email: string;
  password: string;
  confirmPassword: string;
  nom: string;
  prenom: string;
  tel: string;
  siren?: string;
  adresseSociale?: string;
  statutJuridique?: string;
}

export function SignUpTabForm(props: {
  value: number;
  index: number;
  ispresta: boolean;
}) {
  const navigate = useNavigate();

  const { value, index, ispresta, ...other } = props;
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
  const [statutJuridique, setStatutJuridique] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const formData = useMemo(() => {
    const userBasic = {
      email,
      password,
      confirmPassword,
      nom,
      prenom,
      tel,
    };
    const userPresta = {
      siren,
      adresseSociale,
      statutJuridique,
    };
    return ispresta ? { ...userBasic, ...userPresta } : userBasic;
  }, [
    email,
    password,
    confirmPassword,
    nom,
    prenom,
    tel,
    siren,
    adresseSociale,
    statutJuridique,
    ispresta,
  ]);

  async function handleSignUp() {
    setErrorMessage("");
    try {
      await httpCommon.post("/signUp", formData).then(async (response) => {
        console.log(response?.data);
        const data = response?.data;
        window.localStorage.setItem("email", data?.email);
        window.localStorage.setItem("token", data?.token);

        navigate("/", {
          state: response.data,
          replace: true,
          preventScrollReset: true,
        });
      });
    } catch (error: any) {
      console.log(error);
      setErrorMessage(error?.response?.data);
    }
  }

  // ------------------------------------------- Template --------------------------------------- //
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {errorMessage && <p>{errorMessage}</p>}
      {value === index && (
        <>
          <TextField
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

          <TextField
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
              !_checkPassword(formData.password, formData.confirmPassword)
            }
            helperText={
              !!password.length &&
              !_checkPassword(formData.password, formData.confirmPassword)
                ? "Mot de passe différent"
                : ""
            }
            onChange={(e) => setPassword(e.currentTarget.value)}
          />

          <TextField
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
              !_checkPassword(formData.password, formData.confirmPassword)
            }
            helperText={
              !!confirmPassword.length &&
              !_checkPassword(formData.password, formData.confirmPassword)
                ? "Mot de passe différent"
                : ""
            }
            onChange={(e) => setConfirmPassword(e.currentTarget.value)}
          />

          <p>Parlez-nous de vous</p>
          <FormControl variant="standard">
            <InputLabel htmlFor="name">Nom</InputLabel>
            <Input
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
          <FormControl variant="standard">
            <InputLabel htmlFor="firstName">Prenom</InputLabel>
            <Input
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

          <TextField
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

          {ispresta && (
            <>
              <p>Parlez-nous de votre société</p>
              <TextField
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

              <FormControl variant="standard">
                <InputLabel htmlFor="adress">Adresse Sociale</InputLabel>
                <Input
                  id="adress"
                  placeholder="Saisir votre adresse sociale"
                  startAdornment={
                    <InputAdornment position="start">
                      <StoreIcon />
                    </InputAdornment>
                  }
                  onChange={(e) => setAdresseSociale(e.currentTarget.value)}
                />
              </FormControl>
              <FormControl variant="standard">
                <InputLabel htmlFor="statut">Statut juridique</InputLabel>
                <Input
                  id="statut"
                  placeholder="Saisir votre statut juridique"
                  startAdornment={
                    <InputAdornment position="start">
                      <BalanceIcon />
                    </InputAdornment>
                  }
                  onChange={(e) => setStatutJuridique(e.currentTarget.value)}
                />
              </FormControl>
            </>
          )}
          <Button
            variant="contained"
            disabled={!_checkFormData(formData)}
            onClick={handleSignUp}
          >
            S'inscrire
          </Button>
        </>
      )}
    </div>
  );
}

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

function _checkFormData(formData: IFormData) {
  const isEmailCheck = _checkEmail(formData.email);
  const isPasswordSame = formData.password === formData.confirmPassword;
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
