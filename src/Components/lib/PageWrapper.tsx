import { Drawer } from "@mui/material";
import React, { ReactNode, useState } from "react";
import styled from "styled-components";
import background from "../../Rnovatio.jpg";
import { Link, useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { authContext } from "./AuthProvider";

export default function PageWrapper({
  children,
  isUserConnected = true,
}: {
  children: ReactNode;
  isUserConnected?: boolean;
}) {
  const navigate = useNavigate();

  const [displayMenu, setDisplayMenu] = useState(false);

  function logout() {
    window.localStorage.removeItem("email");
    window.localStorage.removeItem("token");
    navigate("/", {
      replace: true,
      preventScrollReset: true,
    });
  }

  return (
    <StyledPageWrapper $isConnected={isUserConnected}>
      <StyledBackground $isConnected={isUserConnected} />
      {isUserConnected && (
        <StyledMenuClosed onMouseOver={() => setDisplayMenu(true)}>
          <ArrowForwardIosIcon fontSize="small" />
        </StyledMenuClosed>
      )}
      {isUserConnected && (
        <StyledDrawer
          anchor="left"
          open={displayMenu}
          onClose={() => setDisplayMenu(false)}
          onMouseLeave={() => setDisplayMenu(false)}
        >
          <StyledDrawPart to="/" state={true}>
            Accueil
          </StyledDrawPart>
          <StyledDrawPart to="/myProjects">Mes Projets</StyledDrawPart>
          <StyledLogout onClick={logout}>Déconnexion</StyledLogout>
        </StyledDrawer>
      )}
      {children}
    </StyledPageWrapper>
  );
}

// ----------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------- Style ---------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------

const StyledPageWrapper = styled.div<{ $isConnected: boolean }>`
  width: 100vw;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 24px;
  background-color: ${(props) =>
    props.$isConnected ? "#d8dae0" : "#000000a0"};
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

const StyledMenuClosed = styled.div`
  width: 15px;
  min-height: 100vh;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #ca6f06;
  display: flex;
  flex-direction: column;
  justify-content: center;
  svg {
    width: 0.9rem;
    height: 1.8rem;
  }
`;

const StyledDrawer = styled(Drawer)`
  display: flex;
  flex: 0;
  width: fit-content;

  .MuiBackdrop-root {
    display: none;
  }
  .MuiPaper-root {
    position: relative;
    background-color: #19191a;
  }
`;

const StyledDrawPart = styled(Link)`
  padding: 16px 6px;
  border-top: 1px solid white;
  text-decoration: none;
  color: black;
  text-align: center;
  font-weight: 400;
  font-kerning: 1px;
  color: white;

  :hover {
    background-color: #70b1ca;
  }
`;

const StyledLogout = styled.div`
  padding: 16px 6px;
  border-top: 1px solid white;
  text-decoration: none;
  color: black;
  text-align: center;
  font-weight: 400;
  font-kerning: 1px;
  color: white;
  cursor: pointer;
  :hover {
    background-color: #70b1ca;
  }
`;
