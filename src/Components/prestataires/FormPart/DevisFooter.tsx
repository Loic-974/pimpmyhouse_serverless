import React, { Dispatch, useMemo } from "react";
import { Grid, InputAdornment, TextField } from "@mui/material";
import { IDevis } from "../DevisForm";
import {
  jsDateToYYYYMMDD,
  strDateToLocale,
} from "../../../functionLib/dateFnLib/strDateToLocale";
import { sumBy } from "lodash";
import { useEffect } from "react";

export const DevisFooter = ({
  devisData,
  setDevisData,
}: {
  devisData: IDevis;
  setDevisData: Dispatch<React.SetStateAction<IDevis>>;
}) => {
  const totalTTC = useMemo(() => {
    return sumBy(devisData.devisRow, (item) => item.montantTTC);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devisData.devisRow]);

  const totalTVA = useMemo(() => {
    return sumBy(
      devisData.devisRow,
      (item) => item.montantHT * (item.tva / 100)
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devisData.devisRow]);

  useEffect(() => {
    setDevisData((prevState) => ({
      ...prevState,
      montantTotalTVA: totalTVA,
      montantTotalTTC: totalTTC,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalTTC, totalTVA]);

  return (
    <Grid container item xs={12} justifyContent={"end"} spacing={2}>
      <Grid item xs={4}>
        <TextField
          variant="standard"
          label="Date Fin Validité"
          defaultValue={jsDateToYYYYMMDD(new Date())}
          placeholder="Date Fin Validité"
          fullWidth
          type="date"
          onChange={(e) => {
            setDevisData((prevState) => ({
              ...prevState,
              dateValidite: strDateToLocale(e.target.value),
            }));
          }}
          InputProps={{
            inputProps: {
              min: jsDateToYYYYMMDD(new Date()),
            },
          }}
        />
      </Grid>
      <Grid item xs={3} />
      <Grid item xs={2}>
        <TextField
          variant="standard"
          label="Total TVA"
          disabled
          value={totalTVA}
          defaultValue={totalTVA}
          placeholder="Total TVA"
          fullWidth
          InputProps={{
            endAdornment: <InputAdornment position="end">€</InputAdornment>,
          }}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          variant="standard"
          label="Total TTC"
          disabled
          value={totalTTC}
          defaultValue={totalTTC}
          placeholder="Total TTC"
          fullWidth
          InputProps={{
            endAdornment: <InputAdornment position="end">€</InputAdornment>,
          }}
        />
      </Grid>
    </Grid>
  );
};
