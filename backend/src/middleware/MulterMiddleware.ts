import multer from "multer";
import path from "path";
import { Request, Response, NextFunction } from "express";
import { ResponseJSON } from "../types/response";
import { allowedFileTypes } from "../types/types";

const uploadFilter: Record<string, string[]> = {
  images: [".jpg", ".jpeg", ".png"],
  documents: [".pdf", ".doc", ".docx"],
};

const limitSize: number = 5000000;

const generateUniqueFilename = (): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(7);
  return `${timestamp}-${randomString}`;
};

const storage = multer.memoryStorage();

const upload = (allowedTypes: allowedFileTypes) => {
  const multerUpload = multer({
    storage,
    limits: {
      fileSize: limitSize,
    },
  }).single("file");

  return (req: Request, res: Response<ResponseJSON>, next: NextFunction) => {
    multerUpload(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        console.log(err);
        return res.status(500).json({ success: false, message: (err as Error).message });
      } else if (err) {
        return res.status(500).json({ success: false, message: "File upload failed." });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded." });
      }

      const extension = path.extname(req.file.originalname).toLowerCase();
      if (!uploadFilter[allowedTypes].includes(extension)) {
        return res.status(400).json({
          success: false,
          message: `Invalid file type. Supported formats: ${uploadFilter[allowedTypes].join(", ")}.`,
        });
      }

      const uniqueFilename = req.file.originalname;
      req.url = uniqueFilename;
      next();
    });
  };
};

export default upload;
