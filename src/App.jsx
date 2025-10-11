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
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-dark drop-shadow-lg">
            Encuesta Segunda Vuelta Bolivia 2025
          </h1>
          <p className="text-dark mt-1 font-medium drop-shadow">
            Sistema de encuestas con análisis en tiempo real
          </p>
        </div>
      </div>

      {/* Navegación por pestañas */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('encuesta')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'encuesta'
                  ? 'border-b-4 border-indigo-600 text-indigo-700 bg-indigo-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
               Responder Encuesta
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'border-b-4 border-indigo-600 text-indigo-700 bg-indigo-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
               Panel de Administración
            </button>
          </div>
        </div>
      </div>

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