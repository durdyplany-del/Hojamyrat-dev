# E-Commerce Proýekt

Mukammal professional E-Commerce application. Iki sürüm bar: **Node.js** we **Go**.

---

## Node.js Backend (Takyklanan)

```
backend-node/
├── src/
│   ├── config/           # Configuration
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Auth & Error
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── server.js       # Entry point
├── .env
└── package.json
```

### Gurnamak
```bash
cd backend-node
npm install
npm run db:seed
npm start
```

---

## Go Backend (Mukawam)

```
backend/
├── cmd/server/main.go
├── internal/
│   ├── config, domain, repository
│   ├── usecase, delivery, middleware
│   └── response
├── migrations/
└── pkg/database/
```

### Gurnamak
```bash
cd backend
go mod tidy
go run ./cmd/server/main.go
```

---

## Frontend (Vue.js 3)

```
frontend/
├── src/
│   ├── views/           # Pages
│   ├── stores/         # Pinia
│   ├── router/
│   └── composables/
├── package.json
└── vite.config.js
```

### Gurnamak
```bash
cd frontend
npm install
npm run dev
```

---

## Demo Ulanyjy

- **Ulanyjy:** admin
- **Parol:** test123

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/register | Agza bolmak |
| POST | /api/login | Girmek |
| GET | /api/dashboard | Baş sahypa |
| GET | /api/products | Ähli harytlar |
| POST | /api/products | Täze haryt |
| PUT | /api/products/:id | Üýtgetmek |
| DELETE | /api/products/:id | Poçelmek |
| GET | /api/sales | Satyslar |
| POST | /api/sales | Täze satys |
| GET | /api/sales/daily | Günlik |
| GET | /api/sales/weekly | Hepdelik |
| GET | /api/dashboard/stats | Haryt statistika |

---

## Backend: http://localhost:8080
## Frontend: http://localhost:5173
