import multer from "multer";
import path from "path";
import { Request, Response, NextFunction } from "express";
import { ResponseJSON } from "../types/response";

const uploadFilter: Record<string, string[]> = {
  images: [".jpg", ".jpeg", ".png"],
  documents: [".pdf", ".doc", ".docx"],
};

const getSubdirectory = (extension: string): string => {
  const normalizedExtension = extension.toLowerCase();
  for (const category in uploadFilter) {
    if (uploadFilter[category].includes(normalizedExtension)) {
      return category;
    }
  }
  throw new Error(`Unsupported file extension: ${extension}`);
};

const storage = multer.memoryStorage();

const upload = (allowedTypes: "images" | "documents") => {
  const multerUpload = multer({
    storage,
    limits: {
      fileSize: 5000000,
    },
  }).single("file");

  return (req: Request, res: Response<ResponseJSON>, next: NextFunction) => {
    multerUpload(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
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

      req.url = extension;
      next();
    });
  };
};

export default upload;
