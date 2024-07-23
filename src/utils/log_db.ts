import { logger } from "..";
import { db } from "../methods/db";

const logDb = () => {
  try {
    const data = db.query("SELECT * FROM MappedAnime").all();
    console.log(data);
  } catch (err: unknown) {
    logger.error("Failed to log db !");
  }
};

logDb();
