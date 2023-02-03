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
  Badge,
} from "@mui/material";
import styled from "styled-components";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";
import { IProject } from "../../types/projet";
import { dateToStrDateFull } from "../../functionLib/dateFnLib/dateToStrDateLib";
import { authContext } from "./AuthProvider";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import ShieldMoonIcon from "@mui/icons-material/ShieldMoon";
import { ButtonModal } from "./GenericComponent/ButtonModal";
import { NewProjectForm } from "./NewProjectForm";
import httpCommon from "../../http.common";
import { DevisForm } from "../prestataires/DevisForm";
import { IPrestataire } from "../../types/utilisateur";
import DescriptionIcon from "@mui/icons-material/Description";
import { intersection } from "lodash";
import FindInPageIcon from "@mui/icons-material/FindInPage";

export const ProjectCard = ({
  projectData,
  handleAction,
}: {
  projectData: IProject;
  handleAction: (arg: IProject) => void;
}) => {
  const { user } = useContext(authContext);

  const [updateStateLoading, setUpdateStateLoading] = useState(false);

  const isUserPresta = useMemo(() => {
    if (user) {
      return "siren" in user;
    }
  }, [user]);

  const prestaDevisId = useMemo(() => {
    if (user && "propositionDevis" in user) {
      const inter = intersection(
        projectData.numDevis,
        user.propositionDevis as string[]
      );
      return inter[0];
    }
  }, [user, projectData]);

  const isUserProject = useMemo(() => {
    return projectData.userId === user?._id;
  }, [user, projectData]);

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
        {!!projectData.details?.length &&
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
        {isUserPresta && !isUserProject && projectData.isActive && (
          <div>
            <ButtonModal
              btnLabel={prestaDevisId ? "Modifier Devis" : "Soumettre devis"}
              render={(setDisplayModal: Dispatch<SetStateAction<boolean>>) => (
                <DevisForm
                  user={user as IPrestataire}
                  setDisplayModal={setDisplayModal}
                  projectData={projectData}
                  handleOnCreate={handleAction}
                  prestaDevisId={prestaDevisId}
                />
              )}
              buttonRender={(onClickFn) => (
                <Chip
                  label={prestaDevisId ? "Modifier Devis" : "Soumettre devis"}
                  color="primary"
                  onClick={() => onClickFn(true)}
                />
              )}
            />
          </div>
        )}
        {isUserProject && (
          <div>
            <ButtonModal
              btnLabel="Modifier un projet"
              render={(setDisplayModal: Dispatch<SetStateAction<boolean>>) => (
                <NewProjectForm
                  user={user}
                  setDisplayModal={setDisplayModal}
                  projectData={projectData}
                  handleOnCreate={handleAction}
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
        )}
        <Badge badgeContent={projectData?.numDevis?.length} color="primary">
          {isUserProject ? (
            <FindInPageIcon color="action" />
          ) : (
            <DescriptionIcon color="action" />
          )}
        </Badge>
      </StyledCardAction>
    </StyledCard>
  );
};

// -----------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------- Style ---------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------

const StyledCard = styled(Card)`
  width: 30%;
  margin: 1%;
  display: flex;
  flex-direction: column;
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
  flex-grow: 1;
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
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 12px;
  }
  .MuiTypography-root .MuiTypography-subtitle1 {
    font-size: bold;
  }
`;

const StyledCardAction = styled(CardActions)`
  display: flex;
  flex-grow: 1;
  flex-direction: row-reverse;
  justify-content: space-around;
  &.MuiCardActions-root {
    display: flex;
    flex-grow: 1;
    padding: 1px;
    align-items: end;
    padding-bottom: 8px;
  }
  &.MuiCardContent-root:last-child {
    padding-bottom: 0px;
  }
`;
