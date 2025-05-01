-- Criar tabela de grupos
create table public.groups (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  image_url text,
  is_private boolean default false,
  allow_all_photos boolean default false,
  created_at timestamptz default now(),
  created_by uuid not null references auth.users(id) on delete cascade
);

-- Ativar Row Level Security (RLS)
alter table public.groups enable row level security;

-- Permitir leitura de grupos públicos ou onde o usuário é membro
create policy "Public groups are viewable by everyone"
  on public.groups
  for select
  using (
    not is_private or exists (
      select 1 from public.group_members
      where group_id = id and user_id = auth.uid()
    )
  );

-- 🚨 Corrigir: Permitir criação apenas se created_by = auth.uid()
drop policy if exists "Users can create groups" on public.groups;

create policy "Users can create groups"
  on public.groups
  for insert
  with check (auth.uid() = created_by);

-- Permitir atualização se o usuário for admin ou owner
create policy "Users can update their own groups"
  on public.groups
  for update
  using (
    exists (
      select 1 from public.group_members
      where group_id = id
        and user_id = auth.uid()
        and role in ('owner', 'admin')
    )
  );

-- Permitir exclusão se o usuário for o owner
create policy "Users can delete their own groups"
  on public.groups
  for delete
  using (
    exists (
      select 1 from public.group_members
      where group_id = id
        and user_id = auth.uid()
        and role = 'owner'
    )
  );
