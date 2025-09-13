import { prismaClient } from "../lib/db.ts";
import { io } from "../socket/socket.ts";

export interface SendMessageInput {
  senderId: string;
  receiverEmail: string;
  content?: string;
  mediaUrl?: string;
}

export default class MessageService {
  static async sendDirectMessage({
    senderId,
    receiverEmail,
    content,
    mediaUrl,
  }: SendMessageInput) {
    const sender = await prismaClient.user.findUnique({
      where: { id: Number(senderId) },
    });
    const receiver = await prismaClient.user.findUnique({
      where: { email: receiverEmail },
    });

    if (!sender) throw new Error("Sender not found");
    if (!receiver) throw new Error("Receiver not found");

    let chat = await prismaClient.chat.findFirst({
      where: {
        isGroup: false,
        participants: {
          every: { userId: { in: [sender.id, receiver.id] } },
        },
      },
      include: { participants: true },
    });

    if (!chat) {
      chat = await prismaClient.chat.create({
        data: {
          isGroup: false,
          participants: {
            create: [{ userId: sender.id }, { userId: receiver.id }],
          },
        },
        include: { participants: true },
      });
    }

    const message = await prismaClient.message.create({
      data: {
        chatId: chat.id,
        senderId: sender.id,
        content,
        mediaUrl,
      },
      include: { sender: true },
    });

    const messages = await prismaClient.message.findMany({
      where: { chatId: chat.id },
      orderBy: { sentAt: "asc" },
      include: { sender: true },
    });

    io.to(`user_${sender.id}`).emit("receive_direct_message", messages);
    io.to(`user_${receiver.id}`).emit("receive_direct_message", messages);

    return message;
  }

  static async getDirectMessages(senderId: number, receiverEmail: string) {
    const receiver = await prismaClient.user.findUnique({
      where: { email: receiverEmail },
    });
    if (!receiver) throw new Error("Receiver not found");

    const chat = await prismaClient.chat.findFirst({
      where: {
        isGroup: false,
        participants: { every: { userId: { in: [senderId, receiver.id] } } },
      },
    });

    if (!chat) return [];

    return prismaClient.message.findMany({
      where: { chatId: chat.id },
      orderBy: { sentAt: "asc" },
      include: { sender: true },
    });
  }

  static async getMessagesBetweenUsers(
    senderEmail: string,
    receiverEmail: string
  ) {
    // Find sender and receiver
    const sender = await prismaClient.user.findUnique({
      where: { email: senderEmail },
    });
    const receiver = await prismaClient.user.findUnique({
      where: { email: receiverEmail },
    });

    if (!sender) throw new Error("Sender not found");
    if (!receiver) throw new Error("Receiver not found");

    // Find 1-to-1 chat
    const chat = await prismaClient.chat.findFirst({
      where: {
        isGroup: false,
        participants: {
          some: { userId: sender.id },
        },
      },
      include: { participants: true },
    });

    // Check if the chat also contains the receiver
    if (!chat || !chat.participants.some((p) => p.userId === receiver.id)) {
      return [];
    }

    // Fetch all messages in this chat, including sender info
    const messages = await prismaClient.message.findMany({
      where: { chatId: chat.id },
      orderBy: { sentAt: "asc" },
      include: { sender: true },
    });

    return messages;
  }
}
