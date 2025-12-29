import React, { useEffect, useState } from 'react';
import { Wallet, Transaction } from '../types';
import { TrendingUp, Shield, Zap, Receipt } from 'lucide-react';

interface Props {
  wallet: Wallet;
  transactions: Transaction[];
}

const ThreePoolsView: React.FC<Props> = ({ wallet, transactions }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const getCategoryColor = (cat: string) => {
      switch(cat) {
          case 'growth': return 'text-sky-600 bg-sky-50 border-sky-100';
          case 'defense': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
          case 'opportunity': return 'text-violet-600 bg-violet-50 border-violet-100';
          default: return 'text-slate-600 bg-slate-50';
      }
  };

  return (
    <div className="h-full bg-slate-50 overflow-y-auto pb-24 md:pb-8">
      {/* Flat Header */}
      <div className="bg-slate-900 text-white p-8 rounded-b-[40px] md:rounded-3xl md:m-4 mb-6">
        <h2 className="text-2xl font-bold mb-1">资金流动监控</h2>
        <p className="text-slate-400 text-sm">Real-time Fund Flow</p>
      </div>

      <div className="px-6 md:px-4 md:grid md:grid-cols-12 md:gap-6">
        {/* Pools Visual */}
        <div className="grid grid-cols-3 md:grid-cols-1 md:flex md:flex-col gap-3 mb-8 md:col-span-4 md:h-fit">
            <div className={`bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:justify-between md:px-6 items-center justify-center text-center transition-all duration-700 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className="flex flex-col md:flex-row items-center gap-3">
                    <div className="bg-sky-100 p-2 rounded-full mb-2 md:mb-0"><TrendingUp size={18} className="text-sky-600"/></div>
                    <p className="text-[10px] md:text-sm text-slate-400 uppercase font-bold mt-1 md:mt-0">Growth</p>
                </div>
                <p className="font-black text-slate-800 text-lg md:text-xl">¥{wallet.growth}</p>
            </div>
            <div className={`bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:justify-between md:px-6 items-center justify-center text-center transition-all duration-700 delay-100 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className="flex flex-col md:flex-row items-center gap-3">
                    <div className="bg-emerald-100 p-2 rounded-full mb-2 md:mb-0"><Shield size={18} className="text-emerald-600"/></div>
                    <p className="text-[10px] md:text-sm text-slate-400 uppercase font-bold mt-1 md:mt-0">Defense</p>
                </div>
                <p className="font-black text-slate-800 text-lg md:text-xl">¥{wallet.defense}</p>
            </div>
            <div className={`bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:justify-between md:px-6 items-center justify-center text-center transition-all duration-700 delay-200 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className="flex flex-col md:flex-row items-center gap-3">
                     <div className="bg-violet-100 p-2 rounded-full mb-2 md:mb-0"><Zap size={18} className="text-violet-600"/></div>
                     <p className="text-[10px] md:text-sm text-slate-400 uppercase font-bold mt-1 md:mt-0">Oppty</p>
                </div>
                <p className="font-black text-slate-800 text-lg md:text-xl">¥{wallet.opportunity}</p>
            </div>
        </div>

        {/* Transaction History */}
        <div className="md:col-span-8">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Receipt size={18} /> 最近账单
            </h3>
            
            {transactions.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 border-dashed">
                    <p className="text-slate-400 text-sm">暂无记账记录</p>
                    <p className="text-xs text-slate-300 mt-1">去首页记一笔吧！</p>
                </div>
            ) : (
                <div className="space-y-3 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
                    {transactions.map(tx => (
                        <div key={tx.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                                    tx.category === 'growth' ? 'bg-sky-100' : 
                                    tx.category === 'defense' ? 'bg-emerald-100' : 'bg-violet-100'
                                }`}>
                                    {tx.category === 'growth' ? '🌱' : tx.category === 'defense' ? '🛡️' : '⚡'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">{tx.title}</h4>
                                    <p className="text-[10px] text-slate-400 line-clamp-1">{tx.aiReason}</p>
                                </div>
                            </div>
                            <div className="text-right whitespace-nowrap ml-2">
                                <p className="font-bold text-slate-900">-¥{tx.amount}</p>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${getCategoryColor(tx.category)}`}>
                                    {tx.category}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ThreePoolsView;