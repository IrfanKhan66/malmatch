import { AxiosError } from "axios";
import { logger } from "..";
import client from "../utils/client";

const fetchMal = async (id: number) => {
  try {
    const resp = await client.get(
      `${
        process.env.MAL_API_ENDPOINT as string
      }/anime/${id}?fields=id,main_picture,title`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MAL_ACCESS_TOKEN}`,
        },
      }
    );

    return resp.data as IMalRes;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      if (err.status) {
        if (err.status === 401) {
          logger.error("Mal access token expired !");
          logger.info("Refreshing access token !");
          const params = new URLSearchParams();
          params.append("client_id", process.env.MAL_ID as string);
          params.append("client_secret", process.env.MAL_SECRET as string);
          params.append("grant_type", "refresh_token");
          params.append(
            "refresh_token",
            process.env.MAL_REFRESH_TOKEN as string
          );
          try {
            const resp = await client(`${process.env.REFRESH_TOKEN_ENDPOINT}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              params,
            });
            const { access_token, refresh_token } = resp.data;

            process.env.MAL_ACCESS_TOKEN = access_token;
            process.env.MAL_REFRESH_TOKEN = refresh_token;

            logger.info("Access token refreshed & updated successfully !");

            await fetchMal(id);
          } catch (refreshErr: unknown) {
            logger.error(`Failed to refresh access_token ! ${refreshErr}`);
          }
        } else if (err.status === 400)
          logger.error(`Mal request error: ${err.message}`);
        else logger.error("Unknown Axios error at Anilist");
      }
    } else logger.error("Failed to fetch info from Anilist !");
    return null;
  }
};

export default fetchMal;
