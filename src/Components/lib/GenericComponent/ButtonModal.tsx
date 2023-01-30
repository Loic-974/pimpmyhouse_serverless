import { Dialog, DialogTitle, DialogContent, Button } from "@mui/material";
import React, { ReactNode, useState } from "react";

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
      <Dialog
        open={isDisplay}
        onClose={() => setIsDisplay(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{btnLabel}</DialogTitle>
        <DialogContent>{children}</DialogContent>
      </Dialog>
    </>
  );
};
