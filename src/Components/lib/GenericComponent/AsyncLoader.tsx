import { CircularProgress } from "@mui/material";
import React from "react";
import styled from "styled-components";

export const AsyncLoader = ({
  isLoading,
  label,
}: {
  isLoading: boolean;
  label: string;
}) => {
  return isLoading ? (
    <StyledContainer>
      <StyledLoader>
        <CircularProgress size={80} />
        <p>{label}.....</p>
      </StyledLoader>
    </StyledContainer>
  ) : (
    <></>
  );
};

const StyledContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  background-color: #2c2c2cab;
  z-index: 1000;
  display: flex;
  min-height: 100%;
`;

const StyledLoader = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin-top: 20%;
  p {
    color: #e7e5e5;
    font-size: 1.5rem;
  }
`;
