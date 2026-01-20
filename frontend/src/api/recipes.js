import { apiFetch } from "./http";

function normalizePaged(data, page, pageSize) {
    const items = data?.items ?? data?.Items ?? [];
    const total = data?.total ?? data?.Total ?? 0;

    return {
        page: data?.page ?? data?.Page ?? page,
        pageSize: data?.pageSize ?? data?.PageSize ?? pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
        items,
    };
}

export const recipesApi = {
    list: async ({ page = 1, pageSize = 9, search = "", q = "", categoryId = null } = {}) => {
        const qs = new URLSearchParams();
        qs.set("page", String(page));
        qs.set("pageSize", String(pageSize));

        const s = (search || q || "").trim();
        if (s) qs.set("search", s);
        if (categoryId) qs.set("categoryId", String(categoryId));

        const data = await apiFetch(`/api/RecipesApi?${qs.toString()}`);
        return normalizePaged(data, page, pageSize);
    },

    get: (id) => apiFetch(`/api/RecipesApi/${id}`),

    create: (payload) =>
        apiFetch(`/api/RecipesApi`, {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    update: (id, payload) =>
        apiFetch(`/api/RecipesApi/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
        }),

    remove: (id) =>
        apiFetch(`/api/RecipesApi/${id}`, {
            method: "DELETE",
        }),
};
