// VERSIÓN AVANZADA: App.jsx con Routing para incluir Dashboard
// Instala primero: npm install react-router-dom

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './config/firebaseconfig';
import * as XLSX from 'xlsx';
import { FileDown, FileUp, Database, BarChart3, Home } from 'lucide-react';
import SurveyForm from './components/SurveyForm';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

// Componente de Navegación
function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="bg-white shadow-md mb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗳️</span>
            <span className="text-xl font-bold text-gray-800">Encuesta Bolivia 2025</span>
          </div>
          <div className="flex gap-4">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                location.pathname === '/'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Home size={20} />
              <span>Encuesta</span>
            </Link>
            <Link
              to="/admin"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                location.pathname === '/admin'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 size={20} />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Componente Principal de la Encuesta
function SurveyPage() {
  const [formData, setFormData] = useState({
    edad: '',
    genero: '',
    departamento: '',
    localidad: '',
    vivienda: '',
    situacionEducativa: '',
    carrera: '',
    estratoSocioeconomico: '',
    estatusLaboral: '',
    haVotado: '',
    candidatoVoto: '',
    seguridadEleccion: '3',
    tendenciaPolitica: '',
    probabilidadConvencer: '3',
    intensidadIdentificacion: '3',
    economia: '3',
    educacion: '3',
    corrupcion: '3',
    salud: '3',
    seguridad: '3',
    climaAmbiente: '3',
    derechosSociales: '3',
    modeloDesarrollo: '3',
    migracion: '3',
    innovacion: '3',
    pazExperiencia: '3',
    pazHonestidad: '3',
    pazUnion: '3',
    pazLiderazgo: '3',
    pazPropuestas: '3',
    quirogaExperiencia: '3',
    quirogaHonestidad: '3',
    quirogaUnion: '3',
    quirogaLiderazgo: '3',
    quirogaPropuestas: '3',
    redesSociales: [],
    mediosComunicacion: [],
    vinculoSocial: [],
    frecuenciaInteraccion: '',
    influyenteDecision: '',
    confianzaEncuestas: '3',
    estabilidadPolitica: '3',
    expectativaPaz: '3',
    expectativaQuiroga: '3'
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [totalRespuestas, setTotalRespuestas] = useState(0);

  useEffect(() => {
    loadTotalRespuestas();
  }, []);

  const loadTotalRespuestas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'encuestas'));
      setTotalRespuestas(querySnapshot.size);
    } catch (error) {
      console.error('Error al cargar total de respuestas:', error);
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
      edad: '',
      genero: '',
      departamento: '',
      localidad: '',
      vivienda: '',
      situacionEducativa: '',
      carrera: '',
      estratoSocioeconomico: '',
      estatusLaboral: '',
      haVotado: '',
      candidatoVoto: '',
      seguridadEleccion: '3',
      tendenciaPolitica: '',
      probabilidadConvencer: '3',
      intensidadIdentificacion: '3',
      economia: '3',
      educacion: '3',
      corrupcion: '3',
      salud: '3',
      seguridad: '3',
      climaAmbiente: '3',
      derechosSociales: '3',
      modeloDesarrollo: '3',
      migracion: '3',
      innovacion: '3',
      pazExperiencia: '3',
      pazHonestidad: '3',
      pazUnion: '3',
      pazLiderazgo: '3',
      pazPropuestas: '3',
      quirogaExperiencia: '3',
      quirogaHonestidad: '3',
      quirogaUnion: '3',
      quirogaLiderazgo: '3',
      quirogaPropuestas: '3',
      redesSociales: [],
      mediosComunicacion: [],
      vinculoSocial: [],
      frecuenciaInteraccion: '',
      influyenteDecision: '',
      confianzaEncuestas: '3',
      estabilidadPolitica: '3',
      expectativaPaz: '3',
      expectativaQuiroga: '3'
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
      
      setMessage('¡Encuesta enviada correctamente! Gracias por tu participación.');
      resetForm();
      await loadTotalRespuestas();
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      setTimeout(() => {
        setMessage('');
      }, 5000);
      
    } catch (error) {
      console.error('Error al enviar encuesta:', error);
      setMessage('Error al enviar la encuesta. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = async () => {
    setLoading(true);
    setMessage('Exportando datos...');

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
        setMessage('No hay datos para exportar.');
        setLoading(false);
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Encuestas');

      const fileName = `encuestas_bolivia_2025_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      setMessage(`✓ ${data.length} respuestas exportadas correctamente.`);
      setTimeout(() => setMessage(''), 3000);
      
    } catch (error) {
      console.error('Error al exportar:', error);
      setMessage('Error al exportar los datos.');
    } finally {
      setLoading(false);
    }
  };

  const importFromExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setMessage('Importando datos...');

    try {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);

          let imported = 0;
          for (const row of jsonData) {
            const { ID, ...rowData } = row;
            await addDoc(collection(db, 'encuestas'), rowData);
            imported++;
          }

          setMessage(`✓ ${imported} respuestas importadas correctamente.`);
          await loadTotalRespuestas();
          setTimeout(() => setMessage(''), 3000);
          
        } catch (error) {
          console.error('Error al procesar el archivo:', error);
          setMessage('Error al procesar el archivo Excel.');
        }
      };

      reader.readAsArrayBuffer(file);
      
    } catch (error) {
      console.error('Error al importar:', error);
      setMessage('Error al importar los datos.');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Encuesta Segunda Vuelta Bolivia 2025
          </h1>
          <p className="text-gray-600 mb-4">
            Por favor complete todos los campos. La encuesta es anónima.
          </p>

          {/* Estadísticas */}
          <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg">
            <Database className="text-blue-600" size={20} />
            <span className="text-sm font-medium text-gray-700">
              Total de respuestas registradas: <span className="text-blue-600 font-bold">{totalRespuestas}</span>
            </span>
          </div>
          
          {/* Botones de Importar/Exportar */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition disabled:opacity-50">
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
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              <FileDown size={20} />
              Exportar Excel
            </button>
          </div>

          {/* Mensajes */}
          {message && (
            <div className={`mt-4 p-3 rounded-lg ${
              message.includes('Error') || message.includes('error')
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Formulario */}
        <SurveyForm 
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          loading={loading}
        />

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Encuesta anónima - Segunda Vuelta Bolivia 2025</p>
          <p className="mt-1">Todos los datos son confidenciales</p>
        </div>
      </div>
    </div>
  );
}

// Componente Principal con Routing
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Navigation />
        <Routes>
          <Route path="/" element={<SurveyPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;