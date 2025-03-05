import { io } from "socket.io-client";

// Connect to the Socket.IO server
const socket = io("http://localhost:3000", {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

// Register the student with their ID
socket.on("connect", () => {
  console.log("Socket connected!");
  const studentDetailsId = localStorage.getItem("studentDetailsId"); // Ensure this is set during login
  if (studentDetailsId) {
    socket.emit("register-user", studentDetailsId);
  }
});

// Handle disconnection
socket.on("disconnect", () => {
  console.log("Socket disconnected!");
});

export default socket;
