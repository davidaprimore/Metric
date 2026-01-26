# Plano de Implementação: Redesign do Story de Resultados (Antes e Depois)

Este plano detalha o redesign da tela de resultados (`ResultsScreen.tsx`) para um formato premium de Instagram Story (9:16), com foco em comparação por colunas e estética de luxo natural.

## 1. Ativos (Assets)
- [x] Gerar imagem de fundo `natural_premium_bg.png` (Mármore Carrara + Jardim Tropical).
- [x] Mover imagem para `public/assets/dashboard-bgs/`.

## 2. Redesign do `SlideSummary` em `ResultsScreen.tsx`
- **Layout de Colunas**: Alterar a estrutura de `ComparisonRow` para um layout que permita ver claramente "Antes" e "Depois" lado a lado ou em uma grade de colunas.
- **Estética Superior**:
    - Reduzir o blur excessivo para garantir nitidez.
    - Usar tipografia premium e cores harmonizadas (Ouro/Slate).
    - Adicionar micro-animações com `framer-motion`.
- **Título Dinâmico**: Manter e destacar o título "Minha evolução em X dias".

## 3. Melhorias de Legibilidade
- Ajustar contrastes e overlays para que o texto se destaque no fundo de mármore.
- Garantir que todas as métricas sejam fáceis de ler rapidamente (formato Story).

## 4. Tarefas Técnicas
1. **Mover Arquivos**: Copiar a imagem gerada para o local correto.
2. **Atualizar `ResultsScreen.tsx`**:
    - Implementar nova estrutura de colunas.
    - Ajustar estilos CSS/Tailwind.
3. **Verificação**:
    - Testar responsividade (foco em 9:16).
    - Verificar carregamento da imagem.

## 5. Perguntas Socráticas (Gate)
1. Devemos incluir as fotos de antes e depois (se disponíveis no banco) ou focar apenas nos números das métricas?
2. Para o compartilhamento no Instagram, você prefere que o botão gere uma imagem para download ou tente usar a API de compartilhamento nativa (Web Share API)?
3. A ordem das métricas (Peso, Gordura, Massa Magra, Massa Gorda) está correta ou gostaria de priorizar algum indicador específico no topo?
