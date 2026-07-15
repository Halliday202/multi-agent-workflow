# Project Context & Architecture

## System Architecture Summary
This is a cross-platform mobile application built using Flutter and Dart. The project enforces a strict separation of concerns using three architectural layers: Presentation (UI), Business Logic (State), and Data (Repositories).

## Tech Stack & Ecosystem
* Framework: Flutter
* Language: Dart
* State Management: Riverpod
* Network Client: Dio
* Code Generation & Modeling: Freezed

## Layer Contracts & Boundaries
1. UI Layer (/lib/ui): Restricted to visual widgets. No state manipulation or network calls.
2. Logic Layer (/lib/logic): Contains Riverpod providers. Manages app state and connects UI to Data.
3. Data Layer (/lib/data): Handles API requests, local databases, and hardware integrations. Returns fully typed Freezed models.

## Data Contracts & Model Registry
<!-- Master Agent: Document all Freezed data models, API endpoints, and provider names here as they are created -->