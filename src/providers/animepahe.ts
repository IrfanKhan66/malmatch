import { AxiosError } from "axios";
import { logger } from "..";
import similarity from "../methods/similarity";
import client from "../utils/client";

const cookie = "__ddgid_=; __ddg2_=;";

interface AnimepaheResponse {
  total: number;
  per_page: number;
  current_page: number;
  data: Array<{
    id: number;
    poster: string;
    title: string;
    episodes: number;
  }>;
}

export default class Animepahe {
  private readonly baseUrl = "https://animepahe.ru";

  async search(title: string): Promise<Pick<Sites, "Animepahe"> | null> {
    try {
      logger.info("Fetching data from animepahe...");

      const resp = await client.get<AnimepaheResponse>(
        `${this.baseUrl}/api?m=search&q=${title}`,
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      const animeList: AnimeInfo[] = resp.data.data.map((anime, i) => ({
        id: anime.id,
        img: anime.poster,
        title: anime.title,
        url: `${this.baseUrl}/a/${anime.id}`,
      }));

      const mostSimilar = similarity(animeList, title);
      return {
        Animepahe: [
          {
            id: animeList[mostSimilar[0].index].id,
            site: "animepahe",
            title: animeList[mostSimilar[0].index].title,
            img: animeList[mostSimilar[0].index].img,
            url: animeList[mostSimilar[0].index].url,
          },
        ],
      };
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        logger.error(
          `Unable to fetch data from animepahe ! error: ${err.message}`
        );
        return null;
      }
      logger.error(`Error at animepahe provider: ${err}`);
      return null;
    }
  }
}
