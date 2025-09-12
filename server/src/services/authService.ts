import type { Request, Response } from "express";
import JWT from "jsonwebtoken";
import type { GetUserTokenPayload } from "./user.ts";
import UserService from "./user.ts";

const JWT_SECRET = process.env.JWT_SECRET || "@JWT_TOKEN";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "your_refresh_token_secret";
const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

export class AuthService {
  public static async getUserToken(
    payload: GetUserTokenPayload,
    res: Response
  ) {
    const { email, password } = payload;
    const user = await UserService.getUserByEmail(email);

    if (!user) throw new Error("User not found");

    const userSalt = user.salt || "";
    const hashedPassword = UserService.generateHash(userSalt, password);

    if (hashedPassword !== user.passwordHash) {
      throw new Error("Incorrect Password");
    }

    const accessToken = JWT.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );

    const refreshToken = JWT.sign(
      { id: user.id, email: user.email },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );

    await UserService.saveRefreshToken(user.id, refreshToken);

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in prod
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { message: "Login successful" };
  }

  public static async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) throw new Error("Refresh token not found");

    try {
      const payload = JWT.verify(refreshToken, REFRESH_TOKEN_SECRET) as {
        id: number;
        email: string;
      };

      // Optional: Check if refresh token exists in DB
      const savedToken = await UserService.getRefreshToken(payload.id);
      if (savedToken !== refreshToken) {
        throw new Error("Invalid refresh token");
      }

      const newAccessToken = JWT.sign(
        { id: payload.id, email: payload.email },
        JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
      );

      res.cookie("access_token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
      });

      return res.json({ message: "Access token refreshed" });
    } catch (err) {
      throw new Error("Invalid refresh token");
    }
  }
}
