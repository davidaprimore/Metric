-- CORREÇÃO DE ESTRUTURA DO BANCO (INDÍCES)

-- Para que o "salvamento triplo" funcione na tabela de backup, precisamos garantir que 
-- não haja duplicidade de documentos do mesmo tipo para o mesmo usuário.

-- 1. Tentar criar o índice único (se já existir, não faz nada)
CREATE UNIQUE INDEX IF NOT EXISTS idx_prof_docs_unique_type 
ON public.professional_documents (profile_id, document_type);

-- 2. Reforçar permissões na tabela (garantia)
ALTER TABLE public.professional_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fix: Owner Upsert" 
ON public.professional_documents 
FOR INSERT 
TO authenticated 
WITH CHECK ( auth.uid() = profile_id );

CREATE POLICY "Fix: Owner Update" 
ON public.professional_documents 
FOR UPDATE 
TO authenticated 
USING ( auth.uid() = profile_id )
WITH CHECK ( auth.uid() = profile_id );

-- 3. Grant usage sequences (prevents ID errors)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
