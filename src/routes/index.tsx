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
import { ShipmentsPage } from "@/pages/shipments/ShipmentsPage";
import { CreateShipmentPage } from "@/pages/shipments/CreateShipmentPage";
import { TrackingPage } from "@/pages/shipments/TrackingPage";
import { CarriersPage } from "@/pages/carriers/CarriersPage";
import { RoutesPage } from "@/pages/routes/RoutesPage";

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
        path: "shipments/tracking/:id",
        element: <TrackingPage />,
      },
      {
        path: "shipments",
        element: <ShipmentsPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "shipments/create",
        element: <CreateShipmentPage />,
      },
      {
        path: "carriers",
        element: <CarriersPage />,
      },
      {
        path: "routes",
        element: <RoutesPage />,
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
