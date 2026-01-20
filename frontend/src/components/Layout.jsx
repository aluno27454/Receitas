import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { authApi } from "../api/auth";
import { useEffect, useState } from "react";

export default function Layout() {
    const [user, setUser] = useState(null);
    const nav = useNavigate();
    const location = useLocation();

    async function refreshWhoAmI() {
        try {
            const u = await authApi.whoami();
            setUser(u); // esperado: { user: "email" } ou { user: "" }
        } catch {
            setUser(null);
        }
    }

    // 1) ao arrancar
    useEffect(() => {
        refreshWhoAmI();
    }, []);

    // 2) sempre que mudas de rota (ex: depois do login)
    useEffect(() => {
        refreshWhoAmI();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    // 3) evento global (vamos disparar no login/register)
    useEffect(() => {
        const handler = () => refreshWhoAmI();
        window.addEventListener("auth-changed", handler);
        return () => window.removeEventListener("auth-changed", handler);
    }, []);

    async function logout() {
        try {
            await authApi.logout(); // ideal: POST /api/AuthenticationApi/logout
        } catch {
            // mesmo que falhe, limpamos UI
        } finally {
            window.dispatchEvent(new Event("auth-changed"));
            nav("/");
        }
    }

    const isLoggedIn = !!user?.user;

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
                <div className="container">
                    <Link className="navbar-brand fw-semibold" to="/">
                        Home
                    </Link>

                    <div className="d-flex align-items-center gap-2">
                        <Link className="btn btn-outline-light btn-sm" to="/admin/recipes">
                            Backoffice
                        </Link>

                        {isLoggedIn ? (
                            <>
              <span className="badge rounded-pill bg-light text-dark d-none d-md-inline">
                {user.user}
              </span>
                                <button className="btn btn-warning btn-sm" onClick={logout}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link className="btn btn-success btn-sm" to="/admin/login">
                                    Login
                                </Link>
                                <Link className="btn btn-outline-light btn-sm" to="/register">
                                    Registar
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <main className="container py-4">
                <Outlet />
            </main>

            <footer className="py-4">
                <div className="container text-muted small d-flex justify-content-between">
                    <span>Receitas</span>
                    <span>Interfaces Web</span>
                </div>
            </footer>
        </>
    );

}
