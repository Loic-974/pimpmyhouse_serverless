import { Drawer } from "@mui/material";
import React, { ReactNode } from "react";
import styled from "styled-components";
import background from "../../Rnovatio.jpg";
export default function PageWrapper({
  children,
  isUserConnected = true,
}: {
  children: ReactNode;
  isUserConnected?: boolean;
}) {
  return (
    <StyledPageWrapper $isConnected={isUserConnected}>
      <StyledBackground $isConnected={isUserConnected} />
      {isUserConnected && (
        <Drawer
          anchor="left"
          open={true}
          //onClose={toggleDrawer(anchor, false)}
        >
          <p>toto</p>
          <p>titi</p>
        </Drawer>
      )}
      {children}
    </StyledPageWrapper>
  );
}

const StyledPageWrapper = styled.div<{ $isConnected: boolean }>`
  width: 100vw;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 24px;
  background-color: ${(props) =>
    props.$isConnected ? "#cacdd6" : "#000000a0"};
  opacity: 1;
`;

const StyledBackground = styled.div<{ $isConnected: boolean }>`
  background-image: ${(props) =>
    !props.$isConnected ? `url(${background})` : ""};
  background-size: cover;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
`;
