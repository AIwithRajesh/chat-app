import { Server as SocketIOServer } from "socket.io";
import http from "http";

// Global variable to hold io instance
let io: SocketIOServer;

export function initSocket(server: http.Server) {
  io = new SocketIOServer(server, {
    path: "/api/socket_io",
    cors: {
      origin: "http://localhost:3000", // your frontend URL
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join_user", (userId: number) => {
      socket.join(`user_${userId}`);
      console.log(`Socket ${socket.id} joined user room ${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
}

// Export io so other modules can use it
export { io };
