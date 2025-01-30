import { exec } from "child_process";
import { promisify } from "util";
import logger from "./logger.js";

const execAsync = promisify(exec);

export const createDatabaseBackup = async () => {
  const backupCommand = `pg_dump ${process.env.DATABASE_URL} > backup.sql`;

  try {
    await execAsync(backupCommand);
    logger.info("Database backup created successfully");
    return true;
  } catch (error) {
    logger.error(`Backup failed: ${error.message}`);
    return false;
  }
};
