import React, { useState } from 'react';
import { usePetContext } from '../context/PetContext';
import { GoogleGenAI } from '@google/genai';
import { Bot, Sparkles, Send, X, AlertCircle, Utensils, HeartPulse, Key } from 'lucide-react';

export const GeminiAssistantModal: React.FC = () => {
  const { isGeminiAssistantOpen, setIsGeminiAssistantOpen, selectedPet } = usePetContext();
  const [activeTab, setActiveTab] = useState<'chat' | 'food'>('chat');
  const [prompt, setPrompt] = useState('');
  const [foodText, setFoodText] = useState('');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('modo_mascota_gemini_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isGeminiAssistantOpen) return null;

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('modo_mascota_gemini_key', key);
    setShowKeyInput(false);
  };

  const getAiResponse = async (userPrompt: string, systemContext: string) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    const savedKey = localStorage.getItem('modo_mascota_gemini_key') || '';
    const processKey = typeof process !== 'undefined' ? (process as any).env?.GEMINI_API_KEY : undefined;
    const effectiveKey = apiKey || savedKey || (import.meta as any).env?.VITE_GEMINI_API_KEY || processKey;

    if (!effectiveKey) {
      // Fallback simulated intelligent response if no API key is provided
      setTimeout(() => {
        setLoading(false);
        setResponse(
          `🐾 **Respuesta de la Guía Veterinaria (Modo Demostración):**\n\n` +
          `Para **${selectedPet?.name || 'tu mascota'}** (${selectedPet?.species || 'Mascota'}, ${selectedPet?.weight || 5}kg):\n\n` +
          `1. **Recomendación principal:** Mantén agua fresca a libre disposición y monitorea su nivel de energía y apetito.\n` +
          `2. **Atención:** Si observas decaimiento, vómitos repetidos o falta de apetito por más de 24 horas, consulta de inmediato a tu veterinario de confianza.\n` +
          `3. **Nutrición:** Procura alimentos con proteína de alta calidad como primer ingrediente.\n\n` +
          `*(Consejo: Puedes ingresar tu propia API Key de Google Gemini de forma privada en el botón 🔑 para obtener respuestas 100% personalizadas en tiempo real).*`
        );
      }, 1000);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: effectiveKey });
      const fullPrompt = `${systemContext}\n\nMascota: ${selectedPet?.name || 'Mascota'} (${selectedPet?.species || 'Animal'}, ${selectedPet?.breed || 'Mestizo'}, ${selectedPet?.weight || 5}kg, ${selectedPet?.approximate_age || '1 año'}).\nPregunta: ${userPrompt}`;
      
      let text = '';
      try {
        const res = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: fullPrompt,
        });
        text = res.text || '';
      } catch (firstErr) {
        // Fallback to gemini-2.0-flash if gemini-2.5-flash has temporary unavailability
        const res = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: fullPrompt,
        });
        text = res.text || '';
      }

      setResponse(text || 'No se recibió respuesta del modelo de IA.');
    } catch (err: any) {
      console.error('Gemini error:', err);
      setError(err?.message || 'Error al comunicarse con la IA de Gemini. Revisa que tu API Key sea válida.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;
    const sys = `Eres "Dr. Mascotas AI", un asistente experto en medicina veterinaria, nutrición animal y bienestar de mascotas. Brinda respuestas claras, empáticas y formateadas con viñetas en español. Recuerda siempre recomendar visitar al veterinario para diagnósticos graves.`;
    getAiResponse(prompt, sys);
  };

  const handleAnalyzeFood = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!foodText.trim()) return;
    const sys = `Eres un experto nutricionista veterinario. Analiza la lista de ingredientes o marca de croquetas/alimento proporcionada. Evalúa la calidad proteica, carbohidratos, aditivos artificiales y da un veredicto (Excelente, Aceptable o No Recomendado) con recomendaciones.`;
    getAiResponse(`Analiza este alimento o lista de ingredientes: ${foodText}`, sys);
  };

  const quickPrompts = [
    `¿Qué vacunas necesita mi ${selectedPet?.species || 'perro'}?`,
    `¿Cómo saber si mi ${selectedPet?.species || 'mascota'} tiene dolor?`,
    `Alimentos prohibidos para ${selectedPet?.species || 'perros'}`,
    `¿Cuántas veces al día debe comer?`,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-emerald-100 dark:border-slate-800">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-5 text-white flex justify-between items-center relative overflow-hidden">
          <div className="flex items-center space-x-3 z-10">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
              <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                Asistente Vet-AI <span className="text-xs bg-yellow-400 text-slate-900 font-extrabold px-2 py-0.5 rounded-full">Gemini</span>
              </h3>
              <p className="text-xs text-emerald-100">Consultas veterinarias y nutricionales 24/7</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 z-10">
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              title="Configurar Gemini API Key"
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors text-white"
            >
              <Key className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsGeminiAssistantOpen(false)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* API Key Modal Banner */}
        {showKeyInput && (
          <div className="bg-emerald-50 dark:bg-slate-800 p-4 border-b border-emerald-200 dark:border-slate-700 flex flex-col gap-2">
            <label className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
              Clave de API de Google Gemini (Opcional):
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="flex-1 px-3 py-2 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              />
              <button
                onClick={() => saveApiKey(apiKey)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium text-sm hover:bg-emerald-700"
              >
                Guardar
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <button
            onClick={() => { setActiveTab('chat'); setResponse(null); setError(null); }}
            className={`flex-1 py-3 px-4 font-semibold text-sm flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'chat'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <HeartPulse className="w-4 h-4" /> Consulta Médica & Conducta
          </button>
          <button
            onClick={() => { setActiveTab('food'); setResponse(null); setError(null); }}
            className={`flex-1 py-3 px-4 font-semibold text-sm flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'food'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <Utensils className="w-4 h-4" /> Analizador de Alimentos
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {activeTab === 'chat' ? (
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Preguntas sugeridas sobre <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedPet?.name}</span>:
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {quickPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setPrompt(qp); getAiResponse(qp, `Eres Vet-AI experto.`); }}
                    className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-slate-800 dark:text-emerald-300 dark:hover:bg-slate-700 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-slate-700 transition-all text-left"
                  >
                    💡 {qp}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder={`Escribe tu duda sobre el cuidado de ${selectedPet?.name || 'tu mascota'}...`}
                  className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-2xl flex items-center gap-2 transition-all shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Ingresa la marca de alimento o copia la lista de ingredientes:
              </label>
              <textarea
                rows={3}
                value={foodText}
                onChange={e => setFoodText(e.target.value)}
                placeholder="Ejemplo: Harina de pollo, maíz entero, trigo grano entero, grasa de pollo preservada con tocoferoles..."
                className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm mb-3"
              />
              <button
                onClick={handleAnalyzeFood}
                disabled={loading || !foodText.trim()}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-md"
              >
                <Utensils className="w-4 h-4" /> Analizar Calidad Nutricional
              </button>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="p-6 bg-emerald-50/50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center gap-3 border border-emerald-100 dark:border-slate-700">
              <div className="w-6 h-6 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                Dr. Mascotas AI está consultando la información...
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 rounded-2xl flex items-start gap-3 border border-red-200 text-xs">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div>{error}</div>
            </div>
          )}

          {/* AI Response Display */}
          {response && (
            <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-850 border border-emerald-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-100 text-sm leading-relaxed shadow-xs">
              <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300 mb-2 border-b border-emerald-200 dark:border-slate-700 pb-2">
                <Bot className="w-5 h-5 text-emerald-600" />
                Respuesta del Asistente
              </div>
              <div className="whitespace-pre-wrap font-sans space-y-1">
                {response}
              </div>
            </div>
          )}
        </div>

        {/* Footer Disclaimer */}
        <div className="bg-slate-50 dark:bg-slate-950 px-6 py-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 text-center">
          ⚠️ *Las sugerencias de la IA son orientativas. Ante emergencias médicas, consulta siempre a tu veterinario.*
        </div>

      </div>
    </div>
  );
};
