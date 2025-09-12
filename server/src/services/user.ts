import { createHmac, randomBytes } from "node:crypto";
import { prismaClient } from "../lib/db.ts";
import JWT from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "@JWT_TOKEN";

export interface userInterface {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  passwordHash: string;
  salt: string;
  phoneNumber: string;
}

export interface GetUserTokenPayload {
  email: string;
  password: string;
}

class UserService {
  public static generateHash(salt: string, password: string) {
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    return hashedPassword;
  }

  public static async saveRefreshToken(
    userId: number,
    refreshToken: string
  ): Promise<void> {
    await prismaClient.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  public static async getRefreshToken(userId: number): Promise<string | null> {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: { refreshToken: true },
    });

    return user?.refreshToken || null;
  }

  public static createUser(payload: userInterface) {
    const { firstName, lastName, username, email, passwordHash, phoneNumber } =
      payload;
    const salt = randomBytes(32).toString();
    const hashedPassword = this.generateHash(salt, passwordHash);

    return prismaClient.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        passwordHash: hashedPassword,
        salt: salt,
        phoneNumber,
      },
    });
  }

  public static getUserByEmail(email: string) {
    return prismaClient.user.findUnique({ where: { email } });
  }
}

export default UserService;
