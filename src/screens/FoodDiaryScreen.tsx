// src/screens/FoodDiaryScreen.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    ArrowLeft,
    Plus,
    Camera,
    Flame,
    Droplets,
    Wheat,
    Clock
} from 'lucide-react';

const meals = [
    {
        id: 'breakfast',
        name: 'Café da Manhã',
        time: '07:30 - 08:30',
        calories: 450,
        target: 500,
        items: [
            { name: 'Ovos mexidos', portion: '2 ovos', cal: 140, protein: 12, carbs: 2, fat: 10 },
            { name: 'Pão integral', portion: '2 fatias', cal: 160, protein: 8, carbs: 28, fat: 2 },
            { name: 'Café com leite', portion: '200ml', cal: 150, protein: 6, carbs: 12, fat: 5 },
        ],
        completed: true,
        emoji: '🍳',
        color: 'from-orange-400 to-orange-500',
    },
    {
        id: 'lunch',
        name: 'Almoço',
        time: '12:00 - 13:00',
        calories: 720,
        target: 750,
        items: [
            { name: 'Peito de frango grelhado', portion: '150g', cal: 280, protein: 45, carbs: 0, fat: 8 },
            { name: 'Arroz integral', portion: '100g', cal: 130, protein: 3, carbs: 28, fat: 1 },
            { name: 'Brócolis no vapor', portion: '80g', cal: 25, protein: 2, carbs: 5, fat: 0 },
            { name: 'Azeite', portion: '1 colher', cal: 120, protein: 0, carbs: 0, fat: 14 },
        ],
        completed: true,
        emoji: '🍽️',
        color: 'from-green-400 to-green-500',
    },
    {
        id: 'snack',
        name: 'Lanche da Tarde',
        time: '15:30 - 16:00',
        calories: 0,
        target: 300,
        items: [],
        completed: false,
        emoji: '🍎',
        color: 'from-red-400 to-red-500',
    },
    {
        id: 'dinner',
        name: 'Jantar',
        time: '19:30 - 20:30',
        calories: 0,
        target: 600,
        items: [],
        completed: false,
        emoji: '🥗',
        color: 'from-purple-400 to-purple-500',
    },
];

const macros = {
    calories: { current: 1170, target: 2150, label: 'kcal' },
    protein: { current: 86, target: 170, label: 'g', color: 'text-blue-500', icon: Droplets },
    carbs: { current: 75, target: 250, label: 'g', color: 'text-yellow-500', icon: Wheat },
    fat: { current: 40, target: 65, label: 'g', color: 'text-red-500', icon: Flame },
};

