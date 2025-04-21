import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";

interface HistoryUpdateData {
  shipment_id: string;
  status: string;
  notes: string;
  location_latitude: string;
  location_longitude: string;
  location_formatted_address: string;
  location_place_id: string;
  created_at: string;
}

interface WebSocketContextType {
  isConnected: boolean;
  onHistoryUpdate: (callback: (data: HistoryUpdateData) => void) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token, user } = useAuthStore();
  const historyCallbackRef = useRef<((data: HistoryUpdateData) => void) | null>(
    null
  );

  useEffect(() => {
    if (!token || !user?.id) return;

    const socket = io(import.meta.env.VITE_WS_URL || "http://localhost:3000", {
      auth: { token },
      path: "/socket.io",
    });

    socket.on("connect", () => {
      console.log("Socket.IO connected");
      setIsConnected(true);
      toast.success("Conectado al servidor de notificaciones");
      socket.emit("register", user.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket.IO disconnected");
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
      toast.error("Error en la conexión de notificaciones");
    });

    socket.on(`history-created-${user.id}`, (data: HistoryUpdateData) => {
      historyCallbackRef.current?.(data);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, user?.id]);

  const onHistoryUpdate = (callback: (data: HistoryUpdateData) => void) => {
    historyCallbackRef.current = callback;
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, onHistoryUpdate }}>
      {children}
    </WebSocketContext.Provider>
  );
}
