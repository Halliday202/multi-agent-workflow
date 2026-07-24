/// Sealed Class Hierarchy for Flutter/Dart Master Dispatcher Payloads

enum MobileActionType {
  modelContractSync,
  providerStateUpdate,
  mobileDecisionLog,
  mobileConsolidatedWorkflow,
}

/// Maps SCREAMING_CASE JSON action strings to enum values
const _actionJsonMap = <String, MobileActionType>{
  'MODEL_CONTRACT_SYNC': MobileActionType.modelContractSync,
  'PROVIDER_STATE_UPDATE': MobileActionType.providerStateUpdate,
  'MOBILE_DECISION_LOG': MobileActionType.mobileDecisionLog,
  'MOBILE_CONSOLIDATED_WORKFLOW': MobileActionType.mobileConsolidatedWorkflow,
};

enum MobileLayerAgent {
  ui,
  logic,
  data,
  qa,
}

sealed class DispatcherPayload {
  const DispatcherPayload();

  factory DispatcherPayload.fromJson(Map<String, dynamic> json) {
    final type = json['type'] as String?;
    if (type == 'NATIVE_EXECUTION') {
      return NativeTaskPayload.fromJson(json);
    } else if (type == 'SUBAGENT_DELEGATION') {
      return SubAgentFallbackPayload.fromJson(json);
    } else {
      throw FormatException('Unknown DispatcherPayload type: $type');
    }
  }
}

final class NativeTaskPayload extends DispatcherPayload {
  final MobileActionType action;
  final Map<String, dynamic> payload;

  const NativeTaskPayload({
    required this.action,
    required this.payload,
  });

  factory NativeTaskPayload.fromJson(Map<String, dynamic> json) {
    final actionStr = json['action'] as String;
    final action = _actionJsonMap[actionStr];
    if (action == null) {
      throw FormatException('Unknown MobileActionType: $actionStr');
    }
    return NativeTaskPayload(
      action: action,
      payload: (json['payload'] as Map<String, dynamic>?) ?? {},
    );
  }
}

final class SubAgentFallbackPayload extends DispatcherPayload {
  final String reason;
  final MobileLayerAgent assignedAgent;
  final String taskId;
  final String objective;
  final List<String> allowedScope;
  final List<String> forbiddenScope;
  final List<String> dependencies;
  final List<String> contextToRead;
  final List<String> acceptanceCriteria;

  const SubAgentFallbackPayload({
    required this.reason,
    required this.assignedAgent,
    required this.taskId,
    required this.objective,
    required this.allowedScope,
    required this.forbiddenScope,
    required this.dependencies,
    required this.contextToRead,
    required this.acceptanceCriteria,
  });

  factory SubAgentFallbackPayload.fromJson(Map<String, dynamic> json) {
    final payloadMap = (json['payload'] as Map<String, dynamic>?) ?? {};
    final agentStr = payloadMap['assignedAgent'] as String? ?? 'ui';
    final agent = MobileLayerAgent.values.firstWhere(
      (e) => e.name.toLowerCase() == agentStr.toLowerCase(),
      orElse: () => MobileLayerAgent.ui,
    );

    return SubAgentFallbackPayload(
      reason: json['reason'] as String? ?? 'Unstructured request fallback',
      assignedAgent: agent,
      taskId: payloadMap['taskId'] as String? ?? 'TASK-000',
      objective: payloadMap['objective'] as String? ?? '',
      allowedScope: List<String>.from(payloadMap['allowedScope'] ?? []),
      forbiddenScope: List<String>.from(payloadMap['forbiddenScope'] ?? []),
      dependencies: List<String>.from(payloadMap['dependencies'] ?? []),
      contextToRead: List<String>.from(payloadMap['contextToRead'] ?? []),
      acceptanceCriteria: List<String>.from(payloadMap['acceptanceCriteria'] ?? []),
    );
  }
}
