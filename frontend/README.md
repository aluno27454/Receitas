# 🍽️ Receitas SPA

Aplicação **Single Page Application (SPA)** para gestão e visualização de receitas culinárias.

Projeto desenvolvido no âmbito da unidade curricular **Interfaces Web II**.

---

## 🧰 Tecnologias Utilizadas

### Backend
- ASP.NET Core (.NET 8)
- Entity Framework Core
- SQLite
- ASP.NET Identity (Autenticação e Autorização)
- Swagger

### Frontend
- React
- React Router
- Bootstrap 5
- Fetch API

---

## ✨ Funcionalidades

### Público
- Listagem de receitas
- Pesquisa de receitas
- Visualização do detalhe da receita
- Visualização por categorias

### Autenticação
- Registo de utilizadores
- Login / Logout
- Sessão persistente via cookies

### Backoffice (Editor)
- Criar, editar e apagar receitas
- Criar, editar e apagar categorias
- Controlo de permissões (apenas dono ou admin pode editar/apagar)

---

## 🔐 Conta Admin (Seed)

Ao arrancar o backend é criado automaticamente um utilizador administrador:

```text
Email: admin@admin.com
Password: Admin123!
