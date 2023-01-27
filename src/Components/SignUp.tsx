import React, { useState } from "react";

import { Tab, Tabs } from "@mui/material";
import PageWrapper from "./lib/PageWrapper";
import { SignUpTabForm } from "./lib/SignUpTabForm";

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
    <PageWrapper>
      <div>
        <Tabs value={displayedForm} onChange={handleChange}>
          <Tab label="Utilisateur" {...a11yProps(0)} />
          <Tab label="Prestataire" {...a11yProps(1)} />
        </Tabs>
      </div>
      <div>
        <SignUpTabForm value={displayedForm} index={0} ispresta={false} />
        <SignUpTabForm value={displayedForm} index={1} ispresta={true} />
      </div>
    </PageWrapper>
  );
}

// ----------------------------------------- SUB COMPONENT -------------------------------------------
