import express from "express";
import { deleteTodoController } from "../../controllers/deleteTodoController";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = express.Router();

router.delete("/deleteTodo/:id", authMiddleware, deleteTodoController);

export default router;
