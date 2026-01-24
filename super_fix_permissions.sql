-- SOLUÇÃO DEFINITIVA PARA DOCUMENTOS E PERMISSÕES

-- 1. Adicionar coluna 'documents' na tabela de perfis (profiles)
-- Isso permite salvar os links dos documentos direto no perfil do usuário,
-- sem depender da tabela 'professional_documents' ou de listar arquivos do Storage.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '{}'::jsonb;

-- 2. Garantir permissões na tabela PROFILES
-- Permitir que o usuário atualize seu próprio perfil (para salvar os docs)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING ( id = auth.uid() )
WITH CHECK ( id = auth.uid() );

-- Permitir que todos (especialmente Admin) leiam todos os perfis
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
CREATE POLICY "Enable read access for all users"
ON public.profiles FOR SELECT
TO authenticated
USING ( true );

-- 3. Liberar TOTALMENTE o Storage 'documents' para usuários logados
-- Isso resolve o erro de upload "row-level security policy"
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Storage Access" ON storage.objects;

CREATE POLICY "Storage Full Access"
ON storage.objects FOR ALL
TO authenticated
USING ( bucket_id = 'documents' )
WITH CHECK ( bucket_id = 'documents' );

-- 4. Garantir tabela de notificações
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('success', 'error', 'warning', 'info')) DEFAULT 'info',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Políticas de notificações
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
CREATE POLICY "Users can read own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING ( auth.uid() = user_id );

-- Permitir inserir para outros (para Admin notificar usuário)
DROP POLICY IF EXISTS "Allow insert notifications" ON public.notifications;
CREATE POLICY "Allow insert notifications"
ON public.notifications FOR INSERT
TO authenticated
WITH CHECK ( true );
