import UserService, { type userInterface } from "../../../services/user.ts";
import MessageService from "../../../services/messageService.ts";

export const mutation = {
  Mutation: {
    createUser: async (_: any, payload: userInterface) => {
      const res = await UserService.createUser(payload);
      return res.id;
    },

    sendDirectMessage: async (
      _: any,
      {
        senderId,
        receiverEmail,
        content,
        mediaUrl,
      }: {
        senderId: string;
        receiverEmail: string;
        content: string;
        mediaUrl?: any; // optional
      }
    ) => {
      return await MessageService.sendDirectMessage({
        senderId,
        receiverEmail,
        content,
        mediaUrl, // can be undefined
      });
    },
  },
};
