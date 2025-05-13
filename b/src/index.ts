import express, { Response, Request } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import authRoutes from "./routes/auth/authRoutes";
import api from "./routes/api";

import { passportConfig } from "./passport";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (origin === process.env.FRONTEND_URL || !origin) {
        callback(null, true);
      } else {
        callback(new Error("CORS error"));
      }
    },

    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("AAAAAAAAAAHHHHHHHHHHHH");
});

app.use(passport.initialize());
passportConfig();

app.use("/auth", authRoutes);
api.forEach((route: any) => app.use("/api", route));

app.listen(port, () => {
  console.log(`PORTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT ${port}`);
});
