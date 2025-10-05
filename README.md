# 🏥 OpenAccess - FINAL SETUP GUIDE (Modular Structure)

## ✅ **COMPLETE FILE LIST - ALL FEATURES READY**

### **Backend Files (Already Created)**
- ✅ `backend/services/cerebrasService.js` - Medical image analysis + TB detection
- ✅ `backend/services/llamaService.js` - Symptom checker + maternal health
- ✅ `backend/server.js` - Main server with all endpoints
- ⚠️ `backend/.env` - YOU NEED TO CREATE THIS

### **Frontend Files (Modular Components)**
- ✅ `frontend/app/components/Header.tsx` - Navigation header
- ✅ `frontend/app/components/MedicalImageAnalysis.tsx` - Feature 1
- ✅ `frontend/app/components/MaternalHealth.tsx` - Feature 2
- ✅ `frontend/app/components/TBDetection.tsx` - Feature 3
- ✅ `frontend/app/components/SymptomChecker.tsx` - Feature 4
- ✅ `frontend/app/components/Dashboard.tsx` - Feature 5
- ✅ `frontend/app/page.tsx` - Main page combining all components

---

## 📁 **EXACT FILE STRUCTURE**

```
medai-swasthya/
├── backend/
│   ├── services/
│   │   ├── cerebrasService.js       ✅ COPY THIS
│   │   └── llamaService.js          ✅ COPY THIS
│   ├── server.js                    ✅ COPY THIS
│   ├── .env                         ⚠️ CREATE THIS
│   └── package.json                 ✅ MODIFY THIS
│
└── frontend/
    ├── app/
    │   ├── components/
    │   │   ├── Header.tsx                      ✅ COPY THIS
    │   │   ├── MedicalImageAnalysis.tsx        ✅ COPY THIS
    │   │   ├── MaternalHealth.tsx              ✅ COPY THIS
    │   │   ├── TBDetection.tsx                 ✅ COPY THIS
    │   │   ├── SymptomChecker.tsx              ✅ COPY THIS
    │   │   └── Dashboard.tsx                   ✅ COPY THIS
    │   ├── page.tsx                 ✅ COPY THIS
    │   ├── layout.tsx               (Next.js default - DON'T TOUCH)
    │   └── globals.css              (Next.js default - DON'T TOUCH)
    └── package.json                 ✅ ALREADY GOOD
```

---

## 🚀 **STEP-BY-STEP SETUP (10 MINUTES)**

### **Step 1: Create Backend .env File (1 min)**

```bash
cd backend
```

Create `.env` file with this content:
```env
CEREBRAS_API_KEY=your_cerebras_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
PORT=3001
NODE_ENV=development
```

**Get API Keys:**
- Cerebras: https://cerebras.ai/ → Sign Up → API Keys
- Hugging Face: https://huggingface.co/ → Settings → Access Tokens

---

### **Step 2: Install Backend Dependencies (2 min)**

```bash
cd backend

# Install all required packages
npm install express cors dotenv ws multer axios sharp nodemon
npm install @cerebras/cerebras_cloud_sdk
npm install @huggingface/inference
```

---

### **Step 3: Copy Backend Files (1 min)**

Copy these 3 files into your `backend/` folder:
1. `services/cerebrasService.js`
2. `services/llamaService.js`
3. `server.js`

**Make sure folder structure is correct:**
```
backend/
├── services/
│   ├── cerebrasService.js
│   └── llamaService.js
├── server.js
├── .env
└── package.json
```

---

### **Step 4: Start Backend Server (1 min)**

```bash
cd backend
npm run dev
```

**Expected Output:**
```
🚀 ============================================
🚀 OpenAccess Server Started!
🚀 ============================================
📡 HTTP Server: http://localhost:3001
🔌 WebSocket: ws://localhost:3001
🏥 Health: http://localhost:3001/health
✅ Cerebras API configured
✅ Hugging Face API configured
✅ Server ready to accept requests!
```

**✅ Test Backend:**
Open browser: http://localhost:3001/health

---

### **Step 5: Create Frontend Components Folder (1 min)**

```bash
cd frontend

# Create components directory
mkdir -p app/components
```

---

### **Step 6: Copy All Frontend Files (2 min)**

Copy these 7 files into your `frontend/app/` folder:

**Components (in `app/components/`):**
1. `Header.tsx`
2. `MedicalImageAnalysis.tsx`
3. `MaternalHealth.tsx`
4. `TBDetection.tsx`
5. `SymptomChecker.tsx`
6. `Dashboard.tsx`

**Main Page (in `app/`):**
7. `page.tsx`

**Your structure should look like:**
```
frontend/
├── app/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── MedicalImageAnalysis.tsx
│   │   ├── MaternalHealth.tsx
│   │   ├── TBDetection.tsx
│   │   ├── SymptomChecker.tsx
│   │   └── Dashboard.tsx
│   ├── page.tsx
│   ├── layout.tsx (already exists)
│   └── globals.css (already exists)
```

---

### **Step 7: Install Frontend Dependencies (1 min)**

```bash
cd frontend
npm install
```

All required packages (lucide-react, tailwindcss, etc.) are already in package.json.

---

### **Step 8: Start Frontend (1 min)**

Open **NEW TERMINAL** (keep backend running):

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
▲ Next.js 14.x.x
- Local: http://localhost:3000
✓ Ready in 2.3s
```

---

### **Step 9: TEST ALL FEATURES! (5 min)**

Open browser: **http://localhost:3000**

You should see the OpenAccess platform with 5 tabs!

#### **✅ Test Checklist:**

**1. Medical Image Analysis Tab**
- [ ] Upload any medical image
- [ ] Select image type (X-Ray/CT/MRI)
- [ ] Click "Analyze Image"
- [ ] See results in 2-3 seconds

**2. Maternal Health Tab**
- [ ] Enter test vital signs
- [ ] Click "Assess Maternal Health Risk"
- [ ] See risk assessment with recommendations

**3. TB Detection Tab**
- [ ] Upload chest X-ray
- [ ] Click "Detect Tuberculosis"
- [ ] See TB detection results

**4. Symptom Checker Tab**
- [ ] Select language (English/Hindi/etc.)
- [ ] Type symptoms
- [ ] Click "Get AI Diagnosis"
- [ ] See differential diagnosis

**5. Dashboard Tab**
- [ ] View automatically on load
- [ ] See disease distribution chart
- [ ] See regional analysis
- [ ] See outbreak predictions

---

## 🐛 **TROUBLESHOOTING**

### **Problem: Backend won't start**
```bash
# Check if .env file exists and has correct format
cat backend/.env

# Should have no quotes around values:
# CORRECT: CEREBRAS_API_KEY=csk-abc123
# WRONG: CEREBRAS_API_KEY="csk-abc123"
```

### **Problem: Frontend shows errors**
```bash
# Make sure all files are in correct folders
ls frontend/app/components/
# Should show: Header.tsx, MedicalImageAnalysis.tsx, etc.

ls frontend/app/
# Should show: page.tsx, layout.tsx, globals.css, components/
```

### **Problem: "Cannot find module"**
```bash
# Reinstall dependencies
cd backend && npm install
cd ../frontend && npm install
```

### **Problem: Port 3001 already in use**
```bash
# Kill the process
lsof -i :3001  # Mac/Linux
kill -9 <PID>

# Or change port in backend/.env
PORT=3002
```

---

## 📋 **FILES CHECKLIST**

### **Backend Files to Copy:**
- [ ] `backend/services/cerebrasService.js`
- [ ] `backend/services/llamaService.js`
- [ ] `backend/server.js`
- [ ] `backend/.env` (create new with your API keys)

### **Frontend Files to Copy:**
- [ ] `frontend/app/components/Header.tsx`
- [ ] `frontend/app/components/MedicalImageAnalysis.tsx`
- [ ] `frontend/app/components/MaternalHealth.tsx`
- [ ] `frontend/app/components/TBDetection.tsx`
- [ ] `frontend/app/components/SymptomChecker.tsx`
- [ ] `frontend/app/components/Dashboard.tsx`
- [ ] `frontend/app/page.tsx`

---

## 🎯 **QUICK COMMANDS REFERENCE**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Browser
http://localhost:3000 - Frontend
http://localhost:3001/health - Backend health check
```

---

## ✅ **SUCCESS INDICATORS**

### **Backend Running Successfully:**
- ✅ See "OpenAccess Server Started!" message
- ✅ Both API keys show as "configured"
- ✅ http://localhost:3001/health returns JSON

### **Frontend Running Successfully:**
- ✅ See "Ready in X seconds" message
- ✅ http://localhost:3000 loads without errors
- ✅ Can see 5 navigation tabs
- ✅ All tabs switch correctly

### **Complete System Working:**
- ✅ Can upload images and get analysis
- ✅ Can enter vital signs and get risk assessment
- ✅ Can detect TB from X-rays
- ✅ Can get symptom diagnosis in multiple languages
- ✅ Can view dashboard analytics

---

## 🏆 **YOU'RE DONE!**

If all checkboxes above are ✅, you have a **COMPLETE, WORKING** OpenAccess platform!

### **What You Have:**
- ✅ 5 complete features working
- ✅ Clean, modular code structure
- ✅ Professional UI with all components
- ✅ Real AI integrations (Cerebras + Llama)
- ✅ Production-ready architecture
- ✅ Complete error handling
- ✅ Beautiful, accessible interface

### **Next Steps:**
1. Test all features thoroughly
2. Take screenshots of each feature
3. Record 3-minute demo video
4. Push to GitHub
5. Submit for hackathon!

---

## 📞 **Still Having Issues?**

### **Quick Diagnostic:**
```bash
# Check backend is running
curl http://localhost:3001/health

# Check frontend is running
curl http://localhost:3000

# Check Node version (should be 16+)
node --version

# Check if ports are available
lsof -i :3000  # Frontend
lsof -i :3001  # Backend
```

---

## 🎉 **CONGRATULATIONS!**

You now have a **complete, production-ready healthcare AI platform** with:
- ✅ Modular, maintainable code structure
- ✅ All 5 features fully functional
- ✅ Clean separation of concerns
- ✅ Easy to debug and extend
- ✅ Professional quality code

🏆

---

**Built with ❤️ for accessible healthcare in India** 🇮🇳