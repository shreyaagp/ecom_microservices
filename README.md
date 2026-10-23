# NestJS E-Commerce Microservices

A **production-grade microservices e-commerce backend** built with NestJS and TypeScript. This project demonstrates senior-level architectural thinking — service decomposition, gRPC inter-service communication, Kafka event-driven patterns, and operational readiness.

Every service is independently deployable, independently testable, and follows consistent engineering standards.

---

## Architecture

```
                    ┌─────────────────────────────┐
                    │         API Gateway          │
                    │   (HTTP · JWT · Rate Limit)  │
                    └──────────────┬──────────────┘
                                   │ gRPC
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
   ┌──────▼──────┐         ┌──────▼───────┐        ┌───────▼──────┐
   │    User     │         │   Product    │        │    Order     │
   │   Service   │         │   Service    │        │   Service    │
   │  PostgreSQL │         │   MongoDB    │        │  PostgreSQL  │
   └──────┬──────┘         └──────┬───────┘        └───────┬──────┘
          │                       │                        │
          └───────────┬───────────┘                        │
                      │                                    │
               ┌──────▼──────┐                    ┌────────▼─────┐
               │   Apache    │                    │   Payment    │
               │    Kafka    │◄───────────────────│   Service    │
               │  (Events)   │                    │   Stripe     │
               └──────┬──────┘                    └──────────────┘
                      │
       ┌──────────────┼──────────────┐
       │              │              │
┌──────▼──────┐ ┌─────▼──────┐ ┌────▼────────┐
│  Inventory  │ │Notification│ │   Search    │
│   Service   │ │  Service   │ │   Service   │
│  PostgreSQL │ │   Email    │ │Elasticsearch│
└─────────────┘ └────────────┘ └─────────────┘
```

---

## Service Inventory

| Service              | Port | Database      | Communication  | Responsibility                            |
| -------------------- | ---- | ------------- | -------------- | ----------------------------------------- |
| API Gateway          | 3000 | —             | HTTP ↔ gRPC    | Routing, JWT auth, rate limiting, Swagger |
| User Service         | 3001 | PostgreSQL    | gRPC server    | Auth, users, addresses, tokens            |
| Product Service      | 3002 | MongoDB       | gRPC + Kafka   | Catalog, reviews, search, Redis cache     |
| Order Service        | 3003 | PostgreSQL    | gRPC + Kafka   | Cart, orders, state machine               |
| Inventory Service    | 3004 | PostgreSQL    | Kafka          | Stock reservation, pessimistic locking    |
| Payment Service      | 3005 | PostgreSQL    | Kafka          | Stripe intents, webhooks, refunds         |
| Notification Service | 3006 | —             | Kafka + BullMQ | Email delivery, templates, retries        |
| Search Service       | 3007 | Elasticsearch | Kafka          | Full-text search, autocomplete            |

---

## Tech Stack

| Layer            | Technology                           |
| ---------------- | ------------------------------------ |
| Runtime          | Node.js 20+                          |
| Framework        | NestJS 10+ with Microservices module |
| Language         | TypeScript (strict mode)             |
| Synchronous IPC  | gRPC                                 |
| Async Events     | Apache Kafka                         |
| API Gateway      | NestJS HTTP with JWT + rate limiting |
| Primary Database | PostgreSQL 15+ via TypeORM           |
| Document Store   | MongoDB via Mongoose                 |
| Cache            | Redis 7+                             |
| Payment          | Stripe SDK                           |
| Search           | Elasticsearch 8                      |
| Validation       | class-validator + class-transformer  |
| API Docs         | Swagger / OpenAPI                    |
| Testing          | Jest + Supertest                     |
| Containers       | Docker + Docker Compose              |
| CI/CD            | GitHub Actions                       |
| Monorepo         | Turborepo                            |
| Linting          | ESLint + Prettier                    |

---

## Key Engineering Decisions

1. **gRPC for synchronous calls** — Strong contracts via Protobuf, lower latency than REST, bi-directional streaming support for future use.
2. **Kafka for async events** — Durable, ordered, replayable event log. Enables loose coupling and independent scaling of consumers.
3. **MongoDB for products** — Flexible schema suits highly variable product attributes, variants, and nested specs without migration overhead.
4. **Redis for cart** — Ephemeral data with sub-millisecond access; natural TTL expiry for abandoned carts.
5. **Turborepo monorepo** — Shared proto/event contracts with independent service deployment; single CI entry point.
6. **Pessimistic locking for inventory** — Prevents overselling under concurrent purchases using PostgreSQL row-level locks.
7. **Schema-per-service isolation** — Each service owns its data; no shared database access across service boundaries.
8. **API Gateway pattern** — Single entry point simplifies auth, rate limiting, and observability; services never directly exposed.

---

## Prerequisites

- **Node.js** 20+
- **npm** 10+
- **Docker** and **Docker Compose**

---

## Local Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd nestjs-ecommerce-microservices

# 2. Install dependencies
npm install

