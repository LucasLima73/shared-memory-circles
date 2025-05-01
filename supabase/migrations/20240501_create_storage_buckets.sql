-- Create storage buckets for groups and memories if they don't exist
insert into storage.buckets (id, name, public)
values 
  ('group-covers', 'group-covers', true),
  ('memory-images', 'memory-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies to allow authenticated users to upload
create policy "Allow authenticated users to upload group covers"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'group-covers');

create policy "Allow authenticated users to read group covers"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'group-covers');

create policy "Allow authenticated users to upload memory images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'memory-images');

create policy "Allow authenticated users to read memory images"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'memory-images');
