import axios from "axios";

const $http = axios.create({
  baseURL: "https://api.paystack.co",
  timeout: 5000,
  headers: {
    Authorization: `Bearer ${process.env.PS_TEST_SEC}`,
  },
});

export default $http;
