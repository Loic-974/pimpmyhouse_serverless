import React, { useContext } from "react";

import { authContext } from "./lib/AuthProvider";
import PageWrapper from "./lib/PageWrapper";

export const MyProjects = () => {
  const { user } = useContext(authContext);

  return (
    <PageWrapper>
      <div></div>
    </PageWrapper>
  );
};
