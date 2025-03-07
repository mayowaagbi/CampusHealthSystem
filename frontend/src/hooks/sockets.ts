import { io, Socket } from "socket.io-client";

// Initialize the socket connection
const socket: Socket = io("http://localhost:3000", {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

// Register the user with their ID based on their role
export const registerSocket = (role: string, userId: string) => {
  socket.on("connect", () => {
    console.log("Socket connected!");

    if (role === "STUDENT") {
      const studentDetailsId = localStorage.getItem("studentDetailsId");
      if (studentDetailsId) {
        socket.emit("register-user", studentDetailsId);
      }
    } else if (role === "PROVIDER") {
      if (userId) {
        socket.emit("register-provider", userId);
      }
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Socket disconnected!");
  });
};

export default socket;
