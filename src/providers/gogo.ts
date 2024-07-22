import { AxiosError } from "axios";
import { logger } from "..";
import load from "../methods/loadHtml";
import similarity from "../methods/similarity";

export default class Gogo {
  private readonly baseUrl = "https://anitaku.pe";

  async search(title: string): Promise<Pick<Sites, "Gogoanime"> | null> {
    try {
      logger.info("Fetching data from gogoanime...");

      const $ = await load(`${this.baseUrl}/search.html?keyword=${title}`);

      const animeList: AnimeInfo[] = $(".main_body .last_episodes .items li")
        .map((i, el) => ({
          title: $(el).find(".name a").text(),
          img: $(el).find(".img > a img").attr("src") || null,
          id: $(el).find(".img > a").attr("href")?.split("/")[2] as string,
          url: `${this.baseUrl}${$(el).find(".img > a").attr("href")}` || null,
        }))
        .get();

      const mostSimilar = similarity(animeList, title);
      const secondMostSimilar = similarity(animeList, `${title} dub`);

      return {
        Gogoanime: [
          {
            id: animeList[mostSimilar[0].index].id,
            site: "gogoanime",
            title: animeList[mostSimilar[0].index].title,
            img: animeList[mostSimilar[0].index].img,
            url: animeList[mostSimilar[0].index].url,
          },
          {
            id: animeList[secondMostSimilar[0].index].id,
            site: "gogoanime",
            title: animeList[secondMostSimilar[0].index].title,
            img: animeList[secondMostSimilar[0].index].img,
            url: animeList[secondMostSimilar[0].index].url,
          },
        ],
      };
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        logger.error("Unable to fetch data from goganime !");
        return null;
      }
      logger.error(`Error at goganime provider: ${err}`);
      return null;
    }
  }
}
