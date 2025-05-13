import { UserTokenData } from "./auth";
declare global {
  namespace Express {
    interface Request {
      user?: UserTokenData;
    }
  }
}

export * from "./auth";
