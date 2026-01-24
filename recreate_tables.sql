-- RECRIAÇÃO TOTAL DA TABELA DE DOCUMENTOS
-- Atenção: Isso apaga o histórico de documentos da tabela de backup (não do Storage).

DROP TABLE IF EXISTS public.professional_documents;

CREATE TABLE public.professional_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES auth.users(id),
    document_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'refused'
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RECRIA O ÍNDICE ÚNICO (Essencial para o código funcionar)
CREATE UNIQUE INDEX idx_prof_docs_unique_type 
ON public.professional_documents (profile_id, document_type);

-- RECRIAR AS PERMISSÕES (Policies)
ALTER TABLE public.professional_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Master: Table Docs Access" 
ON public.professional_documents 
FOR ALL 
TO authenticated
USING ( true )
WITH CHECK ( auth.uid() = profile_id );

-- Garante permissões de Grant
GRANT ALL ON TABLE public.professional_documents TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
