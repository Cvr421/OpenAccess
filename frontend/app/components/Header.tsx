'use client';

import React from 'react';
import { Activity, FileImage, Baby, MessageSquare, BarChart3, Heart } from 'lucide-react';

export type TabType = 'image' | 'maternal' | 'tb' | 'chatbot' | 'dashboard';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const tabs = [
    { id: 'image' as TabType, name: 'Image Analysis', icon: FileImage },
    { id: 'maternal' as TabType, name: 'Maternal Health', icon: Baby },
    { id: 'tb' as TabType, name: 'TB Detection', icon: Activity },
    { id: 'chatbot' as TabType, name: 'Symptom Checker', icon: MessageSquare },
    { id: 'dashboard' as TabType, name: 'Dashboard', icon: BarChart3 }
  ];

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-green-500">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 p-2 rounded-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">MedAI Swasthya</h1>
                <p className="text-sm text-gray-600">AI-Powered Healthcare for Rural India</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}