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
import { TabPanel } from "./lib/GenericComponent/TabPanel";
import { IProject } from "../types/projet";
import { getCityByCodePostal } from "../functionLib/apiGouvGeoLib";

export const Home = () => {
  const { user } = useContext(authContext);

  const [displayedList, setDisplayedList] = useState(0);
  const [projectList, setProjectList] = useState<IProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isUserPresta = useMemo(() => {
    if (user) {
      return "siren" in user;
    }
  }, [user]);

  useAsync(async () => {
    setIsLoading(true);
    const projectResp = await httpCommon.get("/getAllProject");
    setProjectList(projectResp.data);
    setIsLoading(false);
  }, []);

  const filteredList = useAsync(async () => {
    //@ts-ignore
    const userDep = await getCodeDepsFromUserCp(user?.codePostal);
    return projectList.filter((item) => item.codeDepartement === userDep);
  }, [projectList]).value;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setDisplayedList(newValue);
  };

  return (
    <PageWrapper isUserConnected={true}>
      <AsyncLoader isLoading={isLoading} label={"Récupération Projets..."} />
      <StyledContainer>
        <StyledHeaderContainer>
          <StyledTitle>Nos meilleurs prestataires, vos projets.</StyledTitle>

          <Tabs
            value={displayedList}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Tous les projets" {...a11yProps(0)} />
            <Tab label="Projets proches de chez vous" {...a11yProps(1)} />
          </Tabs>
        </StyledHeaderContainer>
        <TabPanel props={{ value: displayedList, index: 0 }}>
          <StyledListContainer>
            {!!projectList.length &&
              projectList.map((item) => (
                <ProjectCard projectData={item} handleAction={noop} />
              ))}
          </StyledListContainer>
        </TabPanel>
        <TabPanel props={{ value: displayedList, index: 1 }}>
          {isUserPresta && !!filteredList?.length && (
            <StyledListContainer>
              {filteredList.map((item) => (
                <ProjectCard projectData={item} handleAction={noop} />
              ))}
            </StyledListContainer>
          )}
        </TabPanel>
      </StyledContainer>
    </PageWrapper>
  );
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

async function getCodeDepsFromUserCp(codePostal: string) {
  const cities = await getCityByCodePostal(codePostal);
  if (!cities.length) {
    return "";
  }
  return cities[0].codeDepartement;
}

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
  margin: 1%;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  /* justify-content: center; */
`;

const StyledHeaderContainer = styled.div`
  width: 100%;
  margin: 2%;
`;
