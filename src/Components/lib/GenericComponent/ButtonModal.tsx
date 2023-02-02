import { Dialog, DialogTitle, DialogContent, Button } from "@mui/material";
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import styled from "styled-components";

export const ButtonModal = ({
  render,
  btnLabel,
  buttonRender,
}: {
  render: (setterModal: Dispatch<SetStateAction<boolean>>) => ReactNode;
  btnLabel: string;
  buttonRender?: (onClickFn: Dispatch<SetStateAction<boolean>>) => ReactNode;
}) => {
  const [isDisplay, setIsDisplay] = useState(false);

  const children = useMemo(() => {
    return render(setIsDisplay);
  }, [render, setIsDisplay]);

  return (
    <>
      {buttonRender ? (
        buttonRender(() => setIsDisplay(true))
      ) : (
        <Button variant="contained" onClick={() => setIsDisplay(true)}>
          {btnLabel}
        </Button>
      )}
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
    max-width: 80%;
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
