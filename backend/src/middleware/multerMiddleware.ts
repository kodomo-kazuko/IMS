import multer from "multer";
import path from "path";
import { Request, Response, NextFunction } from "express";

// Define extension-to-folder mapping
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
  // If no matching category found, log a warning (optional)
  console.warn(`Unknown file extension: ${extension}`);
  return "other";
};

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Function) => {
    const uploadDir = path.join(__dirname, "../uploads");
    const extension = path.extname(file.originalname).toLowerCase();
    const subdirectory = getSubdirectory(extension);
    cb(null, path.join(uploadDir, subdirectory));
  },
  filename: (req: Request, file: Express.Multer.File, cb: Function) => {
    const timestamp = Date.now();
    const { name, ext } = path.parse(file.originalname); // Split the filename
    const customFilename = `${name}_${timestamp}${ext}`;
    cb(null, customFilename);
  },
});

// Create the combined Multer middleware
const upload = (allowedTypes: "images" | "documents") => {
  const multerUpload = multer({ storage }).single(allowedTypes);

  return (req: Request, res: Response, next: NextFunction) => {
    multerUpload(req, res, (err: any) => {
      if (err) {
        return res.status(500).json({ error: err as Error });
      }
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Construct the complete file path
      const extension = path.extname(req.file.originalname).toLowerCase();
      const subdirectory = getSubdirectory(extension);
      const filePath = path.join("/uploads", subdirectory, req.file.filename).replace(/\\/g, "/");

      // Store the file path in the request object
      req.url = filePath;

      next();
    });
  };
};

export default upload;
