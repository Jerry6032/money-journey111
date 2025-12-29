import React, { useState, useRef, useEffect } from 'react';
import { Message, UserProfile, Wallet, CFOStatus } from '../types';
import { Send, Image as ImageIcon, Loader2, Sparkles, X, ChevronDown, ChevronRight } from 'lucide-react';
import { getCFOAdvice, editUserImage } from '../services/geminiService';

interface ChatInterfaceProps {
  profile: UserProfile;
  wallet: Wallet;
  onMoodUpdate: (mood: CFOStatus['mood'], text: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ profile, wallet, onMoodUpdate, isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      type: 'text',
      content: `老板好 (${profile.name})! 👋 我是你的专属 CFO。这月钱够花吗？想买鞋还是想报课？跟我说说。`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isLoading, isOpen]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      type: selectedImage ? 'image' : 'text',
      content: selectedImage || input,
      caption: selectedImage ? input : undefined, 
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    
    const currentInput = input;
    const currentImage = selectedImage;

    setInput('');
    setSelectedImage(null);

    try {
      if (currentImage) {
        const prompt = currentInput || "优化这张图片";
        const editedImageBase64 = await editUserImage(currentImage, prompt);
        
        if (editedImageBase64) {
             const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                type: 'image',
                content: editedImageBase64,
                caption: "设计部把图改好了，老板过目。",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiResponse]);
            onMoodUpdate('happy', '创意无限');
        } else {
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                type: 'text',
                content: "抱歉老板，设计部罢工了，处理不了这张图。",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMsg]);
            onMoodUpdate('skeptical', '系统故障');
        }

      } else {
        const analysis = await getCFOAdvice(messages, currentInput, profile, wallet);
        
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          type: 'text',
          content: analysis.advice,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
        onMoodUpdate(analysis.mood, analysis.moodText);
      }
    } catch (error) {
        const errorMsg: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            type: 'text',
            content: "与总部连接中断...",
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Logic to handle show/hide
  // Mobile: slide up from bottom. Desktop: slide in from right.
  // We use `fixed` positioning and transform classes.
  
  if (!isOpen) return null;

  return (
    <>
        {/* Backdrop for Desktop */}
        <div className="hidden md:block fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-in fade-in" onClick={onClose} />
        
        <div className={`
            fixed z-50 bg-slate-50 flex flex-col shadow-2xl
            /* Mobile Styles */
            inset-0 animate-in slide-in-from-bottom-full duration-300
            /* Desktop Styles */
            md:inset-y-0 md:left-auto md:right-0 md:w-[450px] md:rounded-l-3xl md:border-l md:border-slate-100 md:animate-in md:slide-in-from-right
        `}>
        {/* Header */}
        <div className="bg-white border-b border-slate-100 p-4 flex items-center justify-between shadow-sm z-10 md:rounded-tl-3xl">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <h2 className="font-bold text-slate-800">CFO 办公室 (在线)</h2>
            </div>
            <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                <div className="md:hidden"><ChevronDown size={20} className="text-slate-600"/></div>
                <div className="hidden md:block"><ChevronRight size={20} className="text-slate-600"/></div>
            </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-4 scrollbar-hide bg-slate-50">
            {messages.map((msg) => (
            <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
                <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                    msg.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                }`}
                >
                {msg.type === 'image' ? (
                    <div className="space-y-2">
                        <img src={msg.content} alt="Content" className="rounded-lg max-h-60 object-cover" />
                        {msg.caption && <p className="text-sm opacity-90 italic">{msg.caption}</p>}
                    </div>
                ) : (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                )}
                </div>
            </div>
            ))}
            {isLoading && (
            <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-100 shadow-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                <span className="text-xs text-slate-500">正在计算 ROI...</span>
                </div>
            </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-slate-100 p-4 pb-6 md:pb-4">
            {selectedImage && (
                <div className="absolute bottom-20 left-4 bg-white p-2 rounded-lg shadow-lg border border-slate-200 flex items-start gap-2">
                    <img src={selectedImage} alt="Preview" className="w-16 h-16 object-cover rounded-md" />
                    <button onClick={() => setSelectedImage(null)} className="bg-slate-100 rounded-full p-1"><X size={14} /></button>
                </div>
            )}
            <div className="flex items-end gap-2">
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className={`p-3 rounded-xl transition-all ${selectedImage ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-500'}`}>
                <ImageIcon size={20} />
            </button>
            <div className="flex-1 bg-slate-100 rounded-xl flex items-center px-4 py-2">
                <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={selectedImage ? "如何修图？" : "我想买..."}
                className="bg-transparent border-none outline-none w-full text-sm py-1 text-slate-900 placeholder:text-slate-400"
                />
            </div>
            <button onClick={handleSend} disabled={(!input.trim() && !selectedImage) || isLoading} className="bg-slate-900 text-white p-3 rounded-xl">
                {selectedImage ? <Sparkles size={20} /> : <Send size={20} />}
            </button>
            </div>
        </div>
        </div>
    </>
  );
};

export default ChatInterface;