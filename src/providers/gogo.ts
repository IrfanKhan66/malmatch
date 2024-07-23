import { AxiosError } from "axios";
import { logger } from "..";
import load from "../methods/loadHtml";
import similarity from "../methods/similarity";

export default class Gogo {
  private readonly baseUrl = "https://anitaku.pe";

  async search(title: string): Promise<Pick<Sites, "Gogoanime"> | null> {
    try {
      logger.info("Fetching data from gogoanime...");

      const $ = await load(`${this.baseUrl}/search.html?keyword=${title}`, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      const animeList: AnimeInfo[] = $("body .list_search_ajax")
        .map((i, el) => ({
          title: $(el).find("a").text().trim(),
          img:
            $(el)
              .find("a > div")
              .attr("style")
              ?.match(/url\(\'(.*)\'\);/)?.[1] || null,
          id: $(el).find("a").attr("href")?.split("/")[2] as string,
          url: `${this.baseUrl}${$(el).find("a").attr("href")}` || null,
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
        logger.error(
          `Unable to fetch data from gogoanime ! error: ${err.message}`
        );
        return null;
      }
      logger.error(`Error at goganime provider: ${err}`);
      return null;
    }
  }
}
