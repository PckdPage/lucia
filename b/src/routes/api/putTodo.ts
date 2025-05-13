import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { putTodoController } from "../../controllers/putTodoController";

const router = express.Router();

router.put("/putTodo", authMiddleware, putTodoController);

export default router;
