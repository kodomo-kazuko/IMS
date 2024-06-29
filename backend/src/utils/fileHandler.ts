import fs from "fs";
import path from "path";
import { allowedFileTypes } from "../types/types";

const FILE_PATH = process.env.FILE_PATH;

const rootUploadsPath = path.join(__dirname, `../${FILE_PATH}`);

export const saveFileToDisk = async (file: Express.Multer.File, allowedTypes: allowedFileTypes): Promise<void> => {
  try {
    const { name, ext } = path.parse(file.originalname);
    const customFilename = `${name}${ext}`;
    const subfolder = allowedTypes;
    const filePath = path.join(rootUploadsPath, subfolder, customFilename);

    await fs.promises.writeFile(filePath, file.buffer);
  } catch (error) {
    throw error;
  }
};
