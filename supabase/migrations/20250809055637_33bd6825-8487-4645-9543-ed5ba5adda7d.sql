-- Create public avatars bucket if not exists
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Ensure RLS policies for avatars bucket
-- Public read access for avatars
create policy if not exists "Public read access for avatars"
  on storage.objects
  for select
  using (bucket_id = 'avatars');

-- Users can upload files to their own folder (userId/<filename>) in avatars
create policy if not exists "Users can upload their own avatars"
  on storage.objects
  for insert
  with check (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can update their own avatar files
create policy if not exists "Users can update their own avatars"
  on storage.objects
  for update
  using (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can delete their own avatar files
create policy if not exists "Users can delete their own avatars"
  on storage.objects
  for delete
  using (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );