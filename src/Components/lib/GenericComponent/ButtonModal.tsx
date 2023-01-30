import { Dialog, DialogTitle, DialogContent, Button } from "@mui/material";
import React, { ReactNode, useState } from "react";
import styled from "styled-components";

export const ButtonModal = ({
  children,
  btnLabel,
}: {
  children: ReactNode;
  btnLabel: string;
}) => {
  const [isDisplay, setIsDisplay] = useState(false);

  return (
    <>
      <Button onClick={() => setIsDisplay(true)}>{btnLabel}</Button>
      <StyledDialog
        open={isDisplay}
        onClose={() => setIsDisplay(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{btnLabel}</DialogTitle>
        <DialogContent>{children}</DialogContent>
      </StyledDialog>
    </>
  );
};

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    max-width: 60%;
    width: fit-content;
  }
  .MuiDialogContent-root {
    display: flex;
    box-sizing: border-box;
  }
  .MuiDialogTitle-root {
    background-color: #121213;
    color: white;
  }
`;
