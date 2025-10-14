// src/components/SurveyForm.jsx
import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const SurveyForm = () => {
  // Estado con NOMBRES EXACTOS de las columnas de Google Forms
  const [formData, setFormData] = useState({
    'Marca temporal': '',
    'Puntuación': '',
    '¿Qué edad tienes?': '',
    'Genero:': '',
    'Ciudad/Departamento de residencia:': '',
    'Localidad/Provincia de origen.\nEjm: Cliza, Punata, Chapare, etc.': '',
    'Tu vivienda donde reside actualmente es:': '',
    'Situación Educativa:': '',
    '¿Menciona la carrera que estudias o estudiaste?': '',
    'Estrato Socioeconómico Percibido:': '',
    'Estatus Laboral (Recién profesionalizados - Profesionales Junior)': '',
    'Ha votado en elecciones presidenciales previas:': '',
    'Si las elecciones fueran mañana, ¿por qué candidato votarías?': '',
    '¿Qué tan seguro esta de su elección?': '',
    '¿Con qué tendencia política se identifica mas personalmente?': '',
    '¿Qué probabilidad crees que tienes para convencer a otra persona de cambiar su voto?': '',
    '¿Con qué intensidad se identifica con la ideología del candidato que apoya?': '',
    // Relevancia - Cada tema en su propia columna
    'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Economía: Estabilidad, Empleo, Deuda]': '',
    'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Educación: Calidad universitaria, Acceso a becas]': '',
    'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Lucha contra la Corrupción y Justicia]': '',
    'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Acceso a servicios: Salud Publica]': '',
    'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Seguridad ciudadana:]': '',
    'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Cambio Climático y Medio Ambiente:]': '',
    'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Derechos Sociales/Minorías: Temas de género, indigenas]': '',
    'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Modelo de Desarrollo del País: Estatismo vs. Mercado]': '',
    'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Migración laboral juvenil]': '',
    'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Propuestas de innovación y tecnología]': '',
    // Atributos Paz Pereira - Cada atributo en su propia columna
    '¿En qué medida describe el siguiente atributo de Rodrigo Paz Pereira?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Experiencia en gestión ]': '',
    '¿En qué medida describe el siguiente atributo de Rodrigo Paz Pereira?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Honestidad/Transparencia]': '',
    '¿En qué medida describe el siguiente atributo de Rodrigo Paz Pereira?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Capacidad de unir a la población]': '',
    '¿En qué medida describe el siguiente atributo de Rodrigo Paz Pereira?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Liderazgo fuerte/Decisivo]': '',
    '¿En qué medida describe el siguiente atributo de Rodrigo Paz Pereira?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Propuestas claras y realistas]': '',
    // Atributos Quiroga - Cada atributo en su propia columna
    '¿En qué medida describe el siguiente atributo de Jorge Quiroga Ramírez?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Experiencia en gestión ]': '',
    '¿En qué medida describe el siguiente atributo de Jorge Quiroga Ramírez?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Honestidad/Transparencia]': '',
    '¿En qué medida describe el siguiente atributo de Jorge Quiroga Ramírez?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Capacidad de unir a la población]': '',
    '¿En qué medida describe el siguiente atributo de Jorge Quiroga Ramírez?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Liderazgo fuerte/Decisivo]': '',
    '¿En qué medida describe el siguiente atributo de Jorge Quiroga Ramírez?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Propuestas claras y realistas]': '',
    // Fuentes de información
    '¿Cuáles son las redes sociales por el cual recibe información de política?': '',
    '¿Cuáles son los medios comunicación por el cual recibe información de política?': '',
    '¿Cuáles son los medios de vinculo social por el cual recibe información de política?': '',
    '¿Con qué frecuencia interactúa con contenidos políticos en redes sociales?': '',
    '¿A quién considera más influyente en su decisión política?': '',
    'Nivel de confianza en encuestas publicadas en medios digitales': '',
    '¿Cree que los debates podrían hacerle reconsiderar su actual preferencia de voto?': '',
    'Percepción de estabilidad política futura tras la segunda vuelta': '',
    'Expectativa personal sobre mejora del País si GANA Rodrigo Paz Pereira': '',
    'Expectativa personal sobre mejora del País si GANA Jorge Quiroga Ramírez': '',
    'Dirección de correo electrónico': ''
  });

  const [loading, setLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const currentValue = formData[name];
      const valuesArray = currentValue ? currentValue.split(', ') : [];
      
      if (checked) {
        setFormData(prev => ({
          ...prev,
          [name]: [...valuesArray, value].join(', ')
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: valuesArray.filter(item => item !== value).join(', ')
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmissionStatus(null);

    try {
      // ORDEN EXACTO de columnas según Google Forms (CRITICAL para Python)
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
        '¿En qué medida describe el siguiente atributo de Rodrigo Paz Pereira?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Experiencia en gestión ]',
        '¿En qué medida describe el siguiente atributo de Rodrigo Paz Pereira?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Honestidad/Transparencia]',
        '¿En qué medida describe el siguiente atributo de Rodrigo Paz Pereira?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Capacidad de unir a la población]',
        '¿En qué medida describe el siguiente atributo de Rodrigo Paz Pereira?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Liderazgo fuerte/Decisivo]',
        '¿En qué medida describe el siguiente atributo de Rodrigo Paz Pereira?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Propuestas claras y realistas]',
        '¿En qué medida describe el siguiente atributo de Jorge Quiroga Ramírez?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Experiencia en gestión ]',
        '¿En qué medida describe el siguiente atributo de Jorge Quiroga Ramírez?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Honestidad/Transparencia]',
        '¿En qué medida describe el siguiente atributo de Jorge Quiroga Ramírez?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Capacidad de unir a la población]',
        '¿En qué medida describe el siguiente atributo de Jorge Quiroga Ramírez?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Liderazgo fuerte/Decisivo]',
        '¿En qué medida describe el siguiente atributo de Jorge Quiroga Ramírez?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Propuestas claras y realistas]',
        '¿Cuáles son las redes sociales por el cual recibe información de política?',
        '¿Cuáles son los medios comunicación por el cual recibe información de política?',
        '¿Cuáles son los medios de vinculo social por el cual recibe información de política?',
        '¿Con qué frecuencia interactúa con contenidos políticos en redes sociales?',
        '¿A quién considera más influyente en su decisión política?',
        'Nivel de confianza en encuestas publicadas en medios digitales',
        '¿Cree que los debates podrían hacerle reconsiderar su actual preferencia de voto?',
        'Percepción de estabilidad política futura tras la segunda vuelta',
        'Expectativa personal sobre mejora del País si GANA Rodrigo Paz Pereira',
        'Expectativa personal sobre mejora del País si GANA Jorge Quiroga Ramírez',
        'Dirección de correo electrónico'
      ];

      // Crear objeto ordenado según COLUMN_ORDER
      const orderedData = {};
      
      // Agregar Marca temporal y Puntuación primero
      orderedData['Marca temporal'] = new Date().toLocaleString('es-BO', { 
        timeZone: 'America/La_Paz',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      orderedData['Puntuación'] = ''; // Vacío como en Google Forms
      
      // Recorrer el orden de columnas y asignar valores desde formData
      COLUMN_ORDER.forEach(column => {
        if (column !== 'Marca temporal' && column !== 'Puntuación' && column !== 'timestamp') {
          // CRITICAL: Asegurar que TODAS las columnas tengan un valor (aunque sea vacío)
          orderedData[column] = formData[column] !== undefined && formData[column] !== null && formData[column] !== '' 
            ? formData[column] 
            : ''; // Siempre string vacío, nunca undefined
        }
      });

      // Agregar timestamp de Firebase para ordenamiento interno (no se exporta)
      orderedData['timestamp'] = serverTimestamp();

      await addDoc(collection(db, 'encuestas'), orderedData);
      
      setSubmissionStatus('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Limpiar formulario después de 3 segundos
      setTimeout(() => {
        setSubmissionStatus(null);
        // Resetear formulario
        Object.keys(formData).forEach(key => {
          setFormData(prev => ({ ...prev, [key]: '' }));
        });
      }, 3000);
      
    } catch (error) {
      console.error('Error al guardar:', error);
      setSubmissionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Componentes de renderizado (simplificados)
  const renderRadioGroup = (name, label, options) => (
    <div className="card p-4 shadow-sm border-0 rounded-3 mb-4">
      <label className="form-label fw-bold text-dark mb-3">
        {label} <span className="text-danger">*</span>
      </label>
      <div className="d-flex flex-column gap-2">
        {options.map((option, idx) => (
          <div key={idx} className="form-check">
            <input
              type="radio"
              name={name}
              value={option}
              checked={formData[name] === option}
              onChange={handleInputChange}
              required
              className="form-check-input"
              id={`${name}-${idx}`}
            />
            <label className="form-check-label text-dark" htmlFor={`${name}-${idx}`}>
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
        <option value="">Selecciona una opción</option>
        {options.map((option, idx) => (
          <option key={idx} value={option}>{option}</option>
        ))}
      </select>
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

  const renderScale = (name, label, minLabel, maxLabel) => (
    <div className="card p-4 shadow-sm border-0 rounded-3 mb-4">
      <label className="form-label fw-bold mb-3 text-dark">
        {label} <span className="text-danger">*</span>
      </label>
      <div className="d-flex flex-column align-items-center bg-light p-4 rounded-3 border">
        <div className="d-flex gap-4 justify-content-center mb-3">
          {[1, 2, 3, 4, 5].map(value => (
            <div key={value} className="form-check d-flex flex-column align-items-center">
              <label className="form-check-label mb-2 text-dark fw-medium" htmlFor={`${name}-${value}`}>
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
                id={`${name}-${value}`}
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

  const renderCheckboxGroup = (name, label, options) => {
    const currentValues = formData[name] ? formData[name].split(', ') : [];
    
    return (
      <div className="card p-4 shadow-sm border-0 rounded-3 mb-4">
        <label className="form-label fw-bold text-dark mb-3">{label}</label>
        <div className="d-flex flex-column gap-2">
          {options.map((option, idx) => (
            <div key={idx} className="form-check">
              <input
                type="checkbox"
                name={name}
                value={option}
                checked={currentValues.includes(option)}
                onChange={handleInputChange}
                className="form-check-input"
                id={`${name}-${idx}`}
              />
              <label className="form-check-label text-dark" htmlFor={`${name}-${idx}`}>
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMatrixQuestion = (questions, title) => (
    <div className="card shadow-sm mb-4 border-0 rounded-3">
      <div className="card-header bg-info bg-opacity-10 border-0 rounded-top-3">
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
            {questions.map((q, idx) => (
              <tr key={idx}>
                <td className="align-middle fw-medium text-dark">{q.shortLabel}</td>
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

  return (
    <form onSubmit={handleSubmit}>
    <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl shadow-2xl p-6">
          <h1 className="text-3xl font-extrabold text-white mb-2 drop-shadow-lg">
            Encuesta de Percepción Política
          </h1>
          <p className="text-lg text-white font-medium drop-shadow">
            Análisis de la intención de voto y factores influyentes en el segmento juvenil.
          </p>
        </div>

        {/* Mensajes */}
        {submissionStatus === 'success' && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <strong>¡Éxito!</strong> Tu encuesta ha sido enviada correctamente.
            <button type="button" className="btn-close" onClick={() => setSubmissionStatus(null)}></button>
          </div>
        )}

        {submissionStatus === 'error' && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error</strong> No se pudo enviar. Por favor intenta nuevamente.
            <button type="button" className="btn-close" onClick={() => setSubmissionStatus(null)}></button>
          </div>
        )}

        {/* SECCIÓN 1: Datos Demográficos */}
        <div className="card shadow-lg mb-5 p-4 rounded-3 gradient-border">
          <h2 className="h4 text-dark border-bottom pb-3 mb-4 fw-bold">
            1. Datos Demográficos y Socioeconómicos
          </h2>
          
          {renderSelect('¿Qué edad tienes?', '¿Qué edad tienes?', ['18 a 24', '25 en adelante'])}
          
          {renderSelect('Genero:', 'Género', ['Masculino', 'Femenino', 'Prefiero no decirlo', 'No Binario'])}
          
          {renderSelect('Ciudad/Departamento de residencia:', 'Ciudad/Departamento de residencia', [
            'La Paz', 'Santa Cruz', 'Cochabamba', 'Chuquisaca', 'Tarija', 'Pando', 'Beni', 'Potosi', 'Oruro'
          ])}

          {renderTextInput('Localidad/Provincia de origen.\nEjm: Cliza, Punata, Chapare, etc.', 'Localidad/Provincia de origen', 'Ej: Cliza, Punata, Chapare')}
          
          {renderSelect('Tu vivienda donde reside actualmente es:', 'Tu vivienda donde reside actualmente es', [
            'Alquiler', 'Anticrético', 'Propia', 'Familiar'
          ])}
          
          {renderSelect('Situación Educativa:', 'Situación Educativa', [
            'Estudiante Universitario', 'Recién Profesionalizado'
          ])}

          {renderTextInput('¿Menciona la carrera que estudias o estudiaste?', 'Menciona la carrera que estudias o estudiaste', 'Ej: Ingeniería de Sistemas')}
          
          {renderSelect('Estrato Socioeconómico Percibido:', 'Estrato Socioeconómico Percibido', [
            'Bajo (Luchando para cubrir necesidades básicas)',
            'Medio-Bajo (Cubriendo necesidades, pocos ahorros)',
            'Medio (Vida cómoda, capacidad de ahorro)',
            'Medio-Alto (Ingresos significativos, estabilidad)'
          ])}
          
          {renderSelect('Estatus Laboral (Recién profesionalizados - Profesionales Junior)', 'Estatus Laboral', [
            'Empleado Institución Pública',
            'Empleado Empresa Privada',
            'Desempleado',
            'Emprendedor',
            'Freelance',
            'Innovador'
          ])}
          
          {renderSelect('Ha votado en elecciones presidenciales previas:', 'Ha votado en elecciones presidenciales previas', [
            'Si', 'No'
          ])}
        </div>

        {/* SECCIÓN 2: Intención de Voto */}
        <div className="card shadow-lg mb-5 p-4 rounded-3 gradient-border">
          <h2 className="h4 text-dark border-bottom pb-3 mb-4 fw-bold">
            2. Intención de Voto
          </h2>
          
          {renderSelect('Si las elecciones fueran mañana, ¿por qué candidato votarías?', 'Si las elecciones fueran mañana, ¿por qué candidato votarías?', [
            'Candidato Rodrigo Paz Pereira (Izquierda)',
            'Candidato Jorge Quiroga Ramirez (Derecha)',
            'Voto Blanco',
            'Voto Nulo',
            'Aun no lo decido'
          ])}

          {renderScale('¿Qué tan seguro esta de su elección?', '¿Qué tan seguro está de su elección?', '1 = Poco seguro', '5 = Muy seguro')}

          {renderSelect('¿Con qué tendencia política se identifica mas personalmente?', '¿Con qué tendencia política se identifica más personalmente?', [
            'Izquierda/Progresista',
            'Centro-Izquierda',
            'Centro',
            'Centro-Derecha',
            'Derecha Conservadora'
          ])}

          {renderScale('¿Qué probabilidad crees que tienes para convencer a otra persona de cambiar su voto?', '¿Qué probabilidad crees que tienes para convencer a otra persona de cambiar su voto?', '1 = Poco probable', '5 = Muy probable')}

          {renderScale('¿Con qué intensidad se identifica con la ideología del candidato que apoya?', '¿Con qué intensidad se identifica con la ideología del candidato que apoya?', '1 = Baja', '5 = Alta')}
        </div>

        {/* SECCIÓN 3: Relevancia de Temas */}
        <div className="card shadow-lg mb-5 p-4 rounded-3 gradient-border">
          <h2 className="h4 text-dark border-bottom pb-3 mb-4 fw-bold">
            3. Relevancia de los temas en su elección
          </h2>
          <p className="text-secondary mb-4">
            Valore del <strong>1 (Nada Importante)</strong> al <strong>5 (Muy Importante)</strong>
          </p>

          {renderMatrixQuestion([
            { name: 'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Economía: Estabilidad, Empleo, Deuda]', shortLabel: 'Economía: Estabilidad, Empleo, Deuda' },
            { name: 'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Educación: Calidad universitaria, Acceso a becas]', shortLabel: 'Educación: Calidad universitaria, Acceso a becas' },
            { name: 'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Lucha contra la Corrupción y Justicia]', shortLabel: 'Lucha contra la Corrupción y Justicia' },
            { name: 'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Acceso a servicios: Salud Publica]', shortLabel: 'Acceso a servicios: Salud Pública' },
            { name: 'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Seguridad ciudadana:]', shortLabel: 'Seguridad ciudadana' },
            { name: 'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Cambio Climático y Medio Ambiente:]', shortLabel: 'Cambio Climático y Medio Ambiente' },
            { name: 'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Derechos Sociales/Minorías: Temas de género, indigenas]', shortLabel: 'Derechos Sociales/Minorías' },
            { name: 'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Modelo de Desarrollo del País: Estatismo vs. Mercado]', shortLabel: 'Modelo de Desarrollo del País' },
            { name: 'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Migración laboral juvenil]', shortLabel: 'Migración laboral juvenil' },
            { name: 'Relevancia de los temas en su elección\n(1 = Nada Importante) a (5 = Muy Importante) [Propuestas de innovación y tecnología]', shortLabel: 'Propuestas de innovación y tecnología' }
          ], 'Relevancia de los Temas')}
        </div>

        {/* SECCIÓN 4: Percepción de Candidatos */}
        <div className="card shadow-lg mb-5 p-4 rounded-3 gradient-border">
          <h2 className="h4 text-dark border-bottom pb-3 mb-4 fw-bold">
            4. Percepción de Candidatos y Atributos
          </h2>
          <p className="text-secondary mb-4">
            Valore del <strong>1 (Nada en absoluto)</strong> al <strong>5 (Totalmente)</strong>
          </p>

          {renderMatrixQuestion([
            { name: '¿En qué medida describe el siguiente atributo de Rodrigo Paz Pereira?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Experiencia en gestión ]', shortLabel: 'Experiencia en gestión' },
            { name: '¿En qué medida describe el siguiente atributo de Rodrigo Paz Pereira?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Honestidad/Transparencia]', shortLabel: 'Honestidad/Transparencia' },
            { name: '¿En qué medida describe el siguiente atributo de Rodrigo Paz Pereira?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Capacidad de unir a la población]', shortLabel: 'Capacidad de unir a la población' },
            { name: '¿En qué medida describe el siguiente atributo de Rodrigo Paz Pereira?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Liderazgo fuerte/Decisivo]', shortLabel: 'Liderazgo fuerte/Decisivo' },
            { name: '¿En qué medida describe el siguiente atributo de Rodrigo Paz Pereira?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Propuestas claras y realistas]', shortLabel: 'Propuestas claras y realistas' }
          ], 'Atributos de Rodrigo Paz Pereira')}

          <p className="text-secondary mb-4 mt-4">
            Valore del <strong>1 (Nada en absoluto)</strong> al <strong>5 (Totalmente)</strong>
          </p>

          {renderMatrixQuestion([
            { name: '¿En qué medida describe el siguiente atributo de Jorge Quiroga Ramírez?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Experiencia en gestión ]', shortLabel: 'Experiencia en gestión' },
            { name: '¿En qué medida describe el siguiente atributo de Jorge Quiroga Ramírez?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Honestidad/Transparencia]', shortLabel: 'Honestidad/Transparencia' },
            { name: '¿En qué medida describe el siguiente atributo de Jorge Quiroga Ramírez?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Capacidad de unir a la población]', shortLabel: 'Capacidad de unir a la población' },
            { name: '¿En qué medida describe el siguiente atributo de Jorge Quiroga Ramírez?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Liderazgo fuerte/Decisivo]', shortLabel: 'Liderazgo fuerte/Decisivo' },
            { name: '¿En qué medida describe el siguiente atributo de Jorge Quiroga Ramírez?\n(1 = Nada en absoluto) a  (5 = Totalmente) [Propuestas claras y realistas]', shortLabel: 'Propuestas claras y realistas' }
          ], 'Atributos de Jorge Quiroga Ramírez')}
        </div>

        {/* SECCIÓN 5: Fuentes de Información */}
        <div className="card shadow-lg mb-5 p-4 rounded-3 gradient-border">
          <h2 className="h4 text-dark border-bottom pb-3 mb-4 fw-bold">
            5. Fuentes de Información Política
          </h2>
          
          {renderCheckboxGroup('¿Cuáles son las redes sociales por el cual recibe información de política?', '¿Cuáles son las redes sociales por el cual recibe información de política?', 
            ['TikTok', 'Facebook', 'Instagram', 'Twitter (X)', 'Reddit']
          )}

          {renderCheckboxGroup('¿Cuáles son los medios comunicación por el cual recibe información de política?', '¿Cuáles son los medios de comunicación por el cual recibe información de política?',
            ['Televisión', 'Radio', 'Periódico', 'Prensa en linea']
          )}

          {renderCheckboxGroup('¿Cuáles son los medios de vinculo social por el cual recibe información de política?', '¿Cuáles son los medios de vínculo social por el cual recibe información de política?',
            ['Familiares', 'Amigos', 'Conocidos en el trabajo']
          )}

          {renderSelect('¿Con qué frecuencia interactúa con contenidos políticos en redes sociales?', '¿Con qué frecuencia interactúa con contenidos políticos en redes sociales?', [
            'Diario', 'Semanal', 'Ocasional', 'Nunca'
          ])}

          {renderSelect('¿A quién considera más influyente en su decisión política?', '¿A quién considera más influyente en su decisión política?', [
            'Familia', 'Amigos', 'Redes sociales', 'Medios de comunicación tradicional'
          ])}

          {renderScale('Nivel de confianza en encuestas publicadas en medios digitales', 'Nivel de confianza en encuestas publicadas en medios digitales', '1 = Muy baja', '5 = Muy alta')}

          {renderSelect('¿Cree que los debates podrían hacerle reconsiderar su actual preferencia de voto?', '¿Cree que los debates podrían hacerle reconsiderar su actual preferencia de voto?', ['Si', 'No'])}
        </div>

        {/* SECCIÓN 6: Expectativas */}
        <div className="card shadow-lg mb-5 p-4 rounded-3 gradient-border">
          <h2 className="h4 text-dark border-bottom pb-3 mb-4 fw-bold">
            6. Expectativas Post-Elección
          </h2>
          
          {renderScale('Percepción de estabilidad política futura tras la segunda vuelta', 'Percepción de estabilidad política futura tras la segunda vuelta', '1 = Muy inestable', '5 = Muy estable')}

          {renderScale('Expectativa personal sobre mejora del País si GANA Rodrigo Paz Pereira', 'Expectativa personal sobre mejora del País si GANA Rodrigo Paz Pereira', '1 = Empeorará mucho', '5 = Mejorará mucho')}

          {renderScale('Expectativa personal sobre mejora del País si GANA Jorge Quiroga Ramírez', 'Expectativa personal sobre mejora del País si GANA Jorge Quiroga Ramírez', '1 = Empeorará mucho', '5 = Mejorará mucho')}
        </div>

        {/* BOTÓN DE ENVÍO */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg fw-bold px-5 py-3 shadow-lg"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Procesando...
              </>
            ) : (
              'FINALIZAR Y ENVIAR'
            )}
          </button>
        </div>
          
      <footer className="text-center text-muted small mt-4">
        <p className="mb-0">* Campos obligatorios. Desarrollado para análisis de percepción política.</p>
      </footer>  
    </div>
    </form>  
  );
};

export default SurveyForm;