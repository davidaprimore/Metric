-- RODA ESTE SCRIPT NO EDITOR SQL DO SUPABASE PARA CORRIGIR OS ERROS DE PERMISSÃO

-- 1. Habilitar upload na bucket 'documents' para usuários autenticados
-- Primeiro removemos políticas antigas para evitar conflitos
drop policy if exists "Allow authenticated uploads" on storage.objects;
drop policy if exists "Allow authenticated reads" on storage.objects;
drop policy if exists "Allow authenticated updates" on storage.objects;
drop policy if exists "Allow authenticated deletes" on storage.objects;

-- Criar nova política de Upload (INSERT)
create policy "Allow authenticated uploads"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'documents' );

-- Criar nova política de Leitura (SELECT)
create policy "Allow authenticated reads"
on storage.objects for select
to authenticated
using ( bucket_id = 'documents' );

-- Criar nova política de Atualização (UPDATE)
create policy "Allow authenticated updates"
on storage.objects for update
to authenticated
using ( bucket_id = 'documents' );

-- 2. Garantir que a tabela professional_documents também aceite inserts (caso queira voltar a usar ela)
drop policy if exists "Allow professionals to insert documents" on public.professional_documents;
drop policy if exists "Allow professionals to select documents" on public.professional_documents;
drop policy if exists "Allow professionals to update documents" on public.professional_documents;

create policy "Allow professionals to insert documents"
on public.professional_documents for insert
to authenticated
with check ( auth.uid() = profile_id );

create policy "Allow professionals to select documents"
on public.professional_documents for select
to authenticated
using ( auth.uid() = profile_id );

create policy "Allow professionals to update documents"
on public.professional_documents for update
to authenticated
using ( auth.uid() = profile_id );

-- 3. Políticas para Admins (Se houver role 'administrador' ou checagem de perfil)
-- Simplificação: Permitir que trigger ou função de admin gerencie tudo, mas estas policies acima já devem desbloquear o uso básico.
