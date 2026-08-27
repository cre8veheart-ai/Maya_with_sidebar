import "server-only";
import { supabaseRest } from "@/lib/supabase/server";

export type MayaPersistenceContext = {
  userId: string;
  workspaceId: string;
  clientId: string | null;
};

type WorkspaceRow = { id: string; owner_id: string };
type ClientRow = { id: string; workspace_id: string };

export async function resolveMayaPersistenceContext(input: {
  userId: string;
  workspaceId?: string | null;
  clientId?: string | null;
}): Promise<MayaPersistenceContext | null> {
  const workspaceParams = new URLSearchParams({
    select: "id,owner_id",
    owner_id: `eq.${input.userId}`,
    limit: "1",
  });
  if (input.workspaceId) workspaceParams.set("id", `eq.${input.workspaceId}`);

  const workspaces = await supabaseRest<WorkspaceRow[]>(`workspaces?${workspaceParams.toString()}`);
  const workspace = workspaces[0];
  if (!workspace) return null;

  if (!input.clientId) {
    return { userId: input.userId, workspaceId: workspace.id, clientId: null };
  }

  const clientParams = new URLSearchParams({
    select: "id,workspace_id",
    id: `eq.${input.clientId}`,
    workspace_id: `eq.${workspace.id}`,
    limit: "1",
  });
  const clients = await supabaseRest<ClientRow[]>(`clients?${clientParams.toString()}`);
  if (clients.length === 0) return null;

  return { userId: input.userId, workspaceId: workspace.id, clientId: input.clientId };
}
