import React, { useContext } from "react";

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
import { expressAxios } from "../http.common";

export const MyProjects = () => {
  const { user } = useContext(authContext);

  //   expressAxios
  //     .post("/sendImage", { text: "toto" })
  //     .then((response) => console.log(response.data));

  return (
    <PageWrapper>
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
                <ButtonModal btnLabel="Créer un projet">toto</ButtonModal>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <div>Liste Projet</div>
      </div>
    </PageWrapper>
  );
};

const StyledTitle = styled.div`
  font-size: 2rem;
  padding: 12px 8px;
  font-weight: 400;
`;
