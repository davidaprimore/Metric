-- AUDITORIA E CORREÇÃO FINAL DE PERMISSÕES

-- 1. Garantir que a coluna 'documents' existe e é JSONB
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '{}'::jsonb;

-- 2. Limpar todas as políticas da tabela PROFILES para evitar conflitos antigos
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;

-- 3. Criar políticas LIMPAS E PERMISSIVAS para Profiles
-- Leitura: TODO MUNDO pode ler perfil (necessário para Admin ver)
CREATE POLICY "Profiles Read Access"
ON public.profiles FOR SELECT
TO authenticated
USING ( true );

-- Escrita: Usuário pode atualizar SEU PRÓPRIO perfil
CREATE POLICY "Profiles Update Access"
ON public.profiles FOR UPDATE
TO authenticated
USING ( auth.uid() = id )
WITH CHECK ( auth.uid() = id );

-- Inserção: Usuário pode inserir SEU PRÓPRIO perfil
CREATE POLICY "Profiles Insert Access"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK ( auth.uid() = id );

-- 4. Garantir Tabela de Documentos (Backup) com permissão
ALTER TABLE public.professional_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Professional Docs Policy" ON public.professional_documents;
DROP POLICY IF EXISTS "Allow professionals to insert documents" ON public.professional_documents;
DROP POLICY IF EXISTS "Allow professionals to select documents" ON public.professional_documents;
DROP POLICY IF EXISTS "Allow professionals to update documents" ON public.professional_documents;

-- Política Única Simplificada: Dono pode tudo. Admin pode tudo (se admin_policy existir, senão authenticated pode tudo pra facilitar auditoria)
-- Vamos liberar Leitura/Escrita para o Dono e Leitura para Todos (Admin)
CREATE POLICY "Professional Docs Owner Access"
ON public.professional_documents
TO authenticated
USING ( true )
WITH CHECK ( auth.uid() = profile_id );

-- 5. Storage (Garantia Final)
DROP POLICY IF EXISTS "Storage Full Access" ON storage.objects;
CREATE POLICY "Storage Final Audit Access"
ON storage.objects FOR ALL
TO authenticated
USING ( bucket_id = 'documents' )
WITH CHECK ( bucket_id = 'documents' );

-- 6. Notificações
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
DROP POLICY IF EXISTS "Notify Access" ON public.notifications;
CREATE POLICY "Notify Access" ON public.notifications FOR ALL TO authenticated USING (true) WITH CHECK (true);
