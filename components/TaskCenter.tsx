import React, { useState } from 'react';
import { Task } from '../types';
import { CheckCircle2, Circle, Trophy, Plus, Trash2, X, Sparkles, Gift } from 'lucide-react';

const INITIAL_TASKS: Task[] = [
    { id: '1', title: '减少一次外卖，自己做饭', reward: '成长池 +20', completed: false, type: 'daily' },
    { id: '2', title: '阅读/学习 1 小时', reward: 'XP +50', completed: false, type: 'daily' },
    { id: '3', title: '记账连续 3 天', reward: '防御池 +10', completed: true, type: 'weekly' },
    { id: '4', title: '不喝奶茶挑战', reward: '机会池 +15', completed: false, type: 'daily' },
];

interface TaskCenterProps {
    onClaimReward: (reward: string) => void;
}

const TaskCenter: React.FC<TaskCenterProps> = ({ onClaimReward }) => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [rewardType, setRewardType] = useState<'xp' | 'growth' | 'defense' | 'opportunity'>('xp');

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const claimTask = (task: Task, e: React.MouseEvent) => {
      e.stopPropagation();
      onClaimReward(task.reward);
      deleteTask(task.id);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let rewardText = '';
    switch (rewardType) {
        case 'growth': rewardText = '成长池 +20'; break;
        case 'defense': rewardText = '防御池 +20'; break;
        case 'opportunity': rewardText = '机会池 +20'; break;
        default: rewardText = 'XP +50';
    }

    const newTask: Task = {
        id: Date.now().toString(),
        title: newTitle,
        reward: rewardText,
        completed: false,
        type: 'daily'
    };

    setTasks([newTask, ...tasks]);
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <div className="p-6 h-full bg-slate-50 overflow-y-auto pb-24 md:pb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">任务中心</h2>
        <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Trophy size={12} /> 挑战任务
        </div>
      </div>

      <div className="md:grid md:grid-cols-2 md:gap-8">
        <div>
            {/* Add Task Button or Form */}
            {!isAdding ? (
                <button 
                    onClick={() => setIsAdding(true)}
                    className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 font-medium flex items-center justify-center gap-2 hover:bg-white hover:border-teal-500 hover:text-teal-600 transition-all mb-6"
                >
                    <Plus size={20} /> 添加新挑战
                </button>
            ) : (
                <form onSubmit={handleAddTask} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-slate-700 text-sm">创建新任务</h3>
                        <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
                            <X size={16} />
                        </button>
                    </div>
                    
                    <div className="space-y-3">
                        <input 
                            type="text" 
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="例如：背 20 个单词"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-teal-500 outline-none"
                            autoFocus
                        />
                        
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            {[
                                { id: 'xp', label: '经验值', color: 'bg-amber-100 text-amber-700' },
                                { id: 'growth', label: '成长池', color: 'bg-emerald-100 text-emerald-700' },
                                { id: 'defense', label: '防御池', color: 'bg-blue-100 text-blue-700' },
                                { id: 'opportunity', label: '机会池', color: 'bg-violet-100 text-violet-700' },
                            ].map(type => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => setRewardType(type.id as any)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                                        rewardType === type.id 
                                        ? `${type.color} border-transparent ring-2 ring-offset-1 ring-slate-200` 
                                        : 'bg-slate-50 text-slate-500 border-slate-100'
                                    }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>

                        <button 
                            type="submit"
                            disabled={!newTitle.trim()}
                            className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors"
                        >
                            确认添加
                        </button>
                    </div>
                </form>
            )}

            {/* Active Tasks */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Sparkles size={12} /> 进行中
                </h3>
                <div className="space-y-3">
                    {tasks.filter(t => !t.completed).length === 0 && (
                        <p className="text-sm text-slate-400 italic text-center py-4">暂无任务，快去添加一个吧！</p>
                    )}
                    {tasks.filter(t => !t.completed).map(task => (
                        <div 
                            key={task.id}
                            onClick={() => toggleTask(task.id)}
                            className="group p-4 rounded-xl border bg-white border-slate-200 shadow-sm hover:shadow-md flex items-center justify-between cursor-pointer transition-all relative overflow-hidden"
                        >
                            <div className="flex items-center gap-3 z-10">
                                <Circle className="text-slate-300 group-hover:text-teal-500 transition-colors" />
                                <span className="text-slate-800 font-medium">{task.title}</span>
                            </div>
                            <div className="flex items-center gap-3 z-10">
                                <span className="text-xs font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-500">
                                    {task.reward}
                                </span>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Completed Tasks - Wait for Claim (Right Column on Desktop) */}
        <div>
            {tasks.some(t => t.completed) && (
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 mt-8 md:mt-0">待领取奖励</h3>
                    <div className="space-y-3">
                        {tasks.filter(t => t.completed).map(task => (
                            <div 
                                key={task.id}
                                className="p-4 rounded-xl border bg-white border-emerald-100 shadow-sm flex items-center justify-between animate-in slide-in-from-left-2"
                            >
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="text-emerald-500" />
                                    <div className="flex flex-col">
                                        <span className="text-slate-800 font-medium line-through opacity-50">{task.title}</span>
                                        <span className="text-xs font-bold text-emerald-600">{task.reward}</span>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={(e) => claimTask(task, e)}
                                    className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-800 hover:scale-105 transition-all shadow-md shadow-slate-200"
                                >
                                    <Gift size={14} /> 领取
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TaskCenter;