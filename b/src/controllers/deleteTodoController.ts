import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { z } from "zod";
import { User } from "@prisma/client";

const deleteParamSchema = z.object({
  id: z.string().uuid({ message: "Invalid id" }),
});

export const deleteTodoController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const data = deleteParamSchema.safeParse(req.params);
  if (!data.success) {
    return res.status(400).json({
      message: "Invalid parameters",
      errors: data.error.format(),
    });
  }
  const id = data.data.id;
  try {
    const deletedInstance = await prisma.todo.delete({
      where: {
        id: id,
      },
    });

    if (!deletedInstance) {
      return res.status(404).json({ message: "Todo not found" });
    }
    return res.status(200).json({ message: "Todo deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
