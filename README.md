# Kredent — Blockchain-Based Digital Degree Certificate Verification (SBT)

Final-year engineering project: MVJCE issues degree certificates digitally,
secured on-chain via Soulbound Tokens (SBTs). Students view/download their
certificates, admins issue and revoke them through a wallet-authenticated
portal, and employers verify any certificate instantly via QR code — no
login required.

This repo is split into two independent projects:

```
kredent 2/
  frontend/   React + Vite + Tailwind SPA — see frontend/README.md
  backend/    Spring Boot REST API (Java 17, JPA, Spring Security, JWT)
```

Each has its own dependencies, its own README, and can be run independently.

## Running locally

**Backend** (Spring Boot, port 8080 by default):

```bash
cd backend
mvn spring-boot:run
```

Requires `DB_URL` / `DB_USERNAME` / `DB_PASSWORD` (Supabase Postgres) and, to
seed an admin account, `ADMIN_WALLET_ADDRESS`. See
`backend/src/main/resources/application.properties` for all supported env vars.

**Frontend** (Vite dev server, port 5173 by default):

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_BASE_URL` in `frontend/.env` if the backend isn't running on
`http://localhost:8080`.

## Roadmap

- ✅ Auth & security foundation (JWT, BCrypt, wallet-based admin login)
- ✅ Frontend UI polish + design system (`frontend/src/components/ui`)
- ✅ Frontend/backend project structure separation
- ⬜ Certificate issuance + Supabase storage (PDFs)
- ⬜ Soulbound Token smart contract (Solidity + Hardhat + Polygon Amoy)
- ⬜ On-chain verification wired into the Verify Degree page

## Tech stack

| Layer | Stack |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, React Router, Framer Motion |
| Backend | Spring Boot 3, Spring Security, JWT, Spring Data JPA |
| Database | Supabase PostgreSQL |
| Storage | Supabase Storage (certificate PDFs) |
| Blockchain | Solidity, Hardhat, OpenZeppelin, Ethers.js, Polygon Amoy Testnet *(planned)* |
