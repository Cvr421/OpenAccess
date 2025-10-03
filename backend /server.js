require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3001;
// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const server = http.createServer(app);



server.listen(PORT, () => {
  console.log('🚀 ============================================');
  console.log('🚀 MedAI Swasthya Server Started!');
  console.log('🚀 ============================================');


} );
