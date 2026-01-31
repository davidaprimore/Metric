import { motion } from 'framer-motion';
import {
    User,
    Settings,
    Bell,
    Shield,
    HelpCircle,
    LogOut,
    Award,
    FileCheck,
    ChevronRight,
    Camera
} from 'lucide-react';

export function ProfessionalSettingsScreen({ onSwitchToClient }: { onSwitchToClient: () => void }) {
    const sections = [
        {
            title: 'Perfil Profissional',
            items: [
                { icon: Award, label: 'Especialidades e CRM', value: 'Nutrição Esportiva' },
                { icon: FileCheck, label: 'Documentos e Validação', value: 'Verificado', color: 'text-green-600' },
                { icon: User, label: 'Bio e Fotos', value: 'Editar' },
            ]
        },
        {
            title: 'Preferências',
            items: [
                { icon: Bell, label: 'Notificações', value: 'Ativo' },
                { icon: Shield, label: 'Segurança e Senha', value: '' },
                { icon: HelpCircle, label: 'Suporte Técnico', value: '' },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-32 max-w-[430px] mx-auto overflow-x-hidden">
            {/* Profile Header */}
            <div className="bg-white px-6 pt-safe pb-8 border-b border-gray-100 mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Configurações</h1>

                <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                        <img
                            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop"
                            className="w-24 h-24 rounded-3xl object-cover border-4 border-purple-100 shadow-md"
                            alt="Dr. Ricardo"
                        />
                        <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center border-4 border-white text-white">
                            <Camera className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Dr. Ricardo Silva</h2>
                    <p className="text-gray-500 text-sm mb-4">Nutricionista Esportivo • CRN 12345</p>

                    <button
                        onClick={onSwitchToClient}
                        className="px-6 py-2 bg-purple-50 text-purple-600 rounded-full font-bold text-xs hover:bg-purple-100 transition-colors"
                    >
                        MUDAR PARA MODO CLIENTE
                    </button>
                </div>
            </div>

            {/* Menu Sections */}
            <div className="px-6 space-y-8">
                {sections.map((section, sidx) => (
                    <div key={sidx}>
                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
                            {section.title}
                        </h3>
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-sm">
                            {section.items.map((item, iidx) => (
                                <button
                                    key={iidx}
                                    className={`w-full flex items-center justify-between p-4 active:bg-gray-50 transition-colors ${iidx !== section.items.length - 1 ? 'border-b border-gray-50' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500">
                                            <item.icon className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold text-gray-700">{item.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {item.value && (
                                            <span className={`text-xs font-bold ${item.color || 'text-purple-600'}`}>{item.value}</span>
                                        )}
                                        <ChevronRight className="w-4 h-4 text-gray-300" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                <button className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-3xl font-bold mb-8 active:scale-[0.98] transition-transform">
                    <LogOut className="w-5 h-5" />
                    Sair da Conta
                </button>
            </div>
        </div>
    );
}
