<div align="center">

# ⚡ AXIOM

### The Ultimate Developer Career Platform

*An all-in-one ecosystem designed to accelerate your journey from learner to professional developer*

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-axiomdev.vercel.app-black?style=for-the-badge)](https://axiomdev.vercel.app)
[![Backend](https://img.shields.io/badge/🔧_API-axiom--server--three.vercel.app-gray?style=for-the-badge)](https://axiom-server-three.vercel.app)
[![CI](https://github.com/Adi-gitX/AXIOM/actions/workflows/ci.yml/badge.svg)](https://github.com/Adi-gitX/AXIOM/actions/workflows/ci.yml)

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)
![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?logo=vercel)

</div>

---

## 🎯 Why I Built AXIOM

As a self-taught developer, I experienced firsthand how fragmented the learning journey can be:

- **YouTube tutorials** scattered across thousands of channels
- **DSA practice** on one platform, **interview prep** on another
- **Job boards** that never feel personalized
- **No single place** to track progress, connect with peers, and grow

**AXIOM solves this.** It's the platform I *wished* existed when I started coding—a unified command center that brings together everything a developer needs to learn, practice, prepare, and land their dream job.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎛️ **Dashboard** | Personalized command center with progress stats, streak tracking, and quick navigation |
| 📚 **Education Hub** | Curated video tutorials across 18+ topics (React, Python, System Design, AI/ML, DevOps, etc.) |
| 🧮 **DSA Tracker** | Striver's A2Z Sheet with problem tracking, difficulty tags, and progress visualization |
| 🎤 **Interview Prep** | Resources for behavioral, system design, coding, and resume preparation |
| 💼 **Jobs Board** | Filterable job listings (Remote, Full-time, Contract) with save functionality |
| 💬 **Developer Connect** | Real-time chat channels for networking (General, React, Jobs, Help) |
| 📰 **Posts Feed** | Aggregated content from Y Combinator, Dev.to, Hacker News, Medium, Reddit, GitHub |
| 👤 **Rich Profiles** | Complete developer profiles with Cloudinary image uploads, skills, experience, and social links |

---

## 🏗️ Architecture

```
AXIOM/
├── client/                 # Frontend (Vite + React)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React Context (Auth)
│   │   ├── data/           # Static data (DSA sheet, education videos)
│   │   ├── lib/            # Utilities (API, Cloudinary, Firebase)
│   │   ├── pages/          # Route pages
│   │   └── stores/         # Zustand state management
│   └── vercel.json         # SPA routing config
│
└── server/                 # Backend (Express + Node.js)
    ├── config/             # Database configuration
    ├── controllers/        # Business logic
    ├── routes/             # API endpoints
    └── vercel.json         # Serverless function config
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library with modern hooks |
| **Vite** | Next-gen build tool for fast HMR |
| **TailwindCSS** | Utility-first styling |
| **Framer Motion** | Fluid animations & transitions |
| **Zustand** | Lightweight state management |
| **Firebase Auth** | Secure authentication |

### Backend
| Technology | Purpose |
|------------|---------|
| **Express 5** | Modern Node.js web framework |
| **PostgreSQL** | Robust relational database |
| **Cloudinary** | Cloud-based image management |

### Security & Performance
| Technology | Purpose |
|------------|---------|
| **Helmet** | XSS & security headers protection |
| **express-rate-limit** | DDoS prevention (100 req/15min) |
| **compression** | Gzip response compression |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Firebase project (for authentication)
- Cloudinary account (for image uploads)

### 1. Clone & Install

```bash
git clone https://github.com/Adi-gitX/AXIOM.git
cd AXIOM
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env`:
```env
DATABASE_URL=your_postgres_connection_string
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

Start server:
```bash
npm run init-db
npm run dev
```

### 3. Frontend Setup

```bash
cd ../client
npm install
```

Create `.env`:
```env
VITE_API_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

Start dev server:
```bash
npm run dev
```

Visit `http://localhost:5173` 🎉

---

## 🔐 Security

- **Rate Limiting** — Protects against brute-force and DDoS attacks
- **Secure Headers** — Helmet guards against XSS, clickjacking, MIME sniffing
- **CORS Configuration** — Whitelisted origins only
- **Firebase Auth** — Industry-standard authentication

---

## ️ Roadmap

- [ ] Real-time notifications
- [ ] AI-powered code review integration
- [ ] Collaborative study rooms
- [ ] Mobile app (React Native)
- [ ] Interview scheduler with calendar sync
- [ ] Resume builder with ATS optimization

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

MIT License

---

<div align="center">

**Built with ❤️ by [Aditya Kammati](https://github.com/Adi-gitX)**

*Empowering developers, one feature at a time.*

</div>
