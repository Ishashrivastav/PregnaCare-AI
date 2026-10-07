import { prisma } from '../config/database.js';
import { config } from '../config/index.js';
import { AISafetyService } from './aiSafety.service.js';
import { logger } from '../utils/logger.js';

export class ChatService {
  static async processMessage(userId: string, data: {
    message: string;
    sessionId?: string;
    currentWeek?: number;
  }) {
    // 1. Evaluate safety layer
    const safety = AISafetyService.assessUrgency(data.message);

    // 2. Manage ChatSession
    let session = data.sessionId
      ? await prisma.chatSession.findUnique({ where: { id: data.sessionId } })
      : null;

    if (!session || session.userId !== userId) {
      session = await prisma.chatSession.create({
        data: {
          userId,
          title: data.message.length > 35 ? `${data.message.substring(0, 32)}...` : data.message,
        },
      });
    }

    // 3. Save User Message
    await prisma.chatMessage.create({
      data: {
        chatSessionId: session.id,
        role: 'USER',
        content: data.message,
        concernCategory: safety.category,
        recommendedDoctorSpecialty: safety.recommendedSpecialty,
      },
    });

    // 4. If Urgent, return safety response immediately without calling LLM
    if (safety.isUrgent) {
      const assistantMessage = await prisma.chatMessage.create({
        data: {
          chatSessionId: session.id,
          role: 'ASSISTANT',
          content: safety.urgentGuidance!,
          concernCategory: safety.category,
          recommendedDoctorSpecialty: safety.recommendedSpecialty,
          isSafetyAlert: true,
        },
      });

      return {
        sessionId: session.id,
        message: assistantMessage,
        isUrgent: true,
        category: safety.category,
        recommendedSpecialty: safety.recommendedSpecialty,
        disclaimer: AISafetyService.getMedicalDisclaimer(),
      };
    }

    // 5. Generate Educational Response (via LLM or Smart Medical Knowledge Fallback)
    let aiResponseText = '';

    if (config.llmApiKey) {
      try {
        aiResponseText = await this.callLLMApi(data.message, data.currentWeek, safety.category);
      } catch (err: any) {
        logger.warn('External LLM call failed or timed out, activating clinical-educational fallback engine', { err: err.message });
        aiResponseText = this.generateFallbackResponse(data.message, data.currentWeek, safety.category);
      }
    } else {
      aiResponseText = this.generateFallbackResponse(data.message, data.currentWeek, safety.category);
    }

    // Append standard educational disclaimer
    const fullContent = `${aiResponseText}\n\n*${AISafetyService.getMedicalDisclaimer()}*`;

    // 6. Save Assistant Response
    const assistantMessage = await prisma.chatMessage.create({
      data: {
        chatSessionId: session.id,
        role: 'ASSISTANT',
        content: fullContent,
        concernCategory: safety.category,
        recommendedDoctorSpecialty: safety.recommendedSpecialty,
        isSafetyAlert: false,
      },
    });

    return {
      sessionId: session.id,
      message: assistantMessage,
      isUrgent: false,
      category: safety.category,
      recommendedSpecialty: safety.recommendedSpecialty,
      disclaimer: AISafetyService.getMedicalDisclaimer(),
    };
  }

  private static async callLLMApi(message: string, currentWeek?: number, category?: string): Promise<string> {
    const prompt = `
You are PregnaCare AI Assistant, an empathetic, evidence-based pregnancy care educator.
Mother's stage: ${currentWeek ? `Week ${currentWeek}` : 'General pregnancy'}.
Topic Category: ${category || 'General Pregnancy'}.

CRITICAL SAFETY & CLINICAL RULES:
- Provide clear educational guidance, physiological explanations, and practical wellness advice.
- NEVER diagnose diseases or medical conditions.
- NEVER prescribe medication, recommend pharmaceuticals, or specify dosages.
- Explicitly recommend speaking with an OB/GYN or midwife for diagnostic evaluation or clinical reassurance.
- Write in warm, structured, easy-to-read paragraphs with bullet points where appropriate.

User Question: "${message}"
`;

    // Support Google Gemini standard endpoint
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.llmApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data: any = await response.json();
    const candidate = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidate) {
      throw new Error('Empty response from LLM');
    }

