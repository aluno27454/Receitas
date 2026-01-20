import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authApi } from "../api/auth";

export default function RequireAuth() {
    const [loading, setLoading] = useState(true);
    const [ok, setOk] = useState(false);

    useEffect(() => {
        authApi
            .whoami()
            .then(() => setOk(true))
            .catch(() => setOk(false))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="container py-4">A verificar sessão...</div>;
    if (!ok) return <Navigate to="/admin/login" replace />;

    return <Outlet />;
}
