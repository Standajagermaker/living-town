-- Living Town: FIRST database migration. Run in Supabase SQL editor.
-- This creates the multiplayer-ready data structure. The standalone pilot UI
-- currently uses browser localStorage and does NOT yet sync to Supabase.
create extension if not exists pgcrypto;

create table if not exists public.worlds (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  display_name text not null,
  timezone text not null default 'Europe/Berlin',
  created_at timestamptz not null default now()
);
create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  world_id uuid not null references public.worlds(id) on delete cascade,
  slug text not null,
  display_name text not null,
  kind text not null check (kind in ('home','street','business','public','private')),
  x integer not null default 0,
  y integer not null default 0,
  entry_policy text not null default 'public' check (entry_policy in ('public','restricted','private')),
  unique(world_id,slug)
);
create table if not exists public.player_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  handle text not null unique check (length(handle) between 3 and 30),
  created_at timestamptz not null default now()
);
create table if not exists public.player_world_state (
  user_id uuid not null references auth.users(id) on delete cascade,
  world_id uuid not null references public.worlds(id) on delete cascade,
  current_location_id uuid references public.locations(id),
  last_seen_at timestamptz,
  primary key(user_id,world_id)
);
create table if not exists public.player_discoveries (
  user_id uuid not null references auth.users(id) on delete cascade,
  location_id uuid not null references public.locations(id) on delete cascade,
  discovered_at timestamptz not null default now(),
  last_visited_at timestamptz,
  primary key(user_id,location_id)
);
create table if not exists public.npcs (
  id uuid primary key default gen_random_uuid(),
  world_id uuid not null references public.worlds(id) on delete cascade,
  codename text not null,
  public_name text not null,
  home_location_id uuid references public.locations(id),
  current_location_id uuid references public.locations(id),
  personality jsonb not null default '{}'::jsonb,
  private_state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(world_id,codename)
);
create table if not exists public.npc_knowledge (
  user_id uuid not null references auth.users(id) on delete cascade,
  npc_id uuid not null references public.npcs(id) on delete cascade,
  facts jsonb not null default '{}'::jsonb,
  last_interaction_at timestamptz,
  primary key(user_id,npc_id)
);
create table if not exists public.world_events (
  id uuid primary key default gen_random_uuid(),
  world_id uuid not null references public.worlds(id) on delete cascade,
  event_type text not null,
  public_summary text,
  private_payload jsonb not null default '{}'::jsonb,
  happened_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create table if not exists public.dialogue_turns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  npc_id uuid not null references public.npcs(id) on delete cascade,
  client_turn_id uuid not null,
  player_text text not null check (char_length(player_text) <= 2000),
  npc_reply text not null,
  created_at timestamptz not null default now(),
  unique(user_id,client_turn_id)
);
create table if not exists public.player_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

-- RLS: Deny by default for everything not explicitly allowed.
alter table public.worlds enable row level security;
alter table public.locations enable row level security;
alter table public.player_profiles enable row level security;
alter table public.player_world_state enable row level security;
alter table public.player_discoveries enable row level security;
alter table public.npcs enable row level security;
alter table public.npc_knowledge enable row level security;
alter table public.world_events enable row level security;
alter table public.dialogue_turns enable row level security;
alter table public.player_notifications enable row level security;

create policy "world directory read" on public.worlds for select to authenticated using(true);
-- Locations are publicly known on the SERVER; the API must apply individual discovery
-- rules before returning them to clients. Do not add a direct select grant here.
create policy "my profile read" on public.player_profiles for select to authenticated using(auth.uid()=user_id);
create policy "my profile create" on public.player_profiles for insert to authenticated with check(auth.uid()=user_id);
create policy "my profile update" on public.player_profiles for update to authenticated using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "my state read" on public.player_world_state for select to authenticated using(auth.uid()=user_id);
create policy "my discoveries read" on public.player_discoveries for select to authenticated using(auth.uid()=user_id);
create policy "my NPC knowledge read" on public.npc_knowledge for select to authenticated using(auth.uid()=user_id);
create policy "my dialogues read" on public.dialogue_turns for select to authenticated using(auth.uid()=user_id);
create policy "my notifications read" on public.player_notifications for select to authenticated using(auth.uid()=user_id);
-- IMPORTANT: World state, NPC private info, player scores and dialogue insertion
-- must be mutated only through an authenticated, validating server API.

insert into public.worlds(slug,display_name) values('village-001','Živé městečko') on conflict (slug) do nothing;
with w as (select id from public.worlds where slug='village-001')
insert into public.locations (world_id,slug,display_name,kind,x,y,entry_policy)
select w.id,v.slug,v.title,v.kind,v.x,v.y,v.policy from w cross join (values
 ('home','Tvůj domov','home',0,0,'private'),
 ('street','Ulice','street',1,0,'public'),
 ('bakery','Pekárna','business',2,0,'public'),
 ('square','Náměstí','public',3,1,'public'),
 ('library','Knihovna','public',4,1,'public'),
 ('fitness','Fitness klub','business',2,2,'public'),
 ('private_house','Soukromý dům','private',1,2,'private')
) as v(slug,title,kind,x,y,policy)
on conflict(world_id,slug) do nothing;
