import React, { useState } from 'react';
import { Grade, UserProfile } from '../types';
import { ArrowRight, Wallet, User, Briefcase } from 'lucide-react';

interface SetupViewProps {
  onComplete: (profile: UserProfile) => void;
}

const SetupView: React.FC<SetupViewProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [budget, setBudget] = useState<string>('');
  const [grade, setGrade] = useState<Grade>(Grade.FRESHMAN);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && budget) {
      onComplete({
        name,
        grade,
        monthlyBudget: parseFloat(budget),
        setupComplete: true,
        level: '实习生 CEO',
        xp: 0,
        maxXp: 100
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">开启你的钱程</h1>
          <p className="text-slate-500">初始化你的“个人无限公司”</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <User size={16} /> CEO 姓名
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
              placeholder="例如：马斯克"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Wallet size={16} /> 月度资金 (预算)
            </label>
            <input
              type="number"
              required
              min="0"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
              placeholder="¥ 2000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">公司发展阶段 (年级)</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(Grade).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                    grade === g
                      ? 'bg-teal-50 border-teal-500 text-teal-700 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 group"
          >
            启动公司
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupView;
