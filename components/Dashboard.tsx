import React, { useState } from 'react';
import { Wallet, CFOStatus, UserProfile } from '../types';
import { Smile, Frown, Meh, HelpCircle, Plus, Sparkles, Loader2, ArrowUpRight } from 'lucide-react';

interface DashboardProps {
  wallet: Wallet;
  cfoStatus: CFOStatus;
  profile: UserProfile;
  onAddTransaction: (title: string, amount: number) => Promise<void>;
}

const Dashboard: React.FC<DashboardProps> = ({ wallet, cfoStatus, profile, onAddTransaction }) => {
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  
  const moodIcon = () => {
    switch (cfoStatus.mood) {
      case 'happy': return <Smile className="text-emerald-400 w-5 h-5" />;
      case 'anxious': return <Frown className="text-rose-400 w-5 h-5" />;
      case 'skeptical': return <HelpCircle className="text-amber-400 w-5 h-5" />;
      default: return <Meh className="text-slate-400 w-5 h-5" />;
    }
  };

  const handleBookkeeping = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!expenseTitle || !expenseAmount) return;

      setIsProcessing(true);
      setFeedback(null);
      
      await onAddTransaction(expenseTitle, parseFloat(expenseAmount));
      
      setFeedback("记账成功！AI 已自动归类");
      setExpenseTitle('');
      setExpenseAmount('');
      setIsProcessing(false);
      
      setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="h-full bg-slate-50 overflow-y-auto pb-24 md:pb-8">
        {/* Top Section - Flat Black Header */}
        <div className="bg-slate-900 text-white p-8 pb-12 rounded-b-[40px] md:rounded-3xl md:m-4 md:shadow-lg shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
                <div className="flex items-center justify-between md:justify-start md:gap-8">
                     <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                         <span className="text-xl">🧑‍💼</span>
                     </div>
                     <div>
                        <p className="text-slate-400 text-sm font-medium mb-1">CFO 今日状态</p>
                        <div className="flex items-center gap-2 bg-slate-800/50 pr-4 pl-2 py-1.5 rounded-full w-fit">
                            <div className="bg-slate-900 p-1 rounded-full">{moodIcon()}</div>
                            <span className="text-sm font-bold tracking-wide">{cfoStatus.text}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center md:text-left md:flex md:items-end md:justify-between">
                <div>
                    <p className="text-slate-400 text-xs uppercase tracking-[0.2em] mb-2">Total Budget</p>
                    <h1 className="text-5xl font-black tracking-tight mb-2">¥{wallet.total}</h1>
                    <p className="text-emerald-400 text-sm font-medium flex items-center justify-center md:justify-start gap-1">
                        <ArrowUpRight size={16} /> 本月剩余可支配
                    </p>
                </div>
                {/* Desktop: Show Pools Summary Here potentially, but keeping simple for now */}
            </div>
        </div>

        <div className="md:grid md:grid-cols-2 md:gap-6 md:px-6">
            
            {/* AI Bookkeeping Section - Floating Card */}
            <div className="px-6 -mt-8 md:mt-0 md:px-0">
                <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 h-full">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="bg-teal-50 p-2 rounded-xl text-teal-600">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">AI 智能记账</h3>
                            <p className="text-[10px] text-slate-400">输入消费，AI 自动归入三池</p>
                        </div>
                    </div>

                    <form onSubmit={handleBookkeeping} className="space-y-3">
                        <div className="flex gap-3">
                            <input 
                                type="text" 
                                placeholder="买了什么？(如: 咖啡)"
                                value={expenseTitle}
                                onChange={e => setExpenseTitle(e.target.value)}
                                className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-100 outline-none"
                            />
                            <input 
                                type="number" 
                                placeholder="¥"
                                value={expenseAmount}
                                onChange={e => setExpenseAmount(e.target.value)}
                                className="w-24 bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-100 outline-none text-center"
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={isProcessing || !expenseTitle || !expenseAmount}
                            className="w-full bg-slate-900 text-white rounded-xl py-3 font-bold text-sm hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                            {isProcessing ? "AI 分析中..." : "记一笔"}
                        </button>
                        {feedback && (
                            <div className="text-center text-xs font-bold text-emerald-600 animate-in fade-in slide-in-from-top-1 bg-emerald-50 py-2 rounded-lg">
                                {feedback}
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* Pool Status Preview - Flat Blocks */}
            <div className="p-6 md:p-0">
                <h3 className="font-bold text-slate-900 mb-4 text-lg md:hidden">资金池概览</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                    {/* Growth */}
                    <div className="md:col-span-2 bg-[#E0F2FE] rounded-3xl p-5 flex items-center justify-between group cursor-pointer hover:scale-[1.01] transition-transform">
                        <div>
                            <span className="text-xs font-bold text-sky-600 bg-sky-100 px-2 py-1 rounded-md mb-2 inline-block">GROWTH</span>
                            <h4 className="text-xl font-black text-slate-900">¥{wallet.growth}</h4>
                            <p className="text-xs text-slate-500 font-medium mt-1">成长池 (投资自己)</p>
                        </div>
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-sm group-hover:rotate-12 transition-transform">
                            🌱
                        </div>
                    </div>

                    <div className="flex gap-4 md:contents">
                        {/* Defense */}
                        <div className="flex-1 bg-[#F0FDF4] rounded-3xl p-5 group cursor-pointer hover:scale-[1.02] transition-transform">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm text-lg">
                                🛡️
                            </div>
                            <h4 className="text-lg font-black text-slate-900">¥{wallet.defense}</h4>
                            <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wide">Defense</p>
                        </div>

                        {/* Opportunity */}
                        <div className="flex-1 bg-[#F5F3FF] rounded-3xl p-5 group cursor-pointer hover:scale-[1.02] transition-transform">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm text-lg">
                                ⚡
                            </div>
                            <h4 className="text-lg font-black text-slate-900">¥{wallet.opportunity}</h4>
                            <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wide">Opportunity</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;