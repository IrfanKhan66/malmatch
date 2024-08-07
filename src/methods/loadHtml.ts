import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { load as cheerio_load, CheerioAPI } from "cheerio";

const load = async (
  url: string,
  config?: AxiosRequestConfig,
  field?: string
) => {
  try {
    let resp!: AxiosResponse<any, any>;
    resp = await axios.get(url, {
      ...config,
    });
    let cheerio_func: CheerioAPI;
    if (typeof resp.data === "object" && field) {
      cheerio_func = cheerio_load(resp.data[field]);
    } else cheerio_func = cheerio_load(resp.data);
    console.log(`At loadHtml.ts Response: ${resp.data}, Response status: ${resp.status}`);
    return cheerio_func;
  } catch (err: unknown) {
    console.error(`At loadHtml.ts Error: ${err}`);
    throw err;
  }
};

export default load;
