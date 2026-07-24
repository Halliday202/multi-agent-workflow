# Master Agent Workflow Registry (TypeScript + Next.js)

This registry documents all solved, deterministic workflow patterns, their expected JSON schemas, and their associated native execution functions.

When the Master Agent evaluates a task request, it checks this registry to determine if a deterministic execution path exists before considering sub-agent delegation.

---

## 1. Solved Workflow Patterns

### 1.1 `API_CONTRACT_SYNC`
* **Trigger**: Updates to database schemas, API parameters, or system boundaries.
* **Deterministic Native Handler**: `updateContextContract(section, updatePayload)`
* **Action Schema**:
```json
{
  "action": "API_CONTRACT_SYNC",
  "payload": {
    "section": "Data Contracts",
    "content": "Description of new schema or API endpoint contract"
  }
}
```

### 1.2 `DECISION_LOG`
* **Trigger**: Architectural decision logging or scoping resolution.
* **Deterministic Native Handler**: `appendDecision(title, context, decision, consequence)`
* **Action Schema**:
```json
{
  "action": "DECISION_LOG",
  "payload": {
    "title": "Decision title",
    "context": "Context for the decision",
    "decision": "Chosen approach",
    "consequence": "Architectural consequence"
  }
}
```

### 1.3 `TASK_TRACKER_UPDATE`
* **Trigger**: Creating, moving, or updating task statuses in `tracker.md`.
* **Deterministic Native Handler**: `updateTrackerTasks(updates)`
* **Action Schema**:
```json
{
  "action": "TASK_TRACKER_UPDATE",
  "payload": {
    "updates": [
      { "category": "In Progress", "task": "Task description" }
    ]
  }
}
```

### 1.4 `CONSOLIDATED_WORKFLOW_EXECUTE`
* **Trigger**: Multi-step task combining contract update, decision logging, and task status progression into a single execution step.
* **Deterministic Native Handler**: `executeBatchNativeWorkflow(batchPayload)`
* **Action Schema**:
```json
{
  "action": "CONSOLIDATED_WORKFLOW_EXECUTE",
  "payload": {
    "contractUpdate": { "section": "...", "content": "..." },
    "decisionLog": { "title": "...", "context": "...", "decision": "...", "consequence": "..." },
    "trackerUpdates": [ { "category": "Done", "task": "..." } ]
  }
}
```

---

## 2. Fallback Criteria (Sub-Agent Delegation)

If an incoming user request does **not** validate against any registered schema above (e.g. requires novel algorithm implementation, UI redesign, complex refactoring), the Master Agent outputs a `SUBAGENT_DELEGATION` payload specifying:
* Target Agent (`frontend`, `backend`, `integrations`, `qa`)
* Instruction block based on the standardized prompt template.
