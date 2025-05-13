import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { z } from "zod";
import { User } from "@prisma/client";

const bodySchema = z.object({
  id: z.string(),
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

export const putTodoController = async (
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

  const { id, dueDate, category, priority, title, description } = data.data;

  const { googleId } = req.user as User;

  try {
    const existingTodo = await prisma.todo.findFirst({
      where: { id, user: { googleId } },
    });

    if (!existingTodo) {
      return res
        .status(403)
        .json({ message: "Unauthorized or Todo not found" });
    }
    const newTodo = await prisma.todo.update({
      where: {
        id,
      },
      data: {
        dueDate,
        priority,
        category,
        title,
        description,
      },
    });

    return res.status(200).json({ message: "Todo Updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
