import React, { ReactNode } from "react";

export interface TabPanelProps {
  index: number;
  value: number;
}

export const TabPanel = ({
  props,
  children,
}: {
  props: TabPanelProps;
  children: ReactNode;
}) => {
  const { value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
};
