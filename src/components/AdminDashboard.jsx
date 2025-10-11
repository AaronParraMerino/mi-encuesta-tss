// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import * as XLSX from 'xlsx';
import { FileDown, FileUp, BarChart3, Users, TrendingUp, PieChart, RotateCcw } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    porEdad: {},
    porGenero: {},
    porCandidato: {},
    porDepartamento: {}
  });
  const [allSurveyData, setAllSurveyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // ORDEN EXACTO DE COLUMNAS según Google Forms (CRITICAL)
  const COLUMN_ORDER = [
    'Marca temporal',
    'Puntuación',
    '¿Qué edad tienes?',
    'Genero:',
    'Ciudad/Departamento de residencia:',
    'Localidad/Provincia de origen.\nEjm: Cliza, Punata, Chapare, etc.',
    'Tu vivienda donde reside actualmente es:',
    'Situación Educativa:',
    '¿Menciona la carrera que estudias o estudiaste?',
    'Estrato Socioeconómico Percibido:',
    'Estatus Laboral (Recién profesionalizados - Profesionales Junior)',
    'Ha votado en elecciones presidenciales previas:',
    'Si las elecciones fueran mañana, ¿por qué candidato votarías?',
    '¿Qué tan seguro esta de su elección?',
    '¿Con qué tendencia política se identifica mas personalmente?',
    '¿Qué probabilidad crees que tienes para convencer a otra persona de cambiar su voto?',
    '¿Con qué intensidad se identifica con la ideología del candidato que apoya?',
    'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Economía: Estabilidad, Empleo, Deuda]',
    'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Educación: Calidad universitaria, Acceso a becas]',
    'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Lucha contra la Corrupción y Justicia]',
    'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Acceso a servicios: Salud Publica]',
    'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Seguridad ciudadana:]',
    'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Cambio Climático y Medio Ambiente:]',
    'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Derechos Sociales/Minorías: Temas de género, indigenas]',
    'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Modelo de Desarrollo del País: Estatismo vs. Mercado]',
    'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Migración laboral juvenil]',
    'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Propuestas de innovación y tecnología]',
    '¿En qué medida describe el siguiente atributo de Rodrigo Paz Pereira?\n(1 = Nada en absoluto) a (5 = Totalmente) [Experiencia en gestión ]',
    '¿En qué medida describe el siguiente atributo de Rodrigo Paz Pereira?\n(1 = Nada en absoluto) a (5 = Totalmente) [Honestidad/Transparencia]',
    '¿En qué medida describe el siguiente atributo de Rodrigo Paz Pereira?\n(1 = Nada en absoluto) a (5 = Totalmente) [Capacidad de unir a la población]',
    '¿En qué medida describe el siguiente atributo de Rodrigo Paz Pereira?\n(1 = Nada en absoluto) a (5 = Totalmente) [Liderazgo fuerte/Decisivo]',
    '¿En qué medida describe el siguiente atributo de Rodrigo Paz Pereira?\n(1 = Nada en absoluto) a (5 = Totalmente) [Propuestas claras y realistas]',
    '¿En qué medida describe el siguiente atributo de Jorge Quiroga Ramírez?\n(1 = Nada en absoluto) a (5 = Totalmente) [Experiencia en gestión ]',
    '¿En qué medida describe el siguiente atributo de Jorge Quiroga Ramírez?\n(1 = Nada en absoluto) a (5 = Totalmente) [Honestidad/Transparencia]',
    '¿En qué medida describe el siguiente atributo de Jorge Quiroga Ramírez?\n(1 = Nada en absoluto) a (5 = Totalmente) [Capacidad de unir a la población]',
    '¿En qué medida describe el siguiente atributo de Jorge Quiroga Ramírez?\n(1 = Nada en absoluto) a (5 = Totalmente) [Liderazgo fuerte/Decisivo]',
    '¿En qué medida describe el siguiente atributo de Jorge Quiroga Ramírez?\n(1 = Nada en absoluto) a (5 = Totalmente) [Propuestas claras y realistas]',
    '¿Cuáles son las redes sociales por el cual recibe información de política?',
    '¿Cuáles son los medios comunicación por el cual recibe información de política?',
    '¿Cuáles son los medios de vinculo social por el cual recibe información de política?',
    '¿Con qué frecuencia interactúa con contenidos políticos en redes sociales?',
    '¿A quién considera más influyente en su decisión política?',
    'Nivel de confianza en encuestas publicadas en medios digitales',
    'Percepción de estabilidad política futura tras la segunda vuelta',
    'Expectativa personal sobre mejora del País si GANA Rodrigo Paz Pereira',
    'Expectativa personal sobre mejora del País si GANA Jorge Quiroga Ramírez',
    'Dirección de correo electrónico'
  ];

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setMessage('');

    try {
      const querySnapshot = await getDocs(collection(db, 'encuestas'));
      const data = [];

      querySnapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setAllSurveyData(data);

      // Calcular estadísticas
      const porEdad = {};
      const porGenero = {};
      const porCandidato = {};
      const porDepartamento = {};

      data.forEach(item => {
        const edad = item['¿Qué edad tienes?'] || 'No especificado';
        porEdad[edad] = (porEdad[edad] || 0) + 1;

        const genero = item['Genero:'] || 'No especificado';
        porGenero[genero] = (porGenero[genero] || 0) + 1;

        const candidato = item['Si las elecciones fueran mañana, ¿por qué candidato votarías?'] || 'No especificado';
        porCandidato[candidato] = (porCandidato[candidato] || 0) + 1;

        const depto = item['Ciudad/Departamento de residencia:'] || 'No especificado';
        porDepartamento[depto] = (porDepartamento[depto] || 0) + 1;
      });

      setStats({
        total: data.length,
        porEdad,
        porGenero,
        porCandidato,
        porDepartamento
      });

    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      setMessage('❌ Error al cargar los datos.');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = async () => {
    setLoading(true);
    setMessage('📊 Exportando datos...');

    try {
      if (allSurveyData.length === 0) {
        setMessage('⚠️ No hay datos para exportar.');
        setLoading(false);
        return;
      }

      // CRITICAL: Reordenar datos según COLUMN_ORDER exacto
      const dataToExport = allSurveyData.map(item => {
        const orderedRow = {};
        
        // Recorrer columnas en orden y asignar valores
        COLUMN_ORDER.forEach(column => {
          // Si la columna existe en el item, usar su valor, sino dejar vacío
          orderedRow[column] = item[column] !== undefined ? item[column] : '';
        });
        
        return orderedRow;
      });

      // Crear worksheet con el orden de columnas preservado
      const worksheet = XLSX.utils.json_to_sheet(dataToExport, {
        header: COLUMN_ORDER // Forzar el orden de las columnas
      });

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Encuestas Bolivia 2025');

      const fileName = `encuestas_bolivia_2025_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      setMessage(`✅ ${allSurveyData.length} respuestas exportadas correctamente.`);
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      console.error('Error al exportar:', error);
      setMessage('❌ Error al exportar los datos.');
    } finally {
      setLoading(false);
    }
  };

  const importFromExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setMessage('📥 Importando datos...');

    try {
      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          
          // Leer con el orden de las columnas
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
            raw: false, // Mantener formato de texto
            defval: '' // Valor por defecto para celdas vacías
          });

          let imported = 0;
          let errors = 0;

          for (const row of jsonData) {
            try {
              // Validar que tenga datos mínimos
              if (row['¿Qué edad tienes?'] && row['Genero:']) {
                // Asegurar que todas las columnas existan en el orden correcto
                const orderedRow = {};
                COLUMN_ORDER.forEach(column => {
                  orderedRow[column] = row[column] !== undefined ? row[column] : '';
                });
                
                await addDoc(collection(db, 'encuestas'), orderedRow);
                imported++;
              } else {
                errors++;
              }
            } catch (err) {
              console.error('Error en fila:', err);
              errors++;
            }
          }

          setMessage(`✅ ${imported} respuestas importadas correctamente${errors > 0 ? `. ${errors} filas con errores.` : '.'}`);
          await loadStats();

          setTimeout(() => setMessage(''), 5000);

        } catch (error) {
          console.error('Error al procesar el archivo:', error);
          setMessage('❌ Error al procesar el archivo Excel. Verifica el formato.');
        }
      };

      reader.readAsArrayBuffer(file);

    } catch (error) {
      console.error('Error al importar:', error);
      setMessage('❌ Error al importar los datos.');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const downloadJSON = () => {
    if (allSurveyData.length === 0) {
      setMessage('⚠️ No hay datos para descargar.');
      return;
    }

    // Reordenar JSON también
    const orderedData = allSurveyData.map(item => {
      const orderedRow = {};
      COLUMN_ORDER.forEach(column => {
        orderedRow[column] = item[column] !== undefined ? item[column] : '';
      });
      return orderedRow;
    });

    const jsonString = JSON.stringify(orderedData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `encuestas_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setMessage('✅ Archivo JSON descargado correctamente.');
    setTimeout(() => setMessage(''), 3000);
  };

  const renderStatCard = (title, value, IconComponent, colorClass, borderClass) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4" style={{ borderColor: borderClass }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1 font-semibold uppercase">{title}</p>
          <p className="text-4xl font-extrabold text-gray-900">{value}</p>
        </div>
        <div className={`p-4 rounded-full`} style={{ backgroundColor: colorClass + '20' }}>
          <IconComponent size={32} color={colorClass} />
        </div>
      </div>
    </div>
  );

  const renderBarChart = (title, data) => {
    const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);

    const colors = [
      '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b',
      '#ef4444', '#ec4899', '#6366f1', '#14b8a6'
    ];

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">{title}</h3>
        <div className="space-y-4">
          {entries.map(([key, value], index) => {
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            const barColor = colors[index % colors.length];

            return (
              <div key={key}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{key}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-gray-900">{value}</span>
                    <span className="text-sm font-semibold text-indigo-600">({percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: barColor
                    }}
                  >
                    {parseFloat(percentage) > 10 && (
                      <span className="text-xs font-bold text-white px-2">{percentage}%</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {entries.length === 0 && (
          <p className="text-center text-gray-500 italic mt-4">No hay datos disponibles.</p>
        )}
      </div>
    );
  };

  if (loading && allSurveyData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-2xl">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-xl font-semibold text-gray-700">Cargando datos del panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header del Dashboard */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl shadow-2xl p-6">
        <h1 className="text-3xl font-extrabold text-white mb-2 drop-shadow-lg">
          Panel de Administración
        </h1>
        <p className="text-lg text-white font-medium drop-shadow">
          Estadísticas consolidadas con análisis en tiempo real
        </p>
      </div>

      {/* Controles de Administración */}
      <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Gestión de Datos</h2>
          <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">
            Total: {stats.total} respuestas
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition shadow-md font-semibold">
            <FileUp size={20} />
            <span>Importar Excel</span>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={importFromExcel}
              disabled={loading}
              className="hidden"
            />
          </label>

          <button
            onClick={exportToExcel}
            disabled={loading || allSurveyData.length === 0}
            className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 shadow-md font-semibold"
          >
            <FileDown size={20} />
            Exportar Excel
          </button>

          <button
            onClick={downloadJSON}
            disabled={loading || allSurveyData.length === 0}
            className="flex items-center gap-2 px-5 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 shadow-md font-semibold"
          >
            <FileDown size={20} />
            Descargar JSON
          </button>

          <button
            onClick={loadStats}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md font-semibold ml-auto"
          >
            <RotateCcw size={20} />
            Actualizar
          </button>
        </div>

        {message && (
          <div className={`mt-4 p-4 rounded-lg font-medium shadow-sm ${
            message.includes('Error') || message.includes('❌')
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-green-50 text-green-800 border border-green-200'
          }`}>
            {message}
          </div>
        )}
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderStatCard('Total Respuestas', stats.total, Users, '#6366f1', '#6366f1')}
        {renderStatCard('Rangos de Edad', Object.keys(stats.porEdad).length, BarChart3, '#10b981', '#10b981')}
        {renderStatCard('Candidatos', 2, PieChart, '#ef4444', '#ef4444')}
        {renderStatCard('Departamentos', Object.keys(stats.porDepartamento).length, TrendingUp, '#f59e0b', '#f59e0b')}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderBarChart('Distribución de Votos por Candidato', stats.porCandidato)}
        {renderBarChart('Distribución por Rango de Edad', stats.porEdad)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderBarChart('Distribución por Género', stats.porGenero)}
        {renderBarChart('Distribución por Departamento', stats.porDepartamento)}
      </div>
    </div>
  );
};

export default AdminDashboard;