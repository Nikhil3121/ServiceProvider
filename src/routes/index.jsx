// src/routes/index.jsx
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import PageLoader from "@/components/ui/PageLoader";

// ── Layouts ───────────────────────────────────────────────────────────────
import PublicLayout from "@/layouts/PublicLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import AuthLayout from "@/layouts/AuthLayout";

// ── Lazy Pages ───────────────────────────────────────────────────────────
const HomePage = lazy(() => import("@/pages/HomePage"));
const ServicesPage = lazy(() => import("@/pages/services/ServicesPage"));
const ServiceDetail = lazy(() => import("@/pages/services/ServiceDetail"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const SignupPage = lazy(() => import("@/pages/auth/SignupPage"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPasswordPage"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPasswordPage"));
const VerifyEmail = lazy(() => import("@/pages/auth/VerifyEmailPage"));
const VerifyOTP = lazy(() => import("@/pages/auth/VerifyOTPPage"));

const DashboardHome = lazy(() => import("@/pages/user/DashboardPage"));
const ProfilePage = lazy(() => import("@/pages/user/ProfilePage"));
const ChangePassword = lazy(() => import("@/pages/user/ChangePasswordPage"));

const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("@/pages/admin/AdminUsers"));
const AdminContacts = lazy(() => import("@/pages/admin/AdminContacts"));
const AdminServices = lazy(() => import("@/pages/admin/AdminServices"));
const AdminServiceForm = lazy(() => import("@/pages/admin/AdminServiceForm"));

// ── Guards ────────────────────────────────────────────────────────────────
const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};

const GuestRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

// ── Wrap with Suspense ────────────────────────────────────────────────────
const S = ({ children }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public routes ── */}
      <Route element={<PublicLayout />}>
        <Route
          path="/"
          element={
            <S>
              <HomePage />
            </S>
          }
        />
        <Route
          path="/services"
          element={
            <S>
              <ServicesPage />
            </S>
          }
        />
        <Route
          path="/services/:slug"
          element={
            <S>
              <ServiceDetail />
            </S>
          }
        />
        <Route
          path="/contact"
          element={
            <S>
              <ContactPage />
            </S>
          }
        />
      </Route>

      {/* ── Auth routes (guest only) ── */}
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route
            path="/auth/login"
            element={
              <S>
                <LoginPage />
              </S>
            }
          />
          <Route
            path="/auth/signup"
            element={
              <S>
                <SignupPage />
              </S>
            }
          />
          <Route
            path="/auth/forgot-password"
            element={
              <S>
                <ForgotPassword />
              </S>
            }
          />
          <Route
            path="/auth/reset-password"
            element={
              <S>
                <ResetPassword />
              </S>
            }
          />
        </Route>
      </Route>

      {/* ── Email verification (public) ── */}
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/auth/verify-otp" element={<VerifyOTP />} />

      {/* ── Protected user routes ── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={
              <S>
                <DashboardHome />
              </S>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <S>
                <ProfilePage />
              </S>
            }
          />
          <Route
            path="/dashboard/change-password"
            element={
              <S>
                <ChangePassword />
              </S>
            }
          />
        </Route>
      </Route>

      {/* ── Admin routes ── */}
      <Route element={<ProtectedRoute requiredRole="admin" />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/admin"
            element={
              <S>
                <AdminDashboard />
              </S>
            }
          />
          <Route
            path="/admin/users"
            element={
              <S>
                <AdminUsers />
              </S>
            }
          />
          <Route
            path="/admin/contacts"
            element={
              <S>
                <AdminContacts />
              </S>
            }
          />
          <Route
            path="/admin/services"
            element={
              <S>
                <AdminServices />
              </S>
            }
          />
          <Route
            path="/admin/services/new"
            element={
              <S>
                <AdminServiceForm />
              </S>
            }
          />
          <Route
            path="/admin/services/:id/edit"
            element={
              <S>
                <AdminServiceForm />
              </S>
            }
          />
        </Route>
      </Route>

      {/* ── 404 ── */}
      <Route
        path="*"
        element={
          <S>
            <NotFoundPage />
          </S>
        }
      />
    </Routes>
  );
}
