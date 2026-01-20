import { useEffect, useState } from "react";
import { recipesApi } from "../api/recipes";
import { Link } from "react-router-dom";

export default function Home() {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 9;

    async function load(p = page, s = search) {
        const data = await recipesApi.list({ page: p, pageSize, q: s });
        // assumindo que a API devolve { items, page, pageSize, totalItems, totalPages }
        setItems(data.items || []);
        setTotalPages(data.totalPages || 1);
    }

    useEffect(() => { load(1, ""); }, []);

    async function onSearch(e) {
        e.preventDefault();
        setPage(1);
        await load(1, search);
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h1 className="page-title h3 m-0">Receitas</h1>
                    <div className="text-muted">
                        Pesquisa e descobre receitas com imagens e tempos de preparação.
                    </div>
                </div>
                <form className="d-flex gap-2" onSubmit={onSearch}>
                    <input
                        className="form-control"
                        placeholder="Pesquisar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="btn btn-primary">Pesquisar</button>
                </form>
            </div>

            <div className="row g-3">
                {items.map((r) => (
                    <div key={r.id} className="col-12 col-sm-6 col-lg-4">
                        <div className="card h-100">
                            <img
                                src={r.imageUrl}
                                className="card-img-top"
                                alt={r.title}
                                style={{ height: 220, objectFit: "cover" }}/>
                            <div className="card-body">
                                <h5 className="card-title">{r.title}</h5>
                                <p className="card-text text-truncate">{r.description}</p>
                            </div>
                            <div className="card-footer d-flex justify-content-between">
                                <small className="text-muted">{r.prepMinutes} min</small>
                                <Link className="btn btn-outline-primary btn-sm" to={`/recipe/${r.id}`}>Ver</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="d-flex justify-content-center gap-2 mt-4">
                <button
                    className="btn btn-outline-secondary"
                    disabled={page <= 1}
                    onClick={async () => { const p = page - 1; setPage(p); await load(p, search); }}
                >
                    Anterior
                </button>

                <span className="align-self-center">
          Página {page} / {totalPages}
        </span>

                <button
                    className="btn btn-outline-secondary"
                    disabled={page >= totalPages}
                    onClick={async () => { const p = page + 1; setPage(p); await load(p, search); }}
                >
                    Seguinte
                </button>
            </div>
        </>
    );
}
