import { AxiosError } from "axios";
import { logger } from "..";
import client from "../utils/client";
import { ANILIST_BASE, ANILIST_QUERY } from "../utils/constant";

const fetchAnilistInfo = async (id: number) => {
  try {
    const resp = await client.post(ANILIST_BASE, {
      query: ANILIST_QUERY,
      variables: {
        id,
      },
    });

    const data: IAnilistRes = resp.data.data.Media;

    return data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      if (err.status) {
        if (err.status === 429) logger.error("Anilist rate limit exceeded !");
        else if (err.status === 400)
          logger.error(`Anilist query error: ${err.message}`);
        else logger.error("Unknown Axios error at Anilist");
      }
    } else logger.error("Failed to fetch info from Anilist !");
    return null;
  }
};

export default fetchAnilistInfo;
