// src/App.jsx - VERSIÓN MEJORADA CON COLORES VISIBLES
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './config/firebaseConfig';
import * as XLSX from 'xlsx';
import { FileDown, FileUp, Database, BarChart3 } from 'lucide-react';
import SurveyForm from './components/SurveyForm';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('encuesta');
  
  const [formData, setFormData] = useState({
    edad: '', genero: '', departamento: '', localidad: '', vivienda: '',
    situacionEducativa: '', carrera: '', estratoSocioeconomico: '', estatusLaboral: '',
    haVotado: '', candidatoVoto: '', seguridadEleccion: '3', tendenciaPolitica: '',
    probabilidadConvencer: '3', intensidadIdentificacion: '3', economia: '3',
    educacion: '3', corrupcion: '3', salud: '3', seguridad: '3', climaAmbiente: '3',
    derechosSociales: '3', modeloDesarrollo: '3', migracion: '3', innovacion: '3',
    pazExperiencia: '3', pazHonestidad: '3', pazUnion: '3', pazLiderazgo: '3',
    pazPropuestas: '3', quirogaExperiencia: '3', quirogaHonestidad: '3',
    quirogaUnion: '3', quirogaLiderazgo: '3', quirogaPropuestas: '3',
    redesSociales: [], mediosComunicacion: [], vinculoSocial: [],
    frecuenciaInteraccion: '', influyenteDecision: '', confianzaEncuestas: '3',
    estabilidadPolitica: '3', expectativaPaz: '3', expectativaQuiroga: '3'
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [totalRespuestas, setTotalRespuestas] = useState(0);
  const [allResponses, setAllResponses] = useState([]);

  useEffect(() => {
    loadTotalRespuestas();
  }, []);

  const loadTotalRespuestas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'encuestas'));
      setTotalRespuestas(querySnapshot.size);
      
      const responses = [];
      querySnapshot.forEach((doc) => {
        responses.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setAllResponses(responses);
    } catch (error) {
      console.error('Error al cargar respuestas:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked 
          ? [...(prev[name] || []), value]
          : (prev[name] || []).filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      edad: '', genero: '', departamento: '', localidad: '', vivienda: '',
      situacionEducativa: '', carrera: '', estratoSocioeconomico: '', estatusLaboral: '',
      haVotado: '', candidatoVoto: '', seguridadEleccion: '3', tendenciaPolitica: '',
      probabilidadConvencer: '3', intensidadIdentificacion: '3', economia: '3',
      educacion: '3', corrupcion: '3', salud: '3', seguridad: '3', climaAmbiente: '3',
      derechosSociales: '3', modeloDesarrollo: '3', migracion: '3', innovacion: '3',
      pazExperiencia: '3', pazHonestidad: '3', pazUnion: '3', pazLiderazgo: '3',
      pazPropuestas: '3', quirogaExperiencia: '3', quirogaHonestidad: '3',
      quirogaUnion: '3', quirogaLiderazgo: '3', quirogaPropuestas: '3',
      redesSociales: [], mediosComunicacion: [], vinculoSocial: [],
      frecuenciaInteraccion: '', influyenteDecision: '', confianzaEncuestas: '3',
      estabilidadPolitica: '3', expectativaPaz: '3', expectativaQuiroga: '3'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const dataToSend = {
        ...formData,
        marcaTemporal: new Date().toISOString(),
        redesSociales: formData.redesSociales.join(', '),
        mediosComunicacion: formData.mediosComunicacion.join(', '),
        vinculoSocial: formData.vinculoSocial.join(', ')
      };

      await addDoc(collection(db, 'encuestas'), dataToSend);
      
      setMessage('✅ ¡Encuesta enviada correctamente! Gracias por tu participación.');
      resetForm();
      await loadTotalRespuestas();
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      setTimeout(() => {
        setMessage('');
      }, 5000);
      
    } catch (error) {
      console.error('Error al enviar encuesta:', error);
      setMessage('❌ Error al enviar la encuesta. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = async () => {
    setLoading(true);
    setMessage('📊 Exportando datos...');

    try {
      const querySnapshot = await getDocs(collection(db, 'encuestas'));
      const data = [];

      querySnapshot.forEach((doc) => {
        data.push({
          ID: doc.id,
          ...doc.data()
        });
      });

      if (data.length === 0) {
        setMessage('⚠️ No hay datos para exportar.');
        setLoading(false);
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Encuestas Bolivia 2025');

      const fileName = `encuestas_bolivia_2025_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      setMessage(`✅ ${data.length} respuestas exportadas correctamente.`);
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
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);

          let imported = 0;
          let errors = 0;

          for (const row of jsonData) {
            try {
              const { ID, id, ...rowData } = row;
              
              if (rowData.edad && rowData.genero) {
                await addDoc(collection(db, 'encuestas'), rowData);
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
          await loadTotalRespuestas();
          
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

  const calculateStats = () => {
    if (allResponses.length === 0) return null;

    const stats = {
      porCandidato: {},
      porEdad: {},
      porGenero: {},
      porDepartamento: {}
    };

    allResponses.forEach(response => {
      const candidato = response.candidatoVoto || 'No especificado';
      stats.porCandidato[candidato] = (stats.porCandidato[candidato] || 0) + 1;

      const edad = response.edad || 'No especificado';
      stats.porEdad[edad] = (stats.porEdad[edad] || 0) + 1;

      const genero = response.genero || 'No especificado';
      stats.porGenero[genero] = (stats.porGenero[genero] || 0) + 1;

      const depto = response.departamento || 'No especificado';
      stats.porDepartamento[depto] = (stats.porDepartamento[depto] || 0) + 1;
    });

    return stats;
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header con mejor contraste - fondo oscuro, texto claro */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-gray-900 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 drop-shadow-lg">
            🗳️ Encuesta Segunda Vuelta Bolivia 2025
          </h1>
          <p className="text-indigo-100 mt-1 font-medium">
            Encuesta anónima sobre las elecciones presidenciales
          </p>
        </div>
      </div>

      {/* Pestañas mejoradas */}
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
              📝 Responder Encuesta
            </button>
            <button
              onClick={() => setActiveTab('resultados')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'resultados'
                  ? 'border-b-4 border-indigo-600 text-indigo-700 bg-indigo-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              📊 Ver Resultados ({totalRespuestas})
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'encuesta' ? (
          <>
            {/* Panel de administración mejorado */}
            <div className="bg-white rounded-xl shadow-xl p-6 mb-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                <Database className="text-indigo-600" size={24} />
                <span className="text-base font-semibold text-gray-800">
                  Total de respuestas registradas: <span className="text-indigo-700 font-bold text-lg">{totalRespuestas}</span>
                </span>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-gray-900 rounded-lg cursor-pointer hover:bg-blue-700 transition shadow-md font-semibold">
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
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-3 bg-green-600 text-gray-900 rounded-lg hover:bg-green-700 transition disabled:opacity-50 shadow-md font-semibold"
                >
                  <FileDown size={20} />
                  Exportar Excel
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

            <SurveyForm 
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              loading={loading}
            />
          </>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <BarChart3 className="text-indigo-600" size={32} />
                Resultados en Tiempo Real
              </h2>
              <p className="text-gray-700 mb-6 text-lg">
                Total de respuestas: <span className="font-bold text-indigo-700 text-xl">{totalRespuestas}</span>
              </p>

              {stats && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-indigo-200 shadow-md">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Intención de Voto</h3>
                    <div className="space-y-3">
                      {Object.entries(stats.porCandidato)
                        .sort((a, b) => b[1] - a[1])
                        .map(([candidato, count]) => (
                          <div key={candidato} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                            <span className="text-sm font-medium text-gray-800">{candidato}</span>
                            <span className="font-bold text-indigo-700">{count} ({((count / totalRespuestas) * 100).toFixed(1)}%)</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200 shadow-md">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Por Edad</h3>
                    <div className="space-y-3">
                      {Object.entries(stats.porEdad)
                        .sort((a, b) => b[1] - a[1])
                        .map(([edad, count]) => (
                          <div key={edad} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                            <span className="text-sm font-medium text-gray-800">{edad}</span>
                            <span className="font-bold text-purple-700">{count}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200 shadow-md">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Por Género</h3>
                    <div className="space-y-3">
                      {Object.entries(stats.porGenero)
                        .sort((a, b) => b[1] - a[1])
                        .map(([genero, count]) => (
                          <div key={genero} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                            <span className="text-sm font-medium text-gray-800">{genero}</span>
                            <span className="font-bold text-green-700">{count}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-200 shadow-md">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Por Departamento</h3>
                    <div className="space-y-3">
                      {Object.entries(stats.porDepartamento)
                        .sort((a, b) => b[1] - a[1])
                        .map(([depto, count]) => (
                          <div key={depto} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                            <span className="text-sm font-medium text-gray-800">{depto}</span>
                            <span className="font-bold text-orange-700">{count}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {!stats && (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <p className="text-lg font-medium">No hay datos disponibles aún.</p>
                  <p className="text-sm mt-2">Las estadísticas aparecerán cuando se registren respuestas.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer mejorado */}
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