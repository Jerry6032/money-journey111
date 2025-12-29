import React from 'react';
import { TabView } from '../types';
import { LayoutDashboard, Wallet, Calculator, CheckSquare, User, MessageCircle } from 'lucide-react';

interface Props {
    activeTab: TabView;
    onTabChange: (tab: TabView) => void;
    onChatOpen: () => void;
}

const Navigation: React.FC<Props> = ({ activeTab, onTabChange, onChatOpen }) => {
    const tabs: {id: TabView, label: string, icon: React.ElementType}[] = [
        { id: 'dashboard', label: '首页', icon: LayoutDashboard },
        { id: 'pools', label: '三池', icon: Wallet },
        { id: 'roi', label: 'ROI', icon: Calculator },
        { id: 'tasks', label: '任务', icon: CheckSquare },
        { id: 'profile', label: '我的', icon: User },
    ];

    return (
        <>
            {/* MOBILE: Bottom Navigation Bar */}
            <div className="md:hidden absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 px-6 py-4 pb-8 flex justify-between items-center z-40 rounded-t-[30px] shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? 'text-slate-900 scale-110' : 'text-slate-300 hover:text-slate-500'}`}
                        >
                            <div className={`${activeTab === tab.id ? 'bg-slate-100 p-2 rounded-xl' : 'p-2'}`}>
                                <Icon size={20} />
                            </div>
                        </button>
                    );
                })}
                
                {/* Mobile Floating Chat Button */}
                <button 
                    onClick={onChatOpen}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white p-4 rounded-full shadow-lg hover:bg-slate-800 hover:scale-105 transition-all z-50 border-[6px] border-white"
                >
                    <MessageCircle size={24} />
                </button>
            </div>

            {/* DESKTOP: Side Navigation Bar */}
            <div className="hidden md:flex flex-col w-20 lg:w-64 bg-white border-r border-slate-100 h-full py-8 px-4 z-40 justify-between shadow-sm">
                
                {/* Logo Area */}
                <div className="flex flex-col items-center lg:items-start lg:px-4 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-2">
                        ¥
                    </div>
                    <span className="hidden lg:block font-bold text-slate-800 text-lg">Money Journey</span>
                </div>

                {/* Nav Items */}
                <div className="flex flex-col gap-4 w-full">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`flex items-center gap-4 p-3 rounded-2xl transition-all w-full
                                    ${activeTab === tab.id 
                                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                                        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                                    }
                                    justify-center lg:justify-start
                                `}
                            >
                                <div className=""><Icon size={24} /></div>
                                <span className="hidden lg:block font-bold text-sm">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Desktop Chat Button (Bottom of Sidebar) */}
                <button 
                    onClick={onChatOpen}
                    className="mt-auto bg-teal-50 text-teal-600 p-4 rounded-2xl flex items-center gap-3 hover:bg-teal-100 transition-colors justify-center lg:justify-start"
                >
                     <MessageCircle size={24} />
                     <span className="hidden lg:block font-bold">呼叫 CFO</span>
                </button>
            </div>
        </>
    );
};

export default Navigation;