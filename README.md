# EcoCycle

EcoCycle is an e-waste collection and recycling coordination web application,
using React/Vite, Express, Mongoose, and MongoDB.

## Prerequisites

- Git, Node.js, and npm compatible with the project dependencies.
- An authorized development or test MongoDB connection for Atlas mode.
- A MongoDB Community executable for the optional local-database mode.

The recorded QA environment used Node.js 20.20.0 and npm 10.8.2.

## Get the project

```sh
git clone https://github.com/Nipuni-Liyange/QA-Ecocycle.git
cd QA-Ecocycle
```

An existing checkout can be used directly. Start the commands below from the
**repository root**, the folder containing `client` and `server`. The repository
can be stored on any drive or in any parent folder.

## Install dependencies

```sh
npm --prefix server ci
npm --prefix client ci
```

## Configure the database

For a fresh setup, create `server/.env` using `server/.env.example` as the template.
Configure `MONGODB_URI`, `PORT`, and `CLIENT_ORIGIN` for the selected environment.
Keep credentials in the private environment file; it is ignored by Git.

For an existing setup, use the environment configuration agreed by the team.
Atlas and local mode use separate databases, accounts, and pickup records.

## Run the application

Open two terminals, each starting at the repository root.

Backend terminal:

```sh
npm --prefix server run dev
```

Frontend terminal:

```sh
npm --prefix client run dev
```

Wait for the backend to report a successful MongoDB connection and startup.
The default API address is `http://127.0.0.1:5000` and the frontend is
[EcoCycle](http://127.0.0.1:4000). Use the actual configured port if overridden.

Register a General User to create pickups or a Recycling Collector to accept and
schedule them. Log in using the registered email, password, and matching role.
The application has no seeded accounts.

## Diagnose a database connection

```sh
npm --prefix server run db:check
```

The diagnostic reports connection errors without printing credentials or changing
database records. Check the configured connection string, Atlas network access,
cluster availability, DNS, and relevant firewall or TLS settings. A TLS handshake
failure alone does not establish that a database password is incorrect.

See [MongoDB connection troubleshooting](https://www.mongodb.com/docs/atlas/troubleshoot-connection/).
After correcting configuration, restart the backend or use nodemon's `rs` command.

## Optional local database

Install MongoDB Community before using local mode. If needed, configure
`MONGOD_BINARY` for the executable installed on the current machine.

From the repository root:

```sh
npm --prefix server run dev:local
```

This starts a separate MongoDB on loopback port 27018, with persistent data under
the ignored `server/.local-data/mongodb` directory. It does not copy Atlas records.
Stop the active backend with Ctrl+C before switching database modes.

## Features

- Short responsive landing page retaining the original hero photograph, image library and branding.
- Real registration/login/logout, bcrypt passwords, revocable MongoDB sessions, HTTP-only cookies and CSRF protection.
- Exactly two roles: General User and Recycling Collector, with direct collector registration.
- Persistent pickup CRUD with up to three private JPG/PNG/WebP photos (2 MB each), previews, removal/replacement on pending requests, validation, search, filters and pagination.
- General User dashboard, requests, editing, tracking and profile.
- Collector dashboard, available pickups, atomic acceptance, scheduling, status updates, history and profile.
- Real database statistics, empty/loading/error states, route protection and ownership enforcement.
- Reduced-motion support, keyboard-accessible forms/dialogs and responsive layouts.

## Checks

Run from the repository root:

```sh
npm --prefix server test
npm --prefix client run lint
npm --prefix client run build
```

The backend integration tests use an isolated MongoDB instance and synthetic data.
They may need an installed MongoDB executable or a downloaded test binary.
Configure `MONGOD_BINARY` when using a custom installation.
Record actual execution results; the commands above are reproducibility instructions.

## QA documentation

The validation-test instructions and analysis evidence are in
[the QA run guide](qa/member2/README.md).
See [the final handoff](qa/member2/final-handoff.md) for recorded results and shared follow-up.

## Application documentation

- [Application behavior, API, and deployment settings](docs/application.md)
- [Photo upload implementation](docs/photo-uploads.md)
- [Pickup tracking](docs/pickup-tracking.md)
- [Historical Phase A notes](docs/phase-a.md)
