import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
