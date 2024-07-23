import path from "path";
import { Database } from "bun:sqlite";
import { logger } from "..";

const dbPath = path.join(__dirname, "../../src/db/mapped.sqlite");

const db = new Database(dbPath, { create: true });

export const initTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS MappedAnime (
        id INTEGER PRIMARY KEY,
        Animefox TEXT,
        Animepahe TEXT,
        Aniwave TEXT,
        Bilibili TEXT,
        Gogoanime TEXT,
        Yugenanime TEXT,
        Zoro  TEXT
    )    
`);
  logger.info("Created table in database");
};

export const saveAnime = (resp: IResponse) => {
  try {
    const { malId, data } = resp;

    db.run(
      `
        INSERT INTO MappedAnime (id, Animefox, Animepahe, Aniwave, Bilibili, Gogoanime, Yugenanime, Zoro)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        malId,
        JSON.stringify(data?.Sites.Animefox),
        JSON.stringify(data?.Sites.Animepahe),
        JSON.stringify(data?.Sites.Aniwave),
        JSON.stringify(data?.Sites.Bilibili),
        JSON.stringify(data?.Sites.Gogoanime),
        JSON.stringify(data?.Sites.Yugenanime),
        JSON.stringify(data?.Sites.Zoro),
      ]
    );

    logger.info(`Saved id: ${malId} to database`);
  } catch (err: unknown) {
    logger.error(`Error occured while inserting in database: ${err}`);
    return null;
  }
};

export const getAnime = (id: number) => {
  const query = db.query(`SELECT * FROM MappedAnime WHERE id = ?`);
  const data = query.get(id);
  if (!data) return null;

  return data;
};
