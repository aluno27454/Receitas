import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/auth";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function refresh() {
        try {
            const me = await authApi.whoAmI();
            setUser(me);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refresh();
    }, []);

    async function login(email, password) {
        await authApi.login(email, password);
        await refresh();
    }

    async function logout() {
        await authApi.logout();
        setUser(null);
    }

    return (
        <AuthCtx.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthCtx.Provider>
    );
}

export function useAuth() {
    return useContext(AuthCtx);
}
