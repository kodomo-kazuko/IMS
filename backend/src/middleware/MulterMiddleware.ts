import multer from "multer";
import path from "path";
import { Request, Response, NextFunction } from "express";
import { ResponseJSON } from "../types/response";
import { allowedFileTypes } from "../types/types";
import { v4 as uuidv4 } from "uuid"; // Import UUID library

const limitSize: number = 5000000;

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
    fileFilter: (req, file, cb) => {
      const extension = path.extname(file.originalname).toLowerCase();
      if (!uploadFilter[allowedTypes].includes(extension)) {
        return cb(new Error(`Invalid file type. Supported formats: ${uploadFilter[allowedTypes].join(", ")}.`));
      }
      cb(null, true);
    },
  }).single("file");

  return (req: Request, res: Response<ResponseJSON>, next: NextFunction) => {
    multerUpload(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        console.log(err);
        return res.status(500).json({ success: false, message: (err as Error).message });
      } else if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded." });
      }

      const { name, ext } = path.parse(req.file.originalname);
      const uniqueFilename = `${name}_${uuidv4()}${ext}`;

      req.file.filename = uniqueFilename;
      next();
    });
  };
};

export default upload;
