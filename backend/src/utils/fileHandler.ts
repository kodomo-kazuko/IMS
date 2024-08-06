import fs from "node:fs";
import path from "node:path";
import type { allowedFileTypes } from "../types/types";

const FILE_PATH = process.env.FILE_PATH;

const rootUploadsPath = path.join(__dirname, `../${FILE_PATH}`);

export const saveFileToDisk = async (
	file: Express.Multer.File,
	allowedTypes: allowedFileTypes,
): Promise<void> => {
	try {
		const { filename } = file;
		const subfolder = allowedTypes;
		const filePath = path.join(rootUploadsPath, subfolder, filename);

		await fs.promises.writeFile(filePath, file.buffer);
	} catch (error) {
		throw new Error();
	}
};

export const deleteFileOnDisk = async (
	filename: string,
	subfolder: allowedFileTypes,
): Promise<void> => {
	try {
		const filePath = path.join(rootUploadsPath, subfolder, filename);
		await fs.promises.unlink(filePath);
	} catch (error) {
		throw new Error();
	}
};
