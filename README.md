# Projeto Receitas 🍽️

Aplicação web fullstack para gestão e visualização de receitas.

## Tecnologias
- Backend: ASP.NET Core Web API
- Frontend: React + Vite
- UI: Bootstrap 5
- Autenticação: Cookie / Session
- Base de dados: Entity Framework Core

## Funcionalidades
- Listagem pública de receitas
- Pesquisa e paginação
- Detalhe de receita
- Backoffice protegido por login
- CRUD de categorias
- CRUD de receitas com imagem

## Como correr o projeto

### Backend
```bash
dotnet run
```
### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend disponível em:
http://localhost:5173

Backend (Swagger):
http://localhost:5096/swagger

## **PASSO 3 — GitHub (entrega final)**
Se ainda não fizeste:

```bash
git add .
git commit -m "Projeto Receitas - backend + frontend"
git branch -M main
git remote add origin https://github.com/TEU_USER/TEU_REPO.git
git push -u origin main

