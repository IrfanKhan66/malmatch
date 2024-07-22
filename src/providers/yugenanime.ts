import { AxiosError } from "axios";
import { logger } from "..";
import load from "../methods/loadHtml";
import similarity from "../methods/similarity";

export default class Yugenanime {
  private readonly baseUrl = "https://yugenanime.tv";

  async search(title: string): Promise<Pick<Sites, "Yugenanime"> | null> {
    try {
      logger.info("Fetching data from yugenanime...");

      const $ = await load(`${this.baseUrl}/discover/?q=${title}`);

      const animeList: AnimeInfo[] = $(".cards-grid a")
        .map((i, el) => ({
          title: $(el).find(".anime-data .anime-name").text().trim(),
          img:
            ($(el)
              .find(".anime-poster__container > img")
              .data("src") as string) || null,
          id: $(el).attr("href")?.split("/")[2] as string,
          url: `${this.baseUrl}${$(el).attr("href")}` || null,
        }))
        .get();

      const mostSimilar = similarity(animeList, title);

      return {
        Yugenanime: [
          {
            id: animeList[mostSimilar[0].index].id,
            site: "yugenanime",
            title: animeList[mostSimilar[0].index].title,
            img: animeList[mostSimilar[0].index].img,
            url: animeList[mostSimilar[0].index].url,
          },
        ],
      };
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        logger.error("Unable to fetch data from yugenanime !");
        return null;
      }
      logger.error(`Error at yugenanime provider: ${err}`);
      return null;
    }
  }
}
