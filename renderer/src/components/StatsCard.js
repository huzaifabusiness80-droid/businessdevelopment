import React from 'react';

const StatsCard = ({ title, value, subtext, icon: Icon, color }) => {
    const getGradient = (c) => {
        switch (c) {
            case 'blue': return 'from-blue-500 to-blue-600 shadow-blue-500/30';
            case 'green': return 'from-green-500 to-green-600 shadow-green-500/30';
            case 'orange': return 'from-orange-500 to-orange-600 shadow-orange-500/30';
            case 'red': return 'from-red-500 to-red-600 shadow-red-500/30';
            default: return 'from-slate-500 to-slate-600';
        }
    };

    return (
        <div className={`relative overflow-hidden bg-gradient-to-br ${getGradient(color)} rounded-xl p-6 text-white shadow-lg transform transition-all hover:scale-[1.02] hover:shadow-xl`}>
            <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-2 opacity-90">
                    <Icon size={20} className="text-white/80" />
                    <h3 className="text-sm font-medium uppercase tracking-wide">{title}</h3>
                </div>
                <div className="text-3xl font-bold mb-1">{value}</div>
                <div className="text-xs font-medium text-white/80 bg-white/20 inline-block px-2 py-1 rounded backdrop-blur-sm">
                    {subtext}
                </div>
            </div>

            {/* Decorative background icon */}
            <Icon size={100} className="absolute -right-6 -bottom-6 text-white opacity-10 rotate-12" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl -mr-10 -mt-10"></div>
        </div>
    );
};

export default StatsCard;
