-- Add RLS policies for groups table
create policy "Users can create groups"
  on public.groups
  for insert
  with check (auth.uid() is not null);

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
