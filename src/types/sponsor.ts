export interface SponsorData {
    id: string;
    companyName: string;           // Ex: "Growth Suplementos"
    productName: string;           // Ex: "Whey Protein Isolado"
    headline: string;              // Ex: "40% OFF para membros"
    description: string;           // Ex: "Apenas hoje no Clube"
    ctaText: string;               // Ex: "Ver Oferta Exclusiva"
    ctaUrl?: string;               // Link para o produto (quando clicar)

    // Cores (hexadecimal) - O admin poderá mudar no painel futuro
    primaryColor: string;          // Ex: "#F97316" (laranja Growth)
    secondaryColor: string;        // Ex: "#DC2626" (vermelho)
    backgroundType: 'gradient' | 'solid' | 'image';
    backgroundValue: string;       // URL da imagem ou cor/CSS

    // Badge
    badgeText: string;             // Ex: "PATROCINADO" ou "OFERTA ESPECIAL"

    // Animações (o admin pode escolher o estilo)
    animationStyle: 'shimmer' | 'pulse' | 'gradient-flow' | 'particles';

    // Mídia
    logoUrl?: string;              // Logo da empresa (canto superior)
    productImageUrl?: string;      // Imagem do produto (futuramente)

    // Controle
    isActive: boolean;             // Se aparece ou não
    startDate: string;             // Quando começa a exibir
    endDate: string;               // Quando para de exibir
    priority: number;              // Ordem de exibição (1 = primeiro)
}
