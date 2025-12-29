import React, { useState } from 'react';
import { UserProfile, ROIAnalysis } from '../types';
import { calculateLifeROI } from '../services/geminiService';
import { Calculator, ArrowRight, Loader2, RefreshCw, TrendingUp } from 'lucide-react';

interface Props {
  profile: UserProfile;
}

const ROICalculator: React.FC<Props> = ({ profile }) => {
  const [item, setItem] = useState('');
  const [cost, setCost] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ROIAnalysis | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !cost) return;

    setLoading(true);
    setResult(null);
    try {
        const analysis = await calculateLifeROI(item, cost, profile);
        setResult(analysis);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  const getScoreColor = (score: string) => {
      switch(score) {
          case 'S': return 'text-amber-500';
          case 'A': return 'text-emerald-500';
          case 'B': return 'text-blue-500';
          case 'C': return 'text-orange-500';
          default: return 'text-slate-400';
      }
  };

  return (
    <div className="p-6 h-full bg-slate-50 overflow-y-auto pb-24 md:pb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Calculator className="text-teal-600" />
            人生 ROI 计算器
        </h2>
        <p className="text-sm text-slate-500">输入你想做的事，CFO 帮你算算值不值。</p>
      </div>

      <div className="md:grid md:grid-cols-2 md:gap-8 md:items-start">
        <form onSubmit={handleCalculate} className="bg-white p-6 rounded-2xl shadow-sm space-y-4 mb-6">
            <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">投资项目</label>
                <input 
                    type="text" 
                    value={item}
                    onChange={e => setItem(e.target.value)}
                    placeholder="例如：学雅思、买游戏机、去旅行" 
                    className="w-full text-lg border-b-2 border-slate-100 py-2 focus:border-teal-500 outline-none bg-transparent placeholder:text-slate-300"
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">投入成本 (时间/金钱)</label>
                <input 
                    type="text" 
                    value={cost}
                    onChange={e => setCost(e.target.value)}
                    placeholder="例如：¥3000、每天2小时" 
                    className="w-full text-lg border-b-2 border-slate-100 py-2 focus:border-teal-500 outline-none bg-transparent placeholder:text-slate-300"
                />
            </div>
            <button 
                type="submit" 
                disabled={loading || !item || !cost}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
            >
                {loading ? <Loader2 className="animate-spin" /> : <>开始评估 <ArrowRight size={18} /></>}
            </button>
        </form>

        {result && (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 relative">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-emerald-400 to-blue-400"></div>
                    <div className="p-6 text-center">
                        <p className="text-sm text-slate-400 font-medium">评估评级</p>
                        <div className={`text-8xl font-black ${getScoreColor(result.score)} my-4 drop-shadow-sm`}>
                            {result.score}
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 mb-4">
                            <p className="text-slate-700 font-medium italic">“{result.commentary}”</p>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs font-bold text-teal-600 bg-teal-50 py-2 px-4 rounded-full inline-flex">
                            <TrendingUp size={14} />
                            {result.impact}
                        </div>
                    </div>
                    <button 
                        onClick={() => {setResult(null); setItem(''); setCost('');}}
                        className="w-full py-4 bg-slate-50 text-slate-500 font-medium text-sm hover:bg-slate-100 transition-colors border-t border-slate-100 flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={14} /> 算算别的
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ROICalculator;