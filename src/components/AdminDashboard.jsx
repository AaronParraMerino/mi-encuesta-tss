// src/components/AdminDashboard.jsx
// Componente OPCIONAL para ver estadísticas básicas
import React, { useState, useEffect } from 'react';

// === CONFIGURACIÓN DE FIREBASE ===
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

let db = null;
let auth = null;

const Icon = ({ name, size = 24, className = '' }) => {
    let path = '';
    let spinnerClasses = '';

    switch (name) {
        case 'Users':
            path = 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m8-11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 11h2M21 9v4';
            break;
        case 'BarChart3':
            path = 'M3 3v18h18M18 17v-7M12 17v-3M6 17v-9';
            break;
        case 'PieChart':
            path = 'M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z';
            break;
        case 'TrendingUp':
            path = 'M16 6l4 4l-4 4m8-2V4h-6M2 18h20';
            break;
        case 'RotateCcw':
            path = 'M2.5 13a10 10 0 1 0 5-9.35M2 2v5h5';
            break;
        case 'XCircle':
            path = 'M10 10l4 4M14 10l-4 4M12 2A10 10 0 1 0 12 22A10 10 0 0 0 12 2z';
            break;
        case 'FileText':
            path = 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7zM14 2v4a2 2 0 0 0 2 2h4M9 13h6M9 17h6M9 9h3';
            break;
        case 'Loader':
            path = 'M21 12a9 9 0 1 1-6.219-8.56';
            spinnerClasses = 'animate-spin';
            break;
        default:
            return null;
    }

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${className} ${spinnerClasses}`}
        >
            <path d={path} />
        </svg>
    );
};

const exportDataToJSON = (data, filename = 'informe_detallado.json') => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

const App = () => { 
  const [stats, setStats] = useState({
    total: 0,
    porEdad: {},
    porGenero: {},
    porCandidato: {},
    porDepartamento: {}
  });
  const [allSurveyData, setAllSurveyData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false); 
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    try {
      if (typeof firebase !== 'undefined' && firebase.initializeApp) {
        const app = firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        auth = firebase.auth();

        const setupAuth = async () => {
          try {
            if (initialAuthToken) {
              await auth.signInWithCustomToken(initialAuthToken); 
            } else {
              await auth.signInAnonymously();
            }
          } catch (e) {
            console.error("Error al autenticar:", e);
            setError("Error de autenticación. Inténtalo de nuevo.");
          }
        };

        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
          setUser(currentUser);
          setIsAuthReady(true);
        });

        setupAuth();
        return () => unsubscribe();
      } else {
        setError("Error: Las librerías de Firebase no están disponibles.");
        setIsAuthReady(true);
        setLoading(false);
      }
    } catch (e) {
      console.error("Error al inicializar Firebase:", e);
      setError("Error al inicializar la base de datos.");
      setIsAuthReady(true);
      setLoading(false);
    }
  }, []);

  const loadStats = async () => {
    if (!isAuthReady || !db || !user) {
        if (isAuthReady) {
            setError("No se pudo cargar: El usuario no está autenticado o la BD no está lista.");
        }
        return;
    }

    setLoading(true);
    setError(null);

    try {
      const collectionPath = `artifacts/${appId}/public/data/survey_responses`;
      console.log("Cargando encuestas de:", collectionPath);
      
      const querySnapshot = await db.collection(collectionPath).get();
      
      const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
      }));

      setAllSurveyData(data);

      const porEdad = {};
      const porGenero = {};
      const porCandidato = {};
      const porDepartamento = {};

      data.forEach(item => {
        if (item.edad) porEdad[item.edad] = (porEdad[item.edad] || 0) + 1;
        if (item.genero) porGenero[item.genero] = (porGenero[item.genero] || 0) + 1;
        if (item.candidatoVoto) porCandidato[item.candidatoVoto] = (porCandidato[item.candidatoVoto] || 0) + 1;
        if (item.departamento) porDepartamento[item.departamento] = (porDepartamento[item.departamento] || 0) + 1;
      });

      setStats({
        total: data.length,
        porEdad,
        porGenero,
        porCandidato,
        porDepartamento
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
      setError(`Error al conectar con la colección. Detalle: ${err.message}`);
      setLoading(false);
    }
  };
  
  const handleDownloadReport = () => {
      if (allSurveyData.length === 0) {
          setError("No hay datos para generar el informe.");
          return;
      }
      setIsDownloading(true);
      setError(null);

      setTimeout(() => {
          exportDataToJSON(allSurveyData);
          setIsDownloading(false);
      }, 500);
  };
  
  useEffect(() => {
    if (isAuthReady && user) {
        loadStats();
    }
  }, [isAuthReady, user]);

  const renderStatCard = (title, value, IconName, iconColorClass, borderColorClass) => (
    <div className="w-full"> 
        <div className={`bg-white rounded-lg shadow-lg p-4 border-l-4 ${borderColorClass}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 mb-1 font-semibold">{title.toUpperCase()}</p>
                    <p className="text-4xl font-extrabold text-gray-900">{value}</p>
                </div>
                <div className={`p-3 rounded-full ${iconColorClass.replace('text-', 'bg-').replace('-600', '-100')}`}>
                    <Icon name={IconName} size={32} className={iconColorClass} />
                </div>
            </div>
        </div>
    </div>
  );

  const renderBarChart = (title, data) => {
    const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    
    const colors = [
      'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600',
      'bg-red-600', 'bg-pink-600', 'bg-indigo-600', 'bg-teal-600', 'bg-yellow-600'
    ];
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">{title}</h3>
        <div className="space-y-4 flex-grow">
          {entries.map(([key, value], index) => {
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            const barColor = colors[index % colors.length];
            
            return (
              <div key={key}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-base font-medium text-gray-700">{key || 'Sin especificar'}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-gray-900">{value}</span>
                    <span className="text-sm font-semibold text-indigo-600">({percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${barColor} h-3 rounded-full transition-all duration-500 shadow-inner flex items-center justify-end pr-2`}
                    style={{ width: `${percentage}%` }}
                  >
                    {parseFloat(percentage) > 10 && (
                      <span className="text-xs font-bold text-white">{percentage}%</span>
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

  if (!isAuthReady || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-xl shadow-2xl">
          <Icon name="Loader" size={48} className="animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-xl font-semibold text-gray-700">Cargando datos del panel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-start justify-center pt-20 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-lg w-full max-w-xl" role="alert">
            <div className='flex items-center'>
                <Icon name="XCircle" size={24} className="w-6 h-6 mr-3" />
                <strong className="font-bold">¡Error de Carga!</strong>
            </div>
          <span className="block sm:inline mt-2">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 font-['Inter']">
      <div className="max-w-7xl mx-auto">
        
        {/* Header mejorado con gradiente de colores */}
        <div className="mb-8 p-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl shadow-2xl">
          <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow-lg">
            📊 Panel de Administración
          </h1>
          <p className="text-lg text-indigo-100 font-medium">
            Estadísticas consolidadas con porcentajes en tiempo real
          </p>
          <p className="mt-3 text-xs text-indigo-200 break-all">
            {`ID de Usuario: ${user?.uid || 'Anónimo'}`}
          </p>
        </div>
        
        <div className="flex justify-end flex-wrap gap-3 mb-8">
            <button
                onClick={handleDownloadReport}
                disabled={allSurveyData.length === 0 || isDownloading}
                className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-lg font-semibold transform hover:scale-[1.01] active:scale-[0.98] disabled:bg-gray-400"
            >
                {isDownloading ? (
                    <Icon name="Loader" size={20} className="animate-spin w-5 h-5 mr-2" />
                ) : (
                    <Icon name="FileText" size={20} className="w-5 h-5 mr-2" />
                )}
                Descargar Informe Detallado ({allSurveyData.length})
            </button>
            
            <button
                onClick={loadStats}
                className="flex items-center px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg font-semibold transform hover:scale-[1.01] active:scale-[0.98]"
            >
                <Icon name="RotateCcw" size={20} className="w-5 h-5 mr-2" />
                Actualizar
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {renderStatCard('Total Respuestas', stats.total, 'Users', 'text-indigo-600', 'border-indigo-600')}
          {renderStatCard('Rangos de Edad', Object.keys(stats.porEdad).length, 'BarChart3', 'text-green-600', 'border-green-600')}
          {renderStatCard('Candidatos Únicos', Object.keys(stats.porCandidato).length, 'PieChart', 'text-red-600', 'border-red-600')}
          {renderStatCard('Departamentos', Object.keys(stats.porDepartamento).length, 'TrendingUp', 'text-orange-600', 'border-orange-600')}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {renderBarChart('Distribución de Votos por Candidato', stats.porCandidato)}
          {renderBarChart('Distribución por Rango de Edad', stats.porEdad)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderBarChart('Distribución por Género', stats.porGenero)}
          {renderBarChart('Distribución por Departamento', stats.porDepartamento)}
        </div>

      </div>
    </div>
  );
};

export default App;