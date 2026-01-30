import { useState } from 'react';
import { SponsorCardPremium } from './SponsorCardPremium';
import type { SponsorData } from '../types/sponsor';

// Esta é uma ferramenta interna para você testar diferentes layouts de patrocínio
// Antes de contratar o patrocinador, você pode mostrar estas opções para ele escolher

export function SponsorPreviewTool() {
    const [config, setConfig] = useState<SponsorData>({
        id: 'preview',
        companyName: 'Sua Empresa',
        productName: 'Produto Incrível',
        headline: '50% OFF Hoje',
        description: 'A oferta mais esperada do ano',
        ctaText: 'Aproveitar Agora',
        ctaUrl: '#',
        primaryColor: '#8B5CF6',
        secondaryColor: '#EC4899',
        backgroundType: 'gradient',
        backgroundValue: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        badgeText: 'PATROCINADO',
        animationStyle: 'gradient-flow',
        isActive: true,
        startDate: '',
        endDate: '',
        priority: 1
    });

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold">Preview de Patrocínio</h2>

            {/* Preview em tempo real */}
            <div className="max-w-md mx-auto">
                <SponsorCardPremium data={config} />
            </div>

            {/* Controles simplificados */}
            <div className="space-y-4 max-w-md mx-auto bg-white p-6 rounded-2xl shadow-sm">
                <div>
                    <label className="block text-sm font-medium mb-1">Nome da Empresa</label>
                    <input
                        type="text"
                        value={config.companyName}
                        onChange={(e) => setConfig({ ...config, companyName: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Headline</label>
                    <input
                        type="text"
                        value={config.headline}
                        onChange={(e) => setConfig({ ...config, headline: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Cor Principal</label>
                    <input
                        type="color"
                        value={config.primaryColor}
                        onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                        className="w-full h-10 rounded cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
}
