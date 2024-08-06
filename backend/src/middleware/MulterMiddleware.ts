import path from "node:path";
import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import type { ResponseJSON } from "../types/response";
import type { allowedFileTypes } from "../types/types";
import { limitSize } from "../utils/const";

const uploadFilter: Record<string, string[]> = {
	images: [".jpg", ".jpeg", ".png"],
	documents: [".pdf", ".doc", ".docx"],
};

const storage = multer.memoryStorage();

const upload = (allowedTypes: allowedFileTypes) => {
	const multerUpload = multer({
		storage,
		limits: {
			fileSize: limitSize,
		},
		fileFilter: (_req, file, cb) => {
			const extension = path.extname(file.originalname).toLowerCase();
			if (!uploadFilter[allowedTypes].includes(extension)) {
				return cb(
					new Error(
						`Invalid file type. Supported formats: ${uploadFilter[allowedTypes].join(", ")}.`,
					),
				);
			}
			cb(null, true);
		},
	}).single("file");

	return (req: Request, res: Response<ResponseJSON>, next: NextFunction) => {
		multerUpload(req, res, (err) => {
			if (err instanceof multer.MulterError) {
				console.log(err);
				return res
					.status(500)
					.json({ success: false, message: (err as Error).message });
			}
			if (err) {
				return res.status(400).json({ success: false, message: err.message });
			}

			if (!req.file) {
				return res
					.status(400)
					.json({ success: false, message: "No file uploaded." });
			}

			const { name, ext } = path.parse(req.file.originalname);
			const uniqueFilename = `${name}_${uuidv4()}${ext}`;

			req.file.filename = uniqueFilename;
			next();
		});
	};
};

export default upload;
