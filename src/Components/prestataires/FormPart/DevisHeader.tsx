import React from "react";
import { IPrestataire, IUtilisateur } from "../../../types/utilisateur";
import { IProject } from "../../../types/projet";
import styled from "styled-components";
import { CircularProgress, Grid } from "@mui/material";
import { dateToStrDate } from "../../../functionLib/dateFnLib/dateToStrDateLib";

export const DevisHeader = ({
  user,
  projectUser,
  projectData,
  isProjectUserFetching,
}: {
  user: IPrestataire;
  isProjectUserFetching: boolean;
  projectUser: IUtilisateur;
  projectData: IProject;
}) => {
  return (
    <StyledHeader container item xs={12}>
      <StyledHeaderPart item xs={4}>
        <p>
          <span>Entreprise</span>
        </p>
        <p>Siren :{user.siren}</p>
        <p>
          {user.nom} {user.prenom}
        </p>
        <p>
          {user.adresseSociale}({user.codePostal})
        </p>
        <p>{user.codePostal}</p>
        <p>{user.tel}</p>
        <p>{user.email}</p>
      </StyledHeaderPart>
      <StyledHeaderPart item xs={4}>
        <p>
          <span>Client</span>
        </p>
        {isProjectUserFetching || !projectUser ? (
          <StyledLoader>
            <CircularProgress size={30} />
            <p>Récupération données...</p>
          </StyledLoader>
        ) : (
          <>
            <p>
              {projectUser.nom} {projectUser.prenom}
            </p>

            <p>{projectUser.tel}</p>
            <p>{projectUser.email}</p>
          </>
        )}
      </StyledHeaderPart>
      <StyledHeaderPart item xs={4}>
        <p>
          <span>Details</span>
        </p>
        <p>Devis N°{user?.propositionDevis?.length || 0}</p>
        <p>Date : {dateToStrDate(new Date())}</p>
        <p>Projet : {projectData.libelleProjet}</p>
        <p>Description :</p>

        {projectData.details.map((item) => (
          <p>- {item}</p>
        ))}
      </StyledHeaderPart>
    </StyledHeader>
  );
};

// ----------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------- Style ---------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------

const StyledHeader = styled(Grid)`
  display: flex;
  align-items: start;
  justify-content: space-between;
  padding: 3px 8px;
`;

const StyledHeaderPart = styled(Grid)`
  &.MuiGrid-root {
    display: flex;
    flex-direction: column;
  }

  p {
    margin-block-start: 0.1rem;
    margin-block-end: 0.1rem;
  }
  span {
    font-weight: bold;
  }
`;

const StyledLoader = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: start;
`;
