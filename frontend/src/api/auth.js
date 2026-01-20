import { apiFetch } from "./http";

export const authApi = {
    whoami: () => apiFetch("/api/AuthenticationApi/whoami"),
    login: (email, password) =>
        apiFetch("/api/AuthenticationApi/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        }),
    register: (email, password) =>
        apiFetch("/api/AuthenticationApi/register", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        }),
    logout: () =>
        apiFetch("/api/AuthenticationApi/logout", {
            method: "POST",
        }),
};
