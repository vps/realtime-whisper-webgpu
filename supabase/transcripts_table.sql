-- Table and RLS policy for user transcripts

create table if not exists public.transcripts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  language text not null,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.transcripts enable row level security;

create policy "Allow owner operations" on public.transcripts
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
