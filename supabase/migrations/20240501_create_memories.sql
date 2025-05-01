-- Create memories table
create table public.memories (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  image_url text,
  created_at timestamptz default now(),
  created_by uuid references auth.users(id) on delete cascade,
  group_id uuid references public.groups(id) on delete cascade
);

-- Enable RLS
alter table public.memories enable row level security;

-- RLS Policies
create policy "Only group members can view memories"
  on public.memories for select
  using (exists (
    select 1 from public.group_members
    where group_id = memories.group_id and user_id = auth.uid()
  ));

create policy "Only group members can create memories"
  on public.memories for insert
  with check (exists (
    select 1 from public.group_members
    where group_id = memories.group_id and user_id = auth.uid()
  ));

-- Function to create a new memory
create or replace function public.create_memory(
  p_title text,
  p_description text,
  p_image_url text,
  p_group_id uuid
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_memory_id uuid;
begin
  -- Verify if user is a member of the group
  if not exists (
    select 1 from public.group_members
    where group_id = p_group_id and user_id = auth.uid()
  ) then
    raise exception 'User is not a member of this group';
  end if;

  -- Insert new memory
  insert into public.memories (
    title,
    description,
    image_url,
    group_id,
    created_by
  )
  values (
    p_title,
    p_description,
    p_image_url,
    p_group_id,
    auth.uid()
  )
  returning id into v_memory_id;

  return v_memory_id;
end;
$$;
