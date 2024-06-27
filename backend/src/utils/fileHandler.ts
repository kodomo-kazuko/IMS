import fs from "fs";
import path from "path";

export const saveFileToDisk = (file: Express.Multer.File, filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, file.buffer, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const getFilePath = (directory: string, file: Express.Multer.File): string => {
  const timestamp = Date.now();
  const { name, ext } = path.parse(file.originalname);
  const customFilename = `${name}_${timestamp}${ext}`;
  const filePath = path.join(directory, customFilename);
  return filePath.replace(/\\/g, "/");
};
