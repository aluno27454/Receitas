import { apiFetch } from "./http";

export const categoriesApi = {
    list: () => apiFetch("/api/CategoriesApi"),

    create: (data) =>
        apiFetch("/api/CategoriesApi", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    update: (id, data) =>
        apiFetch(`/api/CategoriesApi/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    remove: (id) =>
        apiFetch(`/api/CategoriesApi/${id}`, {
            method: "DELETE",
        }),
};
