import { __prod__ } from "../constants";
import { Response } from "express";
import jwt from "jsonwebtoken";

export const cookieOpts = {
  httpOnly: true,
  secure: __prod__,
  sameSite: "lax",
  path: "/",
  domain: __prod__ ? `.${process.env.FRONTEND_URL}` : "",
  maxAge: 1000 * 60 * 60 * 24 * 365,
} as const;

export const setAuthCookies = (
  res: Response,
  googleId: string,
  refreshTokenVersion: number,
  email: string
) => {
  const accessToken = jwt.sign(
    { googleId, email },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "15min" }
  );

  const refreshToken = jwt.sign(
    { googleId, email, refreshTokenVersion },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "30d" }
  );
  res.cookie("id", accessToken, cookieOpts);
  res.cookie("rid", refreshToken, cookieOpts);
};

export const setAccess = (res: Response, googleId: string, email: string) => {
  const accessToken = jwt.sign(
    { googleId, email },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "15min" }
  );

  res.cookie("id", accessToken, cookieOpts);
};

export const clearAuthCookies = (res: Response) => {
  const { maxAge, ...cookieOptions } = cookieOpts;

  res.clearCookie("id", cookieOptions);
  res.clearCookie("rid", cookieOptions);
};
