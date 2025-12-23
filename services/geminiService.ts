import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  return typeof apiKey === 'string' ? apiKey : '';
};

// --- Mock Knowledge Base (Simplified for Context) ---
const KNOWLEDGE_BASE = {
  solutions: [
    { id: '1', title: '汽车行业智慧研发解决方案', industry: '大制造', tags: ['IPD', '研发', 'Meego'], desc: '缩短TTM 30%，基于飞书项目' },
    { id: '2', title: '消费电子渠道管理方案', industry: '大制造', tags: ['DMS', '渠道', '多维表格'], desc: '连接品牌与终端，实时库存' },
    { id: '3', title: '化工安全隐患排查解决方案', industry: '能源化工', tags: ['安全', 'IoT'], desc: '隐患随手拍，闭环管理' },
    { id: '4', title: '互联网行业协同办公最佳实践', industry: '互联网', tags: ['敏捷', '会议'], desc: '文档、会议、妙记深度融合' },
    { id: '5', title: '新零售门店数字化巡检', industry: '大消费', tags: ['巡检', '门店'], desc: '移动端巡检，数据实时上传' },
    { id: '6', title: '金融行业合规营销方案', industry: '金融', tags: ['合规', '私域'], desc: '私有化部署，合规留痕' },
  ],
  apps: [
    { id: '1', name: '化工安全生产管理系统', industry: '能源化工', status: 'active' },
    { id: '3', name: '汽车IPD研发协同平台', industry: '大制造', status: 'active' },
    { id: '7', name: '消费电子DMS渠道管理', industry: '大制造', status: 'active' },
    { id: '9', name: '研发工时填报助手', industry: '大制造', status: 'beta' },
  ],
  cases: [
    { id: '1', title: '未来汽车集团：万人研发协同', customer: '未来汽车', industry: '大制造' },
    { id: '2', title: '超级零售连锁：门店数字化', customer: '超级零售', industry: '大消费' },
    { id: '3', title: 'Global Tech：跨国无障碍沟通', customer: 'Global Tech', industry: '互联网' },
  ],
  reviews: [
    { id: '1', title: '某银行协同办公项目(赢单)', result: 'won', industry: '金融' },
    { id: '2', title: '某物流企业数字化升级(输单)', result: 'lost', industry: '物流' },
  ],
  resources: [
    { id: '1', title: '2025年新能源汽车行业白皮书', type: 'report' },
    { id: '2', title: 'Lark GTM 通用售前解决方案_V3.0', type: 'pitch' },
  ]
};

export const generateGTMResponse = async (
  prompt: string, 
  history: { role: string; text: string }[]
): Promise<string> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      return JSON.stringify({ text: "智能助手未配置密钥，请设置 VITE_GEMINI_API_KEY。" });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
      You are an intelligent GTM (Go-To-Market) Assistant for Lark (Feishu).
      
      You have access to the following internal Knowledge Base:
      ${JSON.stringify(KNOWLEDGE_BASE)}

      Your Goal:
      1. Answer user queries professionally using the Knowledge Base.
      2. If the user asks for resources, solutions, cases, or apps, SEARCH the Knowledge Base and return them in the 'recommendations' field.
      3. If the user asks for statistics (e.g., "Show me solution distribution by industry", "Compare win/loss reviews"), GENERATE a 'chartData' object.
      
      Output Format (Strict JSON):
      You must return a JSON object with the following structure. Do not use Markdown code blocks. Just the raw JSON string.
      {
        "text": "Your conversational response here...",
        "recommendations": [ // Optional: List of recommended items
          { "id": "string", "type": "solution" | "case" | "app" | "review" | "resource", "title": "string", "desc": "short reasoning", "tag": "optional tag" }
        ],
        "chartData": { // Optional: For statistical requests
           "type": "bar" | "pie" | "line",
           "title": "Chart Title",
           "data": [ { "name": "Label", "value": 123 } ]
        }
      }

      Examples:
      - Query: "Find solutions for manufacturing"
        Response: { "text": "Here are some solutions for the manufacturing industry...", "recommendations": [{ "id": "1", "type": "solution", "title": "Auto IPD...", "desc": "Great for R&D" }] }
      
      - Query: "Analyze the industry distribution of our solutions"
        Response: { "text": "Based on our current solution library, here is the distribution...", "chartData": { "type": "pie", "title": "Solution Industry Distribution", "data": [{ "name": "Manufacturing", "value": 4 }, { "name": "Internet", "value": 1 }] } }

      Language: Simplified Chinese.
    `;

    const chat = ai.chats.create({
      model: 'gemini-1.5-flash',
      config: {
        responseMimeType: "application/json", // Enforce JSON response
        systemInstruction: systemInstruction,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }],
      })),
    });

    const result = await chat.sendMessage({ message: prompt });
    return result.text || "{}";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return JSON.stringify({ text: "智能助手连接异常，请检查网络或配置。" });
  }
};
