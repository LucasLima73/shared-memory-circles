-- ✅ Não recriar o bucket, ele já existe
-- insert into storage.buckets (id, name, public) values ('group-covers', 'group-covers', true);

-- 🔁 Remover as policies antigas, se estiverem duplicadas
drop policy if exists "Group admins can upload group covers" on storage.objects;
drop policy if exists "Public can view group covers" on storage.objects;

-- ✅ Permitir upload apenas por owners/admins do grupo
create policy "Group admins can upload group covers"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'group-covers' AND
    exists (
      select 1 from public.group_members
      where group_id::text = (storage.foldername(name))[1]
        and user_id = auth.uid()
        and role in ('owner', 'admin')
    )
  );

-- ✅ Permitir leitura pública das imagens de capa do grupo
create policy "Public can view group covers"
  on storage.objects
  for select
  to public
  using (
    bucket_id = 'group-covers'
  );
