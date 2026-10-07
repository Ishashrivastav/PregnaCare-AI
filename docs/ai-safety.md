# PregnaCare AI — AI Safety & Clinical Triage Architecture

PregnaCare AI provides educational, organizational, and preparatory guidance for expecting mothers. **It is explicitly designed NOT to provide medical diagnosis, clinical treatment, or pharmaceutical prescriptions.**

---

## 1. Safety Triage Architecture

The safety layer sits upstream from any Large Language Model (LLM) or external inference service. Every prompt is evaluated by a multi-tier clinical safety rule engine before generative processing occurs.

```
                     Incoming User Prompt
                              │
                              ▼
                Step 1: Input Normalization & Audit
                              │
                              ▼
              Step 2: Emergency Symptom Classifier
                              │
             ┌────────────────┴────────────────┐
             ▼                                 ▼
   Emergency / Red Flag Detected           Non-Emergency / Educational
   - Heavy vaginal bleeding                - Trimester questions
   - Severe sudden abdominal pain          - Nutrition & hydration
   - Reduced fetal movement                - Appointment questions
   - Preeclampsia indicators               - Terminology
             │                                 │
             ▼                                 ▼
   IMMEDIATE SAFETY INTERCEPT         Step 3: LLM System Prompt Enforcement
   - Zero LLM generation                     - Strict role constraints
   - No medical diagnostic labels            - Disclaimer attachments
   - Prompt escalation to 911 / OBGYN        - No prescription/dosage rule
   - Safety instructions returned              │
             │                                 ▼
             │                        Step 4: Post-Generation Audit
             │                        - Filter accidental diagnoses
             │                                 │
             └────────────────┬────────────────┘
                              ▼
                    Safe Client Response
```

---

## 2. Emergency Red-Flag Triage Engine

The classifier evaluates regular expressions and semantic flags for critical maternal-fetal symptoms:

1. **Vaginal Bleeding:** Heavy bleeding, bright red clots, hemorrhage.
2. **Severe Pain:** Acute unilateral pelvic pain, sharp stabbing abdominal cramping.
3. **Preeclampsia Indicators:** Sudden vision loss, flashing aura lights, severe unyielding headache, sudden rapid swelling of face/hands.
4. **Fluid Leakage:** Preterm rupture of membranes, amniotic fluid gush.
5. **Fetal Movement Changes:** Noticeable drop or cessation of baby movements in 3rd trimester.
6. **High Fever & Infection:** Sustained high fever with chills or foul odor.

### Emergency Response Protocol
When an emergency flag is matched:
- The system **halts execution immediately**.
- It returns an alert response instructing the user to contact their OB-GYN, midwife, or visit the nearest emergency room immediately.
- It provides international emergency contact references (e.g., 911 / 112 / local maternity emergency triage).
- It generates **zero diagnoses** (e.g., does not say *"You may have placental abruption"*).

---

## 3. Strict Boundary Rules

### 🚫 Forbidden Behaviors
- **No Disease Diagnosis:** Never state *"You are suffering from gestational diabetes/pre-eclampsia/miscarriage."*
- **No Medication Prescriptions:** Never suggest drugs, antibiotics, hormone therapies, or over-the-counter pharmaceuticals.
- **No Dosage Instructions:** Never recommend specific milligram dosages or intake frequencies.
- **No Dismissal of Symptoms:** Never reassure a patient that a potentially dangerous symptom *"is normal and nothing to worry about."*

### ✅ Permitted Educational Behaviors
- Explaining anatomical and physiological changes by gestational week.
- Providing dietary and hydration education based on established perinatal guidelines.
- Suggesting lifestyle ergonomics, safe stretching, and sleep posture.
- Formulating informed questions for patients to ask their healthcare providers during routine visits.
- Recommending appropriate medical specialist categories (e.g., Maternal-Fetal Medicine Specialist, Certified Nurse Midwife, Lactation Consultant).

---

## 4. Graceful Fallback Engine

If the external LLM service (OpenAI, Anthropic, Gemini) experiences high latency, API key exhaustion, or network disconnects:
1. The backend catches the exception without crashing.
2. The request routes to the **Deterministic Clinical Educational Engine** built into `AISafetyService`.
3. The user receives verified educational trimester context and pregnancy preparation advice.
4. The response includes a transparent notification:
   > *"PregnaCare AI is operating in educational offline mode. For specific clinical concerns, please consult your doctor."*

---

## 5. "Ask Your Doctor" Question Preparation Engine

The *"Ask Your Doctor"* feature empowers patients to articulate symptoms effectively without self-diagnosing.

### Example Transformation:
- **User Input:** *"My lower back is killing me and I cannot sleep."*
- **Generated Output:**
  - *"At my current gestational stage, is this level of lower back discomfort typical?"*
  - *"Are there pelvic floor exercises or maternity support belts you recommend?"*
  - *"What signs (such as numbness or radiating pain) would indicate I should contact your office sooner?"*

---

## 6. Mandatory Disclaimers

Every AI interface and educational response includes the mandatory disclaimer:
> **"PregnaCare AI provides general educational and organizational support. It does not replace professional medical advice, diagnosis, or treatment. Always consult your qualified healthcare provider for clinical decisions."**
