// backend/services/llamaService.js
const { HfInference } = require('@huggingface/inference');
const Cerebras = require('@cerebras/cerebras_cloud_sdk').default;

class cerebras {
 constructor() {
    this.client = new Cerebras({
      apiKey: process.env.CEREBRAS_API_KEY
    });
    this.model = 'llama3.1-8b';
  }

  


  /**
   * Multi-lingual medical symptom checker
   * @param {string} symptoms - Patient symptoms
   * @param {string} language - Language (hindi, english, tamil, etc.)
   */
async analyzeSymptoms(symptoms, language = 'english') {
    try {
      const languageInstructions = {
        hindi: 'हिंदी में जवाब दें।',
        english: 'Respond in English.',
        tamil: 'தமிழில் பதிலளிக்கவும்.',
        telugu: 'తెలుగులో సమాధానం ఇవ్వండి.',
        bengali: 'বাংলায় উত্তর দিন।'
      };

      const prompt = `You are an experienced Indian doctor providing medical consultation.

Patient Symptoms: ${symptoms}

Provide a comprehensive medical assessment in JSON format:
{
  "differential_diagnosis": [
    {
      "disease": "Disease name",
      "probability": 0.85,
      "reasoning": "Why this diagnosis",
      "common_in_india": true/false
    }
  ],
  "follow_up_questions": [
    "Question 1 to narrow diagnosis",
    "Question 2",
    "Question 3"
  ],
  "immediate_advice": [
    "What to do right now",
    "Symptoms to watch for"
  ],
  "severity_assessment": "mild/moderate/severe/critical",
  "requires_hospital": true/false,
  "requires_emergency": true/false,
  "home_remedies": [
    "Safe home remedy 1",
    "Safe home remedy 2"
  ],
  "recommended_tests": [
    "Blood test",
    "X-ray",
    "etc"
  ],
  "estimated_cost": "₹500-2000",
  "nearest_facility": "Primary Health Center / District Hospital / Emergency"
}

${languageInstructions[language] || languageInstructions.english}
Focus on diseases common in India. Be empathetic and clear.`;

      const response = await this.client.chat.completions.create({
        model: 'llama3.1-8b',
        messages: [
          {
            role: 'system',
            content: 'You are a knowledgeable and empathetic Indian doctor. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.3 // Low temperature for consistent output
      });
      
      // Extract JSON from response
      const content = response.choices[0].message.content;
      console.log('✅ Raw response:', content);
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        return this.createFallbackDiagnosis(symptoms);
      }

    } catch (error) {
      console.error('Symptom Analysis Error:', error);
      return this.createFallbackDiagnosis(symptoms);
    }
  }

 

  /**
   * Maternal health risk prediction
   * @param {Object} vitalSigns - Patient vital signs
   */
async predictMaternalRisk(vitalSigns) {
    try {
      const { bloodPressure, weight, hemoglobin, glucose, gestationalAge, previousPregnancies } = vitalSigns;

      const prompt = `You are a maternal health specialist. Analyze these vital signs for pregnancy complications and also Disease.

Patient Data:
- Blood Pressure: ${bloodPressure.systolic}/${bloodPressure.diastolic} mmHg
- Weight: ${weight} kg
- Hemoglobin: ${hemoglobin} g/dL
- Blood Glucose: ${glucose} mg/dL
- Gestational Age: ${gestationalAge} weeks
- Previous Pregnancies: ${previousPregnancies}

Provide risk assessment in JSON:
{
  "overall_risk": "low/medium/high/critical",
  "risk_score": 1-10,
  "specific_risks": [
    {
      "condition": "Preeclampsia/Gestational Diabetes/Anemia/etc",
      "probability": 0.75,
      "warning_signs": ["Sign 1", "Sign 2"],
      "timeline": "Expected in 2-3 weeks"
    }
  ],
  "immediate_actions": [
    "Action 1",
    "Action 2"
  ],
  "dietary_recommendations": [
    "Increase iron-rich foods",
    "Reduce salt intake"
  ],
  "monitoring_frequency": "daily/weekly/biweekly",
  "requires_hospital_admission": true/false,
  "follow_up_tests": ["Test 1", "Test 2"],
  "estimated_delivery_complications": "low/medium/high"
}

Base analysis on Indian maternal health guidelines (WHO + FOGSI).`;

      const response = await this.client.chat.completions.create({
        model: 'llama3.1-8b',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in maternal health. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.3 // Low temperature for consistent output
      });

      const content = response.choices[0].message.content;
      console.log('✅ Raw response:', content);
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        return this.createFallbackRiskAssessment();
      }

    } catch (error) {
      console.error('Maternal Risk Prediction Error:', error);
      return this.createFallbackRiskAssessment();
    }
  }

  /**
   * Predict maternal risk and suggest interventions
   */
//   async predictMaternalRisk(vitalSigns) {
//     try {
//       const prompt = `You are a maternal health specialist. Analyze these vital signs for pregnancy complications.

// Vital Signs:
// - Blood Pressure: ${vitalSigns.bloodPressure.systolic}/${vitalSigns.bloodPressure.diastolic} mmHg
// - Weight: ${vitalSigns.weight} kg
// - Hemoglobin: ${vitalSigns.hemoglobin} g/dL
// - Blood Glucose: ${vitalSigns.glucose} mg/dL
// - Gestational Age: ${vitalSigns.gestationalAge} weeks
// - Previous Pregnancies: ${vitalSigns.previousPregnancies}

// Provide risk assessment in JSON:
// {
//   "overall_risk": "low/medium/high/critical",
//   "risk_score": 1-10,
//   "specific_risks": [
//     {
//       "condition": "Preeclampsia/Gestational Diabetes/Anemia/etc",
//       "probability": 0.75,
//       "warning_signs": ["Sign 1", "Sign 2"],
//       "timeline": "Expected in 2-3 weeks"
//     }
//   ],
//   "immediate_actions": [
//     "Action 1",
//     "Action 2"
//   ],
//   "dietary_recommendations": [
//     "Increase iron-rich foods",
//     "Reduce salt intake"
//   ],
//   "monitoring_frequency": "daily/weekly/biweekly",
//   "requires_hospital_admission": true/false,
//   "follow_up_tests": ["Test 1", "Test 2"],
//   "estimated_delivery_complications": "low/medium/high"
// }

// Base analysis on Indian maternal health guidelines (WHO + FOGSI).`;

//       const response = await this.hf.textGeneration({
//         model: this.model,        

//         inputs: prompt,
//         parameters: {
//           max_new_tokens: 1500,
//           temperature: 0.2
//         }
//       });

//       const content = response.generated_text;
//       const jsonMatch = content.match(/\{[\s\S]*\}/);
//       return jsonMatch ? JSON.parse(jsonMatch[0]) : this.createFallbackRiskAssessment();

//     } catch (error) {
//       console.error('Maternal Risk Prediction Error:', error);
//       return this.createFallbackRiskAssessment();
//     }
//   }

