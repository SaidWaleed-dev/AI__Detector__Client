import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../../components/DashboardLayout";
import { lazy, Suspense } from "react";
import ProtectedRoute from "../components/common/ProtectedRoute";
import { Loader2 } from "lucide-react";

const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const VerifyAccount = lazy(() => import("../pages/VerifyAccount"));
const Home = lazy(() => import("../../pages/Home"));
const DetectorInterface = lazy(
  () => import("../../components/DetectorInterface"),
);
const History = lazy(() => import("../../pages/History"));

const fallback = (
  <div
    style={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      justifyContent: "center",
      alignItems: "center",
      background: "var(--bg-page)",
    }}
  >
    <Loader2 className="animate-spin" size={48} color="var(--accent-primary)" />
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={fallback}>
            <Home />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={fallback}>
            <DetectorInterface />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/history",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={fallback}>
            <History />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: (
          <Suspense fallback={fallback}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={fallback}>
            <Register />
          </Suspense>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <Suspense fallback={fallback}>
            <ForgotPassword />
          </Suspense>
        ),
      },
      {
        path: "reset-password",
        element: (
          <Suspense fallback={fallback}>
            <ResetPassword />
          </Suspense>
        ),
      },
      {
        path: "verify-account",
        element: (
          <Suspense fallback={fallback}>
            <VerifyAccount />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
