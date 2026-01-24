-- ADICIONAR CONTROLE DE ONBOARDING
-- Para saber se o usuário já viu a tela de boas-vindas.

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Garante que quem já existe (se houver algum aprovado antigo) comece como false para ver a tela,
-- ou true se preferir pular. Vamos deixar false (padrão) para o Alex ver a experiência.