  /**
   * Generate personalized treatment plan
   */
  async generateTreatmentPlan(diagnosis, patientProfile) {
    try {
      const prompt = `Create a detailed treatment plan for an Indian patient.

Diagnosis: ${diagnosis}
Patient Age: ${patientProfile.age}
Location: ${patientProfile.location} (Rural/Urban)
Economic Status: ${patientProfile.economicStatus}

Provide treatment plan in JSON:
{
  "medications": [
    {
      "name": "Medicine name (Generic + Brand)",
      "dosage": "500mg twice daily",
      "duration": "7 days",
      "cost": "₹50-100",
      "available_at": "PHC/Medical store"
    }
  ],
  "lifestyle_changes": ["Change 1", "Change 2"],
  "diet_plan": {
    "foods_to_eat": ["Food 1", "Food 2"],
    "foods_to_avoid": ["Food 1", "Food 2"],
    "local_alternatives": ["Available in village"]
  },
  "follow_up_schedule": "After 3 days, 1 week, 2 weeks",
  "warning_signs": ["When to rush to hospital"],
  "estimated_recovery_time": "7-10 days",
  "total_estimated_cost": "₹500-1500",
  "government_schemes": ["Ayushman Bharat", "State schemes"]
}

Prioritize affordable, locally available treatments.`;

      const response = await this.hf.textGeneration({
        model: this.model,
        inputs: prompt,
        parameters: {
          max_new_tokens: 1500,
          temperature: 0.3
        }
      });

      const content = response.generated_text;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { medications: [], lifestyle_changes: [] };

    } catch (error) {
      console.error('Treatment Plan Error:', error);
      return { medications: [], error: error.message };
    }
  }

  /**
   * Disease outbreak prediction based on symptoms patterns
   */
async predictOutbreak(diseaseData) {
    try {
      const { region, recentCases, symptoms, season, temperature } = diseaseData;

      const prompt = `Analyze disease outbreak risk for Indian region.

Data:
- Region: ${region}
- Recent Cases: ${recentCases.map(c => `${c.disease}: ${c.count}`).join(', ')}
- Common Symptoms: ${symptoms.join(', ')}
- Season: ${season}
- Temperature: ${temperature}°C

Predict outbreak risk in JSON:
{
  "outbreak_probability": 0.0-1.0,
  "predicted_disease": "Disease name",
  "expected_timeline": "In 2-3 weeks",
  "affected_population": "Estimated number",
  "risk_factors": ["Factor 1", "Factor 2"],
  "prevention_measures": ["Measure 1", "Measure 2"],
  "required_resources": {
    "medicines": ["Medicine 1", "Medicine 2"],
    "medical_staff": "10 doctors, 20 nurses",
    "equipment": ["Equipment 1"]
  },
  "priority_actions": ["Action 1", "Action 2"]
}

Consider Indian epidemiology patterns (monsoon diseases, etc).`;

      const response = await this.hf.textGeneration({
        model: this.model,
        inputs: prompt,
        parameters: {
          max_new_tokens: 1200,
          temperature: 0.2
        }
      });

      const content = response.generated_text;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { outbreak_probability: 0, predicted_disease: 'Unknown' };

    } catch (error) {
      console.error('Outbreak Prediction Error:', error);
      return { outbreak_probability: 0, error: error.message };
    }
  }

  createFallbackDiagnosis(symptoms) {
    return {
      differential_diagnosis: [
        {
          disease: 'Common Viral Infection',
          probability: 0.6,
          reasoning: 'Based on symptoms provided',
          common_in_india: true
        }
      ],
      follow_up_questions: [
        'How many days have you had these symptoms?',
        'Do you have fever?',
        'Any difficulty breathing?'
      ],
      immediate_advice: [
        'Rest and stay hydrated',
        'Monitor temperature',
        'Seek medical help if symptoms worsen'
      ],
      severity_assessment: 'mild',
      requires_hospital: false,
      requires_emergency: false,
      home_remedies: ['Drink warm water', 'Take adequate rest'],
      recommended_tests: ['Clinical examination'],
      estimated_cost: '₹200-500',
      nearest_facility: 'Primary Health Center'
    };
  }

  createFallbackRiskAssessment() {
    return {
      overall_risk: 'medium',
      risk_score: 5,
      specific_risks: [],
      immediate_actions: ['Schedule regular checkups', 'Monitor vital signs'],
      dietary_recommendations: ['Balanced diet', 'Iron-rich foods'],
      monitoring_frequency: 'weekly',
      requires_hospital_admission: false,
      follow_up_tests: ['Regular blood tests', 'Ultrasound'],
      estimated_delivery_complications: 'low'
    };
  }
}

module.exports = cerebras;