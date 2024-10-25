import fs from "node:fs";
import path from "node:path";
import express, {
	type Request,
	type Response,
	type NextFunction,
} from "express";
import type { ResponseJSON } from "../types/response";

const FILE_PATH = process.env.FILE_PATH;

export default class UploadController {
	public async single(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			const decodedUrl = decodeURIComponent(req.url);
			const filePath = path.join(__dirname, `../${FILE_PATH}`, decodedUrl);

			fs.stat(filePath, (err, stats) => {
				if (err) {
					console.error("File stat error:", err);
					res.status(404).json({ success: false, message: "File not found" });
				}

				if (!stats.isFile()) {
					res
						.status(400)
						.json({ success: false, message: "Requested path is not a file" });
				}

				const stream = fs.createReadStream(filePath);

				res.setHeader(
					"Content-Type",
					express.static.mime.lookup(filePath) || "application/octet-stream",
				);
				res.setHeader("Content-Length", stats.size);

				stream.pipe(res);

				stream.on("error", (streamErr) => {
					console.error("Stream error:", streamErr);
					if (!res.headersSent) {
						res
							.status(500)
							.json({ success: false, message: "Error streaming file" });
					}
				});

				res.on("finish", () => {
					stream.destroy();
				});

				res.on("close", () => {
					stream.destroy();
				});
			});
		} catch (error) {
			next(error);
		}
	}
}
