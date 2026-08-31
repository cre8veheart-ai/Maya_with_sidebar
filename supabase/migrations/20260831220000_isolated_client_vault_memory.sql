-- MAYA durable sessions and isolated client-vault memory
-- Server-owned tables. Every relationship carries workspace_id so records
-- cannot be linked across workspaces, even accidentally.

create extension if not exists pgcrypto;

create table if not exists public.maya_client_vaults (
  workspace_id text not null,
  client_id text not null,
  name text not null,
  status text not null default 'active'
    check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (workspace_id, client_id)
);

create table if not exists public.maya_sessions (
  workspace_id text not null,
  session_id text not null,
  title text not null default 'Maya session',
  surface text not null,
  executive_role text,
  client_id text,
  project_id text,
  participants jsonb not null default '[]'::jsonb,
  resume_state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (workspace_id, session_id),
  constraint maya_sessions_role_check check (
    executive_role is null or executive_role in
      ('ceo','coo','cmo','cfo','cto','cio','cro','cd','admin','hr','legal')
  ),
  constraint maya_sessions_client_fk
    foreign key (workspace_id, client_id)
    references public.maya_client_vaults (workspace_id, client_id)
    on update cascade on delete restrict
);

create table if not exists public.maya_session_messages (
  workspace_id text not null,
  session_id text not null,
  message_id uuid not null default gen_random_uuid(),
  sequence_no bigint generated always as identity,
  role text not null check (role in ('user', 'assistant')),
  content text not null check (char_length(content) between 1 and 32000),
  created_at timestamptz not null default now(),
  primary key (workspace_id, session_id, message_id),
  unique (workspace_id, session_id, sequence_no),
  constraint maya_session_messages_session_fk
    foreign key (workspace_id, session_id)
    references public.maya_sessions (workspace_id, session_id)
    on update cascade on delete cascade
);

create table if not exists public.maya_memory_entries (
  workspace_id text not null,
  memory_id uuid not null default gen_random_uuid(),
  scope text not null check (scope in ('shared','executive','client','project','surface')),
  kind text not null check (kind in ('fact','decision','preference','project','client','knowledge','intel','artifact','connector','state')),
  executive_role text,
  client_id text,
  project_id text,
  surface text,
  content text not null check (char_length(content) between 1 and 16000),
  source_session_id text,
  status text not null default 'active'
    check (status in ('active','superseded','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (workspace_id, memory_id),
  constraint maya_memory_scope_shape check (
    (scope = 'shared' and executive_role is null and client_id is null and project_id is null and surface is null) or
    (scope = 'executive' and executive_role is not null and client_id is null and project_id is null and surface is null) or
    (scope = 'client' and executive_role is null and client_id is not null and project_id is null and surface is null) or
    (scope = 'project' and executive_role is null and client_id is null and project_id is not null and surface is null) or
    (scope = 'surface' and executive_role is null and client_id is null and project_id is null and surface is not null)
  ),
  constraint maya_memory_client_fk
    foreign key (workspace_id, client_id)
    references public.maya_client_vaults (workspace_id, client_id)
    on update cascade on delete restrict
);

create index if not exists maya_sessions_recent_idx
  on public.maya_sessions (workspace_id, updated_at desc);
create index if not exists maya_sessions_client_idx
  on public.maya_sessions (workspace_id, client_id, updated_at desc);
create index if not exists maya_messages_session_idx
  on public.maya_session_messages (workspace_id, session_id, sequence_no);
create index if not exists maya_memory_scope_idx
  on public.maya_memory_entries (workspace_id, scope, updated_at desc)
  where status = 'active';
create index if not exists maya_memory_client_idx
  on public.maya_memory_entries (workspace_id, client_id, updated_at desc)
  where status = 'active' and client_id is not null;

alter table public.maya_client_vaults enable row level security;
alter table public.maya_sessions enable row level security;
alter table public.maya_session_messages enable row level security;
alter table public.maya_memory_entries enable row level security;

-- No browser policies. Only server routes holding the service-role secret may
-- access these records, and those routes derive workspace_id from signed auth.
revoke all on public.maya_client_vaults from anon, authenticated;
revoke all on public.maya_sessions from anon, authenticated;
revoke all on public.maya_session_messages from anon, authenticated;
revoke all on public.maya_memory_entries from anon, authenticated;
revoke all on sequence public.maya_session_messages_sequence_no_seq from anon, authenticated;

grant select, insert, update, delete on public.maya_client_vaults to service_role;
grant select, insert, update, delete on public.maya_sessions to service_role;
grant select, insert, update, delete on public.maya_session_messages to service_role;
grant select, insert, update, delete on public.maya_memory_entries to service_role;
grant usage, select on sequence public.maya_session_messages_sequence_no_seq to service_role;
