// context/GlobalStateContext.tsx
import React, { createContext, useContext, useState } from "react";

// Define the shape of the global state
type GlobalState = {
  user: {
    id: string;
    name: string;
    isLoggedIn: boolean;
  } | null;
  notifications: string[];
  setUser: (user: GlobalState["user"]) => void;
  addNotification: (message: string) => void;
};

// Default values
const defaultState: GlobalState = {
  user: null,
  notifications: [],
  setUser: () => {},
  addNotification: () => {},
};

const GlobalStateContext = createContext<GlobalState>(defaultState);

export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<GlobalState["user"]>(null);
  const [notifications, setNotifications] = useState<string[]>([]);

  const addNotification = (message: string) => {
    setNotifications((prev) => [...prev, message]);
  };

  return (
    <GlobalStateContext.Provider
      value={{ user, notifications, setUser, addNotification }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

// Custom hook for accessing the global state
export const useGlobalState = () => useContext(GlobalStateContext);
