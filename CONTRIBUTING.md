# Contributing to AXIOM

First off, **thank you** for considering contributing to AXIOM! 🎉 Every contribution helps make developer growth more accessible for students and early-career engineers worldwide.

## 🚀 Quick Start

```bash
# 1. Fork & clone
git clone https://github.com/<your-username>/AXIOM.git
cd AXIOM

# 2. Install dependencies
npm --prefix client install
npm --prefix server install

# 3. Set up environment
cp client/.env.example client/.env   # Fill in Firebase keys
cp server/.env.example server/.env   # Fill in server config

# 4. Run locally
npm run dev:server   # Terminal 1
npm run dev:client   # Terminal 2

# 5. Verify everything works
npm run check
```

## 🏷️ Finding Issues to Work On

| Label | What it means |
|-------|--------------|
| `good first issue` | Perfect for newcomers — scoped, documented, and mentored |
| `help wanted` | Needs community help — any skill level welcome |
| `bug` | Something broken that needs fixing |
| `enhancement` | New feature or improvement |
| `documentation` | Docs that need writing or updating |

👉 **Start here:** [Good First Issues](../../issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)

## 📝 Making Changes

### Commit Messages

Use clear, descriptive commit messages:

```
Add streak reset logic for DSA heatmap
Fix OAuth callback redirect on mobile Safari
Update education catalog with new React resources
```

Avoid prefixes like `feat:`, `fix:`, `chore:` — just describe what you did in plain English.

### Code Style

- **Client**: React + JSX, TailwindCSS, Zustand for state
- **Server**: Express controllers, SQL.js queries
- Run `npm run lint` before committing (enforced by CI)
- Keep components focused — one responsibility per file

### Pull Request Process

1. **Branch from `main`** — use a descriptive branch name (`add-streak-badges`, `fix-heatmap-timezone`)
2. **Keep PRs focused** — one feature or fix per PR
3. **Fill out the PR template** — describe what, why, and how to test
4. **Ensure CI passes** — lint, build, and smoke tests must be green
5. **Add screenshots** for UI changes
6. **Request review** — a maintainer will review within 48 hours

### Testing Your Changes

```bash
# Full quality gate
npm run check

# Individual checks
npm run lint              # Client linting
npm run build             # Production build
npm run smoke             # Server smoke tests
```

## 🏗️ Project Structure

```
AXIOM/
├── client/               # Vite + React + Tailwind + Zustand
│   ├── src/
│   │   ├── pages/        # Route-level page components
│   │   ├── components/   # Reusable UI components
│   │   ├── lib/          # API client, utilities
│   │   ├── contexts/     # React contexts (Auth)
│   │   └── stores/       # Zustand stores
│   └── ...
├── server/               # Express + SQL.js
│   ├── controllers/      # Domain logic (DSA, OSS, GSOC, etc.)
│   ├── middleware/        # Auth, rate limiting
│   ├── migrations/       # Database schema
│   └── ...
└── README.md
```

## 🌟 Contributor Recognition

We value every contribution! Contributors are recognized through:

- **README Contributors section** — your avatar appears in the project README
- **Monthly spotlight** — top contributors highlighted in discussions
- **Leaderboard** — active contributors tracked on the project dashboard

## 💬 Questions?

- Open a [Discussion](../../discussions) for questions or ideas
- Check existing [Issues](../../issues) before creating new ones
- Read [APP_DOCUMENTATION.md](./APP_DOCUMENTATION.md) for deep architecture details

## 📜 License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
