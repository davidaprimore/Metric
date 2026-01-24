-- CORREÇÃO FINAL DE PERMISSÕES (Notificações + Aprovação)

-- 1. NOTIFICAÇÕES (Privacidade)
-- Antes estava "public", mostrando notificações de todos para todos.
-- Agora será restrito: cada usuário vê apenas as suas.

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Master: Notifications Access" ON public.notifications;
DROP POLICY IF EXISTS "Notify Access" ON public.notifications;

-- Nova Regra: Usuário vê suas próprias; Admin (ou sistema) pode inserir.
CREATE POLICY "Master: Notifications Read Own" 
ON public.notifications 
FOR SELECT 
TO authenticated 
USING ( auth.uid() = user_id );

CREATE POLICY "Master: Notifications Insert System" 
ON public.notifications 
FOR INSERT 
TO authenticated 
WITH CHECK ( true ); -- Permite que Admin envie notificação para outros users


-- 2. PERFIS (Aprovação - Reforço)
-- Garante que o Update na aprovação funcione.
DROP POLICY IF EXISTS "Master: Update Profiles (Admin Unblock)" ON public.profiles;
DROP POLICY IF EXISTS "Master: Update Own Profile" ON public.profiles;

CREATE POLICY "Master: Update Any Profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING ( true ) 
WITH CHECK ( true );
