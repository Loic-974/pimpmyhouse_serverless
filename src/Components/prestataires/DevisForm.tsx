import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { IPrestataire } from "../../types/utilisateur";
import { IProject } from "../../types/projet";
import styled from "styled-components";
import { Grid } from "@mui/material";
import { DevisHeader } from "./FormPart/DevisHeader";
import { DevisBody, IDevisLigne } from "./FormPart/DevisBody";
import { DevisFooter } from "./FormPart/DevisFooter";
import { useEffect } from "react";

export interface IDevis {
  devisRow: IDevisLigne[];
  dateValidite: Date;
  montantTotalTTC: number;
  prestataire: {
    prestataireId: string;
    nom: string;
    prenom: string;
    adresseSociale: string;
    codePostal: string;
    tel: string;
    email: string;
  };
  projectUser: {
    userProjectId: string;
    nom: string;
    prenom: string;
    tel: string;
    email: string;
  };
}

export const DevisForm = ({
  user,
  setDisplayModal,
  projectData,
}: {
  user: IPrestataire;
  setDisplayModal: Dispatch<SetStateAction<boolean>>;
  projectData: IProject;
}) => {
  const [devisData, setDevisData] = useState<IDevis>({
    devisRow: [],
    dateValidite: new Date(),
    montantTotalTTC: 0,
    prestataire: {
      prestataireId: user._id as string,
      nom: user.nom,
      prenom: user.prenom,
      adresseSociale: user.adresseSociale,
      codePostal: user.codePostal,
      tel: user.tel,
      email: user.email,
    },
    projectUser: {
      userProjectId: "",
      nom: "",
      prenom: "",
      tel: "",
      email: "",
    },
  });

  const projectUser = useMemo(
    () => ({
      _id: "63d376010b704765a169f180",
      email: "loic.rabat@live.fr",
      password: "azerty",
      nom: "Rabat",
      prenom: "Loic",
      tel: "1234567898",
      createdAt: {
        $date: {
          $numberLong: "1674802689553",
        },
      },
      updatedAt: {
        $date: {
          $numberLong: "1674818153594",
        },
      },
      __v: 0,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImxvaWMucmFiYXRAbGl2ZS5mciJ9.fuE4UJ5zr4w-iK2dw-h3QLEDq9XmGGI8hABL8sFTvsI",
      adresseSociale: "1 Rue des bons enfants",
      siren: "123456789",
      codePostal: "30900",
    }),
    []
  );

  useEffect(() => {
    setDevisData((prevState) => ({
      ...prevState,
      projectUser: {
        userProjectId: projectUser._id,
        nom: projectUser.nom,
        prenom: projectUser.prenom,
        tel: projectUser.tel,
        email: projectUser.email,
      },
    }));
  }, [projectUser]);

  return (
    <Grid container direction="row">
      <StyledSpanTitle>Devis</StyledSpanTitle>
      <StyledSeparator item xs={12} />
      <DevisHeader
        user={user}
        projectData={projectData}
        projectUser={projectUser}
      />
      <StyledSeparator item xs={12} />

      <DevisBody setDevisData={setDevisData} />

      <StyledSeparator item xs={12} />

      <DevisFooter devisData={devisData} setDevisData={setDevisData} />
    </Grid>
  );
};

// ----------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------- Style ---------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
const StyledSpanTitle = styled.span`
  font-size: 1.6rem;
  font-weight: bold;
  margin: 12px 0px;
`;
const StyledSeparator = styled(Grid)`
  width: 100%;
  height: 8px;
  margin: 8px 0;
  &.MuiGrid-root {
    margin: 8px 0;
    padding: 0 64px;
  }
  background-color: grey;
`;
