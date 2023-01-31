import React, { Dispatch, SetStateAction, useContext, useState } from "react";

import { authContext } from "./lib/AuthProvider";
import PageWrapper from "./lib/PageWrapper";
import styled from "styled-components";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ButtonModal } from "./lib/GenericComponent/ButtonModal";
import httpCommon from "../http.common";
import { NewProjectForm } from "./lib/NewProjectForm";
import { useAsync } from "react-use";
import { IProject } from "../types/projet";
import { AsyncLoader } from "./lib/GenericComponent/AsyncLoader";
import { ProjectCard } from "./lib/ProjectCard";

export const MyProjects = () => {
  const { user } = useContext(authContext);

  const [projectList, setProjectList] = useState<IProject[]>([
    {
      _id: "63d8e02720900801fb11f8a5",
      userId: "63d376010b704765a169f180",
      libelleProjet: "Aménagement Sous-Sol",
      dateCreation: new Date(),
      dateDebut: new Date(),
      budgetMoyen: 4000,
      details: [
        "Transformation d'un sous-sol en pièce à vivre/bureau",
        "Style épuré moderne",
      ],
      imgUrlProjet: "amenagement-sous-sol-petit-budget-top-duo.jpg",
      codeDepartement: "30",
      villeProjet: "Les Angles",
      isActive: true,
      numDevis: [],
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // useAsync(async () => {
  // setIsLoading(true)
  //   const projectDate = await httpCommon.post("/getAllProjectByUserId", {
  //     userId: user?._id,
  //   });
  //   setProjectList(projectDate.data||[])
  //   setIsLoading(false)
  // }, [user]);

  return (
    <PageWrapper>
      <AsyncLoader isLoading={isLoading} label={"Récupération Projets..."} />
      <div>
        <StyledTitle>Aperçu de vos projets</StyledTitle>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Options Projets
          </AccordionSummary>
          <AccordionDetails>
            <Grid container>
              <Grid item md={3} xs={6}>
                Filtre 1
              </Grid>
              <Grid item md={3} xs={6}>
                Filtre 2
              </Grid>
              <Grid item md={3} xs={6}>
                Filtre 3
              </Grid>
              <Grid item md={3} xs={6}>
                <ButtonModal
                  btnLabel="Créer un projet"
                  render={(setDisplayModal) => (
                    <NewProjectForm
                      user={user}
                      setDisplayModal={
                        setDisplayModal as Dispatch<SetStateAction<boolean>>
                      }
                    />
                  )}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <div>
          {!!projectList.length &&
            projectList.map((item) => <ProjectCard projectData={item} />)}
        </div>
      </div>
    </PageWrapper>
  );
};

const StyledTitle = styled.div`
  font-size: 2rem;
  padding: 12px 8px;
  font-weight: 400;
`;
