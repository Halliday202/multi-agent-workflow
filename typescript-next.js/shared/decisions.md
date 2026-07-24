# Architecture Decision Log

## Decision 1: Authentication Method
* Date: [Current Date]
* Status: Accepted
* Context: We needed a secure way to manage user sessions across server and client components.
* Decision: We will use Supabase Auth with SSR (Server-Side Rendering) cookies.
* Consequence: The integration agent must always configure middleware to refresh auth tokens on route changes.

## Decision 2: State Management
* Date: [Current Date]
* Status: Accepted
* Context: The application requires managing UI state without prop drilling.
* Decision: We will use React Context for global state and local component state for UI toggles.
* Consequence: The frontend agent should not install Redux or Zustand.

## Decision 3: Deterministic-First Schema-Driven Multi-Agent Architecture
* Date: 2026-07-24
* Status: Accepted
* Context: Multi-agent reasoning loops were repeatedly consuming tokens on already-solved workflow patterns and dynamic scripts.
* Decision: Master Agent acts strictly as a deterministic dispatcher. Known task patterns output Zod-validated JSON payloads that execute native functions directly. Sub-agents are invoked only as a fallback.
* Consequence: Reduced token consumption, eliminated runtime script generation, and enforced predictable execution paths via WORKFLOW_REGISTRY.md.