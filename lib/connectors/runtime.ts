import { getWhiteBoardroomConnector, whiteBoardroomConnectors } from "./registry";

export type ConnectorAction = "open" | "import" | "export" | "present" | "edit" | "create" | "share" | "sync" | "legacy-import";

export interface ConnectorExecutionRequest {
  connectorId: string;
  action: ConnectorAction;
  clientId?: string;
  projectId?: string;
  resourceId?: string;
}

export interface ConnectorExecutionPlan {
  allowed: boolean;
  requiresAuth: boolean;
  authProvider?: string;
  connectorId: string;
  action: ConnectorAction;
  reason?: string;
}

export function listWhiteBoardroomTools() {
  return whiteBoardroomConnectors.map((connector) => ({
    ...connector,
    connected: false,
  }));
}

export function planConnectorExecution(request: ConnectorExecutionRequest): ConnectorExecutionPlan {
  const connector = getWhiteBoardroomConnector(request.connectorId);

  if (!connector) {
    return {
      allowed: false,
      requiresAuth: false,
      connectorId: request.connectorId,
      action: request.action,
      reason: "Unknown connector.",
    };
  }

  if (!connector.capabilities.includes(request.action)) {
    return {
      allowed: false,
      requiresAuth: false,
      connectorId: connector.id,
      action: request.action,
      reason: `${connector.label} does not support ${request.action}.`,
    };
  }

  if (connector.status === "legacy") {
    return {
      allowed: request.action === "legacy-import" || request.action === "import" || request.action === "export",
      requiresAuth: false,
      connectorId: connector.id,
      action: request.action,
      reason: "Legacy workflow; conversion/import adapter required.",
    };
  }

  return {
    allowed: true,
    requiresAuth: connector.status === "requires-auth",
    authProvider: connector.authProvider,
    connectorId: connector.id,
    action: request.action,
  };
}
