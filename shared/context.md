# System Architecture and Constraints

## Tech Stack
* Framework: Next.js (App Router)
* Database: Supabase (PostgreSQL)
* Language: TypeScript
* Styling: Tailwind CSS

## Directory Structure
* `/app`: Contains all Next.js page routes and server components.
* `/components`: Contains reusable client and server UI components.
* `/lib`: Contains utility functions and Supabase client initializers.
* `/types`: Contains global TypeScript interface definitions.

## Coding Rules
* Prioritize React Server Components. Use `"use client"` only when interactivity or browser APIs are required.
* All database queries must run through the Supabase client.
* Strictly type all function parameters and return values. Avoid using `any`.
* Use functional React components with hooks.