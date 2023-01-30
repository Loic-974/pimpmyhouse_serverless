export interface IBaseProject {
  libelleProjet: string;
  dateCreation: Date;
  dateDebut: Date;
  budgetMoyen: number;
  details: string;
  imgUrlProjet: string;
  codeDepartement: string;
  villeProjet: string;
}

export interface IProject extends IBaseProject {
  isActive: boolean;
  userId: string;
  numDevis: string[];
}
