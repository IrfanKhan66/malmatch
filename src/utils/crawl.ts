import { logger } from "..";
import { db, saveAnime, updateAnime } from "../methods/db";
import fetchMal from "../methods/fetchMal";
import Zoro from "../providers/zoro";
import Gogo from "../providers/gogo";
import Aniwave from "../providers/aniwave";
import Animepahe from "../providers/animepahe";
import Animefox from "../providers/animefox";
import Yugenanime from "../providers/yugenanime";
import Bilibili from "../providers/bilibili";

interface IDatabase {
  id: number;
  Animefox: string;
  Animepahe: string;
  Aniewave: string;
  Bilibili: string;
  Gogoanime: string;
  Yugenanime: string;
  Zoro: string;
}

const zoro = new Zoro();
const gogo = new Gogo();
const aniwave = new Aniwave();
const animepahe = new Animepahe();
const animefox = new Animefox();
const yugenanime = new Yugenanime();
const bilibili = new Bilibili();

const crawlNupdate = async () => {
  try {
    const data = db.query("SELECT * from MappedAnime").all();
    if (!data || data.length < 1) return logger.info("Database is empty !");

    await update(data as IDatabase[]);
  } catch (err: unknown) {
    logger.error("Failed to get data from db !");
  }
};

const update = async (data: IDatabase[]) => {
  try {
    for (const site of data) {
      const malRes = await fetchMal(site.id);
      if (!malRes.data || malRes.status >= 400) {
        logger.error(
          `Failed to fetch Mal data for id : ${site.id} while updating db !`
        );
        continue;
      }
      const title = malRes.data.title.toLowerCase();
      const resp = await Promise.all([
        animefox.search(title),
        animepahe.search(title),
        // aniwave.search(title),
        bilibili.search(title),
        gogo.search(title),
        yugenanime.search(title),
        zoro.search(title),
      ]);
      const formattedResponse: IResponse = {
        status: 200,
        malId: site.id,
        data: {
          Sites: {
            Animefox: resp[0]?.Animefox || [],
            Animepahe: resp[1]?.Animepahe || [],
            // Aniwave: resp[2]?.Aniwave || [],
            Bilibili: resp[2]?.Bilibili || [],
            Gogoanime: resp[3]?.Gogoanime || [],
            Yugenanime: resp[4]!?.Yugenanime || [],
            Zoro: resp[5]?.Zoro || [],
          },
        },
      };
      await updateAnime(site.id, {
        fields: formattedResponse,
      });
    }
  } catch (err: unknown) {
    logger.error("Failed to update db at crawl.ts !");
  }
};

crawlNupdate()
  .then(() => {
    logger.info("Synced Database !");
  })
  .catch(() => {
    logger.error("Failed to sync Database !");
  });
