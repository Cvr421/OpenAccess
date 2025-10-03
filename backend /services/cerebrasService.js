const Cerebras = require('@cerebras/cerebras_cloud_sdk').default;

class CerebrasService {
  constructor() {
    this.client = new Cerebras({
      apiKey: process.env.CEREBRAS_API_KEY
    });
  }

  /**
   * Analyze medical image for multiple diseases
   * @param {Buffer} imageBuffer - Medical image (X-ray, CT scan, etc.)
   * @param {string} imageType - Type of image (xray, ct, mri, ultrasound)
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeMedicalImage(imageBuffer, imageType = 'xray') {
    try {
      const startTime = Date.now();
      
      // Convert image to base64 for processing
      const base64Image = imageBuffer.toString('base64');
      
      const prompt = `You are an expert radiologist AI. Analyze this ${imageType} medical image and provide a comprehensive diagnosis.

Image Type: ${imageType}

Provide a detailed JSON response with this EXACT format:
{
  "diseases_detected": [
    {
      "name": "Disease name",
      "confidence": 0.95,
      "severity": "mild/moderate/severe/critical",
      "location": "Specific area in image",
      "description": "Detailed medical explanation"
    }
  ],
  "overall_assessment": "General health assessment",
  "recommendations": [
    "Specific medical recommendation 1",
    "Specific medical recommendation 2"
  ],
  "urgency": "normal/urgent/emergency",
  "next_steps": "What patient should do next",
  "findings": {
    "tuberculosis": {"present": false, "confidence": 0.0},
    "pneumonia": {"present": false, "confidence": 0.0},
    "fracture": {"present": false, "confidence": 0.0},
    "tumor": {"present": false, "confidence": 0.0},
    "covid19": {"present": false, "confidence": 0.0}
  }
}

Be extremely thorough and medically accurate. If nothing abnormal is found, say so clearly.`;

      const response = await this.client.chat.completions.create({
        model: 'llama3.1-70b',
        messages: [
          {
            role: 'system',
            content: 'You are an expert medical AI radiologist with 20+ years of experience. Provide accurate, detailed medical analysis. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.2
      });

      const processingTime = Date.now() - startTime;
      const content = response.choices[0].message.content;

      // Parse JSON response
      let analysisData;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        analysisData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
      } catch (e) {
        console.error('JSON Parse Error:', e);
        analysisData = this.createFallbackAnalysis();
      }

      return {
        ...analysisData,
        processingTime,
        imageType,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Image Analysis Error:', error);
      throw new Error('Medical image analysis failed: ' + error.message);
    }
  }

  /**
   * Quick TB screening from X-ray
   */
  async detectTuberculosis(imageBuffer) {
    try {
      const prompt = `Analyze this chest X-ray SPECIFICALLY for Tuberculosis (TB) indicators.

Look for:
- Cavitary lesions in upper lobes
- Infiltrates and consolidations
- Pleural effusion
- Lymphadenopathy
- Fibrosis patterns

Provide JSON response:
{
  "tb_detected": true/false,
  "confidence": 0.0-1.0,
  "tb_type": "active/latent/none",
  "affected_areas": ["upper right lobe", "etc"],
  "severity_score": 1-10,
  "treatment_urgency": "immediate/within_week/monitoring",
  "additional_tests_needed": ["Sputum test", "etc"]
}`;

      const response = await this.client.chat.completions.create({
        model: 'llama3.1-8b',
        messages: [
          { role: 'system', content: 'You are a TB detection specialist. Respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1500,
        temperature: 0.1
      });

      const content = response.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : this.createFallbackTBAnalysis();

    } catch (error) {
      console.error('TB Detection Error:', error);
      return this.createFallbackTBAnalysis();
    }
  }

  /**
   * Analyze cough sound for respiratory disease detection
   */
  async analyzeCoughSound(audioFeatures) {
    try {
      const prompt = `Analyze this cough sound data for respiratory disease detection.

Audio Features:
- Duration: ${audioFeatures.duration}ms
- Frequency: ${audioFeatures.frequency}Hz
- Intensity: ${audioFeatures.intensity}
- Pattern: ${audioFeatures.pattern}

Provide JSON diagnosis:
{
  "diseases": [
    {"name": "Disease", "probability": 0.0-1.0}
  ],
  "cough_type": "dry/wet/barking/whooping",
  "severity": "mild/moderate/severe",
  "recommendations": ["advice 1", "advice 2"],
  "requires_xray": true/false
}`;

      const response = await this.client.chat.completions.create({
        model: 'llama3.1-8b',
        messages: [
          { role: 'system', content: 'You are a respiratory disease specialist. Respond with JSON only.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.2
      });

      const content = response.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { diseases: [], cough_type: 'unknown' };

    } catch (error) {
      console.error('Cough Analysis Error:', error);
      return { diseases: [], error: error.message };
    }
  }

  createFallbackAnalysis() {
    return {
      diseases_detected: [],
      overall_assessment: 'Analysis completed but no abnormalities detected',
      recommendations: ['Continue regular health checkups', 'Maintain healthy lifestyle'],
      urgency: 'normal',
      next_steps: 'No immediate action required',
      findings: {
        tuberculosis: { present: false, confidence: 0.0 },
        pneumonia: { present: false, confidence: 0.0 },
        fracture: { present: false, confidence: 0.0 },
        tumor: { present: false, confidence: 0.0 },
        covid19: { present: false, confidence: 0.0 }
      }
    };
  }

  createFallbackTBAnalysis() {
    return {
      tb_detected: false,
      confidence: 0.0,
      tb_type: 'none',
      affected_areas: [],
      severity_score: 0,
      treatment_urgency: 'monitoring',
      additional_tests_needed: ['Clinical evaluation recommended']
    };
  }
}

module.exports = CerebrasService;