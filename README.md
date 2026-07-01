# True Auth

True Auth is a robust, production-ready authentication and authorization service built with Node.js, Express, TypeScript, and Prisma ORM. It provides a solid foundation for managing users, sessions, and secure tokens.

## Features

- **User Management**: Registration, login, and profile management.
- **Role-Based Access Control (RBAC)**: Support for User and Admin roles.
- **Session & Refresh Token Management**: Uses **JWT** for short-lived access tokens and secure **Refresh Token Rotation** for long-lived sessions.
- **Action Token Management**: Handle secure, time-limited tokens for specific actions like Email Verification and Password Resets.
- **Database**: PostgreSQL integrated via Prisma ORM for type-safe database interactions.
- **Security**: Password hashing with bcrypt, JWT for stateless authentication, and secure email token deliveries via Nodemailer.

## Tech Stack

- **Framework**: Express (Node.js)
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Package Manager**: pnpm

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- [Docker](https://www.docker.com/) & Docker Compose (for running the PostgreSQL database locally)

### Installation & Setup

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/Cristlopezr/true-auth
   cd true-auth
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Environment Variables Configuration**:
   Copy the template environment file and update it with your own values:
   ```bash
   cp .env.template .env
   ```
   *Make sure to configure the `JWT_SECRET`, database credentials, and email credentials (`EMAIL_ADDRESS`, `GMAIL_APP_PASSWORD`) in your `.env` file.*

4. **Start the Database**:
   Use Docker Compose to spin up the local PostgreSQL database:
   ```bash
   docker-compose up -d
   ```

5. **Run Database Migrations**:
   Sync your Prisma schema with the database and generate the Prisma Client:
   ```bash
   pnpm dlx prisma db push
   # OR
   pnpm dlx prisma migrate dev
   
   pnpm dlx prisma generate
   ```

6. **Start the Development Server**:
   Start the application in development mode with hot-reloading:
   ```bash
   pnpm run dev
   ```
   
   The server will start, typically on `http://localhost:3000` (depending on your `PORT` environment variable).

## Building for Production

To build the project for production, run:

```bash
pnpm run build
```

This will compile the TypeScript code into the `dist` folder.
To start the production build:

```bash
pnpm start
```