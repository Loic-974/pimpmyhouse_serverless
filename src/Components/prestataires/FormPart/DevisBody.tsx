import {
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  styled,
} from "@mui/material";
import { Dictionary, cloneDeep, omit, zipObject } from "lodash";
import React, { Dispatch, useEffect, useState } from "react";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import RemoveIcon from "@mui/icons-material/Remove";
import { IDevis } from "../DevisForm";

export interface IDevisLigne {
  description: string;
  montantHT: number;
  tva: number;
  montantTTC: number;
}

export const DevisBody = ({
  setDevisData,
  handleOnChange,
  existingDevisRow,
}: {
  setDevisData: Dispatch<React.SetStateAction<IDevis>>;
  handleOnChange: (arg: Dictionary<IDevisLigne>) => void;
  existingDevisRow?: IDevisLigne[] | null;
}) => {
  const { devisRow, setDevisRow } = useDevisRow(existingDevisRow);

  function _setRowDevis(
    key: string,
    property: "description" | "montantHT" | "tva" | "montantTTC",
    value: any
  ) {
    const existingRow = cloneDeep(devisRow);
    const updatedKey = existingRow[key];
    // @ts-ignore
    updatedKey[property] = value;
    if (property === "montantHT" || property === "tva") {
      updatedKey.montantTTC = Math.round(
        updatedKey.montantHT * (1 + updatedKey.tva / 100)
      );
    }
    setDevisRow((prevState) => ({
      ...prevState,
      [key]: updatedKey,
    }));

    handleOnChange(existingRow);
  }

  function addNewItem() {
    const index = Object.keys(devisRow).length;
    return {
      ["row" + index]: {
        description: "",
        montantHT: 0,
        tva: 0,
        montantTTC: 0,
      },
    };
  }

  return (
    <StyledRowContainer container>
      {Object.keys(devisRow).map((key, index) => {
        const row = devisRow[key];
        return (
          <Grid container item xs={12} spacing={2} key={key} alignItems={"end"}>
            <Grid item xs={6}>
              <TextField
                variant="standard"
                label="Service/Produit"
                value={row.description}
                defaultValue={row.description}
                placeholder="Service/Produit"
                fullWidth
                onChange={(e) =>
                  _setRowDevis(key, "description", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                variant="standard"
                label="Montant HT"
                value={row.montantHT}
                defaultValue={row.montantHT}
                placeholder="Montant HT"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">€</InputAdornment>
                  ),
                }}
                onChange={(e) => _setRowDevis(key, "montantHT", e.target.value)}
              />
            </Grid>
            <Grid item xs={1}>
              <TextField
                variant="standard"
                label="TVA"
                placeholder="TVA"
                value={row.tva}
                defaultValue={row.tva}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                fullWidth
                onChange={(e) => _setRowDevis(key, "tva", e.target.value)}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                id={key}
                variant="standard"
                label="Montant TTC"
                disabled
                value={row.montantTTC}
                defaultValue={row.montantTTC}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">€</InputAdornment>
                  ),
                }}
              />
            </Grid>
            {index === 0 && (
              <Grid item xs={1}>
                <IconButton
                  onClick={() =>
                    setDevisRow((prevState) => ({
                      ...prevState,
                      ...addNewItem(),
                    }))
                  }
                >
                  <ControlPointIcon />
                </IconButton>
              </Grid>
            )}
            {index !== 0 && (
              <Grid item xs={1}>
                <IconButton
                  onClick={() => {
                    const newDetails = omit(devisRow, key);
                    setDevisRow(newDetails);
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </Grid>
            )}
          </Grid>
        );
      })}
    </StyledRowContainer>
  );
};

// ----------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------- Helper ---------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------

function useDevisRow(existingDevisRow: IDevisLigne[] | null | undefined) {
  const [devisRow, setDevisRow] = useState<Dictionary<IDevisLigne>>({
    row0: {
      description: "",
      montantHT: 0,
      tva: 0,
      montantTTC: 0,
    },
  });

  useEffect(() => {
    if (existingDevisRow) {
      const arrayKey = existingDevisRow.map((item, index) => "row" + index);
      const devisRowDict = zipObject(arrayKey, existingDevisRow);
      setDevisRow(devisRowDict);
    }
  }, [existingDevisRow]);

  return { devisRow, setDevisRow };
}
// ----------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------- Style ---------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------

const StyledRowContainer = styled(Grid)`
  padding: 16px 4px;
`;
