import React, { Dispatch, SetStateAction, useState } from "react";
import { IPrestataire, IUtilisateur } from "../../types/utilisateur";
import { IProject } from "../../types/projet";
import styled from "styled-components";
import { Button, Grid } from "@mui/material";
import { DevisHeader } from "./FormPart/DevisHeader";
import { DevisBody, IDevisLigne } from "./FormPart/DevisBody";
import { DevisFooter } from "./FormPart/DevisFooter";
import { useEffect } from "react";
import { useAsync } from "react-use";
import httpCommon from "../../http.common";
import { AsyncLoader } from "../lib/GenericComponent/AsyncLoader";
import { cloneDeep } from "lodash";

export interface IDevis {
  devisRow: IDevisLigne[];
  dateValidite: Date;
  montantTotalTTC: number;
  montantTotalTVA: number;
  projectId: string;
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
  handleOnCreate,
}: {
  user: IPrestataire;
  setDisplayModal: Dispatch<SetStateAction<boolean>>;
  projectData: IProject;
  handleOnCreate: (project: IProject) => void;
}) => {
  const [devisData, setDevisData] = useState<IDevis>({
    devisRow: [],
    dateValidite: new Date(),
    montantTotalTTC: 0,
    montantTotalTVA: 0,
    projectId: projectData?._id as string,
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

  const [projectUser, setProjectUser] = useState<IUtilisateur>();
  const [isLoading, setIsLoading] = useState(false);

  const asyncProjectUser = useAsync(async () => {
    const userBdd = await httpCommon.post<IUtilisateur>("/getUserById", {
      userId: projectData.userId,
    });
    return userBdd?.data;
  }, [projectData]);

  useEffect(() => {
    if (asyncProjectUser?.value) {
      setProjectUser(asyncProjectUser?.value);
    }
  }, [asyncProjectUser.value]);

  useEffect(() => {
    if (projectUser) {
      setDevisData((prevState) => ({
        ...prevState,
        projectUser: {
          userProjectId: projectUser._id as string,
          nom: projectUser.nom,
          prenom: projectUser.prenom,
          tel: projectUser.tel,
          email: projectUser.email,
        },
      }));
    }
  }, [projectUser]);

  async function handleSubmitDevis() {
    setIsLoading(true);
    try {
      const data = await httpCommon.post<IUtilisateur>(
        "/insertDevis",
        devisData
      );
      const clonedData = cloneDeep(projectData);
      clonedData.numDevis = [
        ...(clonedData?.numDevis || []),
        data?.data?._id as string,
      ];
      // Add refresh list
      handleOnCreate(clonedData);
      setIsLoading(false);
      setDisplayModal(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  return (
    <Grid container direction="row">
      <AsyncLoader isLoading={isLoading} label={"Création du devis"} />
      <StyledSpanTitle>Devis</StyledSpanTitle>
      <StyledSeparator item xs={12} />
      <DevisHeader
        user={user}
        projectData={projectData}
        isProjectUserFetching={asyncProjectUser.loading}
        projectUser={projectUser as IUtilisateur}
      />
      <StyledSeparator item xs={12} />

      <DevisBody setDevisData={setDevisData} />

      <StyledSeparator item xs={12} />

      <DevisFooter devisData={devisData} setDevisData={setDevisData} />

      <StyledSeparator item xs={12} />
      <Grid
        item
        container
        xs={12}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Button variant="contained" onClick={handleSubmitDevis}>
          Soumettre Devis
        </Button>
      </Grid>
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
