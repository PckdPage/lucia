// import { Request, Response, NextFunction } from "express";
// import { AccessTokenData, RefreshTokenData } from "../types";
// import jwt from "jsonwebtoken";
// import { PrismaClient } from "@prisma/client";
// import { setAccess } from "../utils/authFunctions";

// const prisma = new PrismaClient();

// export const authMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { id: accessToken, rid: refreshToken } = req.cookies;

//     if (accessToken) {
//       try {
//         const user = jwt.verify(
//           accessToken,
//           process.env.ACCESS_TOKEN_SECRET as string
//         ) as AccessTokenData;
//         req.user = user;
//         return next();
//       } catch (error: any) {}
//     }

//     if (!refreshToken) {
//       return res.status(401).json({ message: "UNAUTHORIZED" });
//     }

//     let refreshTokenData: RefreshTokenData;
//     try {
//       refreshTokenData = jwt.verify(
//         refreshToken,
//         process.env.REFRESH_TOKEN_SECRET as string
//       ) as RefreshTokenData;
//     } catch (error: any) {
//       console.error("Refresh token verification failed:", error.message);
//       return res.status(401).json({ message: "UNAUTHORIZED" });
//     }

//     const userDb = await prisma.user.findUnique({
//       where: { googleId: refreshTokenData.googleId },
//     });

//     if (
//       !userDb ||
//       refreshTokenData.refreshTokenVersion !== userDb.refreshTokenVersion
//     ) {
//       return res.status(401).json({ message: "UNAUTHORIZED" });
//     }
//     setAccess(res, refreshTokenData.googleId);

//     req.user = { googleId: refreshTokenData.googleId };

//     next();
//   } catch (error: any) {
//     console.error("Authentication error:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

//eta bata

import { Request, Response, NextFunction } from "express";
import { AccessTokenData, RefreshTokenData } from "../types";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { setAccess } from "../utils/authFunctions";

const prisma = new PrismaClient();

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id: accessToken, rid: refreshToken } = req.cookies;

    if (accessToken) {
      try {
        const user = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET as string
        ) as AccessTokenData;
        req.user = user;
        return next();
      } catch (error: any) {
        console.error("Access token verification failed:", error.message);
      }
    }

    if (!refreshToken) {
      return res.status(401).json({ message: "UNAUTHORIZED" });
    }

    let refreshTokenData: RefreshTokenData;
    try {
      refreshTokenData = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as RefreshTokenData;
    } catch (error: any) {
      console.error("Refresh token verification failed:", error.message);
      return res.status(401).json({ message: "UNAUTHORIZED" });
    }

    const userDb = await prisma.user.findUnique({
      where: { googleId: refreshTokenData.googleId },
    });

    if (
      !userDb ||
      refreshTokenData.refreshTokenVersion !== userDb.refreshTokenVersion
    ) {
      return res.status(401).json({ message: "UNAUTHORIZED" });
    }

    setAccess(res, refreshTokenData.googleId, refreshTokenData.email);

    req.user = { googleId: refreshTokenData.googleId };

    next();
  } catch (error: any) {
    console.error("Authentication error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
