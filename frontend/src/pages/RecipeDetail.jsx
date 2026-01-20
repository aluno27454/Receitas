import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { recipesApi } from "../api/recipes";
import { interactionsApi } from "../api/interactions";

export default function RecipeDetail() {
    const { id } = useParams();

    const [r, setR] = useState(null);

    // likes + comments
    const [comments, setComments] = useState([]);
    const [authorName, setAuthorName] = useState("");
    const [text, setText] = useState("");
    const [likes, setLikes] = useState({ count: 0, likedByMe: false });
    const [err, setErr] = useState("");

    async function loadInteractions(recipeId) {
        const [c, l] = await Promise.all([
            interactionsApi.listComments(recipeId),
            interactionsApi.getLikes(recipeId),
        ]);

        setComments(Array.isArray(c) ? c : []);
        setLikes(l || { count: 0, likedByMe: false });
    }

    useEffect(() => {
        recipesApi.get(id).then(setR);
        loadInteractions(id).catch(() => {
            // se o backend ainda não tiver comments/likes, isto evita crash
        });
    }, [id]);

    if (!r) return <div className="container py-4">A carregar...</div>;

    return (
        <div className="container py-4">
            <div className="row g-4">
                <div className="col-12 col-lg-6">
                    <img
                        src={r.imageUrl}
                        alt={r.title}
                        className="img-fluid rounded"
                        style={{ width: "100%", maxHeight: 420, objectFit: "cover" }}
                    />
                </div>

                <div className="col-12 col-lg-6">
                    <div className="d-flex align-items-start justify-content-between gap-3">
                        <h1 className="h3 m-0">{r.title}</h1>
                        <div className="mt-2">
                            <span className="badge text-bg-light border">{r.category.name}</span>
                        </div>
                        <button
                            type="button"
                            className={`btn ${
                                likes.likedByMe ? "btn-danger" : "btn-outline-danger"
                            }`}
                            onClick={async () => {
                                setErr("");
                                try {
                                    await interactionsApi.toggleLike(id);
                                    const l = await interactionsApi.getLikes(id);
                                    setLikes(l);
                                } catch (e) {
                                    setErr(e.message || "Erro a dar like");
                                }
                            }}
                        >
                            ❤️ {likes.count}
                        </button>
                    </div>

                    {r.prepMinutes > 0 && (
                        <div className="text-muted mt-2">
                            <small>{r.prepMinutes} min</small>
                        </div>
                    )}

                    <p className="mt-3">{r.description}</p>
                </div>
            </div>

            {/* Comentários */}
            <form
                className="card card-body mt-4"
                onSubmit={async (e) => {
                    e.preventDefault();
                    setErr("");

                    if (!authorName.trim()) {
                        setErr("Indica o teu nome.");
                        return;
                    }
                    if (!text.trim()) {
                        setErr("Escreve um comentário.");
                        return;
                    }

                    try {
                        await interactionsApi.addComment(id, authorName, text);
                        setText("");
                        await loadInteractions(id);
                    } catch (e) {
                        setErr(e.message || "Erro ao comentar");
                    }
                }}
            >
                <h2 className="h5">Comentários</h2>

                {err && <div className="alert alert-danger mt-2 mb-0">{err}</div>}

                <div className="row g-2 mt-2">
                    <div className="col-12 col-md-4">
                        <input
                            className="form-control"
                            placeholder="O teu nome"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                        />
                    </div>

                    <div className="col-12 col-md-8">
                        <input
                            className="form-control"
                            placeholder="Escreve um comentário..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-2">
                    <button className="btn btn-primary">Comentar</button>
                </div>

                <hr />

                {comments.length === 0 ? (
                    <div className="text-muted">Ainda sem comentários.</div>
                ) : (
                    <ul className="list-group">
                        {comments.map((c) => (
                            <li key={c.id} className="list-group-item">
                                <div className="d-flex justify-content-between">
                                    <strong>{c.authorName}</strong>
                                    <small className="text-muted">
                                        {new Date(c.createdAt).toLocaleString()}
                                    </small>
                                </div>
                                <div>{c.text}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </form>
        </div>
    );
}
