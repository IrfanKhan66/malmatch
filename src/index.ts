import { Hono } from "hono";
import winston, { format } from "winston";
import fetchAnilistInfo from "./methods/fetchAnilistInfo";
import Zoro from "./providers/zoro";
import t from "./methods/normalize";
import Gogo from "./providers/gogo";
import Aniwave from "./providers/aniwave";
import Animepahe from "./providers/animepahe";
import Animefox from "./providers/animefox";
import Yugenanime from "./providers/yugenanime";
import Bilibili from "./providers/bilibili";
import { db, getAnime, initTable, saveAnime } from "./methods/db";

const app = new Hono();
const { colorize, combine, timestamp, simple } = format;

const loggerColors = {
  error: "red",
  info: "blue",
  warn: "orange",
  debug: "yellow",
};

export const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: combine(
    timestamp(),
    colorize({
      colors: loggerColors,
    }),
    simple()
  ),
});

initTable();

const zoro = new Zoro();
const gogo = new Gogo();
const aniwave = new Aniwave();
const animepahe = new Animepahe();
const animefox = new Animefox();
const yugenanime = new Yugenanime();
const bilibili = new Bilibili();

app.get("/", (c) => {
  return c.text("Hey there !");
});

app.get("/anime/:id", async (c) => {
  const { id } = c.req.param();
  // Check for id in DB
  const isSaved: any = getAnime(Number(id));
  if (isSaved) {
    return c.json(
      {
        status: 200,
        anilistId: isSaved.id,
        malId: isSaved.malId,
        data: {
          Sites: {
            Animefox: JSON.parse(isSaved.Animefox),
            Animepahe: JSON.parse(isSaved.Animepahe),
            Aniwave: JSON.parse(isSaved.Aniwave),
            Bilibili: JSON.parse(isSaved.Bilibili),
            Gogoanime: JSON.parse(isSaved.Gogoanime),
            Yugenanime: JSON.parse(isSaved.Yugenanime),
            Zoro: JSON.parse(isSaved.Zoro),
          },
        },
      } satisfies IResponse,
      200
    );
  }

  const info = await fetchAnilistInfo(Number(id));
  if (!info)
    return c.json(
      {
        status: 429,
        anilistId: Number(id),
        malId: Number(id),
        error: "Rate limited !",
      } satisfies IResponse,
      429
    );
  const title = t(info.title);
  const resp = await Promise.all([
    animefox.search(title),
    animepahe.search(title),
    aniwave.search(title),
    bilibili.search(title),
    gogo.search(title),
    yugenanime.search(title),
    zoro.search(title),
  ]);
  const finalResponse: IResponse = {
    status: 200,
    anilistId: Number(id),
    malId: Number(id),
    data: {
      Sites: {
        Animefox: resp[0]?.Animefox || [],
        Animepahe: resp[1]?.Animepahe || [],
        Aniwave: resp[2]?.Aniwave || [],
        Bilibili: resp[3]?.Bilibili || [],
        Gogoanime: resp[4]?.Gogoanime || [],
        Yugenanime: resp[5]!?.Yugenanime || [],
        Zoro: resp[6]?.Zoro || [],
      },
    },
  };
  saveAnime(finalResponse);
  return c.json(finalResponse, 200);
});

app.get("*", (c) => {
  return c.text("404");
});

export default app;
