import { AxiosError } from "axios";
import { logger } from "..";
import load from "../methods/loadHtml";
import similarity from "../methods/similarity";

export default class Aniwave {
  private readonly baseUrl = "https://aniwave.se";

  async search(title: string): Promise<any| null> {
    try {
      logger.info("Fetching data from aniwave...");

      const $ = await load(
        `${this.baseUrl}/filter?keyword=${title}`,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            "X-Requested-With": "XMLHttpRequest",
          },
        },
        "result"
      );

      const animeList: AnimeInfo[] = $("#list-items .item .inner")
        .map((i, el) => {
          if ($(el).find(".info .b1 > a").text().length > 0) {
            const fId = $(el)
              .find(".info .b1 > a")
              .attr("href")
              ?.split("/")[2] as string;
            const actualId = fId.substring(fId?.lastIndexOf(".") + 1);
            return {
              title: $(el).find(".info .b1 > a").text(),
              img: $(el).children().first().find("a > img").attr("src") || null,
              id: actualId,
              url:
                `${this.baseUrl}${$(el).find(".info .b1 > a").attr("href")}` ||
                null,
            };
          }
        })
        .get();

      const mostSimilar = similarity(animeList, title);
      return {
        Aniwave: [
          {
            id: animeList[mostSimilar[0].index].id,
            site: "aniwave/9anime",
            title: animeList[mostSimilar[0].index].title,
            img: animeList[mostSimilar[0].index].img,
            url: animeList[mostSimilar[0].index].url,
          },
        ],
      };
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        logger.error(
          `Unable to fetch data from aniwave ! error: ${err.message}`
        );
        return null;
      }
      logger.error(`Error at aniwave provider: ${err}`);
      return null;
    }
  }
}
