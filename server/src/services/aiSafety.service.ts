export interface SafetyCheckResult {
  isUrgent: boolean;
  category: string;
  recommendedSpecialty: string;
  urgentGuidance?: string;
}

const URGENT_SYMPTOM_PATTERNS = [
  /heavy\s+bleed/i,
  /vaginal\s+bleed/i,
  /severe\s+abdominal\s+pain/i,
  /intense\s+stomach\s+pain/i,
  /fluid\s+leak/i,
  /water\s+broke/i,
  /amniotic\s+fluid/i,
  /severe\s+headache/i,
  /blurred\s+vision|vision\s+changes|flashing\s+lights/i,
  /decreased\s+fetal\s+movement|no\s+baby\s+movement|baby\s+not\s+moving/i,
  /high\s+fever/i,
  /chest\s+pain|shortness\s+of\s+breath|trouble\s+breathing/i,
  /sudden\s+swelling\s+in\s+face|swelling\s+hands\s+face/i,
  /uncontrollable\s+vomit/i,
  /seizure|convulsion/i,
];

export class AISafetyService {
  static assessUrgency(message: string): SafetyCheckResult {
    const text = message.toLowerCase();

    for (const pattern of URGENT_SYMPTOM_PATTERNS) {
      if (pattern.test(text)) {
        return {
          isUrgent: true,
          category: 'Urgent Concern',
          recommendedSpecialty: 'Obstetric Emergency / Maternal-Fetal Medicine Specialist',
          urgentGuidance: 
            "⚠️ URGENT HEALTH NOTICE:\n\n" +
            "The symptoms you described can indicate a condition requiring immediate clinical evaluation. " +
            "PregnaCare AI does not provide medical diagnoses or emergency triage.\n\n" +
            "PLEASE TAKE THE FOLLOWING ACTIONS IMMEDIATELY:\n" +
            "1. Contact your obstetrician, midwife, or maternity emergency department right now.\n" +
            "2. If you are experiencing heavy bleeding, severe pain, or difficulty breathing, call your local emergency services (e.g., 911, 112, or local ambulance) or proceed to the nearest emergency room.\n" +
            "3. Do not take medications without direct authorization from your healthcare provider.\n\n" +
            "Your health and your baby's safety are the top priority.",
        };
      }
    }

    // Categorization logic
    let category = 'General Pregnancy';
    let recommendedSpecialty = 'Obstetrician / Gynecologist';

    if (/\b(food|diet|eat|nutrition|protein|vitamin|iron|calcium|folic|sugar|glucose)\b/i.test(text)) {
      category = 'Nutrition';
      recommendedSpecialty = 'Prenatal Nutritionist / Dietitian';
    } else if (/\b(anxiety|stress|sad|depress|overwhelm|crying|fear|mood|panic)\b/i.test(text)) {
      category = 'Mental Wellbeing';
      recommendedSpecialty = 'Perinatal Mental Health Specialist';
    } else if (/\b(breastfeed|milk|latch|nursing|colostrum|formula|pump)\b/i.test(text)) {
      category = 'Breastfeeding';
      recommendedSpecialty = 'International Board Certified Lactation Consultant (IBCLC)';
    } else if (/\b(after birth|postpartum|recovery|lochia|fourth trimester|c-section care)\b/i.test(text)) {
      category = 'Postnatal Care';
      recommendedSpecialty = 'Obstetrician / Gynecologist & Postpartum Care Team';
    } else if (/\b(nausea|cramp|backache|fatigue|swelling|heartburn|insomnia|ache|pain)\b/i.test(text)) {
      category = 'Pregnancy Symptoms';
      recommendedSpecialty = 'Obstetrician / Gynecologist';
    }

    return {
      isUrgent: false,
      category,
      recommendedSpecialty,
    };
  }

  static getMedicalDisclaimer(): string {
    return "Disclaimer: PregnaCare AI provides general educational and organizational support only. It does not replace professional medical advice, clinical diagnosis, or treatment. Always consult your qualified healthcare provider with any medical questions.";
  }

  static generateDoctorQuestions(concern: string, currentWeek?: number): {
    summary: string;
    suggestedQuestions: string[];
    specialtyRecommendation: string;
    warningSignsToWatch: string[];
  } {
    const assessment = this.assessUrgency(concern);
    const weekText = currentWeek ? ` (Week ${currentWeek})` : '';

    const suggestedQuestions = [
      `Is the symptom or concern ("${concern.trim()}") typical for my current stage${weekText}?`,
      `Are there specific comfort measures or routine adjustments you recommend for this?`,
      `Are there specific activities, exercises, or dietary choices I should temporarily avoid?`,
      `What specific changes or red-flag signs would warrant immediate contact with your clinic?`,
    ];

    const warningSignsToWatch = [
      'Sudden increase in severity or sharp acute pain',
      'Any vaginal bleeding or fluid leakage',
      'Persistent high fever or chills',
      'Noticeable reduction in regular fetal movement',
    ];

    return {
      summary: `Guidance prepared for your upcoming consultation regarding "${concern.trim()}"`,
      suggestedQuestions,
      specialtyRecommendation: assessment.recommendedSpecialty,
      warningSignsToWatch,
    };
  }
}
