import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAuth() {
    const { user, loading } = useAuth();

    if (loading) return <div className="container py-4">A verificar sessão...</div>;

    // se não houver user, manda para login
    if (!user) return <Navigate to="/admin/login" replace />;

    return <Outlet />;
}
