import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ResponseJSON } from "../types/response";
import { jwtSecretKey } from "../utils/const";
import { prisma } from "../middleware/PrismMiddleware";
import { AccountType } from "@prisma/client";
import { validatePassword } from "../utils/PasswordValidate";
import notFound from "../utils/not-found";
import { saveFileToDisk } from "../utils/fileHandler";

const account: AccountType = "company";

export default class CompanyController {
  public async signup(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { name, email, password, phone, address, weburl } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.company.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phone,
          address,
          weburl,
        },
      });
      res.status(201).json({ success: true, message: "Company registered successfully" });
    } catch (error) {
      next(error);
    }
  }

  public async signin(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const company = await prisma.company.findUniqueOrThrow({
        where: { email },
        omit: {
          password: false,
        },
      });

      notFound(company, "company");

      await validatePassword(password, company.password, res);

      const access = !company.isApproved;

      const token = jwt.sign({ id: company.id, account, access: Number(access) }, jwtSecretKey, {
        expiresIn: "7d",
      });
      res.status(200).json({ success: true, message: "Authentication successful", data: token });
    } catch (error) {
      next(error);
    }
  }

  public async base(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const companies = await prisma.company.findMany({
        where: {
          name: {
            search: req.query.name ? String(req.query.name) : undefined,
          },
        },
      });
      res.status(200).json({
        success: true,
        message: "Companies retrieved successfully",
        data: companies,
      });
    } catch (error) {
      next(error);
    }
  }

  public async cursor(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const companies = await prisma.company.findMany({
        cursor: {
          id: Number(req.params.id),
        },
        where: {
          name: {
            search: req.query.name ? String(req.query.name) : undefined,
          },
        },
        skip: 1,
      });
      res.status(200).json({
        success: true,
        message: "Companies retrieved successfully",
        data: companies,
      });
    } catch (error) {
      next(error);
    }
  }

  public async approve(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      await prisma.company.update({
        where: { id: Number(req.params.id) },
        data: { isApproved: true },
      });
      res.status(200).json({ success: true, message: "Company approval updated successfully" });
    } catch (error) {
      next(error);
    }
  }
  public async account(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const company = await prisma.company.findUnique({
        where: {
          id: req.cookies.id,
        },
      });
      res.status(200).json({ success: true, message: "company details retrieved", data: company });
    } catch (error) {
      next(error);
    }
  }
  public async uploadImage(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      await prisma.company.findUniqueOrThrow({
        where: {
          id: req.cookies.id,
          image: null,
        },
      });
      notFound(req.file, "image");
      await prisma.company.update({
        where: {
          id: req.cookies.id,
        },
        data: {
          image: req.file.filename,
        },
      });

      await saveFileToDisk(req.file, "images");
      res.status(200).json({ success: true, message: "image uploaded" });
    } catch (error) {
      next(error);
    }
  }
  public async count(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const companyCount = await prisma.company.count();
      return res
        .status(200)
        .json({ success: true, message: "company count retrieved", data: companyCount });
    } catch (error) {
      next(error);
    }
  }
  public async single(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const company = await prisma.company.findUnique({
        where: {
          id: Number(req.params.id),
        },
      });
      res.status(200).json({ success: true, message: "company retrieved", data: company });
    } catch (error) {
      next(error);
    }
  }
  public async score(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const companies: any = await prisma.company.findMany({
        where: {
          id: req.query.id ? Number(req.query.id) : undefined,
        },
        select: {
          id: true,
          image: true,
          name: true,
          internships: {
            select: {
              students: {
                select: {
                  Feedback: {
                    select: {
                      score: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const array = companies.list;

      console.log(array);

      const companyScores = array.map(
        (company: { internships: any[]; id: any; name: any; image: any }) => {
          let totalScore = 0;
          let feedbackCount = 0;

          company.internships.forEach((internship) => {
            internship.students.forEach((student: { Feedback: any[] }) => {
              student.Feedback.forEach((feedback) => {
                totalScore += feedback.score;
                feedbackCount += 1;
              });
            });
          });

          const averageScore = feedbackCount > 0 ? totalScore / feedbackCount : 0;

          return {
            id: company.id,
            name: company.name,
            image: company.image,
            averageScore,
          };
        }
      );

      res.status(200).json({
        success: true,
        message: "Company scores retrieved",
        data: {
          lastId: companies.length > 0 ? companies[companies.length - 1].id : null,
          list: companyScores,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
