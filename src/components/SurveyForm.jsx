// src/components/SurveyForm.jsx - VERSIÓN COMPLETA Y FINAL
import React from 'react';

const SurveyForm = ({ formData, handleInputChange, handleSubmit, loading }) => {
  
  // Renderizar matriz de radio buttons (estilo Google Forms)
  const renderMatrixQuestion = (questions, title, subtitle) => (
    <div className="mb-8">
      <h3 className="text-base font-normal text-gray-800 mb-2">
        {title} <span className="text-red-600">*</span>
      </h3>
      {subtitle && <p className="text-sm text-gray-600 mb-4">{subtitle}</p>}
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left p-3 font-normal text-sm text-gray-700"></th>
              {[1, 2, 3, 4, 5].map(num => (
                <th key={num} className="text-center p-3 font-normal text-sm text-gray-700 min-w-[60px]">
                  {num}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {questions.map((q, idx) => (
              <tr key={q.name} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="p-3 text-sm text-gray-800">{q.label}</td>
                {[1, 2, 3, 4, 5].map(value => (
                  <td key={value} className="text-center p-3">
                    <input
                      type="radio"
                      name={q.name}
                      value={value}
                      checked={formData[q.name] === String(value)}
                      onChange={handleInputChange}
                      required
                      className="w-5 h-5 cursor-pointer"
                      style={{ accentColor: '#673AB7' }}
                    />
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
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6 pb-20">
      
      {/* ========== SECCIÓN 1: Datos Demográficos ========== */}
      <div className="bg-white rounded-lg border-t-8 border-purple-600 shadow-sm p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-normal text-gray-800">
            Datos Demográficos y Socioeconómicos
          </h2>
          <p className="text-sm text-gray-600 mt-1">Descripción (opcional)</p>
        </div>
        
        <div className="space-y-6">
          {/* Edad */}
          <div>
            <label className="block text-base text-gray-800 mb-3">
              ¿Qué edad tienes? <span className="text-red-600">*</span>
            </label>
            <div className="space-y-2">
              {['18 a 24', '25 a 30', '30 a 45', '46 en adelante'].map((option) => (
                <label key={option} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="radio"
                    name="edad"
                    value={option}
                    checked={formData.edad === option}
                    onChange={handleInputChange}
                    required
                    className="w-5 h-5 mr-3"
                    style={{ accentColor: '#673AB7' }}
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Género */}
          <div>
            <label className="block text-base text-gray-800 mb-3">
              Género <span className="text-red-600">*</span>
            </label>
            <select
              name="genero"
              value={formData.genero}
              onChange={handleInputChange}
              required
              className="w-full md:w-1/2 px-4 py-3 border-b border-gray-400 focus:outline-none focus:border-purple-600 bg-transparent text-gray-700"
            >
              <option value="">Selecciona una opción</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>

          {/* Departamento */}
          <div>
            <label className="block text-base text-gray-800 mb-3">
              Ciudad/Departamento de residencia <span className="text-red-600">*</span>
            </label>
            <select
              name="departamento"
              value={formData.departamento}
              onChange={handleInputChange}
              required
              className="w-full md:w-1/2 px-4 py-3 border-b border-gray-400 focus:outline-none focus:border-purple-600 bg-transparent text-gray-700"
            >
              <option value="">Selecciona una opción</option>
              <option value="La Paz">La Paz</option>
              <option value="Santa Cruz">Santa Cruz</option>
              <option value="Cochabamba">Cochabamba</option>
              <option value="Chuquisaca">Chuquisaca</option>
              <option value="Tarija">Tarija</option>
              <option value="Pando">Pando</option>
              <option value="Beni">Beni</option>
              <option value="Potosi">Potosí</option>
              <option value="Oruro">Oruro</option>
            </select>
          </div>

          {/* Localidad */}
          <div>
            <label className="block text-base text-gray-800 mb-3">
              Localidad/Provincia de origen <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="localidad"
              value={formData.localidad}
              onChange={handleInputChange}
              required
              placeholder="Ej: Cliza, Punata, Chapare"
              className="w-full md:w-1/2 px-4 py-3 border-b border-gray-400 focus:outline-none focus:border-purple-600 bg-transparent text-gray-700"
            />
          </div>

          {/* Vivienda */}
          <div>
            <label className="block text-base text-gray-800 mb-3">
              Tu vivienda donde reside actualmente es <span className="text-red-600">*</span>
            </label>
            <select
              name="vivienda"
              value={formData.vivienda}
              onChange={handleInputChange}
              required
              className="w-full md:w-1/2 px-4 py-3 border-b border-gray-400 focus:outline-none focus:border-purple-600 bg-transparent text-gray-700"
            >
              <option value="">Selecciona una opción</option>
              <option value="Alquiler">Alquiler</option>
              <option value="Anticrético">Anticrético</option>
              <option value="Propia">Propia</option>
              <option value="Familiar">Familiar</option>
            </select>
          </div>

          {/* Situación Educativa */}
          <div>
            <label className="block text-base text-gray-800 mb-3">
              Situación Educativa <span className="text-red-600">*</span>
            </label>
            <select
              name="situacionEducativa"
              value={formData.situacionEducativa}
              onChange={handleInputChange}
              required
              className="w-full md:w-1/2 px-4 py-3 border-b border-gray-400 focus:outline-none focus:border-purple-600 bg-transparent text-gray-700"
            >
              <option value="">Selecciona una opción</option>
              <option value="Estudiante Universitario">Estudiante Universitario</option>
              <option value="Recién Profesionalizado">Recién Profesionalizado</option>
            </select>
          </div>

          {/* Carrera */}
          <div>
            <label className="block text-base text-gray-800 mb-3">
              ¿Menciona la carrera que estudias o estudiaste? <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="carrera"
              value={formData.carrera}
              onChange={handleInputChange}
              required
              placeholder="Ej: Ingeniería de Sistemas"
              className="w-full md:w-1/2 px-4 py-3 border-b border-gray-400 focus:outline-none focus:border-purple-600 bg-transparent text-gray-700"
            />
          </div>

          {/* Estrato Socioeconómico */}
          <div>
            <label className="block text-base text-gray-800 mb-3">
              Estrato Socioeconómico Percibido <span className="text-red-600">*</span>
            </label>
            <select
              name="estratoSocioeconomico"
              value={formData.estratoSocioeconomico}
              onChange={handleInputChange}
              required
              className="w-full md:w-1/2 px-4 py-3 border-b border-gray-400 focus:outline-none focus:border-purple-600 bg-transparent text-gray-700"
            >
              <option value="">Selecciona una opción</option>
              <option value="Bajo">Bajo (Luchando para cubrir necesidades básicas)</option>
              <option value="Medio-Bajo">Medio-Bajo (Cubriendo necesidades, pocos ahorros)</option>
              <option value="Medio">Medio (Vida cómoda, capacidad de ahorro)</option>
              <option value="Medio-Alto">Medio-Alto (Ingresos significativos, estabilidad)</option>
              <option value="Alto">Alto (Ingresos altos)</option>
            </select>
          </div>

          {/* Estatus Laboral */}
          <div>
            <label className="block text-base text-gray-800 mb-3">
              Estatus Laboral <span className="text-red-600">*</span>
            </label>
            <select
              name="estatusLaboral"
              value={formData.estatusLaboral}
              onChange={handleInputChange}
              required
              className="w-full md:w-1/2 px-4 py-3 border-b border-gray-400 focus:outline-none focus:border-purple-600 bg-transparent text-gray-700"
            >
              <option value="">Selecciona una opción</option>
              <option value="Empleado Institución Pública">Empleado Institución Pública</option>
              <option value="Empleado Empresa Privada">Empleado Empresa Privada</option>
              <option value="Desempleado">Desempleado</option>
              <option value="Emprendedor">Emprendedor</option>
              <option value="Freelance">Freelance</option>
              <option value="Innovador">Innovador</option>
            </select>
          </div>

          {/* Ha votado */}
          <div>
            <label className="block text-base text-gray-800 mb-3">
              Ha votado en elecciones presidenciales previas <span className="text-red-600">*</span>
            </label>
            <select
              name="haVotado"
              value={formData.haVotado}
              onChange={handleInputChange}
              required
              className="w-full md:w-1/2 px-4 py-3 border-b border-gray-400 focus:outline-none focus:border-purple-600 bg-transparent text-gray-700"
            >
              <option value="">Selecciona una opción</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>
      </div>

      {/* ========== SECCIÓN 2: Intención de Voto ========== */}
      <div className="bg-white rounded-lg border-t-8 border-purple-600 shadow-sm p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-normal text-gray-800">Intención de Voto</h2>
        </div>
        
        <div className="space-y-6">
          {/* Candidato */}
          <div>
            <label className="block text-base text-gray-800 mb-3">
              Si las elecciones fueran mañana, ¿por qué candidato votarías? <span className="text-red-600">*</span>
            </label>
            <select
              name="candidatoVoto"
              value={formData.candidatoVoto}
              onChange={handleInputChange}
              required
              className="w-full md:w-1/2 px-4 py-3 border-b border-gray-400 focus:outline-none focus:border-purple-600 bg-transparent text-gray-700"
            >
              <option value="">Selecciona una opción</option>
              <option value="Candidato Rodrigo Paz Pereira (Izquierda)">Rodrigo Paz Pereira</option>
              <option value="Candidato Jorge Quiroga Ramirez (Derecha)">Jorge Quiroga Ramírez</option>
              <option value="Voto Blanco">Voto Blanco</option>
              <option value="Voto Nulo">Voto Nulo</option>
              <option value="Aun no lo decido">Aún no lo decido</option>
            </select>
          </div>

          {/* Seguridad elección */}
          <div>
            <label className="block text-base text-gray-800 mb-3">
              ¿Qué tan seguro está de su elección? <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center gap-6 justify-center">
              <span className="text-sm text-gray-600">(1 = Poco)</span>
              {[1, 2, 3, 4, 5].map(value => (
                <label key={value} className="flex flex-col items-center cursor-pointer">
                  <span className="text-sm text-gray-600 mb-2">{value}</span>
                  <input
                    type="radio"
                    name="seguridadEleccion"
                    value={value}
                    checked={formData.seguridadEleccion === String(value)}
                    onChange={handleInputChange}
                    required
                    className="w-5 h-5"
                    style={{ accentColor: '#673AB7' }}
                  />
                </label>
              ))}
              <span className="text-sm text-gray-600">(5 = Mucho)</span>
            </div>
          </div>

          {/* Tendencia Política */}
          <div>
            <label className="block text-base text-gray-800 mb-3">
              ¿Con qué tendencia política se identifica más personalmente? <span className="text-red-600">*</span>
            </label>
            <select
              name="tendenciaPolitica"
              value={formData.tendenciaPolitica}
              onChange={handleInputChange}
              required
              className="w-full md:w-1/2 px-4 py-3 border-b border-gray-400 focus:outline-none focus:border-purple-600 bg-transparent text-gray-700"
            >
              <option value="">Selecciona una opción</option>
              <option value="Izquierda">Izquierda</option>
              <option value="Centro-Izquierda">Centro-Izquierda</option>
              <option value="Centro">Centro</option>
              <option value="Centro-Derecha">Centro-Derecha</option>
              <option value="Derecha Conservadora">Derecha Conservadora</option>
            </select>
          </div>

          {/* Probabilidad convencer */}
          <div>
            <label className="block text-base text-gray-800 mb-3">
              ¿Qué probabilidad crees que tienes para convencer a otra persona de cambiar su voto? <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center gap-6 justify-center">
              <span className="text-sm text-gray-600 whitespace-nowrap">(1 = Poco probable)</span>
              {[1, 2, 3, 4, 5].map(value => (
                <label key={value} className="flex flex-col items-center cursor-pointer">
                  <span className="text-sm text-gray-600 mb-2">{value}</span>
                  <input
                    type="radio"
                    name="probabilidadConvencer"
                    value={value}
                    checked={formData.probabilidadConvencer === String(value)}
                    onChange={handleInputChange}
                    required
                    className="w-5 h-5"
                    style={{ accentColor: '#673AB7' }}
                  />
                </label>
              ))}
              <span className="text-sm text-gray-600 whitespace-nowrap">(5 = Muy probable)</span>
            </div>
          </div>

          {/* Intensidad identificación */}
          <div>
            <label className="block text-base text-gray-800 mb-3">
              ¿Con qué intensidad se identifica con la ideología del candidato que apoya? <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center gap-6 justify-center">
              <span className="text-sm text-gray-600">(1 = Poco)</span>
              {[1, 2, 3, 4, 5].map(value => (
                <label key={value} className="flex flex-col items-center cursor-pointer">
                  <span className="text-sm text-gray-600 mb-2">{value}</span>
                  <input
                    type="radio"
                    name="intensidadIdentificacion"
                    value={value}
                    checked={formData.intensidadIdentificacion === String(value)}
                    onChange={handleInputChange}
                    required
                    className="w-5 h-5"
                    style={{ accentColor: '#673AB7' }}
                  />
                </label>
              ))}
              <span className="text-sm text-gray-600">(5 = Mucho)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========== SECCIÓN 3: Relevancia de Temas (MATRIZ) ========== */}
      <div className="bg-white rounded-lg border-t-8 border-purple-600 shadow-sm p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-normal text-gray-800">
            Relevancia de los temas en su elección
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            (1 = Nada Importante) a (5 = Muy Importante)
          </p>
        </div>

        {renderMatrixQuestion([
          { name: 'economia', label: 'Economía: Estabilidad, Empleo, Deuda' },
          { name: 'educacion', label: 'Educación: Calidad universitaria, Acceso a becas' },
          { name: 'corrupcion', label: 'Lucha contra la Corrupción y Justicia' },
          { name: 'salud', label: 'Acceso a servicios: Salud Pública' },
          { name: 'seguridad', label: 'Seguridad ciudadana' },
          { name: 'climaAmbiente', label: 'Cambio Climático y Medio Ambiente' },
          { name: 'derechosSociales', label: 'Derechos Sociales/Minorías: Temas de género, indígenas' },
          { name: 'modeloDesarrollo', label: 'Modelo de Desarrollo del País: Estatismo vs. Mercado' },
          { name: 'migracion', label: 'Migración laboral juvenil' },
          { name: 'innovacion', label: 'Propuestas de innovación y tecnología' }
        ], 'Relevancia de los temas')}
      </div>

      {/* ========== SECCIÓN 4: Atributos Rodrigo Paz Pereira ========== */}
      <div className="bg-white rounded-lg border-t-8 border-purple-600 shadow-sm p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-normal text-gray-800">
            Percepción de Candidatos - Rodrigo Paz Pereira
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            (1 = Nada en absoluto) a (5 = Totalmente)
          </p>
        </div>

        {renderMatrixQuestion([
          { name: 'pazExperiencia', label: 'Experiencia en gestión' },
          { name: 'pazHonestidad', label: 'Honestidad/Transparencia' },
          { name: 'pazUnion', label: 'Capacidad de unir a la población' },
          { name: 'pazLiderazgo', label: 'Liderazgo fuerte/Decisivo' },
          { name: 'pazPropuestas', label: 'Propuestas claras y realistas' }
        ], 'Atributos de Rodrigo Paz Pereira')}
      </div>

      {/* ========== SECCIÓN 5: Atributos Jorge Quiroga ========== */}
      <div className="bg-white rounded-lg border-t-8 border-purple-600 shadow-sm p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-normal text-gray-800">
            Percepción de Candidatos - Jorge Quiroga Ramírez
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            (1 = Nada en absoluto) a (5 = Totalmente)
          </p>
        </div>

        {renderMatrixQuestion([
          { name: 'quirogaExperiencia', label: 'Experiencia en gestión' },
          { name: 'quirogaHonestidad', label: 'Honestidad/Transparencia' },
          { name: 'quirogaUnion', label: 'Capacidad de unir a la población' },
          { name: 'quirogaLiderazgo', label: 'Liderazgo fuerte/Decisivo' },
          { name: 'quirogaPropuestas', label: 'Propuestas claras y realistas' }
        ], 'Atributos de Jorge Quiroga Ramírez')}
      </div>

      {/* ========== SECCIÓN 6: Medios de Información ========== */}
      <div className="bg-white rounded-lg border-t-8 border-purple-600 shadow-sm p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-normal text-gray-800">
            Fuentes de Información Política
          </h2>
        </div>
        
        <div className="space-y-6">
          {/* Redes Sociales */}
          <div>
            <label className="block text-base text-gray-800 mb-3">
              ¿Cuáles son las redes sociales por el cual recibe información de política?
            </label>
            <div className="space-y-2">
              {['TikTok', 'Facebook', 'Instagram', 'Twitter (X)', 'Reddit'].map((red) => (
                <label key={red} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    name="redesSociales"
                    value={red}
                    checked={formData.redesSociales.includes(red)}
                    onChange={handleInputChange}
                    className="w-5 h-5 mr-3"
                    style={{ accentColor: '#673AB7' }}
                  />
                  <span className="text-sm text-gray-700">{red}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Medios de Comunicación */}
          <div>
            <label className="block text-base text-gray-800 mb-3">
              ¿Cuáles son los medios de comunicación por el cual recibe información de política?
            </label>
            <div className="space-y-2">
              {['Televisión', 'Radio tradicional', 'Prensa en linea', 'Periódico'].map((medio) => (
                <label key={medio} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    name="mediosComunicacion"
                    value={medio}
                    checked={formData.mediosComunicacion.includes(medio)}
                    onChange={handleInputChange}
                    className="w-5 h-5 mr-3"
                    style={{ accentColor: '#673AB7' }}
                  />
                  <span className="text-sm text-gray-700">{medio}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Vínculo Social */}
          <div>
            <label className="block text-base text-gray-800 mb-3">
              ¿Cuáles son los medios de vínculo social por el cual recibe información de política?
            </label>
            <div className="space-y-2">
              {['Familiares', 'Amigos', 'Conocidos en el trabajo'].map((vinculo) => (
                <label key={vinculo} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    name="vinculoSocial"
                    value={vinculo}
                    checked={formData.vinculoSocial.includes(vinculo)}
                    onChange={handleInputChange}
                    className="w-5 h-5 mr-3"
                    style={{ accentColor: '#673AB7' }}
                  />
                  <span className="text-sm text-gray-700">{vinculo}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Frecuencia Interacción */}
          <div>
            <label className="block text-base text-gray-800 mb-3">
              ¿Con qué frecuencia interactúa con contenidos políticos en redes sociales? <span className="text-red-600">*</span>
            </label>
            <select
              name="frecuenciaInteraccion"
              value={formData.frecuenciaInteraccion}
              onChange={handleInputChange}
              required
              className="w-full md:w-1/2 px-4 py-3 border-b border-gray-400 focus:outline-none focus:border-purple-600 bg-transparent text-gray-700"
            >
              <option value="">Selecciona una opción</option>
              <option value="Diario">Diario</option>
              <option value="Semanal">Semanal</option>
              <option value="Ocasional">Ocasional</option>
              <option value="Nunca">Nunca</option>
            </select>
          </div>

          {/* Influyente Decisión */}
          <div>
            <label className="block text-base text-gray-800 mb-3">
              ¿A quién considera más influyente en su decisión política? <span className="text-red-600">*</span>
            </label>
            <select
              name="influyenteDecision"
              value={formData.influyenteDecision}
              onChange={handleInputChange}
              required
              className="w-full md:w-1/2 px-4 py-3 border-b border-gray-400 focus:outline-none focus:border-purple-600 bg-transparent text-gray-700"
            >
              <option value="">Selecciona una opción</option>
              <option value="Familia">Familia</option>
              <option value="Amigos">Amigos</option>
              <option value="Redes sociales">Redes sociales</option>
              <option value="Medios de comunicación tradicional">Medios de comunicación tradicional</option>
            </select>
          </div>

          {/* Confianza Encuestas */}
          <div>
            <label className="block text-base text-gray-800 mb-3">
              Nivel de confianza en encuestas publicadas en medios digitales <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center gap-6 justify-center">
              <span className="text-sm text-gray-600">(1 = Baja)</span>
              {[1, 2, 3, 4, 5].map(value => (
                <label key={value} className="flex flex-col items-center cursor-pointer">
                  <span className="text-sm text-gray-600 mb-2">{value}</span>
                  <input
                    type="radio"
                    name="confianzaEncuestas"
                    value={value}
                    checked={formData.confianzaEncuestas === String(value)}
                    onChange={handleInputChange}
                    required
                    className="w-5 h-5"
                    style={{ accentColor: '#673AB7' }}
                  />
                </label>
              ))}
              <span className="text-sm text-gray-600">(5 = Alta)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========== SECCIÓN 7: Expectativas ========== */}
      <div className="bg-white rounded-lg border-t-8 border-purple-600 shadow-sm p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-normal text-gray-800">
            Expectativas Post-Elección
          </h2>
        </div>
        
        <div className="space-y-6">
          {/* Estabilidad Política */}
          <div>
            <label className="block text-base text-gray-800 mb-3">
              Percepción de estabilidad política futura tras la segunda vuelta <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center gap-6 justify-center">
              <span className="text-sm text-gray-600 whitespace-nowrap">(1 = Muy inestable)</span>
              {[1, 2, 3, 4, 5].map(value => (
                <label key={value} className="flex flex-col items-center cursor-pointer">
                  <span className="text-sm text-gray-600 mb-2">{value}</span>
                  <input
                    type="radio"
                    name="estabilidadPolitica"
                    value={value}
                    checked={formData.estabilidadPolitica === String(value)}
                    onChange={handleInputChange}
                    required
                    className="w-5 h-5"
                    style={{ accentColor: '#673AB7' }}
                  />
                </label>
              ))}
              <span className="text-sm text-gray-600 whitespace-nowrap">(5 = Muy estable)</span>
            </div>
          </div>

          {/* Expectativa Paz */}
          <div>
            <label className="block text-base text-gray-800 mb-3">
              Expectativa personal sobre mejora del País si GANA Rodrigo Paz Pereira <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center gap-6 justify-center">
              <span className="text-sm text-gray-600">(1 = Empeorará)</span>
              {[1, 2, 3, 4, 5].map(value => (
                <label key={value} className="flex flex-col items-center cursor-pointer">
                  <span className="text-sm text-gray-600 mb-2">{value}</span>
                  <input
                    type="radio"
                    name="expectativaPaz"
                    value={value}
                    checked={formData.expectativaPaz === String(value)}
                    onChange={handleInputChange}
                    required
                    className="w-5 h-5"
                    style={{ accentColor: '#673AB7' }}
                  />
                </label>
              ))}
              <span className="text-sm text-gray-600 whitespace-nowrap">(5 = Mejorará mucho)</span>
            </div>
          </div>

          {/* Expectativa Quiroga */}
          <div>
            <label className="block text-base text-gray-800 mb-3">
              Expectativa personal sobre mejora del País si GANA Jorge Quiroga Ramírez <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center gap-6 justify-center">
              <span className="text-sm text-gray-600">(1 = Empeorará)</span>
              {[1, 2, 3, 4, 5].map(value => (
                <label key={value} className="flex flex-col items-center cursor-pointer">
                  <span className="text-sm text-gray-600 mb-2">{value}</span>
                  <input
                    type="radio"
                    name="expectativaQuiroga"
                    value={value}
                    checked={formData.expectativaQuiroga === String(value)}
                    onChange={handleInputChange}
                    required
                    className="w-5 h-5"
                    style={{ accentColor: '#673AB7' }}
                  />
                </label>
              ))}
              <span className="text-sm text-gray-600 whitespace-nowrap">(5 = Mejorará mucho)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========== BOTÓN DE ENVÍO ========== */}
      <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-purple-600 text-white font-medium rounded hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md w-full md:w-auto"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enviando...
            </span>
          ) : (
            'Enviar'
          )}
        </button>
        <p className="text-xs text-gray-500 text-center md:text-right">
          * Indica que es una pregunta obligatoria
        </p>
      </div>
    </form>
  );
};

export default SurveyForm;