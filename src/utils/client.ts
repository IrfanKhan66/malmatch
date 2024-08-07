import axios from "axios";
import { USER_AGENT, XREQUESTED_HEADER } from "./constant";

const client = axios.create({
  headers: {
    "User-Agent":
      USER_AGENT,
    "X-Requested-With": XREQUESTED_HEADER,
  },
  timeout: 10000,
});

export default client;
