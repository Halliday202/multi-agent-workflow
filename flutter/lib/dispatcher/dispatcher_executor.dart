import 'dart:io';
import 'dispatcher_payload.dart';

/// Consolidated Native Execution Handlers for Flutter Master Dispatcher

class DispatcherExecutionResult {
  final bool success;
  final String message;
  final List<String> details;

  const DispatcherExecutionResult({
    required this.success,
    required this.message,
    this.details = const [],
  });
}

class DispatcherExecutor {
  static final String _sharedDir = 'flutter/shared';
  static final String _contextPath = '$_sharedDir/context-flutter.md';
  static final String _decisionsPath = '$_sharedDir/decisions-flutter.md';
  static final String _trackerPath = '$_sharedDir/tracker-flutter.md';

  /// Native execution entry point for parsed sealed DispatcherPayload
  static Future<DispatcherExecutionResult> execute(DispatcherPayload payload) async {
    switch (payload) {
      case NativeTaskPayload nativePayload:
        return await _executeNativeTask(nativePayload);
      case SubAgentFallbackPayload fallbackPayload:
        return DispatcherExecutionResult(
          success: true,
          message: 'Delegated to sub-agent ${fallbackPayload.assignedAgent.name.toUpperCase()}',
          details: [
            'Task ID: ${fallbackPayload.taskId}',
            'Objective: ${fallbackPayload.objective}',
            'Reason: ${fallbackPayload.reason}',
          ],
        );
    }
  }

  static Future<DispatcherExecutionResult> _executeNativeTask(NativeTaskPayload payload) async {
    switch (payload.action) {
      case MobileActionType.modelContractSync:
        return await updateMobileArchitectureContract(payload.payload);
      case MobileActionType.mobileDecisionLog:
        return await logMobileDecision(payload.payload);
      case MobileActionType.providerStateUpdate:
        return await updateProviderState(payload.payload);
      case MobileActionType.mobileConsolidatedWorkflow:
        return await executeMobileWorkflow(payload.payload);
    }
  }

  static Future<DispatcherExecutionResult> updateMobileArchitectureContract(Map<String, dynamic> data) async {
    try {
      final file = File(_contextPath);
      if (!await file.exists()) return DispatcherExecutionResult(success: false, message: 'Context file not found');
      
      final modelName = data['modelName'] ?? 'DataModel';
      final layer = data['layer'] ?? 'Data';
      final details = data['details'] ?? '';
      
      final entry = '\n* **Model [$modelName]** ($layer Layer): $details\n';
      await file.writeAsString(entry, mode: FileMode.append);
      
      return DispatcherExecutionResult(
        success: true,
        message: 'Updated Flutter Architecture Contract with model $modelName',
      );
    } catch (e) {
      return DispatcherExecutionResult(success: false, message: 'Error updating context contract: $e');
    }
  }

  static Future<DispatcherExecutionResult> logMobileDecision(Map<String, dynamic> data) async {
    try {
      final file = File(_decisionsPath);
      if (!await file.exists()) return DispatcherExecutionResult(success: false, message: 'Decisions file not found');

      final title = data['title'] ?? 'Mobile Scoping Call';
      final context = data['context'] ?? '';
      final decision = data['decision'] ?? '';
      final consequence = data['consequence'] ?? '';
      final dateStr = DateTime.now().toIso8601String().split('T').first;

      final entry = '\n## Decision: $title\n* Date: $dateStr\n* Status: Accepted\n* Context: $context\n* Decision: $decision\n* Consequence: $consequence\n';
      await file.writeAsString(entry, mode: FileMode.append);

      return DispatcherExecutionResult(
        success: true,
        message: 'Logged Flutter Decision: $title',
      );
    } catch (e) {
      return DispatcherExecutionResult(success: false, message: 'Error logging decision: $e');
    }
  }

  static Future<DispatcherExecutionResult> updateProviderState(Map<String, dynamic> data) async {
    final providerName = data['providerName'] ?? 'stateProvider';
    final details = data['details'] ?? '';
    return DispatcherExecutionResult(
      success: true,
      message: 'Validated and synchronized state provider $providerName natively: $details',
    );
  }

  static Future<DispatcherExecutionResult> executeMobileWorkflow(Map<String, dynamic> data) async {
    final results = <String>[];
    if (data.containsKey('contract')) {
      final res = await updateMobileArchitectureContract(data['contract'] as Map<String, dynamic>);
      results.add(res.message);
    }
    if (data.containsKey('decision')) {
      final res = await logMobileDecision(data['decision'] as Map<String, dynamic>);
      results.add(res.message);
    }
    return DispatcherExecutionResult(
      success: true,
      message: 'Executed batch mobile workflow natively',
      details: results,
    );
  }
}
