import React, { useState } from "react";
import PageWrapper from "./lib/PageWrapper";
import styled from "styled-components";
import { Tabs, Tab } from "@mui/material";

export const Home = () => {
  const [displayedList, setDisplayedList] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setDisplayedList(newValue);
  };

  // Call Data Project
  return (
    <PageWrapper isUserConnected={true}>
      <StyledContainer>
        <StyledTitle>Nos meilleurs prestataires, vos projets.</StyledTitle>

        <Tabs
          value={displayedList}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Tous les projets" {...a11yProps(0)} />
          <Tab label="Aménagement intérieur" {...a11yProps(1)} />
          <Tab label="Aménagement extérieur" {...a11yProps(2)} />
          <Tab label="Jardin/Piscine" {...a11yProps(3)} />
        </Tabs>
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
