import ENV from "@/pages/api/config/env";
import axios from "axios";

const $request = axios.create({
  baseURL: `${ENV.clientUrl}/api`,
  timeout: 5000,
});

export default $request;
