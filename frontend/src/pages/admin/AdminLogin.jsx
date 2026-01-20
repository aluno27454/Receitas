import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth";

export default function AdminLogin() {
    const nav = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setErr("");

        if (!email.trim()) return setErr("Email é obrigatório.");
        if (!password) return setErr("Password é obrigatória.");

        setLoading(true);
        try {
            await authApi.login(email.trim(), password);
            window.dispatchEvent(new Event("auth-changed")); // <- faz aparecer Logout
            nav("/admin/recipes");
        } catch (e) {
            setErr(e?.message || "Login inválido.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container py-4" style={{ maxWidth: 520 }}>
            <div className="text-center mb-3">
                <h1 className="h4 m-0">Login</h1>
                <div className="text-muted small">Entra para criares e editares receitas.</div>
            </div>

            {err && <div className="alert alert-danger">{err}</div>}

            <form onSubmit={onSubmit} className="card shadow-sm" autoComplete="off">
                <div className="card-body">
                    <label className="form-label">Email</label>
                    <input
                        name="login-email"
                        className="form-control mb-3"
                        value={email}
                        autoComplete="off"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label className="form-label">Password</label>
                    <input
                        name="login-password"
                        type="password"
                        className="form-control mb-3"
                        value={password}
                        autoComplete="new-password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className="btn btn-success w-100" disabled={loading}>
                        {loading ? "A entrar..." : "Entrar"}
                    </button>
                </div>
            </form>


            <div className="text-center mt-3">
        <span className="text-muted small">
          Ainda não tens conta?{" "}
            <button className="btn btn-link p-0 align-baseline" onClick={() => nav("/register")}>
            Registar
          </button>
        </span>
            </div>
        </div>
    );
}
