import { useEffect, useState } from "react";
import { categoriesApi } from "../../api/categories";
import { Link } from "react-router-dom";

export default function AdminCategories() {
    const [items, setItems] = useState([]);
    const [name, setName] = useState("");

    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");

    const [err, setErr] = useState("");
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);

    async function load() {
        setErr("");
        setLoading(true);
        try {
            const data = await categoriesApi.list();
            const arr = Array.isArray(data) ? data : (data?.items || []);
            setItems(arr);
        } catch (e) {
            setErr(e?.message || "Erro a carregar categorias.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function onCreate(e) {
        e.preventDefault();
        setErr("");

        if (!name.trim()) return setErr("Nome é obrigatório.");

        setSaving(true);
        try {
            await categoriesApi.create({ name: name.trim() });
            setName("");
            await load();
        } catch (e) {
            setErr(e?.message || "Erro a criar categoria.");
        } finally {
            setSaving(false);
        }
    }

    function startEdit(c) {
        setEditId(c.id);
        setEditName(c.name || "");
    }

    function cancelEdit() {
        setEditId(null);
        setEditName("");
    }

    async function saveEdit() {
        setErr("");
        if (!editName.trim()) return setErr("Nome é obrigatório.");

        setSaving(true);
        try {
            await categoriesApi.update(editId, { id: editId, name: editName.trim() });
            cancelEdit();
            await load();
        } catch (e) {
            setErr(e?.message || "Erro a guardar categoria.");
        } finally {
            setSaving(false);
        }
    }

    async function onDelete(id) {
        if (!confirm("Apagar esta categoria?")) return;

        setErr("");
        setSaving(true);
        try {
            await categoriesApi.remove(id);
            await load();
        } catch (e) {
            setErr(e?.message || "Erro a apagar categoria.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="container py-4">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                <div>
                    <h1 className="h4 m-0">Editor — Categorias</h1>
                    <div className="text-muted small">Cria e gere categorias para as receitas.</div>
                </div>

                <div className="d-flex gap-2">
                    <Link className="btn btn-outline-secondary" to="/admin/recipes">
                        ← Voltar às receitas
                    </Link>
                    <button className="btn btn-outline-secondary" onClick={load} disabled={loading || saving}>
                        Recarregar
                    </button>
                </div>
            </div>

            {err && <div className="alert alert-danger">{err}</div>}

            <div className="card shadow-sm mb-3">
                <div className="card-body">
                    <form onSubmit={onCreate} className="row g-2 align-items-end">
                        <div className="col-12 col-md-8">
                            <label className="form-label">Nova categoria</label>
                            <input
                                className="form-control"
                                placeholder="Ex: Sobremesas"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={saving}
                            />
                        </div>
                        <div className="col-12 col-md-4">
                            <button className="btn btn-primary w-100" disabled={saving}>
                                {saving ? "A guardar..." : "Adicionar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="table-responsive">
                    <table className="table table-hover align-middle m-0">
                        <thead className="table-light">
                        <tr>
                            <th style={{ width: 90 }}>ID</th>
                            <th>Nome</th>
                            <th className="text-end" style={{ width: 260 }}></th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="text-center text-muted py-4">
                                    {loading ? "A carregar..." : "Sem categorias."}
                                </td>
                            </tr>
                        ) : (
                            items.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.id}</td>

                                    <td>
                                        {editId === c.id ? (
                                            <input
                                                className="form-control"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                disabled={saving}
                                            />
                                        ) : (
                                            <span className="fw-semibold">{c.name}</span>
                                        )}
                                    </td>

                                    <td className="text-end">
                                        {editId === c.id ? (
                                            <div className="btn-group">
                                                <button className="btn btn-success btn-sm" onClick={saveEdit} disabled={saving}>
                                                    Guardar
                                                </button>
                                                <button className="btn btn-outline-secondary btn-sm" onClick={cancelEdit} disabled={saving}>
                                                    Cancelar
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="btn-group">
                                                <button className="btn btn-outline-primary btn-sm" onClick={() => startEdit(c)} disabled={saving}>
                                                    Editar
                                                </button>
                                                <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(c.id)} disabled={saving}>
                                                    Apagar
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="card-body border-top">
                    <div className="text-muted small">
                        Nota: se houver receitas ligadas a uma categoria, o backend pode impedir apagar (normal).
                    </div>
                </div>
            </div>
        </div>
    );
}
