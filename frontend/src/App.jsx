import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import RecipeDetail from "./pages/RecipeDetail.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminRecipes from "./pages/admin/AdminRecipes.jsx";
import AdminCategories from "./pages/admin/AdminCategories.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import Register from "./pages/admin/Register.jsx";

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/recipe/:id" element={<RecipeDetail />} />
                <Route path="/register" element={<Register />} />

                <Route path="/admin/login" element={<AdminLogin />} />

                {/* tudo o que estiver aqui dentro exige login */}
                <Route element={<RequireAuth />}>
                    <Route path="/admin/recipes" element={<AdminRecipes />} />
                    <Route path="/admin/categories" element={<AdminCategories />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
}
