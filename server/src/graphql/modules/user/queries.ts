import { gql } from "graphql-tag";
import { AuthService } from "../../../services/authService.ts";
import type { Request, Response } from "express";
import MessageService from "../../../services/messageService.ts";
import UserService from "../../../services/user.ts";

export const queries = {
  Query: {
    hello: () => "Hello GraphQL 🚀",
    getUserToken: async (
      _: any,
      payload: { email: string; password: string },
      context: { req: Request; res: Response }
    ) => {
      if (!context.res)
        throw new Error("Response object is missing in context");
      const token = await AuthService.getUserToken(payload, context.res);

      return token;
    },
    getMessagesBetweenUsers: async (
      _: any,
      {
        senderEmail,
        receiverEmail,
      }: { senderEmail: string; receiverEmail: string }
    ) => {
      try {
        return await MessageService.getMessagesBetweenUsers(
          senderEmail,
          receiverEmail
        );
      } catch (err) {
        console.error("Error fetching messages:", err);
        return [];
      }
    },
    getUserListWithConversation: async (_: any, __: any, context: any) => {
      try {
        const currentUserId = Number(context.userId);
        console.log("id", currentUserId);
        if (!currentUserId) throw new Error("User not authenticated");
        return await UserService.getUserListWithConversation(currentUserId);
      } catch (err) {
        console.error("error", err);
        return [];
      }
    },
  },
};
