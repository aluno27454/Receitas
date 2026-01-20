import { apiFetch } from "./http";

export const interactionsApi = {
    listComments: (recipeId) => apiFetch(`/api/recipes/${recipeId}/comments`),

    addComment: (recipeId, authorName, text) =>
        apiFetch(`/api/recipes/${recipeId}/comments`, {
            method: "POST",
            body: JSON.stringify({ authorName, text }),
        }),

    getLikes: (recipeId) => apiFetch(`/api/recipes/${recipeId}/likes`),

    toggleLike: (recipeId) =>
        apiFetch(`/api/recipes/${recipeId}/likes/toggle`, { method: "POST" }),
};
