# Granting Admin Access to Supabase

Para que eu (o Agente AI) possa criar tabelas, corrigir o banco de dados e ter acesso total sem restrições (Bypassing RLS), preciso da **Service Role Key**.

## Passo a Passo

1.  Vá no seu **Supabase Dashboard** > **Project Settings** > **API**.
2.  Encontre a chave `service_role` (secret). **CUIDADO**: Essa chave tem poder total. Não a exponha no frontend (Git).
3.  Abra o arquivo `.env` na raiz do projeto (crie se não existir).
4.  Adicione a linha:
    ```env
    SUPABASE_SERVICE_ROLE_KEY=eyJh...... (sua chave aqui)
    ```

## Como eu usarei isso?
Quando você tiver essa chave no `.env`, eu posso criar scripts chamando:
```javascript
const supabaseAdmin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY);
```
Isso me permite rodar comandos SQL, deletar usuários, criar tabelas e migrações diretamente via código, sem que você precise ir ao painel rodar SQL manualmente.
