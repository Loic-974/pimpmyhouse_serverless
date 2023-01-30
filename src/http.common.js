import axios from "axios";
//https://eu-central-1.aws.data.mongodb-api.com/app/application-0-wgnei/endpoint/signUpUser
//http://localhost:8080
export default axios.create({
  baseURL:
    "https://eu-central-1.aws.data.mongodb-api.com/app/application-0-wgnei/endpoint",
  headers: {
    "Content-type": "application/json",
  },
});

export const expressAxios = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-type": "application/json",
  },
});

export const REALM_APP_DEV_CREDENTIAL = {
  email: "loic.rabat@live.fr",
  password: "azerty",
};
