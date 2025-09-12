import { Server as SocketIOServer } from "socket.io";
import http from "http";

export function initSocket(server: http.Server) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("send_message", (data) => {
      console.log("Message received:", data);
      io.emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
}
