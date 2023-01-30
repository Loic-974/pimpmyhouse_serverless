import React, { useState } from "react";
import { IUtilisateur } from "../../types/utilisateur";
import EuroSymbolIcon from "@mui/icons-material/EuroSymbol";
import {
  FormControl,
  Input,
  InputLabel,
  InputAdornment,
  Grid,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import RemoveIcon from "@mui/icons-material/Remove";
import AsyncSelect from "react-select/async";
import {
  getDepartementByName,
  getCitiesByDepsCode,
} from "../../functionLib/apiGouvGeoLib";
import { Dictionary, omit } from "lodash";
import { SingleValue } from "react-select";
import styled from "styled-components";
//IBaseProject

export const NewProjectForm = ({ user }: { user: IUtilisateur | null }) => {
  const [libelleProjet, setLibelleProjet] = useState("");
  const [villeProjet, setVilleProjet] = useState("");
  const [codeDepartement, setCodeDepartment] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [budgetMoyen, setBudgetMoyen] = useState(0);
  const [detailsProjet, setDetailsProjet] = useState<Dictionary<string>>({
    detail0: "",
  });
  const [imgUrlProjet, setImgUrlProjet] = useState("");

  const getCities = (
    inputValue: string,
    callback: (options: { label: string; value: string }[]) => void
  ) => {
    setTimeout(async () => {
      if (!codeDepartement) {
        callback([{ label: "", value: "" }]);
      } else {
        const depsCall = await getCitiesByDepsCode(codeDepartement);
        const options = depsCall?.map((item) => ({
          label: item.nom,
          value: item.nom,
        }));

        callback(options);
      }
    }, 10);
  };

  const AsyncSelectCities = () => {
    return (
      <AsyncSelect
        id="deps"
        isDisabled={!codeDepartement}
        cacheOptions
        defaultOptions
        loadOptions={(inputValue, callback) =>
          getCities(codeDepartement, callback)
        }
        onChange={(event: SingleValue<{ label: string; value: string }>) =>
          setVilleProjet(event?.value as string)
        }
      />
    );
  };

  function addNewItem() {
    const index = Object.keys(detailsProjet).length;
    return { ["detail" + index]: "" };
  }

  return (
    <StyledGridContainer container>
      <StyledGridUniq item xs={12}>
        <StyledFullWithFormControl variant="standard">
          <InputLabel htmlFor="name">Libelle Projet</InputLabel>
          <Input
            fullWidth
            id="name"
            placeholder="Libellé Projet"
            onChange={(e) => setLibelleProjet(e.currentTarget.value)}
          />
        </StyledFullWithFormControl>
      </StyledGridUniq>
      <StyledGridMargin container item xs={12} spacing={1}>
        <Grid item xs={6}>
          <InputLabel htmlFor="deps">Département</InputLabel>
          <AsyncSelect
            id="deps"
            cacheOptions
            defaultOptions
            loadOptions={getDeps}
            onChange={(event) => setCodeDepartment(event?.value as string)}
          />
        </Grid>

        <Grid item xs={6}>
          <InputLabel htmlFor="deps">Ville</InputLabel>
          <AsyncSelectCities />
        </Grid>
      </StyledGridMargin>
      <StyledGridMargin container item xs={12} spacing={1}>
        <Grid item xs={6}>
          <TextField
            id="debut"
            fullWidth
            type="date"
            variant="standard"
            label="Date Souhaité"
            onChange={(e) => setDateDebut(e.currentTarget.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={6}>
          <StyledFullWithFormControl variant="standard">
            <InputLabel htmlFor="debut">Budget Moyen</InputLabel>
            <Input
              id="debut"
              placeholder="Budget Moyen"
              onChange={(e) => setBudgetMoyen(parseInt(e.currentTarget.value))}
              endAdornment={
                <InputAdornment position="end">
                  <EuroSymbolIcon />
                </InputAdornment>
              }
            />
          </StyledFullWithFormControl>
        </Grid>
      </StyledGridMargin>
      <StyledGridUniq container item xs={12} alignItems={"center"}>
        <Grid
          item
          container
          xs={12}
          alignItems={"end"}
          justifyContent={"center"}
        >
          {Object.keys(detailsProjet).map((key, index) => (
            <>
              <Grid item xs={10}>
                <TextField
                  key={key}
                  id={key}
                  variant="standard"
                  label="Description Projet"
                  placeholder="Détails"
                  fullWidth
                  onChange={(e) =>
                    setDetailsProjet((prevState) => ({
                      ...prevState,
                      [key]: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={1}>
                {index !== 0 ? (
                  <IconButton>
                    <RemoveIcon
                      onClick={() => {
                        const newDetails = omit(detailsProjet, key);
                        setDetailsProjet(newDetails);
                      }}
                    />
                  </IconButton>
                ) : (
                  <Grid item xs={1}>
                    <IconButton>
                      <ControlPointIcon
                        onClick={() =>
                          setDetailsProjet((prevState) => ({
                            ...prevState,
                            ...addNewItem(),
                          }))
                        }
                      />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            </>
          ))}
        </Grid>
      </StyledGridUniq>
      <StyledGridUniq item xs={12}>
        <StyledFullWithFormControl variant="standard">
          <InputLabel htmlFor="debut">Photo du bien</InputLabel>
          <Input
            id={"img"}
            placeholder="Détails"
            type="file"
            inputProps={{ accept: "image/png, image/jpeg" }}
            onChange={(e) => setImgUrlProjet(e.target.value)}
          />
        </StyledFullWithFormControl>
      </StyledGridUniq>
      <StyledGridUniq item xs={12}>
        <Button variant="contained">Créer le Projet</Button>
      </StyledGridUniq>
    </StyledGridContainer>
  );
};

// ----------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------- Helper ---------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------

const getDeps = (
  inputValue: string,
  callback: (options: { label: string; value: string }[]) => void
) => {
  setTimeout(async () => {
    const depsCall = await getDepartementByName(inputValue);
    const options = depsCall?.map((item) => ({
      label: item.nom,
      value: item.code,
    }));

    callback(options);
  }, 10);
};

// ----------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------- Style ---------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------

const StyledGridContainer = styled(Grid)`
  width: 100%;
`;

const StyledGridMargin = styled(Grid)`
  &.MuiGrid-container.MuiGrid-item {
    margin: 24px 8px;
  }
`;

const StyledGridUniq = styled(Grid)`
  display: flex;
  align-items: center;
  justify-content: center;
  &.MuiGrid-item {
    margin: 16px 0px;
  }
`;

const StyledFullWithFormControl = styled(FormControl)`
  width: 100%;
  .MuiFormLabel-root {
    margin-bottom: 18px;
  }
`;
