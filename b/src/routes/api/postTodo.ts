import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { postTodoController } from "../../controllers/postTodoController";

const router = express.Router();

router.post("/postTodo", authMiddleware, postTodoController);

export default router;
