import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    FileText,
    Check,
    X,
    Clock,
    Save
} from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { Button } from '@/components/ui/Button';

// Placeholder data since we don't have a full document fetching flow yet in this step
const mockDocs = [
    { id: 1, title: 'Documento de Identidade (CPF/RG)', name: 'identidade_frente_verso.pdf', status: 'pending' },
    { id: 2, title: 'Registro Profissional (CRM/CREF)', name: 'registro_conselho_2023.pdf', status: 'pending' },
    { id: 3, title: 'Certificado de Especialização', name: 'pos_graduacao_especialidade.pdf', status: 'approved' }
];

export const ProfessionalVerificationScreen: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F1F3F5] pb-32 font-sans px-5">
            <header className="pt-8 flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/admin/registrations/professionals')}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-dark active:scale-95 transition-transform"
                >
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-xl font-bold text-dark">
                    Verificar <span className="text-indigo-600">Documentos</span>
                </h1>
            </header>

            {/* Profile Header */}
            <div className="bg-white p-4 rounded-[2rem] shadow-sm mb-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-indigo-100 p-0.5 overflow-hidden">
                    <img
                        src="https://ui-avatars.com/api/?name=Ricardo+Silva&background=10b981&color=fff"
                        alt="Avatar"
                        className="w-full h-full rounded-full object-cover"
                    />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-dark">Dr. Ricardo Silva</h2>
                    <p className="text-xs text-gray-400 font-medium">CRM: 12345-SP</p>
                    <div className="mt-1 inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-md">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                        <span className="text-[9px] font-black uppercase">Aguardando Revisão</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center px-2 mb-4">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Anexos para Validar</h3>
                <span className="text-xs font-bold text-indigo-500">3 Pendentes</span>
            </div>

            <div className="space-y-4">
                {mockDocs.map((doc) => (
                    <div key={doc.id} className="bg-white p-5 rounded-[2rem] shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="max-w-[70%]">
                                <h4 className="text-sm font-bold text-dark leading-tight mb-1">{doc.title}</h4>
                                <p className="text-[10px] text-gray-400 truncate underline decoration-gray-300">{doc.name}</p>
                            </div>
                            <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <FileText className="text-gray-400" />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 h-10 rounded-xl border border-indigo-100 text-indigo-500 font-bold text-xs flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors">
                                <X size={16} />
                                Reprovar
                            </button>
                            <button className="flex-1 h-10 rounded-xl bg-[#a3e635] text-dark font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#8cc62d] transition-colors shadow-md shadow-lime-500/20">
                                <Check size={16} />
                                Aprovar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Observations */}
            <div className="mt-8">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2 mb-4">Observações Adicionais</h3>
                <textarea
                    className="w-full h-32 bg-white rounded-[2rem] p-5 text-sm font-medium outline-none resize-none shadow-sm placeholder:text-gray-300"
                    placeholder="Ex: Documento de identidade com data de validade expirada..."
                />
            </div>

            <div className="mt-8">
                <Button
                    variant="primary"
                    className="w-full h-14 rounded-2xl bg-[#a3e635] text-dark font-black uppercase tracking-wide hover:bg-[#8cc62d] shadow-lg shadow-lime-500/20 flex items-center justify-center gap-3"
                >
                    <Save size={20} />
                    Salvar Status
                </Button>
            </div>

            <BottomNav />
        </div>
    );
};
