import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-ink">
        <p className="font-mono text-sm text-concrete">Checking session…</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
