import { useEffect } from "react";
import { useWebSocket } from "@/providers/WebSocketProvider";
import { toast } from "sonner";
import { Shipment } from "@/types/shipment";

interface WebSocketNotification {
  type: "shipment_status_updated" | "new_shipment" | "shipment_deleted";
  message: string;
  data?: {
    shipment?: Shipment;
    shipmentId?: string;
    newStatus?: Shipment["status"];
  };
}

export function useWebSocketNotifications() {
  const { isConnected, send } = useWebSocket();

  useEffect(() => {
    if (!isConnected) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const notification = JSON.parse(event.data) as WebSocketNotification;

        switch (notification.type) {
          case "shipment_status_updated":
            toast.info(notification.message);
            break;
          case "new_shipment":
            toast.success(notification.message);
            break;
          case "shipment_deleted":
            toast.error(notification.message);
            break;
          default:
            console.warn("Unknown notification type:", notification.type);
        }
      } catch (error) {
        console.error("Error parsing WebSocket notification:", error);
      }
    };

    // Subscribe to notifications
    send({ type: "subscribe_notifications" });

    // Add message listener
    window.addEventListener("message", handleMessage);

    return () => {
      // Unsubscribe from notifications
      send({ type: "unsubscribe_notifications" });
      window.removeEventListener("message", handleMessage);
    };
  }, [isConnected, send]);
}
