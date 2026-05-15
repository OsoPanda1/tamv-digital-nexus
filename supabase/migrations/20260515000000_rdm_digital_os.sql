-- RDM Digital Territorial OS MVP tables.
create table if not exists public.rdm_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text not null default 'citizen',
  created_at timestamptz not null default now()
);

create table if not exists public.rdm_wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.rdm_users(id) on delete cascade,
  balance numeric(14,2) not null default 0,
  currency text not null default 'MSR',
  updated_at timestamptz not null default now()
);

create table if not exists public.rdm_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.rdm_users(id) on delete cascade,
  amount numeric(14,2) not null,
  type text not null,
  evidence_hash text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.rdm_places (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  lat double precision not null,
  lng double precision not null,
  tags text[] not null default '{}'::text[],
  unique (name, type)
);

create table if not exists public.rdm_commerces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  owner_user_id uuid references public.rdm_users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.rdm_payment_intents (
  id uuid primary key default gen_random_uuid(),
  amount numeric(14,2) not null,
  currency text not null default 'mxn',
  status text not null,
  provider text not null,
  external_id text,
  created_at timestamptz not null default now()
);

insert into public.rdm_places (name, type, lat, lng, tags)
values
  ('Nodo Cero TAMV', 'governance', 19.4326, -99.1332, array['operación','gobernanza']),
  ('Plaza Cuántica', 'commerce', 20.6597, -103.3496, array['comercio','msr']),
  ('UTAMV Campus Digital', 'education', 25.6866, -100.3161, array['educación','certificación']),
  ('Nodo Salud BookPI', 'health', 21.1619, -86.8515, array['salud','evidencia'])
on conflict do nothing;

create index if not exists idx_rdm_transactions_user_created on public.rdm_transactions(user_id, created_at desc);
create index if not exists idx_rdm_places_type on public.rdm_places(type);
