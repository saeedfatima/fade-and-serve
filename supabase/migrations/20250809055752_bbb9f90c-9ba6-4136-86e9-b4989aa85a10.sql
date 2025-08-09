-- Create public avatars bucket
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Public read access for avatars
create policy "Public read access for avatars"
  on storage.objects
  for select
  using (bucket_id = 'avatars');

-- Users can upload their own avatars
create policy "Users can upload their own avatars"
  on storage.objects
  for insert
  with check (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can update their own avatars
create policy "Users can update their own avatars"
  on storage.objects
  for update
  using (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can delete their own avatars
create policy "Users can delete their own avatars"
  on storage.objects
  for delete
  using (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );