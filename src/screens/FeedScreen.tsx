// src/screens/FeedScreen.tsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    Search,
    Bookmark,
    Heart,
    MessageCircle,
    Share2,
    MoreHorizontal,
    Play
} from 'lucide-react';

const feedItems = [
    {
        id: 1,
        type: 'article',
        author: 'Dr. Ricardo Silva',
        authorRole: 'Nutricionista',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop',
        title: '5 Mitos sobre Carboidratos que Você Precisa Parar de Acreditar',
        excerpt: 'Carbo não é vilão! Aprenda a diferenciar os tipos e como usar a seu favor nos treinos.',
        image: 'https://images.unsplash.com/photo-1504384308090-c54be3852f33?w=600&h=400&fit=crop',
        likes: 245,
        comments: 32,
        saved: false,
        tag: 'Nutrição',
        time: '2h',
        featured: true,
    },
    {
        id: 2,
        type: 'video',
        author: 'Prof. Ana Paula',
        authorRole: 'Fisioterapeuta',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop',
        title: 'Alongamento de 5min para Quem Trabalha Sentado',
        videoThumb: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop',
        duration: '5:30',
        likes: 892,
        comments: 45,
        saved: true,
        tag: 'Bem-estar',
        time: '4h',
    },
    {
        id: 3,
        type: 'quick-tip',
        author: 'Metric Team',
        avatar: 'https://placehold.co/100x100/purple/white?text=M',
        title: '💡 Lembretes do Dia',
        content: 'Beba 500ml de água agora! A hidratação aumenta o metabolismo em até 30%.',
        color: 'bg-blue-50 border-blue-200',
        likes: 120,
        saved: false,
    },
    {
        id: 4,
        type: 'article',
        author: 'Dr. João Mendes',
        authorRole: 'Endocrinologista',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop',
        title: 'Como o Sono Afeta Seus Resultados na Academia',
        excerpt: 'A hormona do crescimento é liberada durante o sono profundo. Sem descanso adequado, seus músculos não recuperam.',
        image: 'https://images.unsplash.com/photo-1515894203077-9cd36032142f?w=600&h=400&fit=crop',
        likes: 567,
        comments: 89,
        saved: false,
        tag: 'Performance',
        time: '6h',
    },
];

const topics = ['Todos', 'Nutrição', 'Treino', 'Mental', 'Receitas', 'Bem-estar'];

export function FeedScreen({ isOpen }: { isOpen: boolean; onClose: () => void }) {
    const [activeTopic, setActiveTopic] = useState('Todos');
    const [savedPosts, setSavedPosts] = useState<number[]>([2]);

    const toggleSave = (id: number) => {
        setSavedPosts(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-50 z-50 flex flex-col pt-safe"
        >
            {/* Header Sticky */}
            <div className="bg-white px-4 py-3 border-b border-gray-100 sticky top-0 z-10">
                <div className="flex items-center justify-between mb-3">
                    <h1 className="text-2xl font-bold text-gray-800">Descubra</h1>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <Search className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Topics Scroll Horizontal */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {topics.map((topic) => (
                        <button
                            key={topic}
                            onClick={() => setActiveTopic(topic)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${activeTopic === topic
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {topic}
                        </button>
                    ))}
                </div>
            </div>

            {/* Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {feedItems.map((item, idx) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        {/* Header do Post */}
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img src={item.avatar} className="w-10 h-10 rounded-full object-cover" alt="Author" />
                                <div>
                                    <p className="font-bold text-sm text-gray-800">{item.author}</p>
                                    <p className="text-xs text-gray-500">{item.authorRole} • {item.time}</p>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-gray-50 rounded-full">
                                <MoreHorizontal className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Imagem ou Vídeo */}
                        {(item.image || item.videoThumb) && (
                            <div className="relative aspect-video bg-gray-100">
                                <img src={item.image || item.videoThumb} className="w-full h-full object-cover" alt="Post content" />
                                {item.type === 'video' && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            className="w-16 h-16 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg"
                                        >
                                            <Play className="w-6 h-6 text-purple-600 ml-1" />
                                        </motion.div>
                                        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                                            {item.duration}
                                        </div>
                                    </div>
                                )}
                                {item.featured && (
                                    <div className="absolute top-3 left-3 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                                        DESTAQUE
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Conteúdo */}
                        <div className="p-4">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-bold text-gray-800 line-clamp-2 flex-1">{item.title}</h3>
                                {item.tag && (
                                    <span className="text-[10px] bg-purple-50 text-purple-600 font-bold px-2 py-1 rounded-full whitespace-nowrap">
                                        {item.tag}
                                    </span>
                                )}
                            </div>

                            {'excerpt' in item && item.excerpt && (
                                <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                                    {item.excerpt}
                                </p>
                            )}

                            {'content' in item && item.content && (
                                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                                    {item.content}
                                </p>
                            )}

                            {/* Ações */}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                <div className="flex items-center gap-4">
                                    <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
                                        <Heart className="w-5 h-5" />
                                        <span className="text-xs font-medium">{item.likes}</span>
                                    </button>
                                    <button className="flex items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors">
                                        <MessageCircle className="w-5 h-5" />
                                        {('comments' in item) && <span className="text-xs font-medium">{item.comments}</span>}
                                    </button>
                                    <button className="flex items-center text-gray-500 hover:text-purple-600 transition-colors">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => toggleSave(item.id)}
                                    className={`p-2 rounded-full transition-colors ${savedPosts.includes(item.id) ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100 text-gray-400'
                                        }`}
                                >
                                    <Bookmark className={`w-5 h-5 ${savedPosts.includes(item.id) ? 'fill-current' : ''}`} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
