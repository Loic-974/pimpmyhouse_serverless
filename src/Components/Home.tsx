import React, { useContext, useState } from "react";
import PageWrapper from "./lib/PageWrapper";
import styled from "styled-components";
import { Tabs, Tab } from "@mui/material";
import { useAsync } from "react-use";
import httpCommon from "../http.common";
import { AsyncLoader } from "./lib/GenericComponent/AsyncLoader";
import { ProjectCard } from "./lib/ProjectCard";
import { noop } from "lodash";
import { authContext } from "./lib/AuthProvider";
import { useMemo } from "react";

export const Home = () => {
  const { user } = useContext(authContext);

  //const [displayedList, setDisplayedList] = useState(0);
  const [projectList, setProjectList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useAsync(async () => {
    setIsLoading(true);
    const projectResp = await httpCommon.get("/getAllProject");
    setProjectList(projectResp.data);
    setIsLoading(false);
  }, []);

  // const handleChange = (event: React.SyntheticEvent, newValue: number) => {
  //   setDisplayedList(newValue);
  // };

  return (
    <PageWrapper isUserConnected={true}>
      <AsyncLoader isLoading={isLoading} label={"Récupération Projets..."} />
      <StyledContainer>
        <StyledTitle>Nos meilleurs prestataires, vos projets.</StyledTitle>

        {/* <Tabs
          value={displayedList}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Tous les projets" {...a11yProps(0)} />
          <Tab label="Aménagement intérieur" {...a11yProps(1)} />
          <Tab label="Aménagement extérieur" {...a11yProps(2)} />
          <Tab label="Jardin/Piscine" {...a11yProps(3)} />
        </Tabs> */}
        <StyledListContainer>
          {!!projectList.length &&
            projectList.map((item) => (
              <ProjectCard projectData={item} handleAction={noop} />
            ))}
        </StyledListContainer>
      </StyledContainer>
    </PageWrapper>
  );
};

// function a11yProps(index: number) {
//   return {
//     id: `simple-tab-${index}`,
//     "aria-controls": `simple-tabpanel-${index}`,
//   };
// }

// ----------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------- Style ---------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
`;

const StyledTitle = styled.div`
  font-size: 2rem;
  padding: 12px 8px;
  font-weight: 400;
`;

const StyledListContainer = styled.div`
  width: 100%;
  margin: 3% 2%;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  /* justify-content: center; */
`;
