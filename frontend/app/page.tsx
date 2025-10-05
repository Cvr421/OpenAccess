'use client';

import React, { useState } from 'react';
import Header, { TabType } from './components/Header';
import ImageAnalysis from './components/MedicalImageAnalysis';
import MaternalHealth from './components/MaternalHealth';
import TbDetection from './components/TBDetection';
import Chatbot from './components/SymtomChecker';
import Dashboard from './components/Dashboard';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>('image');

  return (
    <div>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="p-6">
        {activeTab === 'image' && <ImageAnalysis />}
        {activeTab === 'maternal' && <MaternalHealth />}
        {activeTab === 'tb' && <TbDetection />}
        {activeTab === 'chatbot' && <Chatbot />}
        {activeTab === 'dashboard' && <Dashboard />}
      </main>
    </div>
  );
}
