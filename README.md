# AXIOM: Advanced Developer Platform

A modern, production-ready developer platform featuring secure authentication, user profiles, and a modular architecture. Built with **React** (Vite) and **Node.js** (Express).

## 🚀 Live Demo
-   **Frontend**: [axiomdev.vercel.app](https://axiomdev.vercel.app)
-   **Backend**: [axiom-server-three.vercel.app](https://axiom-server-three.vercel.app)

## 🛠️ Tech Stack
-   **Frontend**: React, Vite, TailwindCSS, Framer Motion, Zustand
-   **Backend**: Node.js, Express, PostgreSQL (pg), Dotenvx
-   **Security**: Helmet, Rate Limiting, Compression, CORS, Encrypted Env Vars
-   **Deployment**: Vercel (Split Project Architecture)

## 📂 Project Structure
This repository is a **Monorepo** containing two distinct applications:

```
AXIOM/
├── client/          # Frontend Application (Vite/React)
│   ├── src/         # Source code
│   └── vercel.json  # SPA Routing Config
└── server/          # Backend Application (Express/Node)
    ├── routes/      # API Routes
    └── vercel.json  # Serverless Function Config
```

## 💻 Local Development

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Adi-gitX/AXIOM.git
    cd AXIOM
    ```

2.  **Setup Backend**
    ```bash
    cd server
    npm install
    # Create .env (See .env.example)
    npm run dev
    ```

3.  **Setup Frontend** (In a new terminal)
    ```bash
    cd client
    npm install
    # Create .env with VITE_API_URL (See walkthrough.md)
    npm run dev
    ```

## 🔐 Security Features
-   **Environment Encryption**: Uses `@dotenvx/dotenvx` to encrypt sensitive keys.
-   **DDoS Protection**: `express-rate-limit` throttles excessive requests.
-   **Secure Headers**: `helmet` guards against XSS and sniffing.
-   **Sanitized Logs**: Production logging via `morgan`.

## 📦 Deployment
Deployed on Vercel as two separate projects:
1.  **Frontend**: Root Directory set to `client`.
2.  **Backend**: Root Directory set to `server`.

***
Authored by Aditya Kammati
