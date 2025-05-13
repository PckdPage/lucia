import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const passportConfig = () =>
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: "/auth/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await prisma.user.findUnique({
            where: { googleId: profile.id },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                googleId: profile.id,
                username: profile.displayName,
                email: profile.emails?.[0]?.value!,
                profilePic: profile.photos?.[0]?.value!,
                refreshTokenVersion: 1,
              },
            });
            //   console.log("User created:", user);
          }
          // else {
          //   console.log("User Already Exists:", user);
          // }

          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
