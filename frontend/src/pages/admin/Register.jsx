import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth";

export default function Register() {
    const nav = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setErr("");

        if (!email.trim()) return setErr("Email é obrigatório.");
        if (!password) return setErr("Password é obrigatória.");
        if (password.length < 6) return setErr("A password deve ter pelo menos 6 caracteres.");
        if (password !== confirm) return setErr("As passwords não coincidem.");

        setLoading(true);
        try {
            await authApi.register(email.trim(), password);
            window.dispatchEvent(new Event("auth-changed")); // <- faz aparecer Logout
            nav("/admin/recipes");
        } catch (e) {
            setErr(e?.message || "Erro no registo.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container py-4" style={{ maxWidth: 520 }}>
            <div className="text-center mb-3">
                <h1 className="h4 m-0">Criar conta</h1>
                <div className="text-muted small">Regista-te para criares e editares as tuas receitas.</div>
            </div>

            {err && <div className="alert alert-danger">{err}</div>}

            <form onSubmit={onSubmit} className="card shadow-sm">
                <div className="card-body">
                    <label className="form-label">Email</label>
                    <input
                        className="form-control mb-3"
                        value={email}
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control mb-3"
                        value={password}
                        autoComplete="new-password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <label className="form-label">Confirmar password</label>
                    <input
                        type="password"
                        className="form-control mb-3"
                        value={confirm}
                        autoComplete="new-password"
                        onChange={(e) => setConfirm(e.target.value)}
                    />

                    <button className="btn btn-primary w-100" disabled={loading}>
                        {loading ? "A criar..." : "Registar"}
                    </button>
                </div>
            </form>

            <div className="text-center mt-3">
        <span className="text-muted small">
          Já tens conta?{" "}
            <button className="btn btn-link p-0 align-baseline" onClick={() => nav("/admin/login")}>
            Login
          </button>
        </span>
            </div>
        </div>
    );
}
