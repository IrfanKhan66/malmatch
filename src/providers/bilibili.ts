import { AxiosError } from "axios";
import { logger } from "..";
import load from "../methods/loadHtml";
import similarity from "../methods/similarity";

export default class Bilibili {
  private readonly baseUrl = "https://bilibili.tv/en";

  async search(title: string): Promise<Pick<Sites, "Bilibili"> | null> {
    try {
      logger.info("Fetching data from bilibili...");

      const $ = await load(`${this.baseUrl}/search-result?q=${"demon slayer"}`);

      const animeList: AnimeInfo[] = $(".ogv-card__list li")
        .map((i, el) => ({
          title: $(el)
            .find(".ogv__content > a")
            .text()
            .trim()
            .substring(
              0,
              $(el).find(".ogv__content > a").text().trim().length - 8
            ),
          img:
            $(el).find(".ogv__cover-wrap .ogv__cover > a > img").attr("src") ||
            null,
          id: $(el)
            .find(".ogv__cover-wrap .ogv__cover > a")
            .attr("href")
            ?.split("/")[3] as string,
          url:
            `${this.baseUrl}${$(el)
              .find(".ogv__cover-wrap .ogv__cover > a")
              .attr("href")}` || null,
        }))
        .get();

      if (animeList.length === 0) return null;

      const mostSimilar = similarity(animeList, title);

      if (mostSimilar[0].similarity < 8) return null;

      return {
        Bilibili: [
          {
            id: animeList[mostSimilar[0].index].id,
            site: "bilibili",
            title: animeList[mostSimilar[0].index].title,
            img: animeList[mostSimilar[0].index].img,
            url: animeList[mostSimilar[0].index].url,
          },
        ],
      };
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        logger.error(`Unable to fetch data from bilibili ! ${err.message}`);
        return null;
      }
      logger.error(`Error at bilibili provider: ${err}`);
      return null;
    }
  }
}
