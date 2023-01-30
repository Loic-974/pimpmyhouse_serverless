import React, { useState } from "react";

import { Tab, Tabs, Typography } from "@mui/material";
import PageWrapper from "./lib/PageWrapper";
import { SignUpTabForm } from "./lib/SignUpTabForm";
import styled from "styled-components";

export default function SignUp() {
  const [displayedForm, setDisplayedForm] = useState(0);

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setDisplayedForm(newValue);
  };

  return (
    <PageWrapper isUserConnected={false}>
      <StyledSignUpContainer>
        <StyledTypo variant="h5">Inscription</StyledTypo>
        <StyledTabs value={displayedForm} onChange={handleChange}>
          <StyledTab label="Utilisateur" {...a11yProps(0)} />
          <StyledTab label="Prestataire" {...a11yProps(1)} />
        </StyledTabs>

        <div>
          <SignUpTabForm value={displayedForm} index={0} ispresta={false} />
          <SignUpTabForm value={displayedForm} index={1} ispresta={true} />
        </div>
      </StyledSignUpContainer>
    </PageWrapper>
  );
}

// ----------------------------------------- SUB COMPONENT -------------------------------------------

const StyledSignUpContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #1f1f20f6;
  width: 60%;
  margin: auto;
  height: 50%;
  padding: 12px;
  border-radius: 8px;
`;
const StyledTypo = styled(Typography)`
  color: white;
  &.MuiTypography-root {
    margin-bottom: 16px;
  }
`;

const StyledTabs = styled(Tabs)`
  margin-bottom: 24px;
`;

const StyledTab = styled(Tab)`
  &.MuiTab-root {
    color: white;
    background-color: #6e7577;
  }
  &.Mui-selected {
    background-color: #ca6f06;
    border-radius: 0 8px 8px 0;
  }

  :first-child {
    border-radius: 8px 0 0 8px;
    &.Mui-selected {
      border-radius: 8px 0 0 0;
      color: white;
    }
  }
  :last-child {
    border-radius: 0 8px 8px 0;
    &.Mui-selected {
      border-radius: 0 8px 0px 0;
      color: white;
    }
  }
`;
