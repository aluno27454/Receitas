import { useEffect, useState } from "react";
import { recipesApi } from "../../api/recipes";
import { categoriesApi } from "../../api/categories";

const pageSize = 9;

function emptyForm() {
    return {
        id: 0,
        title: "",
        description: "",
        imageUrl: "",
        prepMinutes: 0,
        categoryId: "",
    };
}

export default function AdminRecipes() {
    const [items, setItems] = useState([]);
    const [cats, setCats] = useState([]);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [q, setQ] = useState("");

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    // modal/form
    const [show, setShow] = useState(false);
    const [form, setForm] = useState(emptyForm());
    const [saving, setSaving] = useState(false);

    async function loadCategories() {
        try {
            const data = await categoriesApi.list();
            const arr = Array.isArray(data) ? data : data?.items || data?.Items || [];
            setCats(arr);
        } catch (e) {
            setErr(String(e?.message || e));
        }
    }

    async function load(p = 1, searchText = "") {
        setErr("");
        setLoading(true);
        try {
            const data = await recipesApi.list({
                page: p,
                pageSize,
                search: searchText, // <- SEM query
            });

            // caso recipesApi já normalize, isto já vem ok.
            const arr = data?.items ?? data?.Items ?? [];
            const tp = data?.totalPages ?? data?.TotalPages;

            // se não vier totalPages, calcula por total
            const total = data?.total ?? data?.Total ?? 0;
            const computedTp = Math.max(1, Math.ceil(total / pageSize));

            setItems(arr);
            setTotalPages(tp ?? computedTp ?? 1);
        } catch (e) {
            setErr(String(e?.message || e));
            setItems([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadCategories();
        load(1, "");
        setPage(1);
    }, []);

    function openCreate() {
        setErr("");
        setForm(emptyForm());
        setShow(true);
    }

    function openEdit(r) {
        setErr("");
        setForm({
            id: r.id,
            title: r.title || "",
            description: r.description || "",
            imageUrl: r.imageUrl || "",
            prepMinutes: r.prepMinutes || 0,
            categoryId: r.categoryId ?? "",
        });
        setShow(true);
    }

    function closeModal() {
        setShow(false);
        setForm(emptyForm());
    }

    async function onSubmit(e) {
        e.preventDefault();
        setErr("");

        if (!form.title.trim()) return setErr("Título é obrigatório.");
        if (!form.description.trim()) return setErr("Receita é obrigatória.");
        if (!form.imageUrl.trim()) return setErr("Imagem (URL) é obrigatória.");
        if (!form.categoryId) return setErr("Escolhe uma categoria.");

        const payload = {
            title: form.title.trim(),
            description: form.description.trim(),
            imageUrl: form.imageUrl.trim(),
            prepMinutes: Number(form.prepMinutes) || 0,
            categoryId: Number(form.categoryId),
        };

        setSaving(true);
        try {
            if (form.id && form.id > 0) {
                await recipesApi.update(form.id, { id: form.id, ...payload });
            } else {
                await recipesApi.create(payload);
            }

            closeModal();
            await load(page, q);
        } catch (e) {
            setErr(String(e?.message || e));
        } finally {
            setSaving(false);
        }
    }

    async function onDelete(id) {
        if (!confirm("Apagar esta receita?")) return;

        setErr("");
        setSaving(true);
        try {
            await recipesApi.remove(id);

            // se apagaste a última da página, volta uma atrás
            const nextPage = page > 1 && items.length === 1 ? page - 1 : page;
            setPage(nextPage);
            await load(nextPage, q);
        } catch (e) {
            setErr(String(e?.message || e));
        } finally {
            setSaving(false);
        }
    }

    async function onSearch(e) {
        e.preventDefault();
        const newPage = 1;
        setPage(newPage);
        await load(newPage, q);
    }

    return (
        <div className="container py-4">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                <h1 className="h4 m-0">Editor — Receitas</h1>
                
                <button className="btn btn-primary" onClick={openCreate}>
                    + Nova receita
                </button>
                
            </div>

            {err && <div className="alert alert-danger">{err}</div>}

            <form onSubmit={onSearch} className="d-flex gap-2 mb-3">
                <input
                    className="form-control"
                    placeholder="Pesquisar..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
                <button className="btn btn-outline-primary" disabled={loading}>
                    Pesquisar
                </button>
            </form>

            <div className="card">
                <div className="table-responsive">
                    <table className="table table-hover m-0 align-middle">
                        <thead>
                        <tr>
                            <th style={{ width: 90 }}>ID</th>
                            <th style={{ width: 90 }}>Imagem</th>
                            <th>Título</th>
                            <th style={{ width: 220 }}></th>
                            <th style={{ width: 120 }}>Tempo</th>
                            <th style={{ width: 220 }}></th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center text-muted py-4">
                                    {loading ? "A carregar..." : "Sem receitas."}
                                </td>
                            </tr>
                        )}

                        {items.map((r) => (
                            <tr key={r.id}>
                                <td>{r.id}</td>
                                <td>
                                    <img
                                        src={r.imageUrl}
                                        alt=""
                                        style={{ width: 64, height: 40, objectFit: "cover" }}
                                        className="rounded"
                                    />
                                </td>
                                <td>
                                    <div className="fw-semibold">{r.title}</div>
                                    <div className="text-muted text-truncate" style={{ maxWidth: 420 }}>
                                        {r.description}
                                    </div>
                                </td>
                                <td>{cats.find((c) => c.id === r.categoryId)?.name ?? r.categoryId}</td>
                                <td>{r.prepMinutes || 0} min</td>
                                <td className="text-end">
                                    <div className="btn-group">
                                        <button className="btn btn-outline-primary btn-sm" onClick={() => openEdit(r)}>
                                            Editar
                                        </button>
                                        <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(r.id)}>
                                            Apagar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="d-flex justify-content-center gap-2 mt-3">
                <a href="/admin/categories" className="btn btn-outline-secondary">
                    Categorias
                </a>
            </div>
            <div className="d-flex justify-content-center gap-2 mt-3">
                <button
                    className="btn btn-outline-secondary"
                    disabled={page <= 1 || loading}
                    onClick={async () => {
                        const p = page - 1;
                        setPage(p);
                        await load(p, q);
                    }}
                >
                    Anterior
                </button>

                <span className="align-self-center">
          Página {page} / {totalPages}
        </span>

                <button
                    className="btn btn-outline-secondary"
                    disabled={page >= totalPages || loading}
                    onClick={async () => {
                        const p = page + 1;
                        setPage(p);
                        await load(p, q);
                    }}
                >
                    Seguinte
                </button>
            </div>

            {/* Modal */}
            {show && (
                <div
                    className="modal fade show"
                    style={{ display: "block", background: "rgba(0,0,0,.5)" }}
                    onMouseDown={(e) => {
                        if (e.target.classList.contains("modal")) closeModal();
                    }}
                >
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <form onSubmit={onSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title">{form.id ? "Editar receita" : "Nova receita"}</h5>
                                    <button type="button" className="btn-close" onClick={closeModal} />
                                </div>

                                <div className="modal-body">
                                    <div className="row g-3">
                                        <div className="col-12 col-lg-8">
                                            <label className="form-label">Título</label>
                                            <input
                                                className="form-control"
                                                value={form.title}
                                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                            />
                                        </div>

                                        <div className="col-12 col-lg-4">
                                            <label className="form-label">Categoria</label>
                                            <select
                                                className="form-select"
                                                value={form.categoryId}
                                                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                                            >
                                                <option value="">— escolher —</option>
                                                {cats.map((c) => (
                                                    <option key={c.id} value={c.id}>
                                                        {c.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label">Receita (ingredientes + passos)</label>
                                            <textarea
                                                className="form-control"
                                                rows={6}
                                                value={form.description}
                                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                            />
                                        </div>

                                        <div className="col-12 col-lg-8">
                                            <label className="form-label">Imagem (URL)</label>
                                            <input
                                                className="form-control"
                                                value={form.imageUrl}
                                                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                                            />
                                            <div className="form-text">Usa um link direto para uma imagem (jpg/png).</div>
                                        </div>

                                        <div className="col-12 col-lg-4">
                                            <label className="form-label">Tempo (min)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={form.prepMinutes}
                                                onChange={(e) => setForm({ ...form, prepMinutes: e.target.value })}
                                            />
                                        </div>

                                        {form.imageUrl?.trim() && (
                                            <div className="col-12">
                                                <label className="form-label">Preview</label>
                                                <img
                                                    src={form.imageUrl}
                                                    alt=""
                                                    className="img-fluid rounded"
                                                    style={{ maxHeight: 260, objectFit: "cover" }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>
                                        Cancelar
                                    </button>
                                    <button className="btn btn-success" disabled={saving}>
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
