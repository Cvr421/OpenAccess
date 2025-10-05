'use client';

import React, { useState } from 'react';
import Header, { TabType } from './components/Header';
import ImageAnalysis from './components/MedicalImageAnalysis';
import MaternalHealth from './components/MaternalHealth';
import TbDetection from './components/TBDetection';
import DocGPT from './components/DocGPT';
import Dashboard from './components/Dashboard';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>('maternal');

  return (
    <div>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="p-6">
        {activeTab === 'maternal' && <MaternalHealth />}
        {activeTab === 'docgpt' && <DocGPT />}
        {activeTab === 'image' && <ImageAnalysis />}
        {activeTab === 'tb' && <TbDetection />}
        {activeTab === 'dashboard' && <Dashboard />}
      </main>
    </div>
  );
}
