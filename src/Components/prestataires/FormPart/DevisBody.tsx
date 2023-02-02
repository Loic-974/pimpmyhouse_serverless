import {
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  styled,
} from "@mui/material";
import { Dictionary, omit } from "lodash";
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
}: {
  setDevisData: Dispatch<React.SetStateAction<IDevis>>;
}) => {
  const [devisRow, setDevisRow] = useState<Dictionary<IDevisLigne>>({
    row0: {
      description: "",
      montantHT: 0,
      tva: 0,
      montantTTC: 0,
    },
  });

  useEffect(() => {
    setDevisData((prevState) => ({
      ...prevState,
      devisRow: Object.values(devisRow),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devisRow]);

  function setMontantTTC(key: string, montantHt: number, tva: number) {
    if (montantHt && tva) {
      setDevisRow((prevState) => ({
        ...prevState,
        [key]: {
          ...prevState[key],
          montantTTC: Math.round(montantHt * (1 + tva / 100)),
        },
      }));
    }
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
                defaultValue={row.description}
                placeholder="Service/Produit"
                fullWidth
                onChange={(e) =>
                  setDevisRow((prevState) => ({
                    ...prevState,
                    [key]: {
                      ...prevState[key],
                      description: e.target.value,
                    },
                  }))
                }
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                variant="standard"
                label="Montant HT"
                // defaultValue={row.montantHT}
                placeholder="Montant HT"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">€</InputAdornment>
                  ),
                }}
                onChange={(e) => {
                  setDevisRow({
                    ...devisRow,
                    [key]: {
                      ...devisRow[key],
                      montantHT: parseInt(e.target.value),
                    },
                  });
                  setMontantTTC(key, parseInt(e.target.value), row.tva);
                }}
              />
            </Grid>
            <Grid item xs={1}>
              <TextField
                variant="standard"
                label="TVA"
                placeholder="TVA"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                fullWidth
                onChange={(e) => {
                  setDevisRow({
                    ...devisRow,
                    [key]: {
                      ...row,
                      tva: parseInt(e.target.value),
                    },
                  });
                  setMontantTTC(key, row.montantHT, parseInt(e.target.value));
                }}
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
// ------------------------------------------------- Style ---------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------

const StyledRowContainer = styled(Grid)`
  padding: 16px 4px;
`;
