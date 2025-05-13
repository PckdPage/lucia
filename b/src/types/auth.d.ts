export interface UserTokenData {
  googleId: string;
}

export interface AccessTokenData {
  googleId: string;
  email;
}

export interface RefreshTokenData {
  googleId: string;
  email;
  refreshTokenVersion: number;
}
