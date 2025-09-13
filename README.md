# 🚀 Chat Web App

A real-time chat application built using **Next.js (Frontend)**,
**Node.js with GraphQL & Express (Backend)**, and **PostgreSQL** as the
database.\
It supports real-time messaging using **Socket.IO**, user
authentication, and Docker-based deployment.

------------------------------------------------------------------------

## ✅ Features

-   User authentication (login/register)
-   One-to-one real-time messaging
-   Message persistence in PostgreSQL
-   WebSocket-based message transport with Socket.IO
-   Clean frontend UI built with Next.js
-   Backend using GraphQL with Express
-   Easy setup with Docker Compose

------------------------------------------------------------------------

## ⚙️ Tech Stack

  Frontend   Backend                       Database     Real-time Communication
  ---------- ----------------------------- ------------ -------------------------
  Next.js    Node.js + GraphQL + Express   PostgreSQL   Socket.IO

------------------------------------------------------------------------

## 🗂 Project Structure

    ├── client/       # Frontend (Next.js)
    ├── server/       # Backend (Node.js + GraphQL + Express)
    └── README.md

------------------------------------------------------------------------

## 🐳 Setup with Docker

### 1️⃣ Install Docker Desktop

Ensure [Docker Desktop](https://www.docker.com/products/docker-desktop/)
is installed.

------------------------------------------------------------------------

### 2️⃣ Docker Compose

Run the following command at the root of the project to spin up the
services (Postgres, Backend, Frontend):

``` bash
docker-compose up -d
```

This will start:

-   **Postgres Database**
-   Backend running at: `http://localhost:8080/graphql`
-   Frontend running at: `http://localhost:3000`

------------------------------------------------------------------------

### 3️⃣ Environment Variables

Create a `.env` file in the `server/` folder with at least the
following:

``` env
DATABASE_URL=postgresql://postgres:password@db:5432/chatapp_db
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

------------------------------------------------------------------------

## ⚡ How it works

-   Users authenticate via GraphQL login.
-   On login, JWT token is stored in HTTP-only cookies.
-   Users join their own Socket.IO room after login.
-   Sending a direct message:
    1.  Message is saved in the database.
    2.  The receiver gets the message in real-time via WebSocket.
-   On refresh, the message history is fetched via GraphQL query.

------------------------------------------------------------------------

## ✅ Scripts

### Run Backend (development)

``` bash
cd server
npm install
npm run dev
```

### Run Frontend (development)

``` bash
cd client
npm install
npm run dev
```

------------------------------------------------------------------------

## 🔧 Notes

-   Backend GraphQL playground available at:
    `http://localhost:8080/graphql`
-   Frontend is accessible at: `http://localhost:3000`
-   Socket.IO path: `/api/socket_io`

------------------------------------------------------------------------
