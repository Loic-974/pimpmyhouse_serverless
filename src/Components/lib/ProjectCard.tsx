import {
  Card,
  CardHeader,
  IconButton,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Chip,
  CircularProgress,
} from "@mui/material";
import styled from "styled-components";
import React, { useContext, useMemo, useState } from "react";
import { IProject } from "../../types/projet";
import { dateToStrDateFull } from "../../functionLib/dateFnLib/dateToStrDateLib";
import { authContext } from "./AuthProvider";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import ShieldMoonIcon from "@mui/icons-material/ShieldMoon";
import { ButtonModal } from "./GenericComponent/ButtonModal";
import { NewProjectForm } from "./NewProjectForm";
import httpCommon from "../../http.common";

export const ProjectCard = ({
  projectData,
  handleAction,
}: {
  projectData: IProject;
  handleAction: (arg: IProject) => void;
}) => {
  const { user } = useContext(authContext);

  const [updateStateLoading, setUpdateStateLoading] = useState(false);

  const isUserProject = useMemo(() => {
    return projectData.userId === user?._id;
  }, []);

  async function _changeProjectState() {
    setUpdateStateLoading(true);
    const formData = {
      projectId: projectData._id,
      isActive: !projectData.isActive,
    };
    await httpCommon.post("/updateProject", formData);
    projectData.isActive = formData.isActive;
    handleAction(projectData);
    setUpdateStateLoading(false);
  }

  return (
    <StyledCard>
      <StyledHeader
        title={projectData.libelleProjet}
        subheader={
          <StyledSubHeaderGroup>
            <p>
              Création :{" "}
              <span>{dateToStrDateFull(projectData.dateCreation)}</span>
            </p>

            <StyledSubDivContainer>
              <p>
                Localisation :{" "}
                <span>
                  {projectData.villeProjet}({projectData.codeDepartement})
                </span>
              </p>
              {updateStateLoading ? (
                <CircularProgress size={20} />
              ) : (
                <Chip
                  label={projectData.isActive ? "En cours" : "Annulé"}
                  variant="outlined"
                  color={projectData.isActive ? "success" : "error"}
                />
              )}
            </StyledSubDivContainer>
            <p>
              Budget Moyen: <span>{projectData.budgetMoyen}€</span>
            </p>
          </StyledSubHeaderGroup>
        }
      />
      <CardMedia
        component="img"
        height="200px"
        image={`http://localhost:8080/images/${projectData.userId}/${projectData.imgUrlProjet}`}
      />
      <StyledCardContent>
        <Typography variant="subtitle1" color="text.primary" gutterBottom>
          Détails du projet :
        </Typography>
        {!!projectData.details.length &&
          projectData.details.map((detail, index) => (
            <Typography
              key={"detail" + index}
              variant="body2"
              color="text.primary"
            >
              - {detail}
            </Typography>
          ))}
      </StyledCardContent>
      <StyledCardAction>
        <div>
          <ButtonModal
            btnLabel="Créer un projet"
            render={(setDisplayModal) => (
              <NewProjectForm
                user={user}
                setDisplayModal={setDisplayModal as any}
                projectData={projectData}
              />
            )}
            buttonRender={(onClickFn) => (
              <IconButton
                aria-label="add to favorites"
                color="primary"
                onClick={() => onClickFn(true)}
              >
                <DesignServicesIcon />
              </IconButton>
            )}
          />
          {updateStateLoading ? (
            <CircularProgress size={20} />
          ) : (
            <IconButton
              aria-label="share"
              color={projectData.isActive ? "error" : "success"}
              onClick={() => _changeProjectState()}
            >
              <ShieldMoonIcon />
            </IconButton>
          )}
        </div>
        {/*<ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore> */}
      </StyledCardAction>
    </StyledCard>
  );
};

// -----------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------- Style ---------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------

const StyledCard = styled(Card)`
  min-width: 30%;
  margin: 1%;
  display: flex;
  flex-direction: column;

  min-height: 0;
  align-items: stretch;
  overflow: visible;
  box-sizing: border-box;
`;

const StyledHeader = styled(CardHeader)`
  &.MuiCardHeader-root {
    padding: 0;
  }
  /* .MuiCardHeader-content {
    padding: 8px;
  } */
  .MuiCardHeader-title {
    padding: 6px 12px;
    color: white;
    background-color: #2b2b2b;
    font-size: 1.3rem;
  }
  .MuiCardHeader-subheader {
    padding: 3px 12px;
  }
`;

const StyledSubHeaderGroup = styled.div`
  display: flex;
  flex-direction: column;
  p {
    margin-block-start: 0.3rem;
    margin-block-end: 0.3rem;
    font-weight: 500;
    span {
      font-weight: bold;
    }
  }
`;
const StyledSubDivContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledCardContent = styled(CardContent)`
  &.MuiCardContent-root {
    padding: 12px;
    max-height: 30%;
  }
  .MuiTypography-root .MuiTypography-subtitle1 {
    font-size: bold;
  }
`;

const StyledCardAction = styled(CardActions)`
  display: flex;

  flex-direction: row-reverse;

  &.MuiCardActions-root {
    display: flex;
    flex-grow: 1;
    padding: 1px;
  }
  &.MuiCardContent-root:last-child {
    padding-bottom: 0px;
  }
`;
