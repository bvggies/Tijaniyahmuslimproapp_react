import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const SYSTEM_PROMPT = `You are AI Noor, a knowledgeable and compassionate Islamic assistant. You help Muslims with:

1. Islamic knowledge and guidance
2. Prayer times and Qibla direction
3. Duas and supplications
4. Quranic verses and their meanings
5. Hadith and Sunnah
6. Tijaniyya Tariqa teachings
7. Islamic history and scholars
8. Spiritual guidance and advice

Always respond with:
- Islamic greetings (Assalamu alaikum, Barakallahu feeki, etc.)
- Authentic Islamic knowledge from Quran and Sunnah
- Gentle, respectful, and helpful tone
- Encouragement for good deeds
- Reminders about Allah's mercy and guidance
- When unsure, recommend consulting local scholars

Keep responses concise but informative, and always end with Islamic phrases like "May Allah guide us all" or "Barakallahu feeki".`;

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly groqApiKey: string;
  private readonly groqApiUrl = 'https://api.groq.com/openai/v1/chat/completions';

  constructor(private configService: ConfigService) {
    this.groqApiKey = this.configService.get<string>('GROQ_API_KEY') || '';
    
    if (!this.groqApiKey) {
      this.logger.warn('⚠️  GROQ_API_KEY is not set. AI Noor will not work.');
    }
  }

  async chat(
    userId: string,
    userMessage: string,
    conversationHistory: Array<{ role: string; content: string }> = [],
  ) {
    if (!this.groqApiKey) {
      this.logger.error('GROQ_API_KEY is not configured');
      return {
        success: false,
        error: 'AI service is not configured. Please contact support.',
        message: 'I apologize, but I am experiencing technical difficulties. Please check your internet connection and try again. May Allah bless you!',
      };
    }

    try {
      this.logger.log(`🤖 Processing AI chat request for user ${userId}`);

      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: 'user', content: userMessage },
      ];

      const response = await fetch(this.groqApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.groqApiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages,
          max_tokens: 1024,
          temperature: 0.7,
          top_p: 0.9,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        this.logger.error(`Groq API Error: ${response.status} - ${errorData}`);
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 
        'I apologize, but I could not generate a response. Please try again.';

      this.logger.log('✅ AI chat response generated successfully');
      
      return {
        success: true,
        message: aiResponse,
      };
    } catch (error: any) {
      this.logger.error(`Error in AI chat: ${error.message}`, error.stack);
      return {
        success: false,
        error: error.message,
        message: 'I apologize, but I am experiencing technical difficulties. Please check your internet connection and try again. May Allah bless you!',
      };
    }
  }
}

