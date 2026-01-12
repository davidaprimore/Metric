import React from 'react';

interface MetricCardProps {
    title: string;
    value: string;
    unit: string;
    trend?: string;
    isPositive?: boolean;
    icon: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, trend, isPositive, icon }) => {
    return (
        <div className="bg-surface p-5 rounded-3xl shadow-soft border border-white/60 flex flex-col justify-between h-40 relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>

            <div className="flex justify-between items-start z-10">
                <div className="p-2 bg-gray-100 rounded-xl text-gray-600">
                    {icon}
                </div>
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {trend}
                    </span>
                )}
            </div>

            <div className="z-10">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-display font-bold text-dark">{value}</span>
                    <span className="text-sm font-medium text-gray-400">{unit}</span>
                </div>
            </div>
        </div>
    );
};
