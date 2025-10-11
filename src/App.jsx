// src/App.jsx - VERSIÓN FINAL OPTIMIZADA
import React, { useState } from 'react';
import SurveyForm from './components/SurveyForm';
import AdminDashboard from './components/AdminDashboard';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('encuesta'); // 'encuesta' o 'dashboard'

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Principal */}
      <header className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 shadow-2xl">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center px-6 py-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg tracking-tight">
            Encuesta Segunda Vuelta Bolivia 2025
          </h1>
          <p className="text-indigo-100 mt-2 text-lg font-medium">
            Sistema de encuestas con análisis en tiempo real
          </p>

          {/* Navegación */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setActiveTab('encuesta')}
              className={`px-6 py-3 rounded-full text-sm md:text-base font-semibold shadow-md transition-all duration-300 ${
                activeTab === 'encuesta'
                  ? 'bg-white text-indigo-700 scale-105 shadow-lg'
                  : 'bg-indigo-500 text-white hover:bg-indigo-400 hover:scale-105'
              }`}
            >
              Responder Encuesta
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-3 rounded-full text-sm md:text-base font-semibold shadow-md transition-all duration-300 ${
                activeTab === 'dashboard'
                  ? 'bg-white text-indigo-700 scale-105 shadow-lg'
                  : 'bg-indigo-500 text-white hover:bg-indigo-400 hover:scale-105'
              }`}
            >
              Panel de Administración
            </button>
          </div>
        </div>
      </header>

      {/* Contenido dinámico */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'encuesta' ? (
          <SurveyForm />
        ) : (
          <AdminDashboard />
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <p className="text-sm font-medium text-gray-700">
            Encuesta Segunda Vuelta Bolivia 2025 - Datos anónimos y confidenciales
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Desarrollado para investigación política
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;