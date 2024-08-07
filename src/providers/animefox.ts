import { AxiosError } from "axios";
import { logger } from "..";
import load from "../methods/loadHtml";
import similarity from "../methods/similarity";

export default class Animefox {
  private readonly baseUrl = "https://animefox.in";

  async search(title: string): Promise<Pick<Sites, "Animefox"> | null> {
    try {
      logger.info("Fetching data from animefox...");

      const $ = await load(`${this.baseUrl}/anime?search-keywords=${title}`);
      console.log(`Animefox: ${$(".film_list-wrap .flw-item").first().html()}`);

      const animeList: AnimeInfo[] = $(".film_list-wrap .flw-item")
        .map((i, el) => ({
          id: $(el)
            .find(".film-poster a")
            .attr("href")
            ?.split("/")[3] as string,
          url: `${this.baseUrl}${$(el).find(".film-poster a").attr("href")}`,
          img: $(el).find(".film-poster img").data("src") as string | null,
          title: $(el).find(".film-detail .film-name a").text() as string,
        }))
        .get();

      const mostSimilar = similarity(animeList, title);
      const secondMostSimilar = similarity(animeList, `${title} dub`);

      return {
        Animefox: [
          {
            id: animeList[mostSimilar[0].index].id,
            site: "animefox",
            title: animeList[mostSimilar[0].index].title,
            img: animeList[mostSimilar[0].index].img,
            url: animeList[mostSimilar[0].index].url,
          },
          {
            id: animeList[secondMostSimilar[0].index].id,
            site: "animefox",
            title: animeList[secondMostSimilar[0].index].title,
            img: animeList[secondMostSimilar[0].index].img,
            url: animeList[secondMostSimilar[0].index].url,
          },
        ],
      };
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        logger.error(
          `Unable to fetch data from animefox ! error: ${err.message}`
        );
        return null;
      }
      logger.error(`Error at animefox provider: ${err}`);
      return null;
    }
  }
}
