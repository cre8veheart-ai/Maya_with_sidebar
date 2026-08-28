import { NextResponse } from "next/server";
import { listWhiteBoardroomTools, planConnectorExecution } from "@/lib/connectors/runtime";

export async function GET() {
  return NextResponse.json({
    room: "The Situation Room Experience",
    connectors: listWhiteBoardroomTools(),
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.connectorId !== "string" || typeof body.action !== "string") {
    return NextResponse.json(
      { error: "connectorId and action are required" },
      { status: 400 },
    );
  }

  const plan = planConnectorExecution({
    connectorId: body.connectorId,
    action: body.action,
    clientId: typeof body.clientId === "string" ? body.clientId : undefined,
    projectId: typeof body.projectId === "string" ? body.projectId : undefined,
    resourceId: typeof body.resourceId === "string" ? body.resourceId : undefined,
  });

  return NextResponse.json({ plan }, { status: plan.allowed ? 200 : 400 });
}