# 3. Copy environment files
for dir in apps/*/; do
  cp "$dir/.env.example" "$dir/.env" 2>/dev/null || true
done

# 4. Start infrastructure services
docker compose up -d postgresql mongodb redis zookeeper kafka elasticsearch

# 5. Run all services in dev mode
npm run dev
```

---

## Running Individual Services

```bash
# Run a single service
npm run dev --workspace=@app/user-service

# Build a single service
npm run build --workspace=@app/order-service
```

---

## Running the Full Stack via Docker Compose

```bash
# Build and start everything (all 8 services + infra)
docker compose up --build

# Production overlay
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

Only the API Gateway (`port 3000`) is publicly exposed. All other services communicate internally.

---

## Running Tests

```bash
# Run all tests across all packages
npm run test

# Run tests for a specific service
npm run test --workspace=@app/order-service

# Typecheck the whole workspace
npm run typecheck

# Lint
npm run lint

# Format check
npm run format:check
```

Each service enforces **80% coverage threshold** in its Jest configuration.

---

## API Endpoints (via API Gateway)

All endpoints are prefixed with `/api/v1`.

### Auth

| Method | Path                    | Auth   | Description              |
| ------ | ----------------------- | ------ | ------------------------ |
| POST   | `/auth/register`        | —      | Register a new user      |
| POST   | `/auth/login`           | —      | Login and receive tokens |
| POST   | `/auth/refresh`         | —      | Rotate refresh token     |
| POST   | `/auth/logout`          | Bearer | Logout                   |
| POST   | `/auth/forgot-password` | —      | Start password reset     |
| POST   | `/auth/reset-password`  | —      | Complete password reset  |

### Products

| Method | Path                    | Auth           | Description                    |
| ------ | ----------------------- | -------------- | ------------------------------ |
| GET    | `/products`             | —              | List with filters + pagination |
| POST   | `/products`             | Bearer (admin) | Create product                 |
| GET    | `/products/search`      | —              | Full-text Elasticsearch search |
| GET    | `/products/:id`         | —              | Get product by ID              |
| PATCH  | `/products/:id`         | Bearer (admin) | Update product                 |
| DELETE | `/products/:id`         | Bearer (admin) | Delete product                 |
| GET    | `/products/:id/reviews` | —              | List reviews                   |
| POST   | `/products/:id/reviews` | Bearer         | Create review                  |

### Cart

| Method | Path                     | Auth   | Description          |
| ------ | ------------------------ | ------ | -------------------- |
| GET    | `/cart`                  | Bearer | Get current cart     |
| POST   | `/cart/items`            | Bearer | Add item to cart     |
| PATCH  | `/cart/items/:productId` | Bearer | Update item quantity |
| DELETE | `/cart/items/:productId` | Bearer | Remove item          |
| DELETE | `/cart`                  | Bearer | Clear cart           |

### Orders

| Method | Path                   | Auth   | Description            |
| ------ | ---------------------- | ------ | ---------------------- |
| POST   | `/orders`              | Bearer | Create order from cart |
| GET    | `/orders`              | Bearer | List user orders       |
| GET    | `/orders/:id`          | Bearer | Get order detail       |
| POST   | `/orders/:id/cancel`   | Bearer | Cancel order           |
| GET    | `/orders/:id/tracking` | Bearer | Tracking info          |

### Payments

| Method | Path                   | Auth   | Description           |
| ------ | ---------------------- | ------ | --------------------- |
| POST   | `/payments/intent`     | Bearer | Create payment intent |
| POST   | `/payments/confirm`    | Bearer | Confirm payment       |
| POST   | `/payments/webhooks`   | —      | Stripe webhook        |
| GET    | `/payments/history`    | Bearer | Payment history       |
| POST   | `/payments/:id/refund` | Bearer | Refund payment        |

### Users

| Method | Path                      | Auth   | Description    |
| ------ | ------------------------- | ------ | -------------- |
| GET    | `/users/me`               | Bearer | Get profile    |
| PATCH  | `/users/me`               | Bearer | Update profile |
| GET    | `/users/me/addresses`     | Bearer | List addresses |
| POST   | `/users/me/addresses`     | Bearer | Add address    |
| PATCH  | `/users/me/addresses/:id` | Bearer | Update address |
| DELETE | `/users/me/addresses/:id` | Bearer | Delete address |

### Swagger

Interactive API docs available at: `http://localhost:3000/api/docs`

---

## Kafka Topics Reference

| Topic                          | Producer          | Consumers               |
| ------------------------------ | ----------------- | ----------------------- |
| `order.created`                | Order Service     | Inventory, Notification |
| `order.confirmed`              | Order Service     | Payment                 |
| `order.cancelled`              | Order Service     | Inventory, Notification |
| `order.shipped`                | Order Service     | Notification            |
| `order.delivered`              | Order Service     | Inventory               |
| `payment.initiated`            | Payment Service   | —                       |
| `payment.succeeded`            | Payment Service   | Order                   |
| `payment.failed`               | Payment Service   | Order, Notification     |
| `payment.refunded`             | Payment Service   | —                       |
| `inventory.reserved`           | Inventory Service | Order                   |
| `inventory.reservation_failed` | Inventory Service | Order                   |
| `inventory.stock_low`          | Inventory Service | Notification            |
| `product.created`              | Product Service   | Search                  |
| `product.updated`              | Product Service   | Search                  |
| `product.deleted`              | Product Service   | Search                  |
| `user.registered`              | User Service      | Notification            |
| `user.password_reset`          | User Service      | Notification            |

**Event envelope** — every event includes: `{ eventId, eventType, timestamp, version, payload }`. `eventId` is used for idempotency.

---

## gRPC Service Definitions

Proto files are in `libs/proto/`:

- **`user.proto`** — `CreateUser`, `GetUser`, `ValidateToken`, `UpdateUser`
- **`product.proto`** — `GetProduct`, `SearchProducts`
- **`order.proto`** — `CreateOrder`, `GetOrder`
- **`inventory.proto`** — `ReserveStock`, `ReleaseStock`

---

## Environment Variables

Each service has an `.env.example` file. Key variables:

| Variable                  | Services                                                 | Description                   |
| ------------------------- | -------------------------------------------------------- | ----------------------------- |
| `PORT`                    | All                                                      | HTTP port for the service     |
| `DATABASE_URL`            | User, Order, Inventory, Payment                          | PostgreSQL connection string  |
| `MONGODB_URI`             | Product                                                  | MongoDB connection string     |
| `REDIS_URL`               | Gateway, Order, Product, Payment, Notification           | Redis connection string       |
| `KAFKA_BROKERS`           | Product, Order, Inventory, Payment, Notification, Search | Kafka broker addresses        |
| `ELASTICSEARCH_URL`       | Product, Search                                          | Elasticsearch URL             |
| `JWT_SECRET`              | Gateway, User                                            | JWT signing secret            |
| `STRIPE_SECRET_KEY`       | Payment                                                  | Stripe API key                |
| `STRIPE_WEBHOOK_SECRET`   | Payment                                                  | Stripe webhook signing secret |
| `SMTP_HOST` / `SMTP_PORT` | Notification                                             | Mail server config            |
| `USER_GRPC_URL`           | User                                                     | gRPC listen address           |

---

## Docker Compose Services

| Service              | Port            | Notes            |
| -------------------- | --------------- | ---------------- |
| api-gateway          | 3000            | Only public port |
| user-service         | 3001 (internal) | + gRPC on 50051  |
| product-service      | 3002 (internal) |                  |
| order-service        | 3003 (internal) |                  |
| inventory-service    | 3004 (internal) |                  |
| payment-service      | 3005 (internal) |                  |
| notification-service | 3006 (internal) |                  |
| search-service       | 3007 (internal) |                  |
| postgresql           | 5432            |                  |
| mongodb              | 27017           |                  |
| redis                | 6379            |                  |
| zookeeper            | 2181            |                  |
| kafka                | 9092            |                  |
| elasticsearch        | 9200            |                  |
| kafdrop              | 9000            | Kafka UI for dev |

---

## Project Structure

```
nestjs-ecommerce-microservices/
├── apps/
│   ├── api-gateway/          # HTTP entry point
│   ├── user-service/         # Authentication & users
│   ├── product-service/      # Product catalog
│   ├── order-service/        # Order lifecycle
│   ├── inventory-service/    # Stock management
│   ├── payment-service/      # Stripe integration
│   ├── notification-service/ # Email & notifications
│   └── search-service/       # Elasticsearch indexing
├── libs/
│   ├── common/               # Guards, filters, interceptors, pipes
│   ├── proto/                # gRPC Protobuf definitions
│   ├── events/               # Kafka event types & envelope
│   └── contracts/            # Shared DTOs & interfaces
├── docker/                   # Per-service Dockerfiles
├── .github/workflows/        # CI pipeline
├── docker-compose.yml        # Dev environment
├── docker-compose.prod.yml   # Production overlay
├── turbo.json                # Turborepo config
├── tsconfig.base.json        # Shared TS config (strict)
└── package.json              # Workspace root
```

---

## Contributing

### Branch Naming

```
feat/<service>/<description>    e.g. feat/order-service/add-state-machine
fix/<service>/<description>     e.g. fix/inventory-service/race-condition
chore/<scope>/<description>     e.g. chore/ci/add-security-scan
```

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(order-service): implement order lifecycle state machine
fix(inventory-service): resolve race condition in stock reservation
test(user-service): add integration tests for auth endpoints
chore(ci): add GitHub Actions pipeline
docs(readme): add architecture diagram
```

### Development Flow

1. Create a feature branch from `develop`
2. Implement changes with tests
3. Ensure `npm run typecheck && npm run lint && npm run test` passes
4. Open a pull request

---

## License

MIT
