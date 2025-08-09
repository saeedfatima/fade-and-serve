-- Create public avatars bucket if not exists
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Create policies idempotently using DO blocks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read access for avatars'
  ) THEN
    EXECUTE $$
      CREATE POLICY "Public read access for avatars"
      ON storage.objects
      FOR SELECT
      USING (bucket_id = 'avatars');
    $$;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can upload their own avatars'
  ) THEN
    EXECUTE $$
      CREATE POLICY "Users can upload their own avatars"
      ON storage.objects
      FOR INSERT
      WITH CHECK (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
      );
    $$;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can update their own avatars'
  ) THEN
    EXECUTE $$
      CREATE POLICY "Users can update their own avatars"
      ON storage.objects
      FOR UPDATE
      USING (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
      );
    $$;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can delete their own avatars'
  ) THEN
    EXECUTE $$
      CREATE POLICY "Users can delete their own avatars"
      ON storage.objects
      FOR DELETE
      USING (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
      );
    $$;
  END IF;
END $$;