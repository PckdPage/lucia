import express from "express";
import { getTodoController } from "../../controllers/getTodoController";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = express.Router();

router.get("/getTodo", authMiddleware, getTodoController);

export default router;
