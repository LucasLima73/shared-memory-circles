
-- Create groups table
create table public.groups (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  image_url text,
  is_private boolean default false,
  created_at timestamptz default now(),
  created_by uuid references auth.users(id) on delete cascade
);

-- Create group_members table
create table public.group_members (
  group_id uuid references public.groups(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'member')),
  joined_at timestamptz default now(),
  primary key (group_id, user_id)
);

-- Create group_photos table
create table public.group_photos (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references public.groups(id) on delete cascade,
  uploaded_by uuid references auth.users(id) on delete cascade,
  url text not null,
  caption text,
  uploaded_at timestamptz default now()
);

-- Create comments table
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  user_id uuid references auth.users(id) on delete cascade,
  photo_id uuid references public.group_photos(id) on delete cascade,
  group_id uuid references public.groups(id) on delete cascade,
  created_at timestamptz default now(),
  check (
    (photo_id is null and group_id is not null) or
    (photo_id is not null and group_id is null)
  )
);

-- Enable RLS
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.group_photos enable row level security;
alter table public.comments enable row level security;

-- RLS Policies
create policy "Public groups are viewable by everyone"
  on public.groups for select
  using (not is_private or exists (
    select 1 from public.group_members
    where group_id = id and user_id = auth.uid()
  ));

create policy "Group members can view private groups"
  on public.group_members for select
  using (true);

create policy "Only group members can view photos"
  on public.group_photos for select
  using (exists (
    select 1 from public.group_members
    where group_id = group_photos.group_id and user_id = auth.uid()
  ));

create policy "Only group members can comment"
  on public.comments for insert
  with check (exists (
    select 1 from public.group_members
    where (group_id = comments.group_id or group_id = (
      select group_id from public.group_photos where id = comments.photo_id
    )) and user_id = auth.uid()
  ));
