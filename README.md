# Maison Delulu

A production-style full-stack luxury fashion e-commerce platform built
with **React + Vite**, **Node.js**, **Express**, and **MongoDB**.

## HomePage
<img width="3200" height="1500" alt="image" src="https://github.com/user-attachments/assets/bd9f812c-5aa4-476f-8495-059a77a07d0b" />
<img width="3200" height="1500" alt="image" src="https://github.com/user-attachments/assets/ce0c1f55-bf10-4414-a25a-3174f6116c22" />

## ProductPage
<img width="3200" height="1500" alt="image" src="https://github.com/user-attachments/assets/1365cd84-508c-4205-975f-684aacbd11bd" />
<img width="3200" height="1500" alt="image" src="https://github.com/user-attachments/assets/46ffb352-5c9a-4b75-af8b-7d19b5d3f625" />

## Register
<img width="1600" height="751" alt="image" src="https://github.com/user-attachments/assets/90f5f463-ac43-4889-ad58-7d0dc9d64b59" />

## Email Verification
<img width="1600" height="749" alt="image" src="https://github.com/user-attachments/assets/f430fc14-0114-4f19-8695-4e4249906caf" />

## Admin Dashboard
<img width="3200" height="1496" alt="image" src="https://github.com/user-attachments/assets/8f12ee10-dff5-4b36-ac01-62ef125dd57f" />
<img width="3200" height="1500" alt="image" src="https://github.com/user-attachments/assets/abf4a4dc-62a2-4a22-8bcf-87f3e18ed214" />

## Admin Orders
<img width="3200" height="1498" alt="image" src="https://github.com/user-attachments/assets/91626350-5672-4669-a717-9dc608afcdf6" />


## Features

-   Editorial luxury storefront
-   Customer authentication (JWT)
-   Email verification & password reset
-   Wishlist with guest-to-account sync
-   Cart & demo checkout
-   Journal CMS
-   Admin dashboard
-   Product & Journal CRUD
-   Newsletter management
-   Contact form
-   PostHog analytics & observability
-   Cloudflare Turnstile bot protection

------------------------------------------------------------------------

# Tech Stack

## Frontend

-   React
-   Vite
-   React Router
-   Zustand
-   PostHog JS SDK

## Backend

-   Node.js
-   Express
-   MongoDB (Mongoose)
-   JWT
-   Nodemailer
-   PostHog Node SDK

------------------------------------------------------------------------

# Prerequisites

Install:

-   Node.js (LTS): https://nodejs.org
-   Git: https://git-scm.com
-   MongoDB Atlas (recommended): https://www.mongodb.com/atlas/database

Helpful guide: https://www.mongodb.com/docs/atlas/getting-started/

------------------------------------------------------------------------

# Clone the Repository

``` bash
git clone https://github.com/lofynerd/sample-website.git
cd sample-website
```

------------------------------------------------------------------------

# Install Dependencies

## Client

``` bash
cd client
npm install
```

## Server

``` bash
cd server
npm install
```

------------------------------------------------------------------------

# Third-Party Services

## MongoDB Atlas

Create a free cluster and copy your connection string.

Environment variable:

``` text
MONGODB_URI=
```

Guide: https://www.mongodb.com/docs/atlas/getting-started/

------------------------------------------------------------------------

## Cloudflare Turnstile

Create a Turnstile site.

Guide: https://developers.cloudflare.com/turnstile/get-started/

Client:

``` text
VITE_TURNSTILE_SITE_KEY=
```

Server:

``` text
TURNSTILE_SECRET_KEY=
```

------------------------------------------------------------------------

## PostHog

Create a free project.

Documentation: https://posthog.com/docs

You'll need:

-   Project API Key
-   Personal API Key
-   Project ID
-   Host URL

Client:

``` text
VITE_POSTHOG_KEY=
VITE_POSTHOG_HOST=
```

Server:

``` text
POSTHOG_PROJECT_TOKEN=
POSTHOG_PERSONAL_API_KEY=
POSTHOG_PROJECT_ID=
POSTHOG_HOST=
POSTHOG_APP_HOST=
```

------------------------------------------------------------------------

## Gmail SMTP

Enable 2-Step Verification and create an App Password.

Guide: https://support.google.com/accounts/answer/185833

Environment:

``` text
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=
```

------------------------------------------------------------------------

# Environment Variables

## client/.env

``` env
VITE_POSTHOG_KEY=
VITE_POSTHOG_HOST=
VITE_API_HOST=http://localhost:5000
VITE_TURNSTILE_SITE_KEY=
```

## server/.env

``` env
PORT=5000

MONGODB_URI=

JWT_SECRET=

CLIENT_URL=http://localhost:5173

EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=

POSTHOG_PROJECT_TOKEN=
POSTHOG_HOST=
POSTHOG_PERSONAL_API_KEY=
POSTHOG_PROJECT_ID=
POSTHOG_APP_HOST=

ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=

TURNSTILE_SECRET_KEY=
```

------------------------------------------------------------------------

# Generate Secrets

## JWT Secret

``` bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Admin Password Hash

Generate a bcrypt hash for:

``` text
MaisonDelulu2026!
```

Example:

``` bash
node
```

``` javascript
const bcrypt=require("bcrypt");
bcrypt.hash("MaisonDelulu2026!",10).then(console.log);
```

Paste the generated hash into:

``` text
ADMIN_PASSWORD_HASH=
```

------------------------------------------------------------------------

# Run the Project

## Backend

``` bash
cd server
npm run dev
```

Runs on:

    http://localhost:5000

## Frontend

``` bash
cd client
npm run dev
```

Runs on:

    http://localhost:5173

------------------------------------------------------------------------

# Admin Login

The admin login page is intentionally hidden from the public navigation.

Visit:

    http://localhost:5173/admin/login

Username:

``` text
admin
```

Password:

``` text
MaisonDelulu2026!
```

> **Important:** The password above is only used to generate the bcrypt
> hash stored in `ADMIN_PASSWORD_HASH`. The application never stores the
> plain-text password.

------------------------------------------------------------------------

# First-Time Checklist

-   Configure all environment variables.
-   Start MongoDB Atlas.
-   Start the backend.
-   Start the frontend.
-   Register a customer account.
-   Verify your email.
-   Browse products.
-   Complete a demo checkout.
-   Subscribe to the newsletter.
-   Submit the contact form.
-   Log into the admin dashboard.
-   Create products and journal articles.
-   Explore analytics.

------------------------------------------------------------------------

# Common Issues

## MongoDB won't connect

-   Verify your connection string.
-   Allow your IP in Atlas.
-   Check your database username/password.

## Emails are not sending

-   Use a Gmail App Password.
-   Do not use your normal Gmail password.

## Turnstile fails

-   Verify your Site Key and Secret Key.
-   Add `localhost` as an allowed hostname.

## PostHog isn't showing data

-   Confirm all PostHog environment variables are set.
-   Wait a minute or two for events to appear.

## Admin login fails

-   Ensure `ADMIN_USERNAME=admin`.
-   Ensure `ADMIN_PASSWORD_HASH` is the bcrypt hash of
    `MaisonDelulu2026!`.
-   Restart the server after changing `.env`.

------------------------------------------------------------------------

# License

This repository is intended for educational and portfolio purposes.
