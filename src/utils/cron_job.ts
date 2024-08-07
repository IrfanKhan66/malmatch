import axios, { AxiosError } from "axios";
import { logger } from ".."

const cron = () => {
    const API_URL = process.env.API_URL || "http://localhost:3000/";
    if(process.env.HOSTING_PROVIDER !== "render") return;
    try {
        setInterval( async () => {
            logger.info("Cron job running !");
            await axios.get(API_URL);
        }, 14 * 60 * 1000)
    } catch(err: unknown) {
        if(err instanceof AxiosError) {
            logger.error(`Failed to run cron job axios error : ${err.message}`);
        }
        logger.error(`Failed to run cron job: ${err}`);
    }
}

export default cron;