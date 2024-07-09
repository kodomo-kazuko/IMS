import fs from "fs";
import path from "path";
import { allowedFileTypes } from "../types/types";

const FILE_PATH = process.env.FILE_PATH;

const rootUploadsPath = path.join(__dirname, `../${FILE_PATH}`);

export const saveFileToDisk = async (
  file: Express.Multer.File,
  allowedTypes: allowedFileTypes
): Promise<void> => {
  try {
    const { filename } = file;
    const subfolder = allowedTypes;
    const filePath = path.join(rootUploadsPath, subfolder, filename);

    await fs.promises.writeFile(filePath, file.buffer);
  } catch (error) {
    throw error;
  }
};
