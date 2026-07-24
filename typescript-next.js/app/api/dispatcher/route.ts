import { MasterDispatcherDecisionSchema } from '@/lib/dispatcher/schemas';
import {
  updateContextContract,
  appendDecision,
  updateTrackerTasks,
  executeBatchNativeWorkflow,
} from '@/lib/dispatcher/executor';

/**
 * Route Handler / Server Action for Master Agent Dispatcher
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validate incoming decision payload using Zod schema
    const parseResult = MasterDispatcherDecisionSchema.safeParse(body);

    if (!parseResult.success) {
      return Response.json(
        {
          success: false,
          error: 'INVALID_DISPATCH_SCHEMA',
          details: parseResult.error.format(),
        },
        { status: 400 }
      );
    }

    const decision = parseResult.data;

    // 2. Deterministic execution or Sub-agent delegation fallback
    if (decision.type === 'NATIVE_EXECUTION') {
      switch (decision.action) {
        case 'API_CONTRACT_SYNC':
          const contractRes = await updateContextContract(decision.payload as any);
          return Response.json({ status: 'EXECUTED_NATIVELY', result: contractRes });

        case 'DECISION_LOG':
          const decisionRes = await appendDecision(decision.payload as any);
          return Response.json({ status: 'EXECUTED_NATIVELY', result: decisionRes });

        case 'TASK_TRACKER_UPDATE':
          const trackerRes = await updateTrackerTasks(decision.payload as any);
          return Response.json({ status: 'EXECUTED_NATIVELY', result: trackerRes });

        case 'CONSOLIDATED_WORKFLOW_EXECUTE':
          const batchRes = await executeBatchNativeWorkflow(decision.payload as any);
          return Response.json({ status: 'EXECUTED_NATIVELY', result: batchRes });

        default:
          return Response.json({ success: false, error: 'UNKNOWN_NATIVE_ACTION' }, { status: 400 });
      }
    }

    // 3. Fallback to sub-agent delegation prompt response
    if (decision.type === 'SUBAGENT_DELEGATION') {
      return Response.json({
        status: 'DELEGATED_TO_SUBAGENT',
        reason: decision.reason,
        subAgentPromptPayload: decision.payload,
      });
    }

    return Response.json({ success: false, error: 'UNHANDLED_DECISION_TYPE' }, { status: 500 });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
