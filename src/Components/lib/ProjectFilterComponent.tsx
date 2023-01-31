import { Grid, Slider } from "@mui/material";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { ButtonModal } from "./GenericComponent/ButtonModal";
import { NewProjectForm } from "./NewProjectForm";
import { IUtilisateur } from "../../types/utilisateur";
import { IProject } from "../../types/projet";
import { useEffect } from "react";
import { first, intersectionBy, last, orderBy, uniqBy } from "lodash";
import Select from "react-select";
import {
  dateToTimestamp,
  timeStampToStrDate,
} from "../../functionLib/dateFnLib/dateToTimestamp";
import { dateToStrDate } from "../../functionLib/dateFnLib/dateToStrDateLib";

export const ProjectFilterComponent = ({
  user,
  projectListOrigin,
  setDisplayedProject,
}: {
  user: IUtilisateur;
  projectListOrigin: IProject[];
  setDisplayedProject: Dispatch<React.SetStateAction<IProject[]>>;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [nonFilteredList, setNonFilteredList] = useState(projectListOrigin);
  const [projectList, setProjectList] = useState(nonFilteredList);

  const [filter, setFilter] = useState({
    budget: 0,
    deps: "",
    timestamp: 0,
  });

  const departementOptions: any[] = useMemo(() => {
    const options = uniqBy(
      nonFilteredList.map((item) => ({
        label: item.codeDepartement,
        value: item.codeDepartement,
      })),
      "value"
    );
    options.unshift({
      label: "Aucun",
      value: "",
    });
    return options;
  }, [nonFilteredList]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [minDateRange, maxDateRange, marksDateRange] = useMemo(
    () =>
      _buildSliderData(
        nonFilteredList,
        (item) => dateToTimestamp(item.dateCreation),
        (item) => ({
          value: dateToTimestamp(item.dateCreation),
          label: dateToStrDate(item.dateCreation),
        }),
        (item) => dateToTimestamp(item.dateCreation)
      ),
    [nonFilteredList]
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [minBudget, maxBudget, marksBudget] = useMemo(
    () =>
      _buildSliderData(
        nonFilteredList,
        (item) => item.budgetMoyen,
        (item) => ({
          value: item.budgetMoyen,
          label: item.budgetMoyen,
        }),
        (item) => item.budgetMoyen
      ),
    [nonFilteredList]
  );

  useEffect(() => {
    setDisplayedProject(projectList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectList]);

  useEffect(() => {
    filterProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.budget, filter.timestamp, filter.deps]);

  function filterProject() {
    const budgetFiltered = filter.budget
      ? nonFilteredList.filter((item) => item.budgetMoyen <= filter.budget)
      : nonFilteredList;
    const departement = filter.deps
      ? nonFilteredList.filter((item) => item.codeDepartement === filter.deps)
      : nonFilteredList;
    const dateFiltered = filter.timestamp
      ? nonFilteredList.filter(
          (item) => dateToTimestamp(item.dateCreation) + 100 < filter.timestamp
        )
      : nonFilteredList;

    const project = intersectionBy(
      budgetFiltered,
      departement,
      dateFiltered,
      "_id"
    );

    return setProjectList(project);
  }

  return (
    <Grid container>
      <Grid item md={3} xs={6}>
        <Slider
          aria-label="Small steps"
          defaultValue={maxBudget + 100}
          step={100}
          min={minBudget}
          max={maxBudget + 100}
          valueLabelDisplay="on"
          valueLabelFormat={(value) => value + "€"}
          onChange={(e: any) => {
            setFilter((prevState) => ({
              ...prevState,
              budget: e.target.value,
            }));
          }}
        />
      </Grid>
      <Grid item md={3} xs={6}>
        <Select
          defaultValue={departementOptions[0]}
          name="colors"
          options={departementOptions}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={(e: any) => {
            setFilter((prevState) => ({
              ...prevState,
              deps: e.value,
            }));
          }}
        />
      </Grid>
      <Grid item md={3} xs={6}>
        <Slider
          valueLabelDisplay="on"
          valueLabelFormat={(value) => timeStampToStrDate(value)}
          aria-label="Small steps"
          //marks={marksDateRange}
          min={minDateRange - 86400000}
          max={maxDateRange + 86400000}
          onChange={(e: any) => {
            setFilter((prevState) => ({
              ...prevState,
              timestamp: e.target.value,
            }));
          }}
        />
      </Grid>
      <Grid item md={3} xs={6}>
        <ButtonModal
          btnLabel="Créer un projet"
          render={(setDisplayModal) => (
            <NewProjectForm
              user={user}
              setDisplayModal={
                setDisplayModal as Dispatch<SetStateAction<boolean>>
              }
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

function _buildSliderData(
  projectList: IProject[],
  iteratee: (item: IProject) => any,
  markIteratee: (arg: IProject) => { value: any; label: any },
  formatter: (arg: IProject) => any
): [number, number, { value: any; label: any }[]] {
  const orderedList = orderBy(projectList, iteratee);
  const marks = orderedList.map(markIteratee);
  const min = first(orderedList) as IProject;
  const max = last(orderedList) as IProject;

  return [formatter(min), formatter(max), marks];
}
