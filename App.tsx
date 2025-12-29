import React, { useState } from 'react';
import SetupView from './components/SetupView';
import Dashboard from './components/Dashboard';
import ThreePoolsView from './components/ThreePoolsView';
import ROICalculator from './components/ROICalculator';
import TaskCenter from './components/TaskCenter';
import ProfileView from './components/ProfileView';
import ChatInterface from './components/ChatInterface';
import Navigation from './components/Navigation';
import { UserProfile, Grade, Wallet, PoolState, CFOStatus, TabView, Transaction } from './types';
import { classifyExpense } from './services/geminiService';

// Default pool ratios based on user grade
const getInitialPools = (grade: Grade, total: number): PoolState => {
  let ratios = { growth: 0.2, defense: 0.6, opportunity: 0.2 }; 

  if (grade === Grade.FRESHMAN) {
    ratios = { growth: 0.25, defense: 0.65, opportunity: 0.1 }; 
  } else if (grade === Grade.SENIOR) {
    ratios = { growth: 0.3, defense: 0.4, opportunity: 0.3 };
  } else {
    ratios = { growth: 0.3, defense: 0.5, opportunity: 0.2 };
  }

  return {
    growth: Math.round(total * ratios.growth),
    defense: Math.round(total * ratios.defense),
    opportunity: Math.round(total * ratios.opportunity),
  };
};

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cfoStatus, setCfoStatus] = useState<CFOStatus>({
    mood: 'neutral',
    text: 'CFO 摸鱼中'
  });
  
  const [activeTab, setActiveTab] = useState<TabView>('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSetupComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    const pools = getInitialPools(newProfile.grade, newProfile.monthlyBudget);
    setWallet({
      total: newProfile.monthlyBudget,
      ...pools
    });
    
    if (newProfile.grade === Grade.FRESHMAN) {
        setCfoStatus({ mood: 'skeptical', text: "观察期..."});
    } else {
        setCfoStatus({ mood: 'happy', text: "准备投资!"});
    }
  };

  const handleLogout = () => {
      if (window.confirm("确定要退出你的无限公司吗？数据将会重置。")) {
          setProfile(null);
          setWallet(null);
          setTransactions([]);
          setActiveTab('dashboard');
      }
  };

  const handleMoodUpdate = (mood: CFOStatus['mood'], text: string) => {
    setCfoStatus({ mood, text });
  };

  const handleClaimReward = (reward: string) => {
    if (!profile || !wallet) return;

    // Parse Reward String
    const amountMatch = reward.match(/(\d+)/);
    const amount = amountMatch ? parseInt(amountMatch[0]) : 0;

    if (amount === 0) return;

    if (reward.includes('XP')) {
        // Update Profile XP
        setProfile(prev => {
            if (!prev) return null;
            const newXp = prev.xp + amount;
            // Simple Level up logic
            let newLevel = prev.level;
            let newMaxXp = prev.maxXp;
            
            if (newXp >= prev.maxXp) {
                newMaxXp = Math.floor(prev.maxXp * 1.5);
                // Cycle levels just for demo fun
                if (prev.level.includes('实习生')) newLevel = '正式员工 (Lv.2)';
                else if (prev.level.includes('Lv.2')) newLevel = '项目经理 (Lv.3)';
                else if (prev.level.includes('Lv.3')) newLevel = '部门总监 (Lv.4)';
                else newLevel = '合伙人 (Lv.Max)';
                
                handleMoodUpdate('happy', '升职加薪!');
            }

            return { ...prev, xp: newXp, maxXp: newMaxXp, level: newLevel };
        });
    } else if (reward.includes('池')) {
        // Update Wallet Pools
        const newWallet = { ...wallet, total: wallet.total + amount };
        
        if (reward.includes('成长')) newWallet.growth += amount;
        else if (reward.includes('防御')) newWallet.defense += amount;
        else if (reward.includes('机会')) newWallet.opportunity += amount;
        
        setWallet(newWallet);
        handleMoodUpdate('happy', '资金入账');
    }
  };

  const handleAddTransaction = async (title: string, amount: number) => {
    if (!wallet) return;

    // Call AI to classify
    try {
        const classification = await classifyExpense(title, amount);
        
        // Update Wallet
        const newWallet = { ...wallet };
        newWallet[classification.category] -= amount;
        newWallet.total = newWallet.total - amount; // Fix: Deduct from total as well
        setWallet(newWallet);

        // Add to history
        const newTx: Transaction = {
            id: Date.now().toString(),
            title,
            amount,
            category: classification.category,
            date: new Date(),
            aiReason: classification.reason
        };
        setTransactions([newTx, ...transactions]);
        
        // Update mood if spending too much
        if (classification.category === 'opportunity' && amount > 200) {
             handleMoodUpdate('anxious', '消费预警');
        } else if (classification.category === 'growth') {
             handleMoodUpdate('happy', '优质投资');
        }

    } catch (e) {
        console.error("Transaction failed", e);
    }
  };

  if (!profile || !wallet) {
    return <SetupView onComplete={handleSetupComplete} />;
  }

  const renderContent = () => {
      switch(activeTab) {
          case 'dashboard': return <Dashboard wallet={wallet} cfoStatus={cfoStatus} profile={profile} onAddTransaction={handleAddTransaction} />;
          case 'pools': return <ThreePoolsView wallet={wallet} transactions={transactions} />;
          case 'roi': return <ROICalculator profile={profile} />; // Kept for logic, but might be redundant if integrated well in Profile
          case 'tasks': return <TaskCenter onClaimReward={handleClaimReward} />;
          case 'profile': return <ProfileView profile={profile} wallet={wallet} transactions={transactions} onLogout={handleLogout} />;
          default: return <Dashboard wallet={wallet} cfoStatus={cfoStatus} profile={profile} onAddTransaction={handleAddTransaction} />;
      }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Navigation: Responsive handling is inside the component */}
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onChatOpen={() => setIsChatOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
          <div className="flex-1 overflow-y-auto w-full scrollbar-hide">
             {/* Center content on large screens */}
             <div className="h-full w-full max-w-7xl mx-auto">
                {renderContent()}
             </div>
          </div>
      </main>
      
      {/* Chat Overlay / Drawer */}
      <ChatInterface 
        profile={profile} 
        wallet={wallet} 
        onMoodUpdate={handleMoodUpdate}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
};

export default App;