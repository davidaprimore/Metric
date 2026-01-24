-- CORREÇÃO FINAL DE SCHEMA
-- O erro no log mostrava que esta coluna faltava na tabela profiles.

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS has_pending_docs BOOLEAN DEFAULT FALSE;

-- Garante que o JSONB também esteja lá (redundância)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '{}'::jsonb;
