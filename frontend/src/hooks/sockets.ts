import { io, Socket } from "socket.io-client";

let socket: Socket;

/**
 * Get the Socket.IO instance (singleton pattern)
 * @returns {Socket} The Socket.IO instance
 */
export const getSocket = (): Socket => {
  if (!socket) {
    // Get token with error handling
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.error("No access token found. User must be authenticated.");
      throw new Error("No access token found. User must be authenticated.");
    }

    console.log(
      "Initializing socket with token:",
      token.substring(0, 10) + "..."
    );

    // Create socket with both transports and proper auth
    socket = io("http://localhost:3000", {
      path: "/socket.io/",
      transports: ["websocket", "polling"],
      autoConnect: false,
      auth: {
        token: token,
      },
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    // Enhanced logging
    socket.on("connect", () => {
      console.log("Socket.IO connected successfully:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error.message);
      console.error("Error details:", error);

      // Log authentication status
      const token = localStorage.getItem("accessToken");
      console.log("Current token available:", !!token);
    });

    socket.once("connect", () => {
      console.log("Requesting initial notifications");
      socket.emit("getInitialNotifications");
    });
    socket.on("disconnect", (reason) => {
      console.log("Socket.IO disconnected:", reason);

      if (reason === "io server disconnect") {
        // Server disconnected us, try reconnecting
        console.log(
          "Server disconnected the socket, attempting to reconnect..."
        );
        socket.connect();
      }
    });

    // Debug events
    socket.on("error", (error) => {
      console.error("Socket.IO error:", error);
    });

    socket.io.on("reconnect", (attempt) => {
      console.log(`Socket.IO reconnected after ${attempt} attempts`);
    });

    socket.io.on("reconnect_attempt", (attempt) => {
      console.log(`Socket.IO reconnection attempt: ${attempt}`);

      // Refresh token on reconnect attempts
      const freshToken = localStorage.getItem("accessToken");
      if (freshToken) {
        socket.auth = { token: freshToken };
        socket.io.opts.extraHeaders = {
          Authorization: `Bearer ${freshToken}`,
        };
      }
    });
  }

  return socket;
};

/**
 * Connect the Socket.IO instance if not already connected
 */
export const connectSocket = (): void => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.error("Cannot connect Socket.IO: No access token found.");
      return;
    }

    const socket = getSocket();

    if (!socket.connected) {
      console.log(
        "Connecting socket with token:",
        token.substring(0, 10) + "..."
      );

      // Ensure auth is set with latest token before connecting
      socket.auth = { token };

      // Connect socket
      socket.connect();

      // Verify connection after a short delay
      setTimeout(() => {
        if (!socket.connected) {
          console.warn("Socket still not connected after connection attempt");
        } else {
          console.log("Socket connection verified");
        }
      }, 2000);
    } else {
      console.log("Socket already connected:", socket.id);
    }
  } catch (error) {
    console.error("Error in connectSocket:", error);
  }
};

/**
 * Register the user with the Socket.IO server based on their role
 * @param {string} role - The user's role ("STUDENT" or "PROVIDER")
 * @param {string} id - The user's ID
 */
export const registerSocket = (
  role: "STUDENT" | "PROVIDER",
  id: string
): void => {
  try {
    const socket = getSocket();

    const register = () => {
      if (role === "STUDENT") {
        socket.emit("register-student", id);
        console.log(`Registered student ${id}`);
      } else if (role === "PROVIDER") {
        socket.emit("register-provider", id);
        console.log(`Registered provider ${id}`);
      } else {
        console.error("Invalid role for Socket.IO registration:", role);
      }
    };

    if (socket.connected) {
      register();
    } else {
      console.log("Socket not connected, setting up one-time connect listener");
      socket.once("connect", register);

      // Make sure socket is connecting
      if (!socket.connected) {
        connectSocket();
      }
    }
  } catch (error) {
    console.error("Error in registerSocket:", error);
  }
};
