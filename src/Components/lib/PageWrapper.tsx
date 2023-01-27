import React, { ReactNode } from "react";
import styled from "styled-components";

export default function PageWrapper({ children }: { children: ReactNode }) {
  return <StyledPageWrapper>{children}</StyledPageWrapper>;
}

const StyledPageWrapper = styled.div`
  background-color: #3c3e44;
  width: 100vw;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 24px;
`;
