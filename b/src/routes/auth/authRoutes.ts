// import express from "express";
// import { authMiddleware } from "../../middlewares/authMiddleware";
// import { clearAuthCookies } from "../../utils/authFunctions";

// const router = express.Router();

// router.post("/logout", (req, res) => {
//   clearAuthCookies(res);

//   res.status(200).json({ message: "Logged out successfully" });
// });

// router.get("/verify", authMiddleware, (req, res) => {
//   res.status(200).json(req.user);
// });

// export default router;

//eta bata

import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { clearAuthCookies } from "../../utils/authFunctions";
import passport from "passport";
import { setAuthCookies } from "../../utils/authFunctions";
import { User } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  (req, res) => {
    const user = req.user as User;

    setAuthCookies(res, user?.googleId, user?.refreshTokenVersion, user?.email);
    res.redirect(`${process.env.FRONTEND_URL}/`);
  }
);

router.post("/logout", (req, res) => {
  clearAuthCookies(res);

  res.status(200).json({ message: "Logged out successfully" });
});

router.get("/verify", authMiddleware, (req, res) => {
  res.status(200).json(req.user);
});

export default router;
