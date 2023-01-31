import React, { useMemo, useState } from "react";
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
import {
  jsDateToYYYYMMDD,
  strDateToLocale,
} from "../../functionLib/dateFnLib/strDateToLocale";
import httpCommon, { expressAxios } from "../../http.common";

interface IFormProject {
  userId: string;
  libelleProjet: string;
  dateCreation: Date;
  dateDebut: Date;
  budgetMoyen: number;
  codeDepartement: string;
  villeProjet: string;
  details: string[];
  imgUrlProjet: string;
}

export const NewProjectForm = ({ user }: { user: IUtilisateur | null }) => {
  const [libelleProjet, setLibelleProjet] = useState("");
  const [villeProjet, setVilleProjet] = useState({ label: "", value: "" });
  const [codeDepartement, setCodeDepartment] = useState({
    label: "",
    value: "",
  });
  const [dateDebut, setDateDebut] = useState("");
  const [budgetMoyen, setBudgetMoyen] = useState(0);
  const [detailsProjet, setDetailsProjet] = useState<Dictionary<string>>({
    detail0: "",
  });
  const [imgUrlProjet, setImgUrlProjet] = useState({
    userId: "",
    name: "",
    file: null,
  });

  const formData: IFormProject = useMemo(() => {
    return {
      userId: user?._id as string,
      libelleProjet,
      dateCreation: new Date(),
      dateDebut: strDateToLocale(dateDebut),
      budgetMoyen,
      details: Object.values(detailsProjet),
      imgUrlProjet: imgUrlProjet.name,
      codeDepartement: codeDepartement.value,
      villeProjet: villeProjet.label,
    };
  }, [
    budgetMoyen,
    codeDepartement,
    dateDebut,
    detailsProjet,
    imgUrlProjet,
    libelleProjet,
    user?._id,
    villeProjet,
  ]);

  /**
   * Send data to mongo server
   * If no error create an user repository and stock img in fake server
   * @param e - mouse Event
   */
  async function handleProjectCreation(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    try {
      const attempt = await httpCommon.post("/insertProject", formData);
      if (attempt?.data) {
        const imgFormData = new FormData();
        // Id must be at the first place
        //https://stackoverflow.com/questions/39589022/node-js-multer-and-req-body-empty
        imgFormData.append("userId", imgUrlProjet.userId);
        //@ts-ignore
        imgFormData.append("imgFile", imgUrlProjet.file);
        await expressAxios({
          method: "POST",
          url: "/sendImage",
          data: imgFormData,
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  //---------------------------------------------- Component Fn -----------------------------------------

  const getCities = (
    inputValue: string,
    callback: (options: { label: string; value: string }[]) => void
  ) => {
    setTimeout(async () => {
      if (!codeDepartement.value) {
        callback([{ label: "", value: "" }]);
      } else {
        const depsCall = await getCitiesByDepsCode(codeDepartement.value);
        const options = depsCall?.map((item) => ({
          label: item.nom,
          value: item.nom,
        }));

        callback(options);
      }
    }, 10);
  };

  // Select City async component
  const AsyncSelectCities = () => {
    return (
      <AsyncSelect
        id="deps"
        isDisabled={!codeDepartement.value}
        cacheOptions
        defaultOptions
        value={villeProjet}
        loadOptions={(inputValue, callback) =>
          getCities(codeDepartement.value, callback)
        }
        onChange={(event: SingleValue<{ label: string; value: string }>) =>
          setVilleProjet(event as { label: string; value: string })
        }
      />
    );
  };

  // Allow to add a new component row
  function addNewItem() {
    const index = Object.keys(detailsProjet).length;
    return { ["detail" + index]: "" };
  }

  /**
   * Set the input file data
   * @param e - event Change input
   */
  const getFileInfo = (
    e: React.ChangeEvent<HTMLInputElement | HTMLInputElement>
  ) => {
    if (e.target.files?.[0]) {
      setImgUrlProjet((prevState) => {
        prevState.name = e.target.files?.[0].name || "";
        //@ts-ignore
        prevState.file = e.target.files?.[0] || null;
        prevState.userId = user?._id || "";
        return prevState;
      });
    }
  };

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
            onChange={(event) =>
              setCodeDepartment(event as { label: string; value: string })
            }
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
            InputProps={{
              inputProps: {
                min: jsDateToYYYYMMDD(new Date()),
              },
            }}
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
            <StyledDetailContainer key={key}>
              <Grid item xs={10}>
                <TextField
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
              <Grid item xs={1} key={key + "grid"}>
                {index !== 0 ? (
                  <IconButton
                    onClick={() => {
                      const newDetails = omit(detailsProjet, key);
                      setDetailsProjet(newDetails);
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>
                ) : (
                  <Grid item xs={1} key={key + "gridbis"}>
                    <IconButton
                      onClick={() =>
                        setDetailsProjet((prevState) => ({
                          ...prevState,
                          ...addNewItem(),
                        }))
                      }
                    >
                      <ControlPointIcon />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            </StyledDetailContainer>
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
            onChange={getFileInfo}
          />
        </StyledFullWithFormControl>
      </StyledGridUniq>

      <StyledGridUniq item xs={12}>
        <Button
          variant="contained"
          onClick={handleProjectCreation}
          disabled={Object.values(formData).some((item) => !item)}
        >
          Créer le Projet
        </Button>
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

const StyledDetailContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
`;
