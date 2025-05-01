-- Add allow_all_photos column to groups table
alter table public.groups
add column allow_all_photos boolean default false;

-- Update RLS policy for group_photos to check allow_all_photos
drop policy if exists "Only group members can view photos" on public.group_photos;

create policy "Group members can view photos"
  on public.group_photos for select
  using (exists (
    select 1 from public.group_members
    where group_id = group_photos.group_id and user_id = auth.uid()
  ));

create policy "Members can add photos if allowed"
  on public.group_photos for insert
  with check (
    exists (
      select 1 from public.group_members gm
      join public.groups g on g.id = gm.group_id
      where 
        gm.group_id = group_photos.group_id 
        and gm.user_id = auth.uid()
        and (
          g.allow_all_photos = true 
          or gm.role in ('owner', 'admin')
        )
    )
  );
