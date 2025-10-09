// src/components/SurveyForm.jsx
import React from 'react';

const SurveyForm = ({ formData, handleInputChange, handleSubmit, loading }) => {
  
  const renderSlider = (name, label, min = 1, max = 5, leftLabel = '1', rightLabel = '5') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="range"
        name={name}
        min={min}
        max={max}
        value={formData[name]}
        onChange={handleInputChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-xs text-gray-600 mt-1">
        <span>{leftLabel}</span>
        <span className="font-semibold text-blue-600 text-base">{formData[name]}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      
      {/* Sección 1: Datos Demográficos */}
      <div className="border-b pb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Datos Demográficos</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Qué edad tienes? *
            </label>
            <select
              name="edad"
              value={formData.edad}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona una opción</option>
              <option value="18 a 24">18 a 24</option>
              <option value="25 a 30">25 a 30</option>
              <option value="30 a 45">30 a 45</option>
              <option value="46 en adelante">46 en adelante</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Género *
            </label>
            <select
              name="genero"
              value={formData.genero}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona una opción</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Prefiero no decirlo">Prefiero no decirlo</option>
              <option value="No Binario">No Binario</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad/Departamento de residencia *
            </label>
            <select
              name="departamento"
              value={formData.departamento}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona una opción</option>
              <option value="La Paz">La Paz</option>
              <option value="Santa Cruz">Santa Cruz</option>
              <option value="Cochabamba">Cochabamba</option>
              <option value="Chuquisaca">Chuquisaca</option>
              <option value="Tarija">Tarija</option>
              <option value="Pando">Pando</option>
              <option value="Beni">Beni</option>
              <option value="Potosi">Potosi</option>
              <option value="Oruro">Oruro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Localidad/Provincia de origen *
            </label>
            <input
              type="text"
              name="localidad"
              value={formData.localidad}
              onChange={handleInputChange}
              required
              placeholder="Ej: Cliza, Punata, Chapare"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tu vivienda donde reside actualmente es *
            </label>
            <select
              name="vivienda"
              value={formData.vivienda}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona una opción</option>
              <option value="Alquiler">Alquiler</option>
              <option value="Anticrético">Anticrético</option>
              <option value="Propia">Propia</option>
              <option value="Familiar">Familiar</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Situación Educativa *
            </label>
            <select
              name="situacionEducativa"
              value={formData.situacionEducativa}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona una opción</option>
              <option value="Estudiante Universitario">Estudiante Universitario</option>
              <option value="Recién Profesionalizado">Recién Profesionalizado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Menciona la carrera que estudias o estudiaste? *
            </label>
            <input
              type="text"
              name="carrera"
              value={formData.carrera}
              onChange={handleInputChange}
              required
              placeholder="Ej: Ingeniería de Sistemas"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estrato Socioeconómico Percibido *
            </label>
            <select
              name="estratoSocioeconomico"
              value={formData.estratoSocioeconomico}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona una opción</option>
              <option value="Bajo">Bajo (Luchando para cubrir necesidades básicas)</option>
              <option value="Medio-Bajo">Medio-Bajo (Cubriendo necesidades, pocos ahorros)</option>
              <option value="Medio">Medio (Vida cómoda, capacidad de ahorro)</option>
              <option value="Medio-Alto">Medio-Alto (Ingresos significativos, estabilidad)</option>
              <option value="Alto">Alto (Ingresos altos)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estatus Laboral *
            </label>
            <select
              name="estatusLaboral"
              value={formData.estatusLaboral}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona una opción</option>
              <option value="Desempleado">Desempleado</option>
              <option value="Empleado Empresa Privada">Empleado Empresa Privada</option>
              <option value="Empleado Institución Pública">Empleado Institución Pública</option>
              <option value="Freelance">Freelance</option>
              <option value="Emprendedor">Emprendedor</option>
              <option value="Innovador">Innovador</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ha votado en elecciones presidenciales previas *
            </label>
            <select
              name="haVotado"
              value={formData.haVotado}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona una opción</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
              <option value="No recuerdo">No recuerdo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sección 2: Intención de Voto */}
      <div className="border-b pb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Intención de Voto</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Si las elecciones fueran mañana, ¿por qué candidato votarías? *
            </label>
            <select
              name="candidatoVoto"
              value={formData.candidatoVoto}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona una opción</option>
              <option value="Candidato Jorge Quiroga Ramirez (Derecha)">Jorge Quiroga Ramírez</option>
              <option value="Candidato Rodrigo Paz Pereira (Izquierda)">Rodrigo Paz Pereira</option>
              <option value="Voto Blanco">Voto Blanco</option>
              <option value="Voto Nulo">Voto Nulo</option>
              <option value="Aun no lo decido">Aún no lo decido</option>
            </select>
          </div>

          {renderSlider('seguridadEleccion', '¿Qué tan seguro está de su elección? *', 1, 5, '1 - Nada', '5 - Muy seguro')}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Con qué tendencia política se identifica más personalmente? *
            </label>
            <select
              name="tendenciaPolitica"
              value={formData.tendenciaPolitica}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona una opción</option>
              <option value="Izquierda">Izquierda</option>
              <option value="Centro-Izquierda">Centro-Izquierda</option>
              <option value="Centro">Centro</option>
              <option value="Centro-Derecha">Centro-Derecha</option>
              <option value="Derecha Conservadora">Derecha Conservadora</option>
            </select>
          </div>

          {renderSlider('probabilidadConvencer', '¿Qué probabilidad crees que tienes para convencer a otra persona de cambiar su voto? *', 1, 5, '1 - Baja', '5 - Alta')}
          {renderSlider('intensidadIdentificacion', '¿Con qué intensidad se identifica con la ideología del candidato que apoya? *', 1, 5, '1 - Baja', '5 - Alta')}
        </div>
      </div>

      {/* Sección 3: Relevancia de Temas */}
      <div className="border-b pb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Relevancia de los temas en su elección
        </h2>
        <p className="text-sm text-gray-600 mb-4">(1 = Nada Importante, 5 = Muy Importante)</p>
        
        <div className="space-y-4">
          {renderSlider('economia', 'Economía: Estabilidad, Empleo, Deuda', 1, 5, '1', '5')}
          {renderSlider('educacion', 'Educación: Calidad universitaria, Acceso a becas', 1, 5, '1', '5')}
          {renderSlider('corrupcion', 'Lucha contra la Corrupción y Justicia', 1, 5, '1', '5')}
          {renderSlider('salud', 'Acceso a servicios: Salud Pública', 1, 5, '1', '5')}
          {renderSlider('seguridad', 'Seguridad ciudadana', 1, 5, '1', '5')}
          {renderSlider('climaAmbiente', 'Cambio Climático y Medio Ambiente', 1, 5, '1', '5')}
          {renderSlider('derechosSociales', 'Derechos Sociales/Minorías: Temas de género, indígenas', 1, 5, '1', '5')}
          {renderSlider('modeloDesarrollo', 'Modelo de Desarrollo del País: Estatismo vs. Mercado', 1, 5, '1', '5')}
          {renderSlider('migracion', 'Migración laboral juvenil', 1, 5, '1', '5')}
          {renderSlider('innovacion', 'Propuestas de innovación y tecnología', 1, 5, '1', '5')}
        </div>
      </div>

      {/* Sección 4: Atributos Rodrigo Paz Pereira */}
      <div className="border-b pb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Atributos de Rodrigo Paz Pereira
        </h2>
        <p className="text-sm text-gray-600 mb-4">(1 = Nada en absoluto, 5 = Totalmente)</p>
        
        <div className="space-y-4">
          {renderSlider('pazExperiencia', 'Experiencia en gestión', 1, 5, '1', '5')}
          {renderSlider('pazHonestidad', 'Honestidad/Transparencia', 1, 5, '1', '5')}
          {renderSlider('pazUnion', 'Capacidad de unir a la población', 1, 5, '1', '5')}
          {renderSlider('pazLiderazgo', 'Liderazgo fuerte/Decisivo', 1, 5, '1', '5')}
          {renderSlider('pazPropuestas', 'Propuestas claras y realistas', 1, 5, '1', '5')}
        </div>
      </div>

      {/* Sección 5: Atributos Jorge Quiroga */}
      <div className="border-b pb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Atributos de Jorge Quiroga Ramírez
        </h2>
        <p className="text-sm text-gray-600 mb-4">(1 = Nada en absoluto, 5 = Totalmente)</p>
        
        <div className="space-y-4">
          {renderSlider('quirogaExperiencia', 'Experiencia en gestión', 1, 5, '1', '5')}
          {renderSlider('quirogaHonestidad', 'Honestidad/Transparencia', 1, 5, '1', '5')}
          {renderSlider('quirogaUnion', 'Capacidad de unir a la población', 1, 5, '1', '5')}
          {renderSlider('quirogaLiderazgo', 'Liderazgo fuerte/Decisivo', 1, 5, '1', '5')}
          {renderSlider('quirogaPropuestas', 'Propuestas claras y realistas', 1, 5, '1', '5')}
        </div>
      </div>

      {/* Sección 6: Medios de Información */}
      <div className="border-b pb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Medios de Información
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Cuáles son las redes sociales por el cual recibe información de política?
            </label>
            <div className="space-y-2">
              {['TikTok', 'Facebook', 'Instagram', 'Twitter (X)', 'Reddit'].map((red) => (
                <label key={red} className="flex items-center">
                  <input
                    type="checkbox"
                    name="redesSociales"
                    value={red}
                    checked={formData.redesSociales.includes(red)}
                    onChange={handleInputChange}
                    className="mr-2 h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="text-sm">{red}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Cuáles son los medios comunicación por el cual recibe información de política?
            </label>
            <div className="space-y-2">
              {['Televisión', 'Radio tradicional', 'Prensa en linea', 'Periódico'].map((medio) => (
                <label key={medio} className="flex items-center">
                  <input
                    type="checkbox"
                    name="mediosComunicacion"
                    value={medio}
                    checked={formData.mediosComunicacion.includes(medio)}
                    onChange={handleInputChange}
                    className="mr-2 h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="text-sm">{medio}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Cuáles son los medios de vínculo social por el cual recibe información de política?
            </label>
            <div className="space-y-2">
              {['Familiares', 'Amigos', 'Conocidos en el trabajo'].map((vinculo) => (
                <label key={vinculo} className="flex items-center">
                  <input
                    type="checkbox"
                    name="vinculoSocial"
                    value={vinculo}
                    checked={formData.vinculoSocial.includes(vinculo)}
                    onChange={handleInputChange}
                    className="mr-2 h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="text-sm">{vinculo}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Con qué frecuencia interactúa con contenidos políticos en redes sociales? *
            </label>
            <select
              name="frecuenciaInteraccion"
              value={formData.frecuenciaInteraccion}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona una opción</option>
              <option value="Nunca">Nunca</option>
              <option value="Ocasional">Ocasional</option>
              <option value="Semanal">Semanal</option>
              <option value="Diario">Diario</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿A quién considera más influyente en su decisión política? *
            </label>
            <select
              name="influyenteDecision"
              value={formData.influyenteDecision}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona una opción</option>
              <option value="Familia">Familia</option>
              <option value="Amigos">Amigos</option>
              <option value="Redes sociales">Redes sociales</option>
              <option value="Medios de comunicación tradicional">Medios de comunicación tradicional</option>
              <option value="Familia, Amigos">Familia, Amigos</option>
              <option value="Familia, Redes sociales">Familia, Redes sociales</option>
              <option value="Familia, Amigos, Redes sociales">Familia, Amigos, Redes sociales</option>
            </select>
          </div>

          {renderSlider('confianzaEncuestas', 'Nivel de confianza en encuestas publicadas en medios digitales *', 1, 5, '1 - Baja', '5 - Alta')}
        </div>
      </div>

      {/* Sección 7: Expectativas y Percepción */}
      <div className="pb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Expectativas y Percepción
        </h2>
        
        <div className="space-y-4">
          {renderSlider('estabilidadPolitica', 'Percepción de estabilidad política futura tras la segunda vuelta *', 1, 5, '1 - Muy inestable', '5 - Muy estable')}
          {renderSlider('expectativaPaz', 'Expectativa personal sobre mejora del País si GANA Rodrigo Paz Pereira *', 1, 5, '1 - Empeorará', '5 - Mejorará mucho')}
          {renderSlider('expectativaQuiroga', 'Expectativa personal sobre mejora del País si GANA Jorge Quiroga Ramírez *', 1, 5, '1 - Empeorará', '5 - Mejorará mucho')}
        </div>
      </div>

      {/* Botón de Envío */}
      <div className="flex justify-center pt-6">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              <span>Enviar Encuesta</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default SurveyForm;