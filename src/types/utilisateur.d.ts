export interface IUtilisateur {
  /**
   * MongoDb ObjectId
   */
  _id?: string;
  /**
   * User name
   */
  nom: string;
  /**
   * user first name
   */
  prenom: string;
  /**
   * User email
   */
  email: string;

  password: string;
  /**
   * User phone
   */
  tel: string;
  /**
   * All user submitted project
   */
  projets?: any[]; // update with Projets

  token?: string;
}

export interface IPrestataire extends IUtilisateur {
  siren: string;
  adresseSociale: string;
  statutJuridique: string;
  propositionDevis?: string[];
}
