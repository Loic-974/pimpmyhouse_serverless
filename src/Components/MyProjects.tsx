import React, { Dispatch, SetStateAction, useContext, useState } from "react";

import { authContext } from "./lib/AuthProvider";
import PageWrapper from "./lib/PageWrapper";
import styled from "styled-components";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  Grid,
  Input,
  InputAdornment,
  InputLabel,
  Slider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ButtonModal } from "./lib/GenericComponent/ButtonModal";
import httpCommon from "../http.common";
import { NewProjectForm } from "./lib/NewProjectForm";
import { useAsync } from "react-use";
import { IProject } from "../types/projet";
import { AsyncLoader } from "./lib/GenericComponent/AsyncLoader";
import { ProjectCard } from "./lib/ProjectCard";
import { useEffect } from "react";
import { ProjectFilterComponent } from "./lib/ProjectFilterComponent";
import { IUtilisateur } from "../types/utilisateur";
import { keyBy } from "lodash";

export const MyProjects = () => {
  const { user } = useContext(authContext);

  const [projectList, setProjectList] = useState<IProject[]>([
    {
      _id: "63d8e0272090080jfb11f8a5",
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
    {
      _id: "63d8e3fbbdf74d5879704e78",
      userId: "63d376010b704765a169f180",
      libelleProjet: "Aménagement Salon",
      dateCreation: new Date(2023, 0, 10),
      dateDebut: new Date(2023, 0, 10),
      budgetMoyen: 2500,
      details: ["Aménagement Salon / Espace / Ameublement"],
      imgUrlProjet: "salon-sous-sol-avec-faux-plafond-et-spot.jpg",
      codeDepartement: "30",
      villeProjet: "Nîmes",
      isActive: true,
      numDevis: [],
    },
    {
      _id: "63d8e027e20900801fb11f8a5",
      userId: "63d376010b704765a169f180",
      libelleProjet: "Aménagement Sous-Sol",
      dateCreation: new Date(2023, 0, 3),
      dateDebut: new Date(2023, 0, 3),
      budgetMoyen: 4000,
      details: [
        "Transformation d'un sous-sol en pièce à vivre/bureau",
        "Style épuré moderne",
      ],
      imgUrlProjet: "amenagement-sous-sol-petit-budget-top-duo.jpg",
      codeDepartement: "70",
      villeProjet: "Montesquieux",
      isActive: true,
      numDevis: [],
    },
    {
      _id: "63d8e3fbbdf741f5879704e78",
      userId: "63d376010b704765a169f180",
      libelleProjet: "Aménagement Salon",
      dateCreation: new Date(2022, 2, 13),
      dateDebut: new Date(),
      budgetMoyen: 2500,
      details: ["Aménagement Salon / Espace / Ameublement"],
      imgUrlProjet: "salon-sous-sol-avec-faux-plafond-et-spot.jpg",
      codeDepartement: "60",
      villeProjet: "Prades",
      isActive: true,
      numDevis: [],
    },
  ]);

  const [displayedProject, setDisplayedProject] = useState(projectList);

  useEffect(() => {
    setDisplayedProject(projectList);
  }, [projectList]);

  const [isLoading, setIsLoading] = useState(false);

  useAsync(async () => {
    setIsLoading(true);
    const projectDate = await httpCommon.post("/getAllProjectByUserId", {
      userId: user?._id,
    });
    setProjectList(projectDate.data || []);
    setIsLoading(false);
  }, []);

  /**
   * Avoid Refetch data
   */
  function handleActionOnList(updatedProject: IProject) {
    const dictionary = keyBy(displayedProject, "_id");
    const updateId = updatedProject._id;
    dictionary[updateId as string] = updatedProject;
    setDisplayedProject(Object.values(dictionary));
  }

  return (
    <PageWrapper>
      <AsyncLoader isLoading={isLoading} label={"Récupération Projets..."} />
      <div>
        <StyledTitle>Aperçu de vos projets</StyledTitle>
        <Accordion>
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
            Options Projets
          </StyledAccordionSummary>
          <AccordionDetails>
            {/* <Grid container>
              <Grid item md={3} xs={6}>
                <Slider
                  aria-label="Small steps"
                  defaultValue={0}
                  step={100}
                  min={0}
                  max={10000}
                  valueLabelDisplay="auto"
                  onChange={(e: any) => {
                    const newList = projectList.filter(
                      (item) => item.budgetMoyen < e.target.value
                    );
                    setDisplayedProject(newList);
                  }}
                />
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
            </Grid> */}
            <ProjectFilterComponent
              user={user as IUtilisateur}
              projectListOrigin={projectList}
              setDisplayedProject={setDisplayedProject}
            />
          </AccordionDetails>
        </Accordion>
        <StyledListContainer>
          {!!displayedProject.length &&
            displayedProject.map((item) => (
              <ProjectCard
                projectData={item}
                handleAction={handleActionOnList}
              />
            ))}
        </StyledListContainer>
      </div>
    </PageWrapper>
  );
};

const StyledTitle = styled.div`
  font-size: 2rem;
  padding: 12px 8px;
  font-weight: 400;
`;

const StyledListContainer = styled.div`
  width: 100%;
  margin: 0 2%;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  /* justify-content: center; */
`;

const StyledAccordionSummary = styled(AccordionSummary)`
  &.MuiAccordionSummary-root {
    background-color: #2b2b2b;
    color: white;
  }
  svg {
    color: white;
  }
`;
