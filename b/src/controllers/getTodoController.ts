import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { z } from "zod";
import { User } from "@prisma/client";

const filterParamSchema = z.object({
  // category: z.enum(["Work", "Personal", "Shopping"]),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
});

export const getTodoController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const data = filterParamSchema.safeParse(req.query);
  if (!data.success) {
    return res.status(400).json({
      message: "Invalid query parameters",
      errors: data.error.format(),
    });
  }

  // const { category, priority } = data.data;
  const { priority } = data.data;

  const { googleId } = req.user as User;

  const filterCriteria: any = {};

  // if (category) filterCriteria.category = category;
  if (priority) filterCriteria.priority = priority;

  try {
    const userObj = await prisma.user.findUnique({
      where: { googleId },
      include: {
        Todo: {
          where: filterCriteria,
        },
        // Todo: true,
      },
    });

    return res.json(userObj);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
