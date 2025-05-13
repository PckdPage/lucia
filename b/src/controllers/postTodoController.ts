import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { z } from "zod";
import { User } from "@prisma/client";

import { scheduleReminder } from "../utils/scheduler/queue";

const bodySchema = z.object({
  dueDate: z
    .string()
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val)),
  // category: z.enum(["Work", "Personal", "Shopping"]),
  category: z.string(),
  priority: z.enum(["High", "Medium", "Low"]),

  title: z.string(),
  description: z.string(),
});

export const postTodoController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const data = bodySchema.safeParse(req.body);
  if (!data.success) {
    return res.status(400).json({
      message: "Invalid query parameters",
      errors: data.error.format(),
    });
  }

  const { dueDate, category, priority, title, description } = data.data;

  const { googleId, email } = req.user as User;
  const addedDate = new Date();

  try {
    const newTodo = await prisma.todo.create({
      data: {
        addedDate,
        user: {
          connect: { googleId },
        },
        dueDate,
        priority,
        category,
        title,
        description,
      },
    });

    // const remindAt = new Date(dueDate.getTime() - 15 * 60 * 1000);
    // const cronTime = `${remindAt.getMinutes()} ${remindAt.getHours()} ${remindAt.getDate()} ${
    //   remindAt.getMonth() + 1
    // } *`;
    console.log("email", email, "title", title, "dueDate", dueDate);
    scheduleReminder(email, title, new Date(dueDate));

    return res.status(200).json({ message: "New Todo Added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
