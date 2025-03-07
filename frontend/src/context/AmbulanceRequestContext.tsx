// src/context/AmbulanceRequestContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import api from "../api";

interface AmbulanceRequest {
  id: string;
  userId: string;
  status: string;
  address: string;
  createdAt: string;
}

interface AmbulanceRequestContextType {
  ambulanceRequests: AmbulanceRequest[];
  resolveRequest: (id: string) => void;
  socket: Socket | null;
}

const AmbulanceRequestContext = createContext<AmbulanceRequestContextType>({
  ambulanceRequests: [],
  resolveRequest: () => {},
  socket: null,
});

export const AmbulanceRequestProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [ambulanceRequests, setAmbulanceRequests] = useState<
    AmbulanceRequest[]
  >([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Fetch ambulance requests
  const fetchAmbulanceRequests = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("Access token not found.");

      const response = await api.get("/api/ambulance-requests", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setAmbulanceRequests(response.data);
    } catch (error) {
      console.error("Error fetching ambulance requests:", error);
    }
  };

  // Resolve an ambulance request
  const resolveRequest = async (id: string) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("Access token not found.");

      await api.patch(
        `/api/ambulance-requests/${id}/resolve`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      // Update the local state
      setAmbulanceRequests((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, status: "RESOLVED" } : request
        )
      );
    } catch (error) {
      console.error("Error resolving ambulance request:", error);
    }
  };

  // Initialize WebSocket connection
  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL);
    setSocket(newSocket);

    // Listen for new ambulance requests
    newSocket.on("new-ambulance-request", (newRequest: AmbulanceRequest) => {
      setAmbulanceRequests((prev) => [newRequest, ...prev]);
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Fetch requests on component mount
  useEffect(() => {
    fetchAmbulanceRequests();
  }, []);

  return (
    <AmbulanceRequestContext.Provider
      value={{ ambulanceRequests, resolveRequest, socket }}
    >
      {children}
    </AmbulanceRequestContext.Provider>
  );
};

export const useAmbulanceRequestContext = () =>
  useContext(AmbulanceRequestContext);
