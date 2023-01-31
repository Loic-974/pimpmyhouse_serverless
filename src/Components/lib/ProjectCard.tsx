import { ExpandMore } from "@mui/icons-material";
import {
  Card,
  CardHeader,
  Avatar,
  IconButton,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Collapse,
} from "@mui/material";
import styled from "styled-components";
import React, { useContext, useMemo } from "react";
import { IProject } from "../../types/projet";
import { dateToStrDateFull } from "../../functionLib/dateFnLib/dateToStrDateLib";
import { authContext } from "./AuthProvider";

export const ProjectCard = ({ projectData }: { projectData: IProject }) => {
  const { user } = useContext(authContext);

  const isUserProject = useMemo(() => {
    return projectData.userId === user?._id;
  }, []);
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
            <p>
              Localisation :{" "}
              <span>
                {projectData.villeProjet}({projectData.codeDepartement})
              </span>
            </p>
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
      <CardActions disableSpacing>
        {/* <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore> */}
      </CardActions>
      {/* <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Method:</Typography>
          <Typography paragraph>
            Heat 1/2 cup of the broth in a pot until simmering, add saffron and
            set aside for 10 minutes.
          </Typography>
          <Typography paragraph>
            Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet
            over medium-high heat. Add chicken, shrimp and chorizo, and cook,
            stirring occasionally until lightly browned, 6 to 8 minutes.
            Transfer shrimp to a large plate and set aside, leaving chicken and
            chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes,
            onion, salt and pepper, and cook, stirring often until thickened and
            fragrant, about 10 minutes. Add saffron broth and remaining 4 1/2
            cups chicken broth; bring to a boil.
          </Typography>
          <Typography paragraph>
            Add rice and stir very gently to distribute. Top with artichokes and
            peppers, and cook without stirring, until most of the liquid is
            absorbed, 15 to 18 minutes. Reduce heat to medium-low, add reserved
            shrimp and mussels, tucking them down into the rice, and cook again
            without stirring, until mussels have opened and rice is just tender,
            5 to 7 minutes more. (Discard any mussels that don&apos;t open.)
          </Typography>
          <Typography>
            Set aside off of the heat to let rest for 10 minutes, and then
            serve.
          </Typography>
        </CardContent>
      </Collapse> */}
    </StyledCard>
  );
};

// -----------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------- Style ---------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------

const StyledCard = styled(Card)`
  width: 30%;
  margin: 1%;
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

const StyledCardContent = styled(CardContent)`
  &.MuiCardContent-root {
    padding: 12px;
    min-height: 20%;
    max-height: 30%;
  }
  .MuiTypography-root .MuiTypography-subtitle1 {
    font-size: bold;
  }
`;
