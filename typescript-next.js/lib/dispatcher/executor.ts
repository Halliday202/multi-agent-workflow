import * as fs from 'fs/promises';
import * as path from 'path';
import {
  ApiContractSyncPayloadSchema,
  DecisionLogPayloadSchema,
  TaskTrackerUpdatePayloadSchema,
  ConsolidatedWorkflowPayloadSchema,
} from './schemas';
import { z } from 'zod';

type ApiContractSyncPayload = z.infer<typeof ApiContractSyncPayloadSchema>;
type DecisionLogPayload = z.infer<typeof DecisionLogPayloadSchema>;
type TaskTrackerUpdatePayload = z.infer<typeof TaskTrackerUpdatePayloadSchema>;
type ConsolidatedWorkflowPayload = z.infer<typeof ConsolidatedWorkflowPayloadSchema>;

const SHARED_DIR = path.join(process.cwd(), 'shared');
const CONTEXT_PATH = path.join(SHARED_DIR, 'context.md');
const DECISIONS_PATH = path.join(SHARED_DIR, 'decisions.md');
const TRACKER_PATH = path.join(SHARED_DIR, 'tracker.md');

/**
 * Consolidated Native Functions for Master Agent Dispatcher
 */

export async function updateContextContract(payload: ApiContractSyncPayload): Promise<{ success: boolean; message: string }> {
  try {
    let content = await fs.readFile(CONTEXT_PATH, 'utf-8');
    const entry = `\n### ${payload.section}\n* ${payload.content}\n`;
    content += entry;
    await fs.writeFile(CONTEXT_PATH, content, 'utf-8');
    return { success: true, message: `Updated API contract section: ${payload.section}` };
  } catch (error: any) {
    return { success: false, message: `Failed to update context contract: ${error.message}` };
  }
}

export async function appendDecision(payload: DecisionLogPayload): Promise<{ success: boolean; message: string }> {
  try {
    let content = await fs.readFile(DECISIONS_PATH, 'utf-8');
    const matches = content.match(/## Decision \d+/g);
    const count = matches ? matches.length + 1 : 1;
    const dateStr = new Date().toISOString().split('T')[0];

    const entry = `\n## Decision ${count}: ${payload.title}\n* Date: ${dateStr}\n* Status: Accepted\n* Context: ${payload.context}\n* Decision: ${payload.decision}\n* Consequence: ${payload.consequence}\n`;

    content += entry;
    await fs.writeFile(DECISIONS_PATH, content, 'utf-8');
    return { success: true, message: `Appended Decision ${count}: ${payload.title}` };
  } catch (error: any) {
    return { success: false, message: `Failed to append decision: ${error.message}` };
  }
}

export async function updateTrackerTasks(payload: TaskTrackerUpdatePayload): Promise<{ success: boolean; message: string }> {
  try {
    let content = await fs.readFile(TRACKER_PATH, 'utf-8');
    for (const update of payload.updates) {
      const taskLine = `* [ ] ${update.task}`;
      const completedLine = `* [x] ${update.task}`;
      if (update.category === 'Done' && content.includes(taskLine)) {
        content = content.replace(taskLine, completedLine);
      } else if (!content.includes(update.task)) {
        const categoryHeader = `## ${update.category}`;
        if (content.includes(categoryHeader)) {
          content = content.replace(categoryHeader, `${categoryHeader}\n* [ ] ${update.task}`);
        }
      }
    }
    await fs.writeFile(TRACKER_PATH, content, 'utf-8');
    return { success: true, message: `Updated task tracker with ${payload.updates.length} item(s)` };
  } catch (error: any) {
    return { success: false, message: `Failed to update tracker: ${error.message}` };
  }
}

export async function executeBatchNativeWorkflow(payload: ConsolidatedWorkflowPayload): Promise<{ success: boolean; results: string[] }> {
  const results: string[] = [];

  if (payload.contractUpdate) {
    const res = await updateContextContract(payload.contractUpdate);
    results.push(res.message);
  }

  if (payload.decisionLog) {
    const res = await appendDecision(payload.decisionLog);
    results.push(res.message);
  }

  if (payload.trackerUpdates && payload.trackerUpdates.length > 0) {
    const res = await updateTrackerTasks({ updates: payload.trackerUpdates });
    results.push(res.message);
  }

  return { success: true, results };
}
