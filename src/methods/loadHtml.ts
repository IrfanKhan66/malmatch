import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { load as cheerio_load, CheerioAPI } from "cheerio";

const load = async (url: string, config?: AxiosRequestConfig) => {
  try {
    const resp = await axios.get(url, {
      ...config,
    });
    let cheerio_func: CheerioAPI;
    if (typeof resp.data !== "object") cheerio_func = cheerio_load(resp.data);
    else cheerio_func = cheerio_load(resp.data.html);
    return cheerio_func;
  } catch (err: unknown) {
    throw err;
  }
};

export default load;
