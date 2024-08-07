import { AxiosError } from "axios";
import { logger } from "..";
import load from "../methods/loadHtml";
import similarity from "../methods/similarity";

export default class Zoro {
  private readonly baseUrl = "https://hianime.to";

  async search(title: string): Promise<Pick<Sites, "Zoro"> | null> {
    try {
      logger.info("Fetching data from zoro...");

      const $ = await load(`${this.baseUrl}/search?keyword=${title}`);
      console.log(`Zoro: ${$(".film_list-wrap .flw-item").first().html()}`);

      const animeList: AnimeInfo[] = $(".film_list-wrap .flw-item")
        .map((i, el) => ({
          id: $(el)
            .find(".film-poster a")
            .attr("href")
            ?.split("/")[2] as string,
          url: `${this.baseUrl}${$(el).find(".film-poster a").attr("href")}`,
          img: $(el).find(".film-poster img").data("src") as string | null,
          title: $(el).find(".film-detail .film-name a").text() as string,
        }))
        .get();

      const mostSimilar = similarity(animeList, title);

      return {
        Zoro: [
          {
            id: animeList[mostSimilar[0].index].id,
            title: animeList[mostSimilar[0].index].title,
            site: "zoro",
            img: animeList[mostSimilar[0].index].img,
            url: animeList[mostSimilar[0].index].url,
          },
        ],
      };
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        logger.error(`Unable to fetch data from zoro ! error: ${err.message}`);
        return null;
      }
      logger.error(`Error at zoro provider: ${err}`);
      return null;
    }
  }
}