export function FoodDiaryScreen({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [expandedMeal, setExpandedMeal] = useState<string | null>('lunch');
    const [selectedDate, setSelectedDate] = useState(0);

    const weekDays = [
        { day: 'Dom', date: 26 },
        { day: 'Seg', date: 27, today: true },
        { day: 'Ter', date: 28 },
        { day: 'Qua', date: 29 },
        { day: 'Qui', date: 30 },
        { day: 'Sex', date: 31 },
        { day: 'Sáb', date: 1 },
    ];

    if (!isOpen) return null;

    const percentage = Math.round((macros.calories.current / macros.calories.target) * 100);

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 bg-gray-50 z-50 flex flex-col pt-safe"
        >
            {/* Header */}
            <div className="bg-white px-6 pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Refeições de Hoje</h1>
                    <div className="w-8" />
                </div>

                {/* Calendario Semanal */}
                <div className="flex justify-between items-center mb-6">
                    {weekDays.map((d, idx) => (
                        <motion.button
                            key={idx}
                            onClick={() => setSelectedDate(idx)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex flex-col items-center gap-1 p-2 rounded-2xl min-w-[40px] px-2 ${selectedDate === idx
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                                    : d.today ? 'bg-purple-50 text-purple-600' : 'text-gray-500'
                                }`}
                        >
                            <span className="text-[10px] font-medium">{d.day}</span>
                            <span className="text-sm font-bold">{d.date}</span>
                        </motion.button>
                    ))}
                </div>

                {/* Resumo Macros */}
                <div className="bg-gray-900 rounded-3xl p-5 text-white relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -mr-10 -mt-10" />

                    <div className="relative z-10 flex items-center gap-6">
                        {/* Circular Progress */}
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90">
                                <circle
                                    cx="48"
                                    cy="48"
                                    r="40"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth="8"
                                />
                                <circle
                                    cx="48"
                                    cy="48"
                                    r="40"
                                    fill="none"
                                    stroke="url(#gradient-diary)"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeDasharray={`${percentage * 2.51} 251`}
                                    className="transition-all duration-1000"
                                />
                                <defs>
                                    <linearGradient id="gradient-diary" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#A78BFA" />
                                        <stop offset="100%" stopColor="#F97316" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute text-center">
                                <span className="text-2xl font-bold">{percentage}%</span>
                                <p className="text-[10px] text-gray-400">atingido</p>
                            </div>
                        </div>

                        <div className="flex-1">
                            <p className="text-gray-400 text-sm mb-1">Calorias restantes</p>
                            <p className="text-3xl font-bold mb-3">
                                {macros.calories.target - macros.calories.current}
                                <span className="text-lg font-normal text-gray-400 ml-1">kcal</span>
                            </p>

                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { icon: Droplets, value: macros.protein.current, target: macros.protein.target, color: 'blue', label: 'Prot' },
                                    { icon: Wheat, value: macros.carbs.current, target: macros.carbs.target, color: 'yellow', label: 'Carb' },
                                    { icon: Flame, value: macros.fat.current, target: macros.fat.target, color: 'red', label: 'Gord' },
                                ].map((macro) => (
                                    <div key={macro.label} className="text-center">
                                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-1">
                                            <macro.icon className="w-3 h-3 text-purple-300" />
                                        </div>
                                        <p className="text-xs font-bold">{macro.value}g</p>
                                        <p className="text-[10px] text-gray-500">de {macro.target}g</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de Refeições */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {meals.map((meal) => (
                    <motion.div
                        key={meal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        {/* Header da Refeição */}
                        <div
                            onClick={() => setExpandedMeal(expandedMeal === meal.id ? null : meal.id)}
                            className="p-4 flex items-center justify-between cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${meal.color} flex items-center justify-center text-2xl shadow-lg`}>
                                    {meal.emoji}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">{meal.name}</h3>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {meal.time}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                {meal.completed ? (
                                    <div>
                                        <p className="font-bold text-gray-800">{meal.calories} kcal</p>
                                        <div className="w-16 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                            <div
                                                className={`h-full bg-gradient-to-r ${meal.color} rounded-full`}
                                                style={{ width: `${(meal.calories / meal.target) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <button className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                                        <Plus className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Detalhes Expandidos */}
                        <AnimatePresence>
                            {expandedMeal === meal.id && meal.items.length > 0 && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-gray-50 bg-gray-50/50 overflow-hidden"
                                >
                                    {meal.items.map((item, idx) => (
                                        <div key={idx} className="px-4 py-3 flex items-center justify-between border-b border-gray-100 last:border-0">
                                            <div>
                                                <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                                                <p className="text-xs text-gray-400">{item.portion}</p>
                                            </div>
                                            <div className="text-right text-xs text-gray-500">
                                                <p className="font-semibold text-gray-700">{item.cal} kcal</p>
                                                <p>P: {item.protein}g • C: {item.carbs}g • G: {item.fat}g</p>
                                            </div>
                                        </div>
                                    ))}

                                    <button className="w-full py-3 text-purple-600 text-sm font-semibold hover:bg-purple-50 transition-colors flex items-center justify-center gap-1">
                                        <Plus className="w-4 h-4" />
                                        Adicionar item
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Botão Adicionar se vazio */}
                        {!meal.completed && (
                            <div className="p-4 border-t border-gray-50">
                                <button className="w-full py-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-medium text-sm hover:border-purple-300 hover:text-purple-600 transition-colors flex items-center justify-center gap-2">
                                    <Camera className="w-4 h-4" />
                                    Registrar refeição
                                </button>
                            </div>
                        )}
                    </motion.div>
                ))}

                {/* Espaço extra pro FAB não cobrir */}
                <div className="h-20" />
            </div>

            {/* Floating Action Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute bottom-6 right-6 w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg shadow-purple-600/40 flex items-center justify-center"
                onClick={() => { }}
            >
                <Plus className="w-6 h-6" />
            </motion.button>
        </motion.div>
    );
}