    return candidate;
  }

  private static generateFallbackResponse(message: string, currentWeek?: number, category?: string): string {
    const text = message.toLowerCase();
    const week = currentWeek || 20;

    if (text.includes('which doctor') || text.includes('consult') || text.includes('specialist')) {
      return (
        "Healthcare Professional Guidance:\n\n" +
        "Depending on your question, here are the key maternal health specialties:\n\n" +
        "• **Obstetrician/Gynecologist (OB/GYN)**: Specializes in prenatal care, pregnancy monitoring, labor, delivery, and postpartum health.\n" +
        "• **Certified Nurse-Midwife (CNM)**: Focuses on low-intervention prenatal care, physiological birth, and postpartum support.\n" +
        "• **Maternal-Fetal Medicine (MFM) Specialist**: Manages high-risk pregnancies, multiple gestations, or pre-existing chronic conditions.\n" +
        "• **Prenatal Nutritionist / Registered Dietitian**: Provides tailored nutritional plans for gestational diabetes, healthy weight gain, and micronutrient balance.\n" +
        "• **Perinatal Mental Health Specialist**: Supports emotional well-being, prenatal anxiety, and postpartum mood adjustments.\n\n" +
        "We recommend reaching out to your primary OB/GYN or prenatal clinic for direct assessment."
      );
    }

    if (text.includes('second trimester') || (week >= 14 && week <= 27 && text.includes('trimester'))) {
      return (
        "Welcome to the Second Trimester (Weeks 14–27)!\n\n" +
        "Often called the 'honeymoon phase' of pregnancy, this stage brings noticeable milestones:\n\n" +
        "• **Baby Development**: Baby grows rapidly from about the size of a lemon to an eggplant. Bones are ossifying, hearing is developing, and fine hair (lanugo) protects delicate skin.\n" +
        "• **Mother's Body**: Morning sickness often wanes, and energy levels rebound. You may start feeling fluttering movements (quickening) between weeks 18–22.\n" +
        "• **Key Checkup**: The anatomy ultrasound is typically scheduled between weeks 18 and 22 to examine organs, limbs, and placenta position.\n" +
        "• **Wellness Suggestions**: Prioritize gentle prenatal stretching, side-sleeping with pillow support, and consistent hydration."
      );
    }

    if (text.includes('discuss at my prenatal appointment') || text.includes('questions to ask') || text.includes('appointment')) {
      return (
        "Important Topics for Your Prenatal Checkup:\n\n" +
        "Preparing ahead helps make the most of your provider visits. Here are helpful questions:\n\n" +
        "1. **Symptom Review**: 'Are the specific changes I've noticed (such as mild cramps, sleep patterns, or energy levels) typical for my week?'\n" +
        "2. **Upcoming Screenings**: 'What lab tests or ultrasound scans are scheduled for the coming weeks, and what do they check for?'\n" +
        "3. **Physical Activity**: 'Are there specific restrictions on my daily exercise, lifting, or work routine?'\n" +
        "4. **Emergency Protocols**: 'What phone number should I call after clinic hours if I have an urgent question or concerning symptoms?'\n" +
        "5. **Nutrition & Supplements**: 'Are my current prenatal vitamin regimen and dietary habits meeting our developmental goals?'"
      );
    }

    if (text.includes('nutrition') || text.includes('food') || text.includes('diet') || text.includes('eat')) {
      return (
        "Essential Pregnancy Nutrition Principles:\n\n" +
        "Nutritious eating during pregnancy supports both maternal vitality and fetal growth:\n\n" +
        "• **Quality Protein**: Include eggs, lean poultry, legumes, tofu, and cooked fish low in mercury for tissue building.\n" +
        "• **Folate / Folic Acid**: Vital for neural tube development; found in dark leafy greens, citrus fruits, and fortified grains.\n" +
        "• **Iron & Vitamin C**: Supports increased blood volume. Pair plant-based iron (lentils, spinach) with vitamin C (bell peppers, oranges) for enhanced absorption.\n" +
        "• **Hydration**: Aim for 8–10 cups of water daily to maintain amniotic fluid and ease digestion.\n" +
        "• **Foods to Avoid**: Raw/undercooked meats and seafood, unpasteurized cheeses, raw sprouts, and excessive caffeine."
      );
    }

    if (text.includes('back') || text.includes('discomfort') || text.includes('ache')) {
      return (
        "Managing Pregnancy Back Discomfort:\n\n" +
        "Back discomfort is common as your center of gravity shifts and pregnancy hormones (relaxin) loosen pelvic ligaments:\n\n" +
        "• **Posture Support**: Practice standing tall with shoulders relaxed and pelvic neutral.\n" +
        "• **Sleep Ergonomics**: Sleep on your side with a supportive pillow between your knees and under your belly.\n" +
        "• **Gentle Movement**: Gentle pelvic tilts, prenatal yoga, and walking can relieve tension.\n" +
        "• **When to Consult Your Doctor**: Contact your provider immediately if the pain is severe, rhythmic, radiates around to the front, or is accompanied by fever or urinary discomfort."
      );
    }

    // Default general educational pregnancy response
    return (
      `Educational Information for Week ${week}:\n\n` +
      "Thank you for sharing your question. During pregnancy, your body undergoes continuous hormonal, vascular, and musculoskeletal adaptations.\n\n" +
      "• **Key Focus**: Rest when tired, stay well-hydrated, and maintain a balanced whole-foods diet.\n" +
      "• **Body Awareness**: Track how your body responds to daily tasks and keep a written list of questions for your next clinic visit.\n" +
      "• **Support Network**: Partner, family, and prenatal healthcare professionals work together to ensure a healthy journey.\n\n" +
      "If you are ever uncertain about a symptom or experience acute pain, bleeding, or unusual fluid, please seek prompt clinical attention."
    );
  }

  static async getChatHistory(userId: string) {
    return prisma.chatSession.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  static async clearSession(userId: string, sessionId: string) {
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
    });
    if (!session || session.userId !== userId) {
      return false;
    }
    await prisma.chatSession.delete({
      where: { id: sessionId },
    });
    return true;
  }
}
