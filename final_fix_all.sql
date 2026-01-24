-- CORREÇÃO FINAL E DEFINITIVA (SCHEMA + PERMISSÕES)

-- 1. CORREÇÃO DA TABELA PROFILES (O Erro da tela vermelha)
-- O erro dizia que faltava a coluna 'rejection_reason'. Vamos criar todas que podem faltar.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS has_pending_docs BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS specialties JSONB; -- Caso falte

-- 2. CORREÇÃO DAS NOTIFICAÇÕES (Privacidade - Admin não vê as do User)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Limpa regras antigas de notificação
DROP POLICY IF EXISTS "Master: Notifications Access" ON public.notifications;
DROP POLICY IF EXISTS "Notify Access" ON public.notifications;
DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Master: Notifications Read Own" ON public.notifications;
DROP POLICY IF EXISTS "Master: Notifications Insert System" ON public.notifications;

-- Cria regras Corretas
-- A. Leitura: Cada um vê a SUA (auth.uid() = user_id)
CREATE POLICY "Final: Notifications Read Own" 
ON public.notifications 
FOR SELECT 
TO authenticated 
USING ( auth.uid() = user_id );

-- B. Escrita: Qualquer um autificado pode inserir (para o sistema mandar msg para outro)
CREATE POLICY "Final: Notifications Insert Any" 
ON public.notifications 
FOR INSERT 
TO authenticated 
WITH CHECK ( true );


-- 3. CORREÇÃO DA APROVAÇÃO (UPDATE Bloqueado)
-- Garante que o Admin consiga mudar o status para 'approved'
DROP POLICY IF EXISTS "Master: Update Profiles (Admin Unblock)" ON public.profiles;
DROP POLICY IF EXISTS "Master: Update Own Profile" ON public.profiles;
DROP POLICY IF EXISTS "Master: Update Any Profile" ON public.profiles;

CREATE POLICY "Final: Update Profiles Full" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING ( true ) 
WITH CHECK ( true );

-- 4. GRANT FINAL (Para garantir que nada foi revogado)
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
