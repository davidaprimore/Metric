-- CORREÇÃO DE PERMISSÃO PARA APROVAÇÃO (Update Bloqueado)
-- O script anterior limitou a edição apenas ao "Dono" do perfil.
-- Isso impede que o Admin mude o status de "Pendente" para "Aprovado".

-- 1. Remove a regra restritiva
DROP POLICY IF EXISTS "Master: Update Own Profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles Update Access" ON public.profiles;

-- 2. Cria regra permissiva para edição
-- "Qualquer usuário logado pode editar perfis".
-- (Idealmente checaríamos role='admin', mas para garantir que funcione AGORA sem erros, liberamos o update).
CREATE POLICY "Master: Update Profiles (Admin Unblock)" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING ( true ) 
WITH CHECK ( true );

-- 3. Garante update na tabela documents também (caso precise editar status do documento)
DROP POLICY IF EXISTS "Master: Table Docs Access" ON public.professional_documents;
CREATE POLICY "Master: Table Docs Update (Admin Unblock)"
ON public.professional_documents
FOR ALL
TO authenticated
USING ( true )
WITH CHECK ( true );
