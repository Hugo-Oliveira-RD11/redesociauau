# 🌐 Projeto de Rede Social

Este é um sistema de rede social dividido em dois projetos:

- 🖥️ **Frontend:** `frontend` (Next.js + TailwindCSS + Zustand)
- ⚙️ **Backend:** `backend` (Express.js + Prisma + PostgreSQL)

---

## 🧱 Requisitos

Certifique-se de ter os seguintes itens instalados:

- [Node.js](https://nodejs.org) (v18 ou superior)
- [PostgreSQL](https://www.postgresql.org/) (ou outro banco compatível com Prisma)
- [Yarn](https://yarnpkg.com/) ou [npm](https://www.npmjs.com/)
- (Opcional) [Docker](https://www.docker.com/) — para facilitar o banco de dados

---

## 📁 Estrutura do Projeto

```bash
/meu-projeto/
├── frontend/  # Frontend (Next.js)
└── backend/   # Backend (Express + Prisma)
```

---

## 🚀 Como rodar o projeto

### 1️⃣ Clone o repositório e acesse a pasta

```bash
git clone https://github.com/seu-usuario/nome-do-projeto.git
cd nome-do-projeto
```

---

## 🔧 Backend (`backend`)

### 📍 Instalar dependências

```bash
cd backend
npm install
# ou
yarn install
```

### 🗄️ Rodar migrações do Prisma

```bash
npx prisma migrate dev --name init
```

### ▶️ Iniciar o servidor backend

```bash
npm run dev
# ou
yarn dev
```

Servidor será iniciado em: [http://localhost:5000](http://localhost:5000)

---

## 🎨 Frontend (`frontend`)

### 📍 Instalar dependências

```bash
cd ../frontend
npm install
# ou
yarn install
```

### ▶️ Iniciar o frontend

```bash
npm run dev
ou (prod)
npm run build
npm start

```

### ▶️ Iniciar o backend

```bash
npm run prisma:generate
npm run prisma:migrate
```

```bash
npm run dev
ou (prod)
npm run build
npm start

```

Aplicação disponível em: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testando a conexão

1. Acesse o frontend: [http://localhost:3000](http://localhost:3000)
2. Navegue pelas funcionalidades
3. Verifique se as chamadas para a API (`http://localhost:5000`) funcionam corretamente

---

## 🛠 Tecnologias

### Frontend

- Next.js
- Tailwind CSS
- Zustand
- Axios
- React Hook Form / Formik
- Cloudinary
- React Toastify

### Backend

- Express.js
- Prisma ORM
- PostgreSQL
- JWT
- Socket.IO
- Multer (upload de arquivos)
- Winston (logs)

---
