import { motion } from 'framer-motion';

interface Props {
    icon: string;
    value: string;
    label: string;
    progress: number;
    progressColor: string;
    subtext: string;
    subColor: string;
    delay: number;
}

export function MetricCard({ icon, value, label, progress, progressColor, subtext, subColor, delay }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="min-w-[140px] bg-white rounded-[20px] p-4 border border-[#E8D5F0] shadow-[0_4px_20px_rgba(93,61,107,0.06)]"
        >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl mb-3 ${progressColor.includes('orange') ? 'bg-[#FFF0E6]' :
                    progressColor.includes('green') ? 'bg-[#E6F7F0]' : 'bg-[#E6F0FF]'
                }`}>
                {icon}
            </div>
            <div className="text-[26px] font-bold text-[#3D2646] leading-none mb-1 font-[Outfit]">
                {value}
            </div>
            <div className="text-[12px] text-[#8B8591] mb-2">{label}</div>
            <div className="h-1.5 bg-[#F3E8F7] rounded-full overflow-hidden mb-2">
                <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${progress}%` }}></div>
            </div>
            <div className={`text-[11px] font-semibold ${subColor}`}>{subtext}</div>
        </motion.div>
    );
}
