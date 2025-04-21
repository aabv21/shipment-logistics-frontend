import { AppRouter } from "@/routes";
import { Toaster } from "sonner";
import { WebSocketProvider } from "@/providers/WebSocketProvider";

export function App() {
  return (
    <WebSocketProvider>
      <AppRouter />
      <Toaster richColors position="top-right" />
    </WebSocketProvider>
  );
}
