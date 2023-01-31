import axios from "axios";

export interface IDeps {
  code: string;
  nom: string;
  codeRegion: string;
}

export interface ICity {
  nom: string;
  code: string;
  codeDepartement: string;
  siren: string;
  codeEpci: string;
  codeRegion: string;
  codesPostaux: string[];
  population: number;
}

export async function getDepartementByName(name: string) {
  const depsCall = await axios.get(
    name
      ? `https://geo.api.gouv.fr/departements?nom=${name}`
      : `https://geo.api.gouv.fr/departements`
  );
  const data: IDeps[] = depsCall.data;

  return data;
}

export async function getDepartementByCode(code: string) {
  const depsCall = await axios.get(
    code
      ? `https://geo.api.gouv.fr/departements?code=${code}`
      : `https://geo.api.gouv.fr/departements`
  );
  const data: IDeps[] = depsCall.data;

  return data;
}

export async function getCitiesByDepsCode(depsCode: string, cityName: string) {
  const depsCall = await axios.get(
    !depsCode
      ? `https://geo.api.gouv.fr/communes?limit=15`
      : cityName
      ? `https://geo.api.gouv.fr/communes?nom=${cityName}&codeDepartement=${depsCode}&limit=15`
      : `https://geo.api.gouv.fr/departements/${depsCode}/communes?limit=15`
  );
  const data: ICity[] = depsCall.data;
  return data;
}

export async function getCityByCodePostal(
  codePostal: string
): Promise<ICity[]> {
  const depsCall = await axios.get(
    codePostal
      ? `https://geo.api.gouv.fr/communes?codePostal=${codePostal}`
      : `https://geo.api.gouv.fr/communes?limit=15`
  );
  const data: ICity[] = depsCall.data;

  return data;
}
