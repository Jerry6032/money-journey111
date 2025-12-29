import React, { useState, useEffect } from 'react';
import { UserProfile, Wallet, Transaction } from '../types';
import { User, Award, TrendingUp, BarChart3, Lock, LogOut, Loader2, Sparkles, Calculator } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { generateFinancialBrief } from '../services/geminiService';
import ROICalculator from './ROICalculator';

interface Props {
  profile: UserProfile;
  wallet: Wallet;
  transactions: Transaction[];
  onLogout: () => void;
}

const ProfileView: React.FC<Props> = ({ profile, wallet, transactions, onLogout }) => {
  const [brief, setBrief] = useState<string>("点击生成 AI 财务简报");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showROI, setShowROI] = useState(false);

  // Prepare Chart Data from Transactions
  const chartData = [
    { 
        name: '成长', 
        amount: transactions.filter(t => t.category === 'growth').reduce((sum, t) => sum + t.amount, 0),
        color: '#0ea5e9' // sky-500
    },
    { 
        name: '防御', 
        amount: transactions.filter(t => t.category === 'defense').reduce((sum, t) => sum + t.amount, 0),
        color: '#10b981' // emerald-500
    },
    { 
        name: '机会', 
        amount: transactions.filter(t => t.category === 'opportunity').reduce((sum, t) => sum + t.amount, 0),
        color: '#8b5cf6' // violet-500
    },
  ];

  const handleGenerateBrief = async () => {
      setIsGenerating(true);
      const text = await generateFinancialBrief(transactions, profile);
      setBrief(text);
      setIsGenerating(false);
  };

  // If "ROI Calculator" mode is active, show it instead
  if (showROI) {
      return (
          <div className="h-full flex flex-col md:p-6">
              <div className="bg-white p-4 border-b border-slate-100 flex items-center gap-2 md:rounded-t-3xl md:border md:border-b-0">
                  <button onClick={() => setShowROI(false)} className="text-slate-500 text-sm font-bold hover:text-slate-800 transition-colors">← 返回个人中心</button>
              </div>
              <div className="flex-1 md:bg-white md:border-x md:border-b md:rounded-b-3xl md:overflow-hidden">
                <ROICalculator profile={profile} />
              </div>
          </div>
      );
  }

  return (
    <div className="p-0 h-full bg-slate-50 overflow-y-auto pb-24 md:pb-8">
      {/* Header / ID Card */}
      <div className="bg-slate-900 text-white p-8 pt-12 rounded-b-3xl md:rounded-3xl md:m-4 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500 rounded-full blur-3xl opacity-20 -translate-y-10 translate-x-10"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-emerald-600 rounded-full flex items-center justify-center border-4 border-slate-800 shadow-xl">
                    <User size={32} className="text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">{profile.name} Inc.</h1>
                    <p className="text-teal-400 font-medium text-sm flex items-center gap-1">
                        <Award size={14} /> {profile.level}
                    </p>
                </div>
              </div>

              {/* XP Bar */}
              <div className="w-full md:w-1/2">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>经验值</span>
                      <span>{profile.xp} / {profile.maxXp} XP</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-teal-500 h-full" style={{ width: `${(profile.xp / profile.maxXp) * 100}%` }}></div>
                  </div>
              </div>
          </div>
      </div>

      <div className="p-6 md:px-4 md:grid md:grid-cols-2 md:gap-6 space-y-6 md:space-y-0">
          
          {/* Action Grid */}
          <div className="grid grid-cols-2 gap-4 h-fit">
              <button 
                onClick={() => setShowROI(true)}
                className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors h-32 md:h-40"
              >
                  <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                      <Calculator size={24} />
                  </div>
                  <span className="font-bold text-slate-700 text-sm">人生 ROI 评估</span>
              </button>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 h-32 md:h-40">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                      <Lock size={24} />
                  </div>
                  <span className="font-bold text-slate-400 text-sm">上市计划书 (Lv.5)</span>
              </div>
          </div>

          {/* AI Quarterly Report */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 md:row-span-2">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <BarChart3 className="text-blue-500" size={20} />
                      财务简报
                  </h3>
                  <button 
                    onClick={handleGenerateBrief}
                    disabled={isGenerating}
                    className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-slate-700 transition-colors disabled:opacity-50"
                  >
                      {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                      {isGenerating ? "分析中..." : "生成简报"}
                  </button>
              </div>
              
              <div className="h-40 md:h-64 w-full mb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl relative overflow-hidden">
                  <p className="text-sm text-slate-600 leading-relaxed italic relative z-10">
                      <span className="font-bold text-slate-900 not-italic block mb-1">CFO 辣评: </span>
                      "{brief}"
                  </p>
              </div>
          </div>

          {/* Logout (Positioned at bottom of grid on desktop) */}
          <div className="md:flex md:items-end">
             <button 
                onClick={onLogout}
                className="w-full py-4 rounded-xl bg-rose-50 text-rose-500 font-bold flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors"
            >
                <LogOut size={18} />
                退出无限公司 (Logout)
            </button>
          </div>
      </div>
    </div>
  );
};

export default ProfileView;