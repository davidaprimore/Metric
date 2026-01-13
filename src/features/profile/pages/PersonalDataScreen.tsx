import React from 'react';
import {
    ChevronLeft,
    MoreVertical,
    Camera,
    CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { BottomNav } from '@/components/layout/BottomNav';

export const PersonalDataScreen: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Using metadata or defaults
    const firstName = user?.user_metadata?.first_name || 'Ricardo';
    const lastName = user?.user_metadata?.last_name || 'Oliveira';
    const email = user?.email || 'ricardo.oliveira@metrik.com.br';
    const birthDate = user?.user_metadata?.birth_date || '12/05/1994';
    const weight = user?.user_metadata?.weight || '62.5';
    const height = user?.user_metadata?.height || '168';
    const cpf = '458.291.003-88'; // Mock CPF

    return (
        <div className="min-h-screen bg-[#F1F3F5] pb-32 font-sans">
            {/* Header */}
            <header className="bg-white px-5 pt-8 pb-4 flex justify-between items-center mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 border border-gray-100 shadow-sm"
                >
                    <ChevronLeft size={24} className="text-dark" />
                </button>
                <div className="flex-1 text-center">
                    <h1 className="text-lg font-bold text-dark">
                        Dados <span className="text-secondary">Pessoais</span>
                    </h1>
                </div>
                <button className="w-10 h-10 flex items-center justify-center">
                    <MoreVertical size={24} className="text-dark" />
                </button>
            </header>

            <div className="px-5">
                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-full border-[3px] border-white p-1 bg-white shadow-xl overflow-hidden">
                            <img
                                src="https://i.pravatar.cc/150?u=Ricardo"
                                alt="Avatar"
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                        <button className="absolute bottom-1 right-1 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                            <Camera size={14} />
                        </button>
                    </div>
                    <button className="mt-4 text-[10px] font-black text-secondary uppercase tracking-[0.2em] hover:underline">
                        Alterar Foto
                    </button>
                </div>

                {/* Form Sections */}
                <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100/50">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-2">Nome</label>
                                <div className="h-14 bg-gray-50 rounded-2xl border border-primary px-4 flex items-center">
                                    <input
                                        className="bg-transparent w-full text-sm font-bold text-dark outline-none"
                                        defaultValue={firstName}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-2">Sobrenome</label>
                                <div className="h-14 bg-white rounded-2xl border border-gray-200 px-4 flex items-center">
                                    <input
                                        className="bg-transparent w-full text-sm font-bold text-dark outline-none"
                                        defaultValue={lastName}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Email & CPF */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100/50 space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-2">E-mail Profissional</label>
                            <div className="h-14 bg-white rounded-2xl border border-gray-200 px-4 flex items-center">
                                <input
                                    className="bg-transparent w-full text-sm font-bold text-dark outline-none"
                                    defaultValue={email}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-2">CPF</label>
                            <div className="h-14 bg-white rounded-2xl border border-gray-200 px-4 flex items-center">
                                <input
                                    className="bg-transparent w-full text-sm font-bold text-dark outline-none"
                                    defaultValue={cpf}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Physical Specs */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100/50 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-2">Nascimento</label>
                                <div className="h-14 bg-white rounded-2xl border border-gray-200 px-4 flex items-center">
                                    <input
                                        className="bg-transparent w-full text-sm font-bold text-dark outline-none"
                                        defaultValue={birthDate}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-2">Gênero</label>
                                <div className="h-14 bg-white rounded-2xl border border-gray-200 px-4 flex items-center">
                                    <select className="bg-transparent w-full text-sm font-bold text-dark outline-none appearance-none">
                                        <option>Feminino</option>
                                        <option>Masculino</option>
                                        <option>Outro</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-2">Altura (cm)</label>
                                <div className="h-14 bg-white rounded-2xl border border-gray-200 px-4 flex items-center justify-between">
                                    <input
                                        className="bg-transparent w-full text-sm font-bold text-dark outline-none"
                                        defaultValue={height}
                                    />
                                    <span className="text-[8px] font-black text-gray-300 uppercase shrink-0">CM</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-2">Peso (kg)</label>
                                <div className="h-14 bg-white rounded-2xl border border-gray-200 px-4 flex items-center justify-between">
                                    <input
                                        className="bg-transparent w-full text-sm font-bold text-dark outline-none"
                                        defaultValue={weight}
                                    />
                                    <span className="text-[8px] font-black text-gray-300 uppercase shrink-0">KG</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8">
                    <Button
                        className="w-full h-16 rounded-3xl bg-primary text-dark font-black tracking-tight gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                    >
                        <CheckCircle2 size={24} strokeWidth={3} />
                        SALVAR ALTERAÇÕES
                    </Button>
                </div>
            </div>

            <BottomNav />
        </div>
    );
};
