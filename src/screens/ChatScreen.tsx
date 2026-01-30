// src/screens/ChatScreen.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import {
    ArrowLeft,
    MoreVertical,
    Phone,
    Video,
    Image as ImageIcon,
    Mic,
    Send,
    Paperclip,
    CheckCheck
} from 'lucide-react';

const messagesMock = [
    { id: 1, text: 'Olá David! Vi que você logrou o peso hoje. Parabéns pela evolução! 🎉', sender: 'them', time: '09:30', read: true },
    { id: 2, text: 'Obrigado Dra! Estou me esforçando bastante direito', sender: 'me', time: '09:32', read: true },
    { id: 3, text: 'Você está indo muito bem. Sobre a refeição de ontem, você conseguiu bater os 150g de proteína?', sender: 'them', time: '09:33', read: true },
    { id: 4, text: 'Consegui sim! Comi 200g de frango no almoço', sender: 'me', time: '09:35', read: true },
    { id: 5, text: 'Perfeito! 💪 Vou ajustar seu plano para próxima semana subir um pouco o carboidrato nos dias de treino.', sender: 'them', time: '09:36', read: false },
];

const quickReplies = [
    'Oi, tudo bem?',
    'Consegui fazer o treino! 💪',
    'Preciso remarcar',
    'Dúvida sobre a dieta',
];

export function ChatScreen({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(messagesMock);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (!message.trim()) return;
        const newMsg = { id: Date.now(), text: message, sender: 'me', time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), read: false };
        setMessages([...messages, newMsg]);
        setMessage('');

        // Simular resposta automática depois de 2s
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: 'Recebi sua mensagem! Vou analisar e te respondo em breve. 📋',
                sender: 'them',
                time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                read: false
            }]);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 bg-gray-100 z-50 flex flex-col"
        >
            {/* Header */}
            <div className="bg-white px-4 py-3 pt-safe flex items-center justify-between border-b border-gray-100 shadow-sm transition-all">
                <div className="flex items-center gap-3">
                    <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>

                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop"
                            className="w-10 h-10 rounded-full object-cover border-2 border-purple-100"
                            alt="Professional"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    </div>

                    <div>
                        <h2 className="font-bold text-gray-800">Dra. Ana Paula</h2>
                        <p className="text-xs text-green-600 font-medium">Online agora</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full text-purple-600">
                        <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full text-purple-600">
                        <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="text-center text-xs text-gray-400 my-4">Hoje</div>

                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] px-4 py-3 rounded-2xl relative ${msg.sender === 'me'
                                    ? 'bg-purple-600 text-white rounded-br-sm'
                                    : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                                }`}>
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                <div className={`flex items-center justify-end gap-1 mt-1 ${msg.sender === 'me' ? 'text-purple-200' : 'text-gray-400'
                                    }`}>
                                    <span className="text-[10px]">{msg.time}</span>
                                    {msg.sender === 'me' && (
                                        <CheckCheck className={`w-3 h-3 ${msg.read ? 'text-blue-300' : 'text-purple-300'}`} />
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Quick Replies */}
            <div className="bg-white px-4 py-2 border-t border-gray-100 overflow-x-auto">
                <div className="flex gap-2">
                    {quickReplies.map((reply) => (
                        <button
                            key={reply}
                            onClick={() => setMessage(reply)}
                            className="px-4 py-2 bg-gray-100 hover:bg-purple-50 text-gray-700 hover:text-purple-700 rounded-full text-xs font-medium whitespace-nowrap transition-colors"
                        >
                            {reply}
                        </button>
                    ))}
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-white p-4 pb-safe border-t border-gray-100">
                <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-purple-200 transition-all">
                    <button className="p-2 hover:bg-gray-200 rounded-full text-gray-500">
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded-full text-gray-500">
                        <ImageIcon className="w-5 h-5" />
                    </button>

                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Digite uma mensagem..."
                        className="flex-1 bg-transparent outline-none text-sm p-1"
                    />

                    {message ? (
                        <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            onClick={sendMessage}
                            className="p-2 bg-purple-600 text-white rounded-full shadow-lg"
                        >
                            <Send className="w-4 h-4" />
                        </motion.button>
                    ) : (
                        <button className="p-2 hover:bg-gray-200 rounded-full text-gray-500">
                            <Mic className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
