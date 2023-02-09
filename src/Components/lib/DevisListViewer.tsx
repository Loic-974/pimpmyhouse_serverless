import {
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemButton,
  CircularProgress,
} from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useAsync } from "react-use";
import httpCommon from "../../http.common";
import styled from "styled-components";
import { DevisForm, IDevis } from "../prestataires/DevisForm";
import { dateToStrDate } from "../../functionLib/dateFnLib/dateToStrDateLib";
import { ButtonModal } from "./GenericComponent/ButtonModal";
import { IUtilisateur } from "../../types/utilisateur";
import { IProject } from "../../types/projet";
import { noop } from "lodash";

export const DevisListViewer = ({
  devisIdList,
  projectData,
}: {
  devisIdList: string[];
  projectData: IProject;
}) => {
  const [listDevis, setListDevis] = useState<IDevis[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useAsync(async () => {
    setIsLoading(true);
    const devisDataList = await httpCommon.post("/findAllDevisByIdList", {
      listId: devisIdList,
    });
    if (devisDataList.data) {
      setListDevis(devisDataList.data);
      setIsLoading(false);
    }
  }, [devisIdList]);
  console.log(listDevis);
  return (
    <>
      {isLoading ? (
        <StyledLoader>
          <CircularProgress size={80} />
          <p>Récupération Devis...</p>
        </StyledLoader>
      ) : (
        <List component="nav" aria-label="mailbox folders">
          {listDevis.map((item, index) => (
            <ButtonModal
              btnLabel="Liste des devis"
              render={(setDisplayModal: Dispatch<SetStateAction<boolean>>) => (
                // eslint-disable-next-line react/jsx-no-undef
                <DevisForm
                  //@ts-ignore
                  user={item.projectUser}
                  setDisplayModal={setDisplayModal}
                  projectData={projectData}
                  handleOnCreate={noop}
                  prestaDevisId={undefined}
                  existingDevis={item}
                />
              )}
              buttonRender={(onClickFn) => (
                <ListItemButton divider onClick={() => onClickFn(true)}>
                  <ListItemText
                    primary={"Devis N°" + item._id}
                    secondary={
                      "Valable jusqu'au : " +
                      dateToStrDate(item.dateValidite) +
                      " - " +
                      "Montant Total : " +
                      item.montantTotalTTC +
                      "€"
                    }
                  />
                </ListItemButton>
              )}
            />
          ))}
        </List>
      )}
    </>
  );
};

const StyledLoader = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: stretch;
  justify-content: center;
  margin-top: 20%;
  margin-bottom: 20%;
  padding-left: 128px;
  padding-right: 128px;
  p {
    color: #1b1b1b;
    font-size: 1.5rem;
    text-align: center;
  }
  span {
    margin: auto;
  }
`;
