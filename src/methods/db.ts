import path from "path";
import { Database } from "bun:sqlite";
import { logger } from "..";

const dbPath = path.join(__dirname, "../../src/db/mapped.sqlite");

export const db = new Database(dbPath, { create: true });

export const initTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS MappedAnime (
        id INTEGER PRIMARY KEY,
        Animefox TEXT,
        Animepahe TEXT,
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
        INSERT INTO MappedAnime (id, Animefox, Animepahe, Bilibili, Gogoanime, Yugenanime, Zoro)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        malId,
        JSON.stringify(data?.Sites.Animefox),
        JSON.stringify(data?.Sites.Animepahe),
        // JSON.stringify(data?.Sites.Aniwave),
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

export const updateAnime = async (
  id: number,
  { fields }: { fields: IResponse | IResponse[] }
) => {
  try {
    const updateQuery = (id: number, sites: Sites) => {
      return db
        .query(
          "UPDATE MappedAnime SET Animefox = $animefox, Animepahe = $animepahe, Bilibili = $bilibili, Gogoanime = $gogoanime, Yugenanime = $yugenanime, Zoro = $zoro WHERE id = $id"
        )
        .run({
          $id: id,
          $animefox: JSON.stringify(sites.Animefox),
          $animepahe: JSON.stringify(sites.Animepahe),
          // $aniwave: JSON.stringify(sites.Aniwave),
          $bilibili: JSON.stringify(sites.Bilibili),
          $gogoanime: JSON.stringify(sites.Gogoanime),
          $yugenanime: JSON.stringify(sites.Yugenanime),
          $zoro: JSON.stringify(sites.Zoro),
        });
    };

    if (Array.isArray(fields)) {
      for (const field of fields) {
        logger.info(`Updating id: ${id} in db...`);
        if (field.data) await updateQuery(id, field.data?.Sites);
      }
    } else {
      logger.info(`Updating id: ${id} in db...`);
      if (fields.data) await updateQuery(id, fields.data.Sites);
    }

    logger.info("Successfully updated db !");
  } catch (err: unknown) {
    logger.error("Failed to update db at db.ts !", err);
  }
};
