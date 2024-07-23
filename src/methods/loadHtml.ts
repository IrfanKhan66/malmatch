import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { load as cheerio_load, CheerioAPI } from "cheerio";

const load = async (url: string, config?: AxiosRequestConfig) => {
  try {
    let resp!: AxiosResponse<any, any>;
    resp = await axios.get(url, {
      ...config,
    });
    let cheerio_func: CheerioAPI;
    cheerio_func = cheerio_load(resp.data);
    return cheerio_func;
  } catch (err: unknown) {
    throw err;
  }
};

export default load;
