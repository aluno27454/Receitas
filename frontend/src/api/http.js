export const API_BASE = "http://localhost:5096"; // SEM https

export async function apiFetch(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    const ct = res.headers.get("content-type") || "";

    // sucesso
    if (res.ok) {
        if (ct.includes("application/json")) return await res.json();
        return null;
    }

    // erro com mensagem do backend
    let msg = `Erro ${res.status}`;
    try {
        if (ct.includes("application/json")) {
            const data = await res.json();
            msg = data?.message || data?.title || JSON.stringify(data);
        } else {
            msg = await res.text();
        }
    } catch {
        // ignora
    }

    throw new Error(msg);
}
