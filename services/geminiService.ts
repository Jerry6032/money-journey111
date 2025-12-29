import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Message, UserProfile, Wallet, CFOAnalysis, ROIAnalysis, Transaction } from "../types";

// Helper to remove "data:image/png;base64," prefix for API calls
const stripBase64Prefix = (base64: string): string => {
  return base64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
};

const getMimeType = (base64: string): string => {
   if (base64.startsWith('data:image/png')) return 'image/png';
   if (base64.startsWith('data:image/jpeg')) return 'image/jpeg';
   if (base64.startsWith('data:image/webp')) return 'image/webp';
   return 'image/png'; // Default
};

const CFO_PERSONA = `
你是一家名为“{USER_NAME} Inc.”的初创公司的“AI 首席财务官 (CFO)”。
你的老板（用户）是一名大学生。
人设：毒舌但负责任的 Gen Z 财务专家。说话幽默、喜欢用 emoji，偶尔会阴阳怪气，但真心为了老板的长远发展。
核心理念：利用“三池子模型”（成长池、防御池、机会池）管理人生 ROI。
`;

/**
 * Chat with the AI CFO
 */
export const getCFOAdvice = async (
  history: Message[],
  userPrompt: string,
  profile: UserProfile,
  wallet: Wallet
): Promise<CFOAnalysis> => {
  if (!process.env.API_KEY) {
    return {
        advice: "错误：找不到 API Key。",
        mood: 'skeptical',
        moodText: "系统离线"
    };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
    ${CFO_PERSONA.replace('{USER_NAME}', profile.name)}
    
    上下文数据:
    - 阶段: ${profile.grade}
    - 总预算: ¥${profile.monthlyBudget}
    - 资金池状态: 
      - 成长池 (投资自己): ¥${wallet.growth}
      - 防御池 (生存/保底): ¥${wallet.defense}
      - 机会池 (风险/娱乐): ¥${wallet.opportunity}
    
    任务:
    分析用户的输入（通常是消费欲望或财务问题）。
    1. 判断是否该买，或者该如何配置资金。
    2. 选择一个心情: 'happy' (好投资), 'anxious' (乱花钱), 'skeptical' (有风险), 'neutral' (普通).
    3. 写一句简短的 'moodText' (2-4个字) 描述你的状态 (例如: "血压升高", "甚感欣慰", "目光犀利").
    4. 给出 'advice' (建议)。风格要像个操心的管家。
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...history.filter(h => h.type === 'text').map(h => ({
            role: h.sender === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }]
        })),
        { role: 'user', parts: [{ text: userPrompt }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                advice: { type: Type.STRING },
                mood: { type: Type.STRING, enum: ['happy', 'anxious', 'neutral', 'skeptical'] },
                moodText: { type: Type.STRING }
            },
            required: ['advice', 'mood', 'moodText']
        }
      },
    });

    if (response.text) {
        return JSON.parse(response.text) as CFOAnalysis;
    }
    throw new Error("Empty response");

  } catch (error) {
    console.error("Gemini Text Error:", error);
    return {
        advice: "系统故障：我的计算器冒烟了，稍后再试。",
        mood: 'neutral',
        moodText: "重启中..."
    };
  }
};

/**
 * Life ROI Calculator
 */
export const calculateLifeROI = async (
    investmentItem: string,
    cost: string,
    profile: UserProfile
): Promise<ROIAnalysis> => {
    if (!process.env.API_KEY) return { score: 'C', commentary: "无 API Key", impact: "无" };

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemInstruction = `
        ${CFO_PERSONA.replace('{USER_NAME}', profile.name)}
        
        任务：计算“人生 ROI”。
        用户想投入时间或金钱做某事（${investmentItem}，成本：${cost}）。
        
        请评估这对大学生未来的长期回报率。
        1. 给出评分 (score): S (血赚), A (优秀), B (一般), C (及格), D (浪费)。
        2. 给出辣评 (commentary): 为什么给这个分？如果分低，讽刺一下；如果分高，大力夸奖。
        3. 给出预期影响 (impact): 比如 "成长池潜能 +20%", "防御池 -100 (吃土预警)"。
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: `我要投资：${investmentItem}，成本：${cost}` }] }],
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.STRING, enum: ['S', 'A', 'B', 'C', 'D'] },
                        commentary: { type: Type.STRING },
                        impact: { type: Type.STRING }
                    },
                    required: ['score', 'commentary', 'impact']
                }
            }
        });

        if (response.text) return JSON.parse(response.text) as ROIAnalysis;
        throw new Error("No ROI response");
    } catch (e) {
        return { score: 'B', commentary: "计算失败，谨慎投资。", impact: "未知风险" };
    }
}

/**
 * Classify Expense for Bookkeeping
 */
export const classifyExpense = async (
    item: string,
    amount: number
): Promise<{ category: 'growth' | 'defense' | 'opportunity', reason: string }> => {
    if (!process.env.API_KEY) return { category: 'defense', reason: '默认归类' };

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemInstruction = `
        任务：记账分类。
        将用户的消费项目归类到“三池子”之一：
        1. growth (成长池): 书籍、课程、健身、技能提升。
        2. defense (防御池): 吃饭、房租、交通、日用品 (生存必需)。
        3. opportunity (机会池): 聚会、游戏、奶茶、旅游 (享乐/社交/风险)。
        
        返回 JSON。
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: `消费：${item}，金额：${amount}` }] }],
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        category: { type: Type.STRING, enum: ['growth', 'defense', 'opportunity'] },
                        reason: { type: Type.STRING }
                    },
                    required: ['category', 'reason']
                }
            }
        });

        if (response.text) {
             const result = JSON.parse(response.text);
             return result;
        }
        return { category: 'defense', reason: 'AI 无法判断，默认为生存支出' };
    } catch (e) {
        return { category: 'defense', reason: '网络错误，默认为生存支出' };
    }
}

/**
 * Generate Financial Brief
 */
export const generateFinancialBrief = async (
    transactions: Transaction[],
    profile: UserProfile
): Promise<string> => {
    if (!process.env.API_KEY) return "暂无数据，请先记账。";
    if (transactions.length === 0) return "老板，你还没花钱呢，这账表比我的脸还干净。";

    const summary = transactions.map(t => `${t.title} (${t.amount}元, ${t.category})`).join(', ');

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemInstruction = `
        ${CFO_PERSONA.replace('{USER_NAME}', profile.name)}
        
        任务：生成一份简短、犀利的财务简报。
        根据用户的消费记录：${summary}
        
        1. 总结消费习惯。
        2. 既然你知道他是大学生，根据三池子模型给出评价。
        3. 字数控制在 60 字以内。
        4. 语气要像个操心的 CFO。
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: "生成简报" }] }],
            config: {
                systemInstruction: systemInstruction,
            }
        });

        if (response.text) return response.text;
        return "CFO 正在整理发票...";
    } catch (e) {
        return "简报生成失败。";
    }
}


/**
 * Edit User Image
 */
export const editUserImage = async (
  base64Image: string,
  prompt: string
): Promise<string | null> => {
  if (!process.env.API_KEY) return null;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const cleanBase64 = stripBase64Prefix(base64Image);
    const mimeType = getMimeType(base64Image);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: cleanBase64 } },
          { text: prompt },
        ],
      },
    });

    if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Edit Error:", error);
    return null;
  }
};