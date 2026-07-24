import { z } from 'zod';

/**
 * Zod schemas for Master Agent Deterministic Dispatcher
 */

export const ApiContractSyncPayloadSchema = z.object({
  section: z.string(),
  content: z.string(),
});

export const DecisionLogPayloadSchema = z.object({
  title: z.string(),
  context: z.string(),
  decision: z.string(),
  consequence: z.string(),
});

export const TaskUpdateSchema = z.object({
  category: z.enum(['Blocked', 'In Progress', 'To Do (Backlog)', 'Done']),
  task: z.string(),
});

export const TaskTrackerUpdatePayloadSchema = z.object({
  updates: z.array(TaskUpdateSchema),
});

export const ConsolidatedWorkflowPayloadSchema = z.object({
  contractUpdate: ApiContractSyncPayloadSchema.optional(),
  decisionLog: DecisionLogPayloadSchema.optional(),
  trackerUpdates: z.array(TaskUpdateSchema).optional(),
});

export const SubAgentDelegationPayloadSchema = z.object({
  assignedAgent: z.enum(['frontend', 'backend', 'integrations', 'qa']),
  taskId: z.string(),
  objective: z.string(),
  allowedScope: z.array(z.string()),
  forbiddenScope: z.array(z.string()),
  dependencies: z.array(z.string()),
  contextToRead: z.array(z.string()),
  acceptanceCriteria: z.array(z.string()),
});

export const MasterDispatcherDecisionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('NATIVE_EXECUTION'),
    action: z.enum([
      'API_CONTRACT_SYNC',
      'DECISION_LOG',
      'TASK_TRACKER_UPDATE',
      'CONSOLIDATED_WORKFLOW_EXECUTE',
    ]),
    payload: z.union([
      ApiContractSyncPayloadSchema,
      DecisionLogPayloadSchema,
      TaskTrackerUpdatePayloadSchema,
      ConsolidatedWorkflowPayloadSchema,
    ]),
  }),
  z.object({
    type: z.literal('SUBAGENT_DELEGATION'),
    reason: z.string(),
    payload: SubAgentDelegationPayloadSchema,
  }),
]);

export type MasterDispatcherDecision = z.infer<typeof MasterDispatcherDecisionSchema>;
