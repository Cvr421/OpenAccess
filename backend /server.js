// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const WebSocket = require('ws');
const http = require('http');
const sharp = require('sharp');
const CerebrasService = require('./services/cerebrasService');
const LlamaService = require('./services/llamaService');

const app = express();
const PORT = process.env.PORT || 3001;

// Services
const cerebrasService = new CerebrasService();
const llamaService = new LlamaService();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/dicom'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and DICOM allowed'));
    }
  }
});

// Create HTTP server
const server = http.createServer(app);

// WebSocket server for real-time communication
const wss = new WebSocket.Server({ server });
const activeConnections = new Map();

// ============================================
// WebSocket Handlers
// ============================================

wss.on('connection', (ws) => {
  const connectionId = `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  activeConnections.set(connectionId, ws);
  
  console.log(`✅ WebSocket connected: ${connectionId} (Total: ${activeConnections.size})`);

  ws.send(JSON.stringify({
    type: 'connected',
    connectionId,
    message: 'Connected to MedAI Swasthya Server'
  }));

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      console.log(`📨 Message received: ${data.type}`);

      switch (data.type) {
        case 'analyze_symptoms':
          await handleSymptomAnalysis(data, ws);
          break;
        case 'maternal_risk':
          await handleMaternalRisk(data, ws);
          break;
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          break;
        default:
          ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
      }
    } catch (error) {
      console.error('❌ WebSocket message error:', error);
      ws.send(JSON.stringify({ type: 'error', message: error.message }));
    }
  });

  ws.on('close', () => {
    activeConnections.delete(connectionId);
    console.log(`❌ WebSocket disconnected: ${connectionId} (Total: ${activeConnections.size})`);
  });
});

async function handleSymptomAnalysis(data, ws) {
  try {
    ws.send(JSON.stringify({ type: 'processing', message: 'Analyzing symptoms...' }));
    
    const analysis = await llamaService.analyzeSymptoms(data.symptoms, data.language || 'english');
    
    ws.send(JSON.stringify({
      type: 'symptom_analysis_result',
      data: analysis,
      timestamp: Date.now()
    }));
  } catch (error) {
    ws.send(JSON.stringify({ type: 'error', message: error.message }));
  }
}

async function handleMaternalRisk(data, ws) {
  try {
    ws.send(JSON.stringify({ type: 'processing', message: 'Assessing maternal health risk...' }));
    
    const riskAssessment = await llamaService.predictMaternalRisk(data.vitalSigns);
    
    ws.send(JSON.stringify({
      type: 'maternal_risk_result',
      data: riskAssessment,
      timestamp: Date.now()
    }));
  } catch (error) {
    ws.send(JSON.stringify({ type: 'error', message: error.message }));
  }
}

// ============================================
// REST API Endpoints
// ============================================

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    connections: activeConnections.size,
    services: {
      cerebras: !!process.env.CEREBRAS_API_KEY,
      llama: !!process.env.HUGGINGFACE_API_KEY
    }
  });
});

// ============================================
// Feature 1 & 3: Medical Image Analysis + TB Detection
// ============================================

app.post('/api/analyze-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image uploaded' });
    }

    console.log(`📸 Analyzing medical image: ${req.file.originalname}`);
    
    const { imageType = 'xray' } = req.body;

    // Optimize image using sharp
    const processedImage = await sharp(req.file.buffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    // Analyze image
    const analysis = await cerebrasService.analyzeMedicalImage(processedImage, imageType);

    res.json({
      success: true,
      data: analysis,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Image analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// TB-Specific Detection
app.post('/api/detect-tb', upload.single('xray'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No X-ray uploaded' });
    }

    console.log('🫁 TB Detection Analysis...');

    const processedImage = await sharp(req.file.buffer)
      .resize(1024, 1024, { fit: 'inside' })
      .jpeg({ quality: 85 })
      .toBuffer();

    const tbAnalysis = await cerebrasService.detectTuberculosis(processedImage);

    res.json({
      success: true,
      data: tbAnalysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ TB detection error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cough Sound Analysis
app.post('/api/analyze-cough', async (req, res) => {
  try {
    const { audioFeatures } = req.body;

    if (!audioFeatures) {
      return res.status(400).json({ success: false, error: 'No audio features provided' });
    }

    console.log('🎤 Analyzing cough sound...');

    const coughAnalysis = await cerebrasService.analyzeCoughSound(audioFeatures);

    res.json({
      success: true,
      data: coughAnalysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Cough analysis error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// Feature 2: Maternal Health Monitoring
// ============================================

app.post('/api/maternal-risk-assessment', async (req, res) => {
  try {
    const { vitalSigns, patientInfo } = req.body;

    if (!vitalSigns) {
      return res.status(400).json({ success: false, error: 'Vital signs required' });
    }

    console.log('🤰 Maternal health risk assessment...');

    const riskAssessment = await llamaService.predictMaternalRisk(vitalSigns);

    res.json({
      success: true,
      data: riskAssessment,
      patientInfo,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Maternal risk assessment error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// Feature 4: Multi-Lingual Medical Chatbot
// ============================================

app.post('/api/symptom-checker', async (req, res) => {
  try {
    const { symptoms, language = 'english', patientAge, location } = req.body;

    if (!symptoms) {
      return res.status(400).json({ success: false, error: 'Symptoms required' });
    }

    console.log(`🩺 Symptom analysis in ${language}...`);

    const analysis = await llamaService.analyzeSymptoms(symptoms, language);

    res.json({
      success: true,
      data: analysis,
      input: { symptoms, language, patientAge, location },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Symptom checker error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate Treatment Plan
app.post('/api/treatment-plan', async (req, res) => {
  try {
    const { diagnosis, patientProfile } = req.body;

    if (!diagnosis) {
      return res.status(400).json({ success: false, error: 'Diagnosis required' });
    }

    console.log('💊 Generating treatment plan...');

    const treatmentPlan = await llamaService.generateTreatmentPlan(diagnosis, patientProfile);

    res.json({
      success: true,
      data: treatmentPlan,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Treatment plan error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// Feature 5: Disease Surveillance Dashboard
// ============================================

app.post('/api/predict-outbreak', async (req, res) => {
  try {
    const { diseaseData } = req.body;

    if (!diseaseData) {
      return res.status(400).json({ success: false, error: 'Disease data required' });
    }

    console.log('📊 Predicting disease outbreak...');

    const outbreakPrediction = await llamaService.predictOutbreak(diseaseData);

    res.json({
      success: true,
      data: outbreakPrediction,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Outbreak prediction error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Analytics Dashboard Data
app.get('/api/dashboard-analytics', async (req, res) => {
  try {
    const { timeRange = '7d', region = 'all' } = req.query;

    // Mock analytics data - in production, fetch from database
    const analytics = {
      totalDiagnoses: 12847,
      todayDiagnoses: 342,
      activeUsers: activeConnections.size,
      tbDetections: 1247,
      maternalRiskAlerts: 89,
      criticalCases: 23,
      diseaseBreakdown: [
        { disease: 'Tuberculosis', count: 1247, trend: '+12%' },
        { disease: 'Pneumonia', count: 892, trend: '+5%' },
        { disease: 'Malaria', count: 456, trend: '-3%' },
        { disease: 'Dengue', count: 234, trend: '+18%' },
        { disease: 'COVID-19', count: 123, trend: '-8%' }
      ],
      regionWiseData: [
        { region: 'Maharashtra', cases: 3421, risk: 'medium' },
        { region: 'Bihar', cases: 2890, risk: 'high' },
        { region: 'Uttar Pradesh', cases: 2456, risk: 'medium' },
        { region: 'West Bengal', cases: 1823, risk: 'low' }
      ],
      weeklyTrend: [
        { date: '2024-09-23', diagnoses: 1845 },
        { date: '2024-09-24', diagnoses: 1923 },
        { date: '2024-09-25', diagnoses: 2134 },
        { date: '2024-09-26', diagnoses: 2056 },
        { date: '2024-09-27', diagnoses: 2198 },
        { date: '2024-09-28', diagnoses: 2301 },
        { date: '2024-09-29', diagnoses: 2390 }
      ],
      outbreakAlerts: [
        {
          disease: 'Dengue',
          region: 'Kerala',
          probability: 0.78,
          timeline: '2-3 weeks',
          severity: 'high'
        },
        {
          disease: 'Malaria',
          region: 'Odisha',
          probability: 0.65,
          timeline: '3-4 weeks',
          severity: 'medium'
        }
      ]
    };

    res.json({
      success: true,
      data: analytics,
      timeRange,
      region,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Dashboard analytics error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// Batch Processing for Mass Screenings
// ============================================

app.post('/api/batch-analyze', upload.array('images', 100), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'No images uploaded' });
    }

    console.log(`📦 Batch processing ${req.files.length} images...`);

    const results = await Promise.all(
      req.files.map(async (file) => {
        try {
          const processedImage = await sharp(file.buffer)
            .resize(1024, 1024, { fit: 'inside' })
            .jpeg({ quality: 85 })
            .toBuffer();

          const analysis = await cerebrasService.detectTuberculosis(processedImage);
          
          return {
            fileName: file.originalname,
            success: true,
            analysis
          };
        } catch (error) {
          return {
            fileName: file.originalname,
            success: false,
            error: error.message
          };
        }
      })
    );

    const successCount = results.filter(r => r.success).length;
    const failCount = results.length - successCount;

    res.json({
      success: true,
      totalProcessed: results.length,
      successCount,
      failCount,
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Batch processing error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// Test Endpoints
// ============================================

app.get('/api/test-cerebras', async (req, res) => {
  try {
    console.log('🧪 Testing Cerebras service...');
    
    // Create a small test buffer
    const testBuffer = Buffer.from('test image data');
    
    res.json({
      success: true,
      message: 'Cerebras service configured',
      hasApiKey: !!process.env.CEREBRAS_API_KEY,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/test-llama', async (req, res) => {
  try {
    console.log('🧪 Testing Llama service...');
    
    const testAnalysis = await llamaService.analyzeSymptoms('headache and fever', 'english');
    
    res.json({
      success: true,
      message: 'Llama service working',
      sampleResponse: testAnalysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// Error Handling
// ============================================

app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      error: 'File upload error: ' + err.message
    });
  }
  
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// ============================================
// Start Server
// ============================================

server.listen(PORT, () => {
  console.log('🚀 ============================================');
  console.log('🚀 MedAI Swasthya Server Started!');
  console.log('🚀 ============================================');
  console.log(`📡 HTTP Server: http://localhost:${PORT}`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log('🚀 ============================================');
  console.log('\n📋 Available Endpoints:');
  console.log('  POST /api/analyze-image - Medical image analysis');
  console.log('  POST /api/detect-tb - TB detection from X-ray');
  console.log('  POST /api/analyze-cough - Cough sound analysis');
  console.log('  POST /api/maternal-risk-assessment - Maternal health');
  console.log('  POST /api/symptom-checker - Multi-lingual symptom analysis');
  console.log('  POST /api/treatment-plan - Generate treatment plan');
  console.log('  POST /api/predict-outbreak - Disease outbreak prediction');
  console.log('  GET  /api/dashboard-analytics - Analytics dashboard');
  console.log('  POST /api/batch-analyze - Batch image processing');
  console.log('🚀 ============================================\n');
  
  // Check API keys
  if (!process.env.CEREBRAS_API_KEY) {
    console.error('⚠️  WARNING: CEREBRAS_API_KEY not configured!');
  } else {
    console.log('✅ Cerebras API configured');
  }
  
  if (!process.env.HUGGINGFACE_API_KEY) {
    console.error('⚠️  WARNING: HUGGINGFACE_API_KEY not configured!');
  } else {
    console.log('✅ Hugging Face API configured');
  }
  
  console.log('\n✅ Server ready to accept requests!\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️  SIGTERM received, closing server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⚠️  SIGINT received, closing server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = server;