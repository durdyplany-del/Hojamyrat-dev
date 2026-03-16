# E-Commerce Backend (Node.js)

Mukammal professional Node.js backend API.

## Architecture

```
backend-node/
├── src/
│   ├── config/           # Configuration
│   │   ├── config.js     # Environment config
│   │   └── database.js   # Database connection
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth & Error handling
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utilities
│   └── server.js        # Entry point
├── .env
├── package.json
└── README.md
```

## Funksiýalar

- ✅ User registration/login (JWT)
- ✅ Products CRUD
- ✅ Sales with stock management
- ✅ Dashboard statistics
- ✅ Daily/Weekly statistics
- ✅ Product statistics

## Gurnamak

```bash
cd backend-node
npm install
npm run db:seed
npm start
```

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

## Demo Ulanyjy

- **Ulanyjy:** admin
- **Parol:** test123

## Server: http://localhost:8080
