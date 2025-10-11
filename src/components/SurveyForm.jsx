import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, addDoc, collection, serverTimestamp } from 'firebase/firestore';

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = (() => {
  try {
    return typeof __firebase_config !== 'undefined' && __firebase_config ? JSON.parse(__firebase_config) : {};
  } catch (e) {
    console.error("Error parsing __firebase_config:", e);
    return {};
  }
})();
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

const SurveyApp = () => {
  
  const [formData, setFormData] = useState({
    edad: '', genero: '', departamento: '', localidad: '', vivienda: '',
    situacionEducativa: '', carrera: '', estratoSocioeconomico: '', estatusLaboral: '',
    haVotado: '', candidatoVoto: '', seguridadEleccion: '', tendenciaPolitica: '',
    probabilidadConvencer: '', intensidadIdentificacion: '', economia: '', educacion: '',
    corrupcion: '', salud: '', seguridad: '', climaAmbiente: '', derechosSociales: '',
    modeloDesarrollo: '', migracion: '', innovacion: '', pazExperiencia: '',
    pazHonestidad: '', pazUnion: '', pazLiderazgo: '', pazPropuestas: '',
    quirogaExperiencia: '', quirogaHonestidad: '', quirogaUnion: '', quirogaLiderazgo: '',
    quirogaPropuestas: '', redesSociales: [], mediosComunicacion: [], vinculoSocial: [],
    frecuenciaInteraccion: '', influyenteDecision: '', confianzaEncuestas: '',
    estabilidadPolitica: '', expectativaPaz: '', expectativaQuiroga: ''
  });

  const [loading, setLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [db, setDb] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    if (Object.keys(firebaseConfig).length === 0) {
      console.error("Firebase Configuración no encontrada.");
      setIsAuthReady(true); 
      return;
    }

    try {
      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const authInstance = getAuth(app);
      setDb(firestore);

      const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
        if (!user) {
          try {
            if (initialAuthToken) {
              await signInWithCustomToken(authInstance, initialAuthToken);
            } else {
              await signInAnonymously(authInstance);
            }
          } catch (error) {
            console.error("Error de autenticación:", error);
          }
        }
        setUserId(authInstance.currentUser?.uid || crypto.randomUUID());
        setIsAuthReady(true);
      });
      
      return () => unsubscribe(); 
    } catch (error) {
      console.error("Error al inicializar Firebase:", error);
      setIsAuthReady(true);
    }
  }, []); 

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prevData => {
      if (type === 'checkbox') {
        const currentArray = prevData[name] || [];
        if (checked) {
          return { ...prevData, [name]: Array.from(new Set([...currentArray, value])) };
        } else {
          return { ...prevData, [name]: currentArray.filter(item => item !== value) };
        }
      }
      return { ...prevData, [name]: value };
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!db || !userId || !isAuthReady) {
      console.error("Firebase no está listo.");
      setSubmissionStatus('error');
      return;
    }

    setLoading(true);
    setSubmissionStatus(null);

    try {
      const collectionRef = collection(db, 'artifacts', appId, 'public', 'data', 'survey_responses');

      await addDoc(collectionRef, {
        ...formData,
        userId: userId,
        timestamp: serverTimestamp(),
      });

      setSubmissionStatus('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Error al guardar la encuesta:", error);
      setSubmissionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Renderizadores de componentes individuales
  const renderMatrixQuestion = (questions, title) => (
    <div className="card shadow-sm mb-4 border-0 rounded-3">
      <div className="card-header bg-info-subtle border-0 rounded-top-3">
        <h3 className="h5 card-title mb-0 text-primary fw-bold">
          {title} <span className="text-danger">*</span>
        </h3>
      </div>
      
      <div className="card-body p-0 table-responsive">
        <table className="table table-striped table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th className="text-start text-dark" style={{minWidth: '250px'}}>Afirmación</th>
              {[1, 2, 3, 4, 5].map(num => (
                <th key={num} className="text-center text-dark">{num}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.name}>
                <td className="align-middle fw-medium text-dark">{q.label}</td>
                {[1, 2, 3, 4, 5].map(value => (
                  <td key={value} className="text-center align-middle">
                    <div className="form-check d-inline-block">
                      <input
                        type="radio"
                        name={q.name}
                        value={value}
                        checked={formData[q.name] === String(value)}
                        onChange={handleInputChange}
                        required
                        className="form-check-input"
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRadioGroup = (name, label, options) => (
    <div className="card p-4 shadow-sm border-0 rounded-3 mb-4">
      <label className="form-label fw-bold text-dark mb-3">
        {label} <span className="text-danger">*</span>
      </label>
      <div className="d-flex flex-column gap-2">
        {options.map((option) => (
          <div key={option} className="form-check">
            <input
              type="radio"
              name={name}
              value={option}
              checked={formData[name] === option}
              onChange={handleInputChange}
              required
              className="form-check-input"
              id={`radio-${name}-${option}`}
            />
            <label className="form-check-label text-dark" htmlFor={`radio-${name}-${option}`}>
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSelect = (name, label, options) => (
    <div className="card p-4 shadow-sm border-0 rounded-3 mb-4">
      <label className="form-label fw-bold text-dark mb-2">
        {label} <span className="text-danger">*</span>
      </label>
      <select
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        required
        className="form-select"
      >
        <option value="" disabled>Selecciona una opción</option>
        {options.map((option) => (
          <option key={option.value} value={option.label}>{option.label}</option>
        ))}
      </select>
    </div>
  );

  const renderCheckboxGroup = (name, label, options) => (
    <div className="card p-4 shadow-sm border-0 rounded-3 mb-4">
      <label className="form-label fw-bold text-dark mb-3">
        {label}
      </label>
      <div className="d-flex flex-column gap-2">
        {options.map((option) => (
          <div key={option} className="form-check">
            <input
              type="checkbox"
              name={name}
              value={option}
              checked={formData[name].includes(option)}
              onChange={handleInputChange}
              className="form-check-input"
              id={`check-${name}-${option}`}
            />
            <label className="form-check-label text-dark" htmlFor={`check-${name}-${option}`}>
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderScale = (name, label, minLabel, maxLabel) => (
    <div className="card p-4 shadow-sm border-0 rounded-3 mb-4">
      <label className="form-label fw-bold mb-3 text-dark">
        {label} <span className="text-danger">*</span>
      </label>
      <div className="d-flex flex-column align-items-center bg-light p-4 rounded-3 border">
        <div className="d-flex gap-4 justify-content-center mb-3">
          {[1, 2, 3, 4, 5].map(value => (
            <div key={value} className="form-check d-flex flex-column align-items-center">
              <label className="form-check-label mb-2 text-dark fw-medium" htmlFor={`scale-${name}-${value}`}>
                {value}
              </label>
              <input
                type="radio"
                name={name}
                value={value}
                checked={formData[name] === String(value)}
                onChange={handleInputChange}
                required
                className="form-check-input"
                id={`scale-${name}-${value}`}
                style={{width: '20px', height: '20px'}}
              />
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-between w-100 px-2">
          <span className="text-secondary fw-normal small">{minLabel}</span>
          <span className="text-secondary fw-normal small">{maxLabel}</span>
        </div>
      </div>
    </div>
  );

  const renderTextInput = (name, label, placeholder) => (
    <div className="card p-4 shadow-sm border-0 rounded-3 mb-4">
      <label className="form-label fw-bold text-dark mb-2">
        {label} <span className="text-danger">*</span>
      </label>
      <input
        type="text"
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        required
        placeholder={placeholder}
        className="form-control"
      />
    </div>
  );

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <form onSubmit={handleSubmit}>
          
          {/* ENCABEZADO */}
          <div className="card shadow-lg mb-5 border border-3 border-primary rounded-3">
            <div className="card-body p-4 p-md-5">
              <h1 className="display-6 fw-bold text-primary mb-2">
                Encuesta de Percepción Política
              </h1>
              <p className="lead text-secondary">
                Análisis de la intención de voto y factores influyentes en el segmento juvenil.
              </p>
              {userId && <p className="mt-4 text-small text-muted">
                Tu ID de Encuestado: <code className="text-primary">{userId}</code>
              </p>}
            </div>
          </div>

          {/* Mensajes de estado */}
          {submissionStatus === 'success' && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <strong>¡Éxito!</strong> Tu encuesta ha sido enviada correctamente.
              <button type="button" className="btn-close" onClick={() => setSubmissionStatus(null)}></button>
            </div>
          )}

          {submissionStatus === 'error' && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <strong>Error</strong> No se pudo enviar la encuesta. Por favor intenta nuevamente.
              <button type="button" className="btn-close" onClick={() => setSubmissionStatus(null)}></button>
            </div>
          )}

          {/* SECCIÓN 1: Datos Demográficos - TODO VERTICAL */}
          <div className="card shadow-lg mb-5 p-4 border-start border-4 border-info rounded-3">
            <h2 className="h4 text-dark border-bottom pb-3 mb-4 fw-bold">
              1. Datos Demográficos y Socioeconómicos
            </h2>
            
            {renderRadioGroup('edad', '¿Qué edad tienes?', ['18 a 24', '25 a 30', '30 a 45', '46 en adelante'])}
            
            {renderSelect('genero', 'Género', [
              { value: 'Masculino', label: 'Masculino' },
              { value: 'Femenino', label: 'Femenino' },
              { value: 'Prefiero no decirlo', label: 'Prefiero no Decirlo' },
              { value: 'No Binario', label: 'No Binario' }
            ])}
            
            {renderSelect('departamento', 'Ciudad/Departamento de residencia', [
              { value: 'La Paz', label: 'La Paz' },
              { value: 'Santa Cruz', label: 'Santa Cruz' },
              { value: 'Cochabamba', label: 'Cochabamba' },
              { value: 'Chuquisaca', label: 'Chuquisaca' },
              { value: 'Tarija', label: 'Tarija' },
              { value: 'Pando', label: 'Pando' },
              { value: 'Beni', label: 'Beni' },
              { value: 'Potosi', label: 'Potosí' },
              { value: 'Oruro', label: 'Oruro' }
            ])}

            {renderTextInput('localidad', 'Localidad/Provincia de origen', 'Ej: Cliza, Punata, Chapare')}
            
            {renderSelect('vivienda', 'Tu vivienda donde reside actualmente es', [
              { value: 'Alquiler', label: 'Alquiler' },
              { value: 'Anticrético', label: 'Anticrético' },
              { value: 'Propia', label: 'Propia' },
              { value: 'Familiar', label: 'Familiar' }
            ])}
            
            {renderSelect('situacionEducativa', 'Situación Educativa', [
              { value: 'Estudiante Universitario', label: 'Estudiante Universitario' },
              { value: 'Recién Profesionalizado', label: 'Recién Profesionalizado' }
            ])}

            {renderTextInput('carrera', '¿Menciona la carrera que estudias o estudiaste?', 'Ej: Ingeniería de Sistemas')}
            
            {renderSelect('estratoSocioeconomico', 'Estrato Socioeconómico Percibido', [
              { value: 'Bajo', label: 'Bajo (Luchando para cubrir necesidades básicas)' },
              { value: 'Medio-Bajo', label: 'Medio-Bajo (Cubriendo necesidades, pocos ahorros)' },
              { value: 'Medio', label: 'Medio (Vida cómoda, capacidad de ahorro)' },
              { value: 'Medio-Alto', label: 'Medio-Alto (Ingresos significativos, estabilidad)' },
              { value: 'Alto', label: 'Alto (Ingresos altos)' }
            ])}
            
            {renderSelect('estatusLaboral', 'Estatus Laboral', [
              { value: 'Empleado Público', label: 'Empleado Institución Pública' },
              { value: 'Empleado Privada', label: 'Empleado Empresa Privada' },
              { value: 'Desempleado', label: 'Desempleado/Buscando empleo' },
              { value: 'Emprendedor', label: 'Emprendedor/Dueño de negocio' },
              { value: 'Freelance', label: 'Freelance/Trabajador independiente' },
              { value: 'Innovador', label: 'Innovador/Trabajando en startup' }
            ])}
            
            {renderSelect('haVotado', 'Ha votado en elecciones presidenciales previas', [
              { value: 'Si', label: 'Sí' },
              { value: 'No', label: 'No' },
              { value: 'No recuerdo', label: 'No recuerdo' }
            ])}
          </div>

          {/* SECCIÓN 2: Intención de Voto - TODO VERTICAL */}
          <div className="card shadow-lg mb-5 p-4 border-start border-4 border-info rounded-3">
            <h2 className="h4 text-dark border-bottom pb-3 mb-4 fw-bold">
              2. Intención de Voto
            </h2>
            
            {renderSelect('candidatoVoto', 'Si las elecciones fueran mañana, ¿por qué candidato votarías?', [
              { value: 'Rodrigo Paz Pereira', label: 'Rodrigo Paz Pereira' },
              { value: 'Jorge Quiroga Ramirez', label: 'Jorge Quiroga Ramírez' },
              { value: 'Voto Blanco', label: 'Voto Blanco' },
              { value: 'Voto Nulo', label: 'Voto Nulo' },
              { value: 'Aun no lo decido', label: 'Aún no lo decido' }
            ])}

            {renderScale('seguridadEleccion', '¿Qué tan seguro está de su elección?', '1 = Poco seguro', '5 = Muy seguro')}

            {renderSelect('tendenciaPolitica', '¿Con qué tendencia política se identifica más personalmente?', [
              { value: 'Izquierda/Progresista', label: 'Izquierda/Progresista' },
              { value: 'Centro-Izquierda', label: 'Centro-Izquierda' },
              { value: 'Centro', label: 'Centro' },
              { value: 'Centro-Derecha', label: 'Centro-Derecha' },
              { value: 'Derecha Conservadora', label: 'Derecha Conservadora' }
            ])}

            {renderScale('probabilidadConvencer', '¿Qué probabilidad crees que tienes para convencer a otra persona de cambiar su voto?', '1 = Poco probable', '5 = Muy probable')}

            {renderScale('intensidadIdentificacion', '¿Con qué intensidad se identifica con la ideología del candidato que apoya?', '1 = Baja', '5 = Alta')}
          </div>

          {/* SECCIÓN 3: Relevancia de Temas */}
          <div className="card shadow-lg mb-5 p-4 border-start border-4 border-info rounded-3">
            <h2 className="h4 text-dark border-bottom pb-3 mb-4 fw-bold">
              3. Relevancia de los temas en su elección
            </h2>
            <p className="text-secondary mb-4">
              Valore del <strong>1 (Nada Importante)</strong> al <strong>5 (Muy Importante)</strong>
            </p>

            {renderMatrixQuestion([
              { name: 'economia', label: 'Economía: Estabilidad, Empleo, Deuda' },
              { name: 'educacion', label: 'Educación: Calidad universitaria, Acceso a becas' },
              { name: 'corrupcion', label: 'Lucha contra la Corrupción y Justicia' },
              { name: 'salud', label: 'Acceso a servicios: Salud Pública' },
              { name: 'seguridad', label: 'Seguridad ciudadana' },
              { name: 'climaAmbiente', label: 'Cambio Climático y Medio Ambiente' },
              { name: 'derechosSociales', label: 'Derechos Sociales/Minorías' },
              { name: 'modeloDesarrollo', label: 'Modelo de Desarrollo del País' },
              { name: 'migracion', label: 'Migración laboral juvenil' },
              { name: 'innovacion', label: 'Propuestas de innovación y tecnología' }
            ], 'Relevancia de los Temas')}
          </div>

          {/* SECCIÓN 4: Percepción de Candidatos */}
          <div className="card shadow-lg mb-5 p-4 border-start border-4 border-info rounded-3">
            <h2 className="h4 text-dark border-bottom pb-3 mb-4 fw-bold">
              4. Percepción de Candidatos y Atributos
            </h2>
            <p className="text-secondary mb-4">
              Valore del <strong>1 (Nada en absoluto)</strong> al <strong>5 (Totalmente)</strong>
            </p>

            {renderMatrixQuestion([
              { name: 'pazExperiencia', label: 'Experiencia en gestión' },
              { name: 'pazHonestidad', label: 'Honestidad/Transparencia' },
              { name: 'pazUnion', label: 'Capacidad de unir a la población' },
              { name: 'pazLiderazgo', label: 'Liderazgo fuerte/Decisivo' },
              { name: 'pazPropuestas', label: 'Propuestas claras y realistas' }
            ], 'Atributos de Rodrigo Paz Pereira')}

            <p className="text-secondary mb-4 mt-4">
              Valore del <strong>1 (Nada en absoluto)</strong> al <strong>5 (Totalmente)</strong>
            </p>

            {renderMatrixQuestion([
              { name: 'quirogaExperiencia', label: 'Experiencia en gestión' },
              { name: 'quirogaHonestidad', label: 'Honestidad/Transparencia' },
              { name: 'quirogaUnion', label: 'Capacidad de unir a la población' },
              { name: 'quirogaLiderazgo', label: 'Liderazgo fuerte/Decisivo' },
              { name: 'quirogaPropuestas', label: 'Propuestas claras y realistas' }
            ], 'Atributos de Jorge Quiroga Ramírez')}
          </div>

          {/* SECCIÓN 5: Fuentes de Información - TODO VERTICAL */}
          <div className="card shadow-lg mb-5 p-4 border-start border-4 border-info rounded-3">
            <h2 className="h4 text-dark border-bottom pb-3 mb-4 fw-bold">
              5. Fuentes de Información Política
            </h2>
            
            {renderCheckboxGroup('redesSociales', '¿Cuáles son las redes sociales por el cual recibe información de política? (Selecciona una o más)', 
              ['TikTok', 'Facebook', 'Instagram', 'Twitter (X)', 'Reddit', 'Telegram/WhatsApp']
            )}

            {renderCheckboxGroup('mediosComunicacion', '¿Cuáles son los medios de comunicación por el cual recibe información de política? (Selecciona una o más)',
              ['Televisión', 'Radio', 'Periódico', 'Prensa en linea']
            )}

            {renderCheckboxGroup('vinculoSocial', '¿Cuáles son los medios de vínculo social por el cual recibe información de política? (Selecciona una o más)',
              ['Familiares', 'Amigos', 'Conocidos en el trabajo']
            )}

            {renderSelect('frecuenciaInteraccion', '¿Con qué frecuencia interactúa con contenidos políticos en redes sociales?', [
              { value: 'Diario', label: 'Diario' },
              { value: 'Semanal', label: 'Semanal' },
              { value: 'Ocasional', label: 'Ocasional (Una vez al mes)' },
              { value: 'Nunca', label: 'Nunca' }
            ])}

            {renderSelect('influyenteDecision', '¿A quién considera más influyente en su decisión política?', [
              { value: 'Familia', label: 'Familia' },
              { value: 'Amigos', label: 'Amigos' },
              { value: 'Redes sociales', label: 'Redes sociales (Influencers, páginas de noticias)' },
              { value: 'Medios tradicionales', label: 'Medios de comunicación tradicional' }
            ])}

            {renderScale('confianzaEncuestas', 'Nivel de confianza en encuestas publicadas en medios digitales', '1 = Muy baja', '5 = Muy alta')}
          </div>

          {/* SECCIÓN 6: Expectativas - TODO VERTICAL */}
          <div className="card shadow-lg mb-5 p-4 border-start border-4 border-info rounded-3">
            <h2 className="h4 text-dark border-bottom pb-3 mb-4 fw-bold">
              6. Expectativas Post-Elección
            </h2>
            
            {renderScale('estabilidadPolitica', 'Percepción de estabilidad política futura tras las elecciones', '1 = Muy inestable', '5 = Muy estable')}

            {renderScale('expectativaPaz', 'Expectativa personal sobre mejora del País si GANA Rodrigo Paz Pereira', '1 = Empeorará mucho', '5 = Mejorará mucho')}

            {renderScale('expectativaQuiroga', 'Expectativa personal sobre mejora del País si GANA Jorge Quiroga Ramírez', '1 = Empeorará mucho', '5 = Mejorará mucho')}
          </div>

          {/* BOTÓN DE ENVÍO */}
          <div className="card shadow-lg p-4 rounded-3">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
              <div className="w-100 text-center text-md-start">
                {loading && (
                  <p className="text-primary fw-bold d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-0">
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Enviando datos...
                  </p>
                )}
                {!isAuthReady && (
                  <p className="text-warning fw-bold d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-0">
                    <span className="spinner-grow spinner-grow-sm me-2"></span>
                    Conectando con la base de datos...
                  </p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={loading || submissionStatus === 'success' || !isAuthReady}
                className="btn btn-primary btn-lg fw-bold px-5 py-3 shadow-sm"
              >
                {loading ? 'Procesando...' : 'FINALIZAR Y ENVIAR'}
              </button>
            </div>
          </div>
        </form>
        
        <footer className="text-center text-muted small mt-4">
          <p className="mb-0">* Campos obligatorios. Desarrollado para análisis de percepción política.</p>
        </footer>
      </div>
    </div>
  );
};

export default SurveyApp;