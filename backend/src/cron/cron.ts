import cron from "node-cron";
import {
  updateInternshipStatusToActive,
  updateInternshipStatusToFinished,
} from "./studentInternshipCron";
import logger from "../logs/logger";

// Schedule the cron jobs to run at midnight every day
cron.schedule("0 0 * * *", async () => {
  try {
    await updateInternshipStatusToActive();
    await updateInternshipStatusToFinished();
  } catch (error) {
    logger.error("Error in cron job execution:", error);
  }
});
