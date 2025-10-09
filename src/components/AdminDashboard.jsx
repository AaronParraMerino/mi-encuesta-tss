// src/components/AdminDashboard.jsx
// Componente OPCIONAL para ver estadísticas básicas
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from "../config/firebaseconfig";
import { BarChart3, Users, TrendingUp, PieChart } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    porEdad: {},
    porGenero: {},
    porCandidato: {},
    porDepartamento: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'encuestas'));
      const data = [];
      
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });

      // Calcular estadísticas
      const porEdad = {};
      const porGenero = {};
      const porCandidato = {};
      const porDepartamento = {};

      data.forEach(item => {
        // Por edad
        porEdad[item.edad] = (porEdad[item.edad] || 0) + 1;
        
        // Por género
        porGenero[item.genero] = (porGenero[item.genero] || 0) + 1;
        
        // Por candidato
        porCandidato[item.candidatoVoto] = (porCandidato[item.candidatoVoto] || 0) + 1;
        
        // Por departamento
        porDepartamento[item.departamento] = (porDepartamento[item.departamento] || 0) + 1;
      });

      setStats({
        total: data.length,
        porEdad,
        porGenero,
        porCandidato,
        porDepartamento
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      setLoading(false);
    }
  };

  const renderStatCard = (title, value, icon, color) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-opacity-10 ${color.replace('border-', 'bg-')}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const renderBarChart = (title, data) => {
    const maxValue = Math.max(...Object.values(data));
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="space-y-3">
          {Object.entries(data)
            .sort((a, b) => b[1] - a[1])
            .map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">{key || 'Sin especificar'}</span>
                  <span className="text-sm font-semibold text-gray-800">{value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(value / maxValue) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600">
            Estadísticas en tiempo real de la encuesta
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {renderStatCard(
            'Total Respuestas',
            stats.total,
            <Users size={32} className="text-blue-600" />,
            'border-blue-600'
          )}
          {renderStatCard(
            'Rangos de Edad',
            Object.keys(stats.porEdad).length,
            <BarChart3 size={32} className="text-green-600" />,
            'border-green-600'
          )}
          {renderStatCard(
            'Candidatos',
            Object.keys(stats.porCandidato).length,
            <PieChart size={32} className="text-purple-600" />,
            'border-purple-600'
          )}
          {renderStatCard(
            'Departamentos',
            Object.keys(stats.porDepartamento).length,
            <TrendingUp size={32} className="text-orange-600" />,
            'border-orange-600'
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {renderBarChart('Distribución por Candidato', stats.porCandidato)}
          {renderBarChart('Distribución por Edad', stats.porEdad)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderBarChart('Distribución por Género', stats.porGenero)}
          {renderBarChart('Distribución por Departamento', stats.porDepartamento)}
        </div>

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={loadStats}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg"
          >
            Actualizar Estadísticas
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;