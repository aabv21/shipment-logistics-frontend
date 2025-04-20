import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PublicRoute } from "@/components/auth/PublicRoute";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

// Public Pages
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";

// Protected Pages
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { ProfilePage } from "@/pages/dashboard/ProfilePage";
import { CreateShipmentPage } from "@/pages/shipments/CreateShipmentPage";

const router = createBrowserRouter([
  // Public routes
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },

  // Protected routes
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "shipments",
        element: <CreateShipmentPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
