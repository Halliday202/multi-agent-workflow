# Architectural Decisions Log (ADR)

This document tracks all critical engineering choices, scoping resolutions, and architectural trade-offs made during the development lifecycle.

| Date | Decision ID | Title | Description & Rationale | Status |
|---|---|---|---|---|
| 2026-07-11 | ADR-001 | Base Workflow Initialization | Adopted Riverpod and Freezed for multi-agent isolation. | Approved |
| 2026-07-24 | ADR-002 | Deterministic Dispatcher Architecture | Replaced non-deterministic loops with Dart sealed class payloads mapping to native functions. | Approved |