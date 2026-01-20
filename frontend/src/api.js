const API_BASE = "https://localhost:7222/api";

export async function apiGet(path) {
    const res = await fetch(`${API_BASE}${path}`, { credentials: "include" });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function apiSend(path, method, body) {
    const res = await fetch(`${API_BASE}${path}`, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.status === 204 ? null : res.json();
}

export const auth = {
    whoami: () => apiGet("/AuthenticationApi/whoami"),
    login: (email, password) => apiSend("/AuthenticationApi/login", "POST", { email, password }),
    logout: () => apiGet("/AuthenticationApi/logout"),
};
