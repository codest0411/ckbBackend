# Portfolio Backend API (Express + Supabase)

This is the **backend API** for the portfolio + CMS system.

- Serves as the API layer for the **public portfolio frontend** (`/frontend`).
- Powers the **CMS admin dashboard** (`/cms`) for managing portfolio content.
- Uses **Supabase** as the primary database/storage layer.

---

## Features

- REST API built with **Express**
- Authentication and authorization using **JWT** and **bcryptjs**
- Data validation with **Zod**
- File uploads via **multer**
- Security hardening via **helmet** and **cors**
- Request logging via **morgan**

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database / Storage:** Supabase (PostgreSQL + storage)
- **Auth:** JWT, bcryptjs
- **Validation:** Zod
- **Other:** multer, uuid, morgan, helmet, cors

---

## Getting Started

You can either **clone** the repository with Git or **download** it as a ZIP.

### 1. Clone with Git (recommended)

```bash
git clone <YOUR_REPO_URL>.git
cd chiragkb/backend
```

> Replace `<YOUR_REPO_URL>` with the actual Git URL of this monorepo.

### 2. Download as ZIP (no Git)

1. Download the repository as a ZIP from your Git hosting (GitHub / GitLab).
2. Extract the ZIP file.
3. Open a terminal in the extracted folder and navigate to:

```bash
cd chiragkb/backend
```

---

## Installation

From the `backend` folder, install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in `/backend` based on `.env.example` (if present) or configure at least:

```bash
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
```

- Keep **all secrets** (Supabase keys, JWT secrets, etc.) on the **backend only**.
- Do **not** commit real secrets to version control.

---

## Database Schema

The database structure is defined in `schema.sql`.

- Use this file as a reference when creating tables in Supabase or a local PostgreSQL instance.

---

## Running the Server

### Development

```bash
npm run dev
```

- Uses `nodemon` to reload on code changes.
- Default port is typically `3000` (or whatever you set in `PORT`).

### Production

```bash
npm start
```

---

## API Usage

Once running (e.g. on `http://localhost:3000`), the CMS and frontend can interact with the API.

- Configure `VITE_API_BASE_URL` in `/frontend` and `/cms` to point to this backend.

(For exact routes and payloads, inspect the files under `src/`.)

---

## Scripts

- `npm run dev` – start dev server with nodemon
- `npm start` – start production server
- `npm run lint` – placeholder script (no linter configured yet)

---

## Relation to Other Projects

- **/frontend** – public portfolio site that reads data from this API.
- **/cms** – admin dashboard that writes/updates data via this API.

---

## License

This project is part of the personal portfolio of **Chirag Bhandarkar**.
