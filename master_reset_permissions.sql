-- SCRIPT MESTRE CORRIGIDO (Pode rodar quantas vezes quiser)
-- Este script apaga TUDO (regras novas e antigas) e recria do zero.

-- 1. TABELA PROFILES (PERFIS)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '{}'::jsonb;

-- Apagar regras antigas
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Profiles Read Access" ON public.profiles;
DROP POLICY IF EXISTS "Profiles Update Access" ON public.profiles;
DROP POLICY IF EXISTS "Profiles Insert Access" ON public.profiles;

-- Apagar regras "Master" (para evitar erro de "já existe")
DROP POLICY IF EXISTS "Master: Read Profiles" ON public.profiles;
DROP POLICY IF EXISTS "Master: Update Own Profile" ON public.profiles;
DROP POLICY IF EXISTS "Master: Insert Own Profile" ON public.profiles;

-- Criar regras Master
CREATE POLICY "Master: Read Profiles" ON public.profiles FOR SELECT TO authenticated USING ( true );
CREATE POLICY "Master: Update Own Profile" ON public.profiles FOR UPDATE TO authenticated USING ( auth.uid() = id ) WITH CHECK ( auth.uid() = id );
CREATE POLICY "Master: Insert Own Profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK ( auth.uid() = id );


-- 2. TABELA PROFESSIONAL_DOCUMENTS
ALTER TABLE public.professional_documents ENABLE ROW LEVEL SECURITY;

-- Apagar regras antigas
DROP POLICY IF EXISTS "Allow professionals to insert documents" ON public.professional_documents;
DROP POLICY IF EXISTS "Allow professionals to select documents" ON public.professional_documents;
DROP POLICY IF EXISTS "Allow professionals to update documents" ON public.professional_documents;
DROP POLICY IF EXISTS "Professional Docs Policy" ON public.professional_documents;
DROP POLICY IF EXISTS "Professional Docs Owner Access" ON public.professional_documents;
DROP POLICY IF EXISTS "Fix: Owner Upsert" ON public.professional_documents;
DROP POLICY IF EXISTS "Fix: Owner Update" ON public.professional_documents;

-- Apagar regras "Master"
DROP POLICY IF EXISTS "Master: Table Docs Access" ON public.professional_documents;

-- Criar regras Master
CREATE POLICY "Master: Table Docs Access" ON public.professional_documents FOR ALL TO authenticated
USING ( true )
WITH CHECK ( auth.uid() = profile_id );

-- 2.1 ÍNDICE ÚNICO (Essencial para o Upsert funcionar)
CREATE UNIQUE INDEX IF NOT EXISTS idx_prof_docs_unique_type 
ON public.professional_documents (profile_id, document_type);


-- 3. STORAGE (ARQUIVOS)
-- Apagar regras antigas
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Storage Access" ON storage.objects;
DROP POLICY IF EXISTS "Storage Full Access" ON storage.objects;
DROP POLICY IF EXISTS "Storage Final Audit Access" ON storage.objects;

-- Apagar regras "Master"
DROP POLICY IF EXISTS "Master: Storage Full Access" ON storage.objects;

-- Criar regra Master
CREATE POLICY "Master: Storage Full Access" ON storage.objects FOR ALL TO authenticated
USING ( bucket_id = 'documents' )
WITH CHECK ( bucket_id = 'documents' );


-- 4. NOTIFICAÇÕES
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Notify Access" ON public.notifications;

-- Apagar regras "Master"
DROP POLICY IF EXISTS "Master: Notifications Access" ON public.notifications;

-- Criar regra Master
CREATE POLICY "Master: Notifications Access" ON public.notifications FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. PERMISSÕES GERAIS
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
