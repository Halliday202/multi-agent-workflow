# Master Agent Workflow Registry (Flutter + Dart)

This registry documents all solved, deterministic mobile workflow patterns, their expected JSON schemas, and their associated native Dart handlers.

When the Master Agent evaluates a mobile task request, it matches it against this registry before considering sub-agent delegation.

---

## 1. Solved Mobile Workflow Patterns

### 1.1 `MODEL_CONTRACT_SYNC`
* **Trigger**: Updates to Freezed data models, API DTOs, or layer boundaries.
* **Deterministic Native Handler**: `DispatcherExecutor.updateMobileArchitectureContract()`
* **Action Schema**:
```json
{
  "action": "MODEL_CONTRACT_SYNC",
  "payload": {
    "modelName": "UserModel",
    "layer": "Data",
    "details": "Added avatarUrl field to UserModel Freezed class"
  }
}
```

### 1.2 `PROVIDER_STATE_UPDATE`
* **Trigger**: Updates to Riverpod state providers or notifier signatures.
* **Deterministic Native Handler**: `DispatcherExecutor.updateProviderState()`
* **Action Schema**:
```json
{
  "action": "PROVIDER_STATE_UPDATE",
  "payload": {
    "providerName": "userStateNotifierProvider",
    "actionType": "STATE_REFRESH",
    "details": "Trigger state refresh on login state update"
  }
}
```

### 1.3 `MOBILE_DECISION_LOG`
* **Trigger**: Mobile architectural decision logging.
* **Deterministic Native Handler**: `DispatcherExecutor.logMobileDecision()`
* **Action Schema**:
```json
{
  "action": "MOBILE_DECISION_LOG",
  "payload": {
    "title": "State Management Choice",
    "context": "Managing global state",
    "decision": "Standardized on Riverpod NotifierProvider",
    "consequence": "No direct UI state mutation"
  }
}
```

### 1.4 `MOBILE_CONSOLIDATED_WORKFLOW`
* **Trigger**: Multi-step mobile maintenance combining contract sync, decision logging, and task status tracking.
* **Deterministic Native Handler**: `DispatcherExecutor.executeMobileWorkflow()`
* **Action Schema**:
```json
{
  "action": "MOBILE_CONSOLIDATED_WORKFLOW",
  "payload": {
    "contract": { "modelName": "...", "layer": "...", "details": "..." },
    "decision": { "title": "...", "context": "...", "decision": "...", "consequence": "..." },
    "taskUpdate": { "category": "Done", "task": "..." }
  }
}
```

---

## 2. Fallback Criteria (Sub-Agent Delegation)

Sub-agent delegation to `UI`, `Logic`, `Data`, or `QA` triggers ONLY when the user request cannot be validated against any registered schema.
