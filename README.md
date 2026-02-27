# Chat App

[🇵🇱 Polish](#-polish) | [🇬🇧 English](#-english)

---

## 🇵🇱 Polish

Aplikacja czatu w czasie rzeczywistym umożliwiająca komunikację między znajomymi - zarówno w konwersacjach 1:1, jak i grupowych.

## Tech Stack

| Warstwa          | Technologia           |
| ---------------- | --------------------- |
| Framework        | NestJS 11             |
| Język            | TypeScript 5.7        |
| Baza danych      | PostgreSQL            |
| ORM              | Prisma 7.4            |
| Real-time        | Socket.IO (WebSocket) |
| Dokumentacja API | Swagger / OpenAPI     |
| Package manager  | pnpm                  |
| Testy            | Jest (unit + e2e)     |

---

## Aktualny stan projektu

### Co jest już gotowe

- **Inicjalizacja aplikacji NestJS** - `main.ts` z bootstrapem i konfiguracją Swaggera
- **Swagger UI** - dostępny pod `/api` w środowiskach innych niż production, uwierzytelnianie przez cookie `connect.sid`
- **Schema bazy danych (Prisma)** - pełny schemat z modelami:
  - `User` - konta użytkowników (email, hasło, avatar, status online/offline/away)
  - `Conversation` - konwersacje (direct message lub grupowe)
  - `Message` - wiadomości w konwersacjach
  - `ConversationParticipant` - relacja many-to-many użytkownik ↔ konwersacja (z rolą: member/admin)
  - `Session` - sesje użytkowników z obsługą revoke i expiry
- **Pierwsza migracja** - tabele stworzone w bazie (`20260226204734_init`)
- **Konfiguracja środowiska** - `.env` z `DATABASE_URL`, `PORT` i `NODE_ENV`
- **Narzędzia deweloperskie** - ESLint, Prettier, tsconfig

### Czego jeszcze brakuje

- Moduł autentykacji (rejestracja, logowanie, sesje)
- Moduł użytkowników (CRUD, zarządzanie profilem, status)
- Moduł konwersacji (tworzenie, dodawanie uczestników)
- Moduł wiadomości (wysyłanie, historia, oznaczanie jako przeczytane)
- WebSocket Gateway (real-time wiadomości, status online)
- Instalacja brakujących pakietów (patrz sekcja poniżej)

---

## Schemat bazy danych

```
User ─────────────────────────────────────────┐
 │  id, firstName, lastName, email, password   │
 │  avatar, status, createdAt                  │
 │                                             │
 ├──< Message (senderId)                       │
 │                                             │
 ├──< ConversationParticipant (userId) >──< Conversation
 │       role, joinedAt                         │  id, name, type, createdAt
 │                                             │
 └──< Session                                 └──< Message (conversationId)
       id, expiredAt, revokedAt                     id, content, isRead, createAt
```

---

## Planowane funkcjonalności

### Autentykacja

- Rejestracja konta (email + hasło z hashowaniem bcrypt)
- Logowanie / wylogowanie
- Sesje przechowywane w bazie (model `Session`), uwierzytelnianie przez cookie
- Ochrona endpointów przez Guard

### Użytkownicy

- Pobieranie profilu własnego i innych użytkowników
- Edycja profilu (avatar, imię, nazwisko)
- Status użytkownika - `online` / `offline` / `away` zarządzany przez WebSocket

### Konwersacje

- Tworzenie konwersacji 1:1 (direct message)
- Tworzenie konwersacji grupowych z nazwą
- Lista konwersacji zalogowanego użytkownika
- Dodawanie / usuwanie uczestników z grupy
- Role uczestników: `member` / `admin`

### Wiadomości

- Wysyłanie wiadomości przez REST (zapis do bazy)
- Wysyłanie wiadomości przez WebSocket (real-time delivery)
- Historia wiadomości z paginacją
- Oznaczanie wiadomości jako przeczytane (`isRead`)

### WebSocket (Socket.IO)

- Połączenie i autentykacja przez WebSocket
- Eventy: `message:send`, `message:received`, `user:status`, `conversation:join`
- Pokoje (rooms) per konwersacja
- Broadcast statusu online/offline

---

## Pakiety do dodania

Pakiety wymagane do implementacji planowanych funkcji:

```bash
# Runtime
pnpm add @prisma/client @nestjs/websockets @nestjs/platform-socket.io socket.io
pnpm add bcrypt @types/bcrypt
pnpm add class-validator class-transformer
pnpm add @nestjs/config

# Opcjonalnie
pnpm add helmet  # security headers
```

---

## Struktura modułów (docelowa)

```
src/
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.guard.ts
│   └── dto/
│       ├── register.dto.ts
│       └── login.dto.ts
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── dto/
├── conversations/
│   ├── conversations.module.ts
│   ├── conversations.controller.ts
│   ├── conversations.service.ts
│   └── dto/
├── messages/
│   ├── messages.module.ts
│   ├── messages.controller.ts
│   ├── messages.service.ts
│   └── dto/
├── chat/
│   ├── chat.module.ts
│   └── chat.gateway.ts          ← WebSocket gateway
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── app.module.ts
└── main.ts
```

---

## Uruchomienie projektu

### Wymagania

- Node.js 20+
- pnpm
- PostgreSQL

### Instalacja

```bash
pnpm install
```

### Konfiguracja środowiska

Skopiuj `.env` i uzupełnij wartości:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/chatapp?schema=public"
PORT=5001
NODE_ENV="develop"
```

### Migracje bazy danych

```bash
# Zastosuj migracje
pnpm prisma migrate dev

# Wygeneruj klienta Prisma
pnpm prisma generate
```

### Uruchomienie

```bash
# Tryb developerski (watch)
pnpm start:dev

# Tryb produkcyjny
pnpm start:prod
```

### Swagger UI

Po uruchomieniu dostępny pod: `http://localhost:5001/api`

---

## Testy

```bash
# Testy jednostkowe
pnpm test

# Testy e2e
pnpm test:e2e

# Pokrycie kodu
pnpm test:cov
```

---

## 🇬🇧 English

A real-time chat application enabling communication between friends - in both 1:1 and group conversations.

## Tech Stack

| Layer       | Technology            |
| ----------- | --------------------- |
| Framework   | NestJS 11             |
| Language    | TypeScript 5.7        |
| Database    | PostgreSQL            |
| ORM         | Prisma 7.4            |
| Real-time   | Socket.IO (WebSocket) |
| API Docs    | Swagger / OpenAPI     |
| Package mgr | pnpm                  |
| Testing     | Jest (unit + e2e)     |

---

## Current Project Status

### What's already done

- **NestJS application bootstrap** - `main.ts` with app bootstrap and Swagger configuration
- **Swagger UI** - available at `/api` in non-production environments, authenticated via `connect.sid` cookie
- **Database schema (Prisma)** - full schema with models:
  - `User` - user accounts (email, password, avatar, online/offline/away status)
  - `Conversation` - conversations (direct message or group)
  - `Message` - messages within conversations
  - `ConversationParticipant` - many-to-many relation user ↔ conversation (with role: member/admin)
  - `Session` - user sessions with revoke and expiry support
- **First migration** - tables created in the database (`20260226204734_init`)
- **Environment configuration** - `.env` with `DATABASE_URL`, `PORT` and `NODE_ENV`
- **Developer tooling** - ESLint, Prettier, tsconfig

### What's still missing

- Authentication module (registration, login, sessions)
- Users module (CRUD, profile management, status)
- Conversations module (creation, adding participants)
- Messages module (sending, history, marking as read)
- WebSocket Gateway (real-time messages, online status)
- Installation of missing packages (see section below)

---

## Database Schema

```
User ─────────────────────────────────────────┐
 │  id, firstName, lastName, email, password   │
 │  avatar, status, createdAt                  │
 │                                             │
 ├──< Message (senderId)                       │
 │                                             │
 ├──< ConversationParticipant (userId) >──< Conversation
 │       role, joinedAt                         │  id, name, type, createdAt
 │                                             │
 └──< Session                                 └──< Message (conversationId)
       id, expiredAt, revokedAt                     id, content, isRead, createAt
```

---

## Planned Features

### Authentication

- Account registration (email + password with bcrypt hashing)
- Login / logout
- Sessions stored in the database (`Session` model), authenticated via cookie
- Endpoint protection via Guard

### Users

- Fetching own and other users' profiles
- Profile editing (avatar, first name, last name)
- User status - `online` / `offline` / `away` managed via WebSocket

### Conversations

- Creating 1:1 conversations (direct messages)
- Creating named group conversations
- List of logged-in user's conversations
- Adding / removing participants from a group
- Participant roles: `member` / `admin`

### Messages

- Sending messages via REST (saved to database)
- Sending messages via WebSocket (real-time delivery)
- Message history with pagination
- Marking messages as read (`isRead`)

### WebSocket (Socket.IO)

- Connection and authentication via WebSocket
- Events: `message:send`, `message:received`, `user:status`, `conversation:join`
- Rooms per conversation
- Online/offline status broadcast

---

## Packages to Add

Packages required for implementing planned features:

```bash
# Runtime
pnpm add @prisma/client @nestjs/websockets @nestjs/platform-socket.io socket.io
pnpm add bcrypt @types/bcrypt
pnpm add class-validator class-transformer
pnpm add @nestjs/config

# Optional
pnpm add helmet  # security headers
```

---

## Target Module Structure

```
src/
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.guard.ts
│   └── dto/
│       ├── register.dto.ts
│       └── login.dto.ts
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── dto/
├── conversations/
│   ├── conversations.module.ts
│   ├── conversations.controller.ts
│   ├── conversations.service.ts
│   └── dto/
├── messages/
│   ├── messages.module.ts
│   ├── messages.controller.ts
│   ├── messages.service.ts
│   └── dto/
├── chat/
│   ├── chat.module.ts
│   └── chat.gateway.ts          ← WebSocket gateway
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── app.module.ts
└── main.ts
```

---

## Running the Project

### Requirements

- Node.js 20+
- pnpm
- PostgreSQL

### Installation

```bash
pnpm install
```

### Environment Configuration

Copy `.env` and fill in the values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/chatapp?schema=public"
PORT=5001
NODE_ENV="develop"
```

### Database Migrations

```bash
# Apply migrations
pnpm prisma migrate dev

# Generate Prisma client
pnpm prisma generate
```

### Running

```bash
# Development mode (watch)
pnpm start:dev

# Production mode
pnpm start:prod
```

### Swagger UI

After starting, available at: `http://localhost:5001/api`

---

## Tests

```bash
# Unit tests
pnpm test

# e2e tests
pnpm test:e2e

# Code coverage
pnpm test:cov
```
