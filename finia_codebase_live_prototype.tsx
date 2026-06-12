import React, { useState, useEffect } from 'react';

// ============================================================================
// DATOS INICIALES SEMILLA (MOCK DATA)
// ============================================================================
const INITIAL_EXPENSES = [
  { id: '1', description: 'Netflix', amount: 249, date: '2026-06-10', category: 'Suscripciones', satisfaction: 'Si', recurring: true },
  { id: '2', description: 'Starbucks Café', amount: 85, date: '2026-06-11', category: 'Ocio', satisfaction: null, recurring: false, micro: true },
  { id: '3', description: 'Supermercado Walmart', amount: 1250, date: '2026-06-08', category: 'Aseo personal', satisfaction: 'Si', recurring: false },
  { id: '4', description: 'Uber de regreso', amount: 180, date: '2026-06-09', category: 'Transporte', satisfaction: 'Mas o menos', recurring: false },
  { id: '5', description: 'Disney Plus', amount: 219, date: '2026-06-01', category: 'Suscripciones', satisfaction: 'No', recurring: true },
  { id: '6', description: 'Tacos de la esquina', amount: 95, date: '2026-06-11', category: 'Comida', satisfaction: null, recurring: false, micro: true },
  { id: '7', description: 'Gimnasio Mensual', amount: 600, date: '2026-06-02', category: 'Salud', satisfaction: 'Si', recurring: true }
];

const INITIAL_GOALS = [
  { id: 'g1', name: 'Comprar una motocicleta', target: 45000, current: 12000, icon: '🏍️' },
  { id: 'g2', name: 'Nueva Laptop Pro', target: 28000, current: 14000, icon: '💻' },
  { id: 'g3', name: 'Viaje a la playa', target: 15000, current: 9500, icon: '✈️' }
];

const RECURRING_BILL_CALENDAR = [
  { id: 'c1', name: 'Internet de casa', amount: 550, dueDate: '2026-06-15', category: 'Servicios', paid: false },
  { id: 'c2', name: 'Colegiatura / Escuela', amount: 3200, dueDate: '2026-06-18', category: 'Escuela', paid: false },
  { id: 'c3', name: 'Spotify Premium', amount: 129, dueDate: '2026-06-22', category: 'Suscripciones', paid: false },
  { id: 'c4', name: 'Luz (CFE)', amount: 840, dueDate: '2026-06-25', category: 'Servicios', paid: false }
];

const ACHIEVEMENTS = [
  { id: 'a1', title: 'Planificador Novato', description: 'Registra gastos por 7 días seguidos', progress: 100, unlocked: true, icon: '🏆' },
  { id: 'a2', title: 'Cazador de Fugas', description: 'Reduce tus gastos hormiga en un 20%', progress: 65, unlocked: false, icon: '🛡️' },
  { id: 'a3', title: 'Primer Gran Ahorro', description: 'Ahorra tus primeros $5,000 MXN', progress: 100, unlocked: true, icon: '💰' },
  { id: 'a4', title: 'Conciencia Financiera', description: 'Evalúa 10 compras con "¿Valió la pena?"', progress: 40, unlocked: false, icon: '🧠' }
];

export default function App() {
  // --- Estados principales de la aplicación móvil ---
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [calendar, setCalendar] = useState(RECURRING_BILL_CALENDAR);
  const [achievements, setAchievements] = useState(ACHIEVEMENTS);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('es');
  
  // --- Estado para el formulario de nuevo gasto ---
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newCategory, setNewCategory] = useState('Ocio');
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');

  // --- Estado para el chat de IA con Gemini ---
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ia',
      text: '¡Hola! Soy FinIA, tu copiloto financiero inteligente. He analizado tus gastos de este mes. Noto que las suscripciones mensuales consumen un porcentaje alto y que tienes pequeños gastos frecuentes de café. ¿En qué puedo ayudarte hoy?'
    }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // --- Estado de Escáner de Tickets (OCR) ---
  const [scanState, setScanState] = useState('idle'); // 'idle' | 'scanning' | 'done'
  const [scannedData, setScannedData] = useState(null);

  // --- Estado de Soporte ---
  const [supportForm, setSupportForm] = useState({ name: '', email: '', type: 'Sugerencia', text: '' });
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  // --- Efecto para sugerir dinámicamente la categoría del gasto ---
  useEffect(() => {
    if (newDesc.trim().length > 3) {
      setAiSuggesting(true);
      const timer = setTimeout(() => {
        const text = newDesc.toLowerCase();
        let suggestion = 'Ocio';
        
        if (text.includes('netflix') || text.includes('disney') || text.includes('spotify') || text.includes('prime') || text.includes('game pass') || text.includes('suscrip')) {
          suggestion = 'Suscripciones';
        } else if (text.includes('uber') || text.includes('taxi') || text.includes('metro') || text.includes('camion') || text.includes('gasolina') || text.includes('pemex')) {
          suggestion = 'Transporte';
        } else if (text.includes('tacos') || text.includes('starbucks') || text.includes('caf') || text.includes('restaurante') || text.includes('comida') || text.includes('cenar') || text.includes('oxxo')) {
          suggestion = 'Comida';
        } else if (text.includes('colegio') || text.includes('escuela') || text.includes('libro') || text.includes('curso') || text.includes('universidad')) {
          suggestion = 'Escuela';
        } else if (text.includes('medico') || text.includes('farmacia') || text.includes('doctor') || text.includes('hospital') || text.includes('dentista')) {
          suggestion = 'Salud';
        } else if (text.includes('internet') || text.includes('luz') || text.includes('agua') || text.includes('gas') || text.includes('telefono')) {
          suggestion = 'Servicios';
        } else if (text.includes('jabon') || text.includes('walmart') || text.includes('shampoo') || text.includes('aseo') || text.includes('super')) {
          suggestion = 'Aseo personal';
        }
        
        setAiSuggestion(suggestion);
        setNewCategory(suggestion);
        setAiSuggesting(false);
      }, 400);

      return () => clearTimeout(timer);
    } else {
      setAiSuggestion('');
    }
  }, [newDesc]);

  // ============================================================================
  // CÁLCULOS FINANCIEROS EN TIEMPO REAL
  // ============================================================================
  const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const dailySpent = expenses.filter(e => e.date === '2026-06-11').reduce((sum, exp) => sum + Number(exp.amount), 0);
  const weeklySpent = totalSpent * 0.72; // Estimación de ejemplo para la semana actual
  const monthlySpent = totalSpent;

  // Clasificación por categoría
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const highestCategory = sortedCategories[0] ? `${sortedCategories[0][0]} ($${sortedCategories[0][1]} MXN)` : 'N/A';
  const lowestCategory = sortedCategories[sortedCategories.length - 1] ? `${sortedCategories[sortedCategories.length - 1][0]} ($${sortedCategories[sortedCategories.length - 1][1]} MXN)` : 'N/A';

  // Radar de fugas de dinero (gastos pequeños <= $100 en comida u ocio)
  const leakExpenses = expenses.filter(e => Number(e.amount) <= 100 && (e.category === 'Ocio' || e.category === 'Comida'));
  const totalLeakAmount = leakExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  // Métricas de suscripciones recurrentes
  const subscriptionsCount = expenses.filter(e => e.recurring).length;
  const subscriptionsTotal = expenses.filter(e => e.recurring).reduce((sum, exp) => sum + Number(exp.amount), 0);

  // Balance proyectado basándose en un salario ficticio de $15,000.00
  const estimatedEndBalance = 15000 - totalSpent;

  // ============================================================================
  // CONTROLADORES DE ACCIONES
  // ============================================================================
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newDesc || !newAmount) return;

    const isRecurring = ['Netflix', 'Spotify', 'Disney Plus', 'Disney', 'Game Pass', 'Suscripción'].some(sub => newDesc.toLowerCase().includes(sub.toLowerCase()));
    const isMicro = Number(newAmount) <= 100;

    const newExpObj = {
      id: Date.now().toString(),
      description: newDesc,
      amount: parseFloat(newAmount),
      date: newDate,
      category: newCategory,
      satisfaction: null,
      recurring: isRecurring,
      micro: isMicro
    };

    setExpenses([newExpObj, ...expenses]);
    setNewDesc('');
    setNewAmount('');
    setNewDate(new Date().toISOString().split('T')[0]);
    setActiveTab('dashboard');

    if (expenses.length >= 7) {
      setAchievements(prev => prev.map(a => a.id === 'a1' ? { ...a, unlocked: true } : a));
    }
  };

  const handleSatisfaction = (id, rating) => {
    setExpenses(prev => prev.map(exp => exp.id === id ? { ...exp, satisfaction: rating } : exp));
  };

  const handleSimulateScan = () => {
    setScanState('scanning');
    setTimeout(() => {
      const mockResult = {
        description: 'Supermercado Costco',
        amount: 875,
        date: '2026-06-11',
        category: 'Aseo personal',
        products: ['Papel Higiénico x12', 'Detergente Líquido', 'Paquete de Snacks']
      };
      setScannedData(mockResult);
      setScanState('done');
    }, 2000);
  };

  const handleAcceptScanned = () => {
    if (!scannedData) return;
    const newExpObj = {
      id: Date.now().toString(),
      description: scannedData.description,
      amount: scannedData.amount,
      date: scannedData.date,
      category: scannedData.category,
      satisfaction: null,
      recurring: false,
      micro: false
    };
    setExpenses([newExpObj, ...expenses]);
    setScanState('idle');
    setScannedData(null);
    setActiveTab('dashboard');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsgText = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsgText }]);
    setChatInput('');
    setIsAiTyping(true);

    const financialContext = {
      gasto_total_mes: totalSpent,
      gastos: expenses.map(e => ({ d: e.description, m: e.amount, c: e.category, sat: e.satisfaction })),
      metas: goals.map(g => ({ n: g.name, t: g.target, c: g.current })),
      fugas_estimadas: totalLeakAmount
    };

    const systemPrompt = `Eres FinIA, un coach de finanzas personales empático, analítico y directo con interfaz iOS. 
Tienes acceso en tiempo real a los siguientes datos reales del usuario actual:
${JSON.stringify(financialContext)}

Instrucciones de comportamiento:
1. Responde de forma concisa (máximo 4 párrafos cortos).
2. Usa viñetas o números para estructurar análisis numéricos.
3. Propón soluciones y planes concretos basados en los datos provistos.
4. Si el usuario te pregunta "¿puedo comprar X?", calcula dinámicamente si afecta a sus metas actuales y haz una recomendación basada en su balance estimado.
5. Usa un tono cercano pero profesional. Habla en español.`;

    try {
      const apiKey = ""; 
      const payload = {
        contents: [{ parts: [{ text: userMsgText }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
      };

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Error API");

      const result = await response.json();
      const aiResponse = result.candidates?.[0]?.content?.parts?.[0]?.text || "Disculpa, tuve un percance analizando tus datos. ¿Podrías reformular tu pregunta?";
      setChatMessages(prev => [...prev, { sender: 'ia', text: aiResponse }]);
    } catch (err) {
      setTimeout(() => {
        let aiResponse = "";
        const lowerMsg = userMsgText.toLowerCase();

        if (lowerMsg.includes('dinero') || lowerMsg.includes('por qué') || lowerMsg.includes('gasto')) {
          aiResponse = `Analizando tu patrón financiero, tienes un egreso acumulado de **$${totalSpent} MXN** este mes. Detecto dos factores clave:\n\n1. Las **suscripciones recurrentes** representan $${subscriptionsTotal} MXN.\n2. Tus **fugas de dinero** (cafés, antojos menores de $100) ya suman **$${totalLeakAmount} MXN**.\n\nTe sugiero recortar al menos una suscripción de streaming activa que califiques como "No valió la pena" para liberar presupuesto de inmediato.`;
        } else if (lowerMsg.includes('comprar') || lowerMsg.includes('audifonos') || lowerMsg.includes('gastar')) {
          aiResponse = `Si decides realizar esa compra de aproximadamente $1,500, estarías reduciendo tu balance final proyectado de **$${estimatedEndBalance} MXN** a **$${estimatedEndBalance - 1500} MXN**. Además, retrasaría tu meta activa de "**Comprar una motocicleta**" en un equivalente a 3 semanas de ahorro regular. Mi consejo: Espera 48 horas para evitar el impulso y comprueba si tu interés persiste.`;
        } else {
          aiResponse = `Entiendo perfectamente tu inquietud financiera. Actualmente, tu categoría dominante es **${sortedCategories[0]?.[0] || 'Suscripciones'}**. Si logras reajustar esta semana reduciendo un 10% tus compras no esenciales, podríamos canalizar esa diferencia de dinero directamente a tu meta de "**${goals[0]?.name}**". ¿Te gustaría que armemos un presupuesto semanal estricto para lograrlo?`;
        }
        setChatMessages(prev => [...prev, { sender: 'ia', text: aiResponse }]);
      }, 1200);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    setSupportSubmitted(true);
    setTimeout(() => {
      setSupportForm({ name: '', email: '', type: 'Sugerencia', text: '' });
      setSupportSubmitted(false);
    }, 2500);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} transition-colors duration-300 flex flex-col justify-between`}>
      
      {/* HEADER MINIMALISTA EXTERNO */}
      <header className="px-6 py-4 flex justify-between items-center bg-slate-900 text-white border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center font-bold shadow-md shadow-indigo-500/10">
            F
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight flex items-center gap-1.5">
              FinIA <span className="bg-indigo-500 text-[10px] text-white px-2 py-0.5 rounded-full font-medium">v1.2 (iOS Live)</span>
            </h1>
            <p className="text-[10px] text-slate-400">Asistente Financiero con Inteligencia Artificial</p>
          </div>
        </div>

        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold tracking-wide transition flex items-center gap-1.5"
        >
          {darkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
        </button>
      </header>

      {/* FRAME DEL DISPOSITIVO MÓVIL CENTRADO */}
      <main className="flex-1 flex items-center justify-center py-6 px-4">
        <div className="max-w-md w-full">
          
          {/* iOS SMARTPHONE CONTAINER / FRAME */}
          <div className="bg-slate-900 rounded-[50px] p-4 shadow-2xl border-4 border-slate-800 relative overflow-hidden transition-all duration-300">
            
            {/* Notch de Cámara Superior iOS */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-slate-950 rounded-full z-50 flex items-center justify-center">
              <div className="w-12 h-1 bg-slate-800 rounded-full mb-1"></div>
            </div>

            {/* Barra de Estado iOS (Hora, Batería, Señal) */}
            <div className="flex justify-between items-center px-6 pt-6 pb-2 text-xs font-bold text-slate-300 z-40 relative">
              <span>18:50</span>
              <div className="flex items-center gap-1.5">
                <span>5G</span>
                <div className="w-5 h-2.5 bg-green-500 rounded-sm relative"></div>
              </div>
            </div>

            {/* CONTENEDOR INTERNO DE LA PANTALLA MÓVIL */}
            <div className={`rounded-[36px] overflow-hidden min-h-[660px] flex flex-col justify-between ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} p-4 transition-all duration-300`}>
              
              {/* CABECERA INTERNA DE LA APP */}
              <div className="flex justify-between items-center px-2 py-3 border-b border-slate-800/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                    F
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">FinIA App</h4>
                    <p className="text-[9px] text-slate-400">Inteligencia Financiera</p>
                  </div>
                </div>
                
                {/* Selector de idioma rápido */}
                <div className="flex items-center gap-1.5 bg-slate-800/40 px-2.5 py-1 rounded-full text-xs">
                  <span className="text-[9px] text-slate-400">Idioma:</span>
                  <button 
                    onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                    className="font-bold text-indigo-400 text-[10px]"
                  >
                    {language.toUpperCase()}
                  </button>
                </div>
              </div>

              {/* AREA DE CONTENIDO DE LA PANTALLA ACTIVA */}
              <div className="flex-1 overflow-y-auto max-h-[500px] px-1 py-2 scrollbar-none">
                
                {/* ==================== PANTALLA: DASHBOARD ==================== */}
                {activeTab === 'dashboard' && (
                  <div className="space-y-4">
                    
                    {/* CARD: Balance Total */}
                    <div className="p-5 rounded-3xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden">
                      <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-white/5 rounded-full"></div>
                      <p className="text-xs uppercase tracking-wider text-indigo-200 font-medium">Balance Proyectado Fin de Mes</p>
                      <h2 className="text-3xl font-black mt-1 tracking-tight">$15,000.00 <span className="text-xs font-normal text-indigo-200">MXN</span></h2>
                      
                      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/20 text-center">
                        <div>
                          <span className="text-[10px] text-indigo-200">Gastos Día</span>
                          <p className="text-xs font-bold">${dailySpent} MXN</p>
                        </div>
                        <div className="border-l border-white/20">
                          <span className="text-[10px] text-indigo-200">Gto. Semanal</span>
                          <p className="text-xs font-bold">${weeklySpent.toFixed(0)} MXN</p>
                        </div>
                        <div className="border-l border-white/20">
                          <span className="text-[10px] text-indigo-200">Gto. Mensual</span>
                          <p className="text-xs font-bold">${monthlySpent} MXN</p>
                        </div>
                      </div>
                    </div>

                    {/* CARD: Resumen de IA en Vivo */}
                    <div className={`p-4 rounded-3xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-indigo-50 border-indigo-100'} flex gap-3`}>
                      <div className="text-xl mt-0.5">💡</div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-indigo-400">Análisis del Asistente IA</h4>
                        <p className="text-xs leading-relaxed text-slate-300">
                          "Has gastado 30% más en comida rápida este mes. Las suscripciones representan el 18% de tus gastos mensuales. Reduce cafés impulsivos y podrías ahorrar $500 MXN extras."
                        </p>
                      </div>
                    </div>

                    {/* CARD: Estructura de Gastos / Gráfico Rápido */}
                    <div className={`p-4 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-3`}>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Porcentaje por Categorías</h3>
                      <div className="space-y-2">
                        {sortedCategories.map(([category, amt]) => {
                          const pct = Math.min(100, Math.round((amt / totalSpent) * 100));
                          return (
                            <div key={category} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="font-semibold">{category}</span>
                                <span className="text-slate-400 font-medium">{pct}% (${amt} MXN)</span>
                              </div>
                              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" 
                                  style={{ width: `${pct}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* CARD: ¿VALIÓ LA PENA? (Loop de satisfacción del usuario) */}
                    <div className={`p-4 rounded-3xl border ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-amber-50/50 border-amber-100'} space-y-3`}>
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500">¿Valió la pena la compra?</h4>
                        <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full text-[9px] font-bold">Feedback IA</span>
                      </div>
                      
                      {expenses.filter(e => e.satisfaction === null).length > 0 ? (
                        <div className="space-y-2.5">
                          {expenses.filter(e => e.satisfaction === null).slice(0, 1).map((exp) => (
                            <div key={exp.id} className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="font-bold">{exp.description}</span>
                                <span className="text-slate-400">${exp.amount} MXN</span>
                              </div>
                              <p className="text-[11px] text-slate-400">¿Qué tanta satisfacción o utilidad te trajo esta compra realizada recientemente?</p>
                              <div className="grid grid-cols-3 gap-1.5 pt-1">
                                <button 
                                  onClick={() => handleSatisfaction(exp.id, 'Si')}
                                  className="py-1.5 rounded-xl bg-emerald-600/35 hover:bg-emerald-600 text-emerald-300 text-[10px] font-semibold transition"
                                >
                                  Sí, valió 🟢
                                </button>
                                <button 
                                  onClick={() => handleSatisfaction(exp.id, 'Mas o menos')}
                                  className="py-1.5 rounded-xl bg-yellow-600/35 hover:bg-yellow-600 text-yellow-300 text-[10px] font-semibold transition"
                                >
                                  Regular 🟡
                                </button>
                                <button 
                                  onClick={() => handleSatisfaction(exp.id, 'No')}
                                  className="py-1.5 rounded-xl bg-red-600/35 hover:bg-red-600 text-red-300 text-[10px] font-semibold transition"
                                >
                                  No valió 🔴
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 text-center py-2">🎉 ¡Has calificado todas tus compras recientes! FinIA está aprendiendo de tus respuestas.</p>
                      )}
                    </div>

                    {/* CARD: Radar de fugas de dinero */}
                    <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2.5">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">🕵️ Radar de Fugas de Dinero</h4>
                        <span className="bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full text-[9px] font-bold">Crítico</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Los pequeños gastos repetitivos menores de $100 (cafés, refrescos, snacks) representan un acumulado de <span className="font-bold text-rose-400">${totalLeakAmount} MXN</span> este mes.
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-1 text-center">
                        <div className="p-2 bg-slate-950 rounded-xl text-xs">
                          <span className="text-[10px] text-slate-400">Gasto Mayor Fuga</span>
                          <p className="font-bold">Starbucks Café</p>
                        </div>
                        <div className="p-2 bg-slate-950 rounded-xl text-xs">
                          <span className="text-[10px] text-slate-400">Impacto Mensual</span>
                          <p className="font-bold text-rose-400">~ $1,120 MXN</p>
                        </div>
                      </div>
                    </div>

                    {/* CARD: Lista de Gastos Recientes */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Historial Reciente</h3>
                        <span className="text-xs text-indigo-400">{expenses.length} Transacciones</span>
                      </div>
                      <div className="space-y-2">
                        {expenses.slice(0, 4).map((exp) => (
                          <div key={exp.id} className="p-3.5 bg-slate-900/50 border border-slate-800/80 rounded-2xl flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-sm">
                                {exp.category === 'Suscripciones' ? '🍿' : exp.category === 'Ocio' ? '🎮' : exp.category === 'Comida' ? '🍔' : '💼'}
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-slate-100">{exp.description}</h4>
                                <p className="text-[10px] text-slate-400">{exp.date} • {exp.category}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-black text-rose-400">-${exp.amount} MXN</p>
                              {exp.satisfaction && (
                                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${exp.satisfaction === 'Si' ? 'bg-green-500/10 text-green-400' : exp.satisfaction === 'No' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                  {exp.satisfaction === 'Si' ? 'Útil' : exp.satisfaction === 'No' ? 'Arrepentido' : 'Regular'}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* ==================== PANTALLA: REGISTRO DE GASTOS ==================== */}
                {activeTab === 'add' && (
                  <div className="space-y-4">
                    <div className="p-2">
                      <h2 className="text-xl font-bold">Registrar Gasto</h2>
                      <p className="text-xs text-slate-400">Nuestra IA auto-clasificará tu gasto mientras lo escribes.</p>
                    </div>

                    <form onSubmit={handleAddExpense} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase text-slate-400">¿Qué compraste? (Descripción)</label>
                        <input 
                          type="text"
                          required
                          placeholder="Ej: Disney Plus, Starbucks, Gasolina, Tacos..."
                          value={newDesc}
                          onChange={(e) => setNewDesc(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      {/* Sugerencia inteligente de IA en vivo */}
                      {newDesc.trim().length > 3 && (
                        <div className="p-3 bg-indigo-950/40 border border-indigo-900/50 rounded-2xl flex items-center justify-between">
                          <span className="text-[11px] text-indigo-300 flex items-center gap-1.5">
                            ✨ Sugerencia de categoría por IA:
                          </span>
                          <span className="bg-indigo-600 text-white font-bold text-xs px-3 py-1 rounded-full uppercase">
                            {aiSuggesting ? 'Pensando...' : aiSuggestion || 'Analizando...'}
                          </span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold uppercase text-slate-400">Monto ($ MXN)</label>
                          <input 
                            type="number"
                            required
                            placeholder="0.00"
                            value={newAmount}
                            onChange={(e) => setNewAmount(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold uppercase text-slate-400">Fecha</label>
                          <input 
                            type="date"
                            required
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase text-slate-400">Categoría Confirmada</label>
                        <select 
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-indigo-500"
                        >
                          <option value="Suscripciones">Suscripciones</option>
                          <option value="Comida">Comida</option>
                          <option value="Transporte">Transporte</option>
                          <option value="Escuela">Escuela</option>
                          <option value="Ocio">Ocio</option>
                          <option value="Salud">Salud</option>
                          <option value="Aseo personal">Aseo personal</option>
                          <option value="Servicios">Servicios</option>
                        </select>
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold transition mt-2 shadow-lg shadow-indigo-600/25"
                      >
                        Guardar Gasto Inteligente
                      </button>
                    </form>

                    {/* Escáner de tickets Simulado */}
                    <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 mt-6">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-slate-300">📷 Escanear Ticket (OCR IA)</h4>
                        <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full text-[9px] font-bold font-mono">PILOTO</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Toma una foto de tu ticket. Nuestra IA extraerá automáticamente productos, fecha, costo total y comercio.
                      </p>

                      {scanState === 'idle' && (
                        <button 
                          onClick={handleSimulateScan}
                          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition"
                        >
                          📸 Tomar Foto de Ticket
                        </button>
                      )}

                      {scanState === 'scanning' && (
                        <div className="flex flex-col items-center justify-center py-6 space-y-2">
                          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-[11px] text-indigo-400 animate-pulse">IA procesando y extrayendo texto del ticket...</p>
                        </div>
                      )}

                      {scanState === 'done' && scannedData && (
                        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
                          <div className="flex justify-between font-bold">
                            <span>{scannedData.description}</span>
                            <span className="text-emerald-400">${scannedData.amount} MXN</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium">Productos: {scannedData.products.join(', ')}</p>
                          <div className="flex justify-between gap-2 pt-2">
                            <button 
                              onClick={() => setScanState('idle')}
                              className="w-1/2 py-2 bg-slate-800 text-slate-300 rounded-lg text-[10px] font-bold"
                            >
                              Reintentar
                            </button>
                            <button 
                              onClick={handleAcceptScanned}
                              className="w-1/2 py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-bold"
                            >
                              Guardar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ==================== PANTALLA: REPORTES E INTELIGENCIA ==================== */}
                {activeTab === 'reports' && (
                  <div className="space-y-4">
                    <div className="p-2">
                      <h2 className="text-xl font-bold">Reportes de Consumo</h2>
                      <p className="text-xs text-slate-400">Generados automáticamente por FinIA.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-400">Donde más gastaste</span>
                        <p className="font-bold text-xs text-rose-400 mt-1">{highestCategory.split(' ')[0]}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-400">Donde menos gastaste</span>
                        <p className="font-bold text-xs text-emerald-400 mt-1">{lowestCategory.split(' ')[0]}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                      <h4 className="text-xs font-bold text-slate-300 uppercase">Tendencias detectadas este mes</h4>
                      <ul className="text-xs space-y-2 text-slate-400">
                        <li className="flex items-start gap-2">
                          <span>📈</span>
                          <span>Tu gasto en <strong>Ocio</strong> ha subido un <strong>12%</strong> respecto a la semana pasada.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span>🔒</span>
                          <span>Tus suscripciones activas suman <strong>${subscriptionsTotal} MXN</strong> mensuales, representando un impacto de bajo uso.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span>💡</span>
                          <span>Si eliminas el gasto hormiga proyectado, podrás completar la meta de tu <strong>Motocicleta</strong> un 20% más rápido.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-slate-300">🕵️ Detector de Suscripciones Recurrentes</h4>
                        <span className="bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded-full text-[9px] font-bold">Activas</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Identificamos {subscriptionsCount} servicios recurrentes con un cobro mensual proyectado de <strong>${subscriptionsTotal} MXN</strong>.
                      </p>
                      <div className="space-y-2">
                        {expenses.filter(e => e.recurring).map(sub => (
                          <div key={sub.id} className="p-2 bg-slate-950 rounded-xl flex justify-between items-center text-xs">
                            <span>🎬 {sub.description}</span>
                            <span className="font-bold text-rose-400">${sub.amount} MXN/mes</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ==================== PANTALLA: METAS DE AHORRO ==================== */}
                {activeTab === 'goals' && (
                  <div className="space-y-4">
                    <div className="p-2">
                      <h2 className="text-xl font-bold">Mis Metas Financieras</h2>
                      <p className="text-xs text-slate-400">Monitorea y calcula el progreso de tus sueños.</p>
                    </div>

                    <div className="space-y-3">
                      {goals.map(goal => {
                        const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100));
                        return (
                          <div key={goal.id} className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{goal.icon}</span>
                                <span className="text-xs font-bold">{goal.name}</span>
                              </div>
                              <span className="text-xs font-mono text-indigo-400">{percentage}%</span>
                            </div>
                            
                            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>

                            <div className="flex justify-between text-[11px] text-slate-400">
                              <span>Ahorrado: ${goal.current} MXN</span>
                              <span>Meta: ${goal.target} MXN</span>
                            </div>

                            <p className="text-[10px] text-indigo-300 italic pt-1 border-t border-slate-800/60 font-medium">
                              ✨ "Tu gasto de Netflix de este mes equivale al 2.1% de esta meta."
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ==================== PANTALLA: CHAT DE IA EN VIVO ==================== */}
                {activeTab === 'chat' && (
                  <div className="flex flex-col h-[440px] justify-between">
                    
                    <div className="pb-3 border-b border-slate-800/60 flex justify-between items-center">
                      <div>
                        <h3 className="text-xs font-bold">Asistente Virtual FinIA</h3>
                        <p className="text-[9px] text-emerald-400">● En línea (Conectado con Gemini API)</p>
                      </div>
                      <button 
                        onClick={() => setChatMessages([
                          { sender: 'ia', text: '¡Hola! Soy tu copiloto financiero inteligente. He analizado tus gastos de este mes. ¿En qué puedo ayudarte hoy?' }
                        ])}
                        className="text-[10px] text-slate-400 hover:text-white"
                      >
                        Limpiar Historial
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto my-3 space-y-2 pr-1 scrollbar-none">
                      {chatMessages.map((msg, idx) => (
                        <div 
                          key={idx} 
                          className={`p-3 rounded-2xl text-xs max-w-[85%] ${msg.sender === 'ia' ? 'bg-slate-900 border border-slate-800/80 text-slate-100 mr-auto' : 'bg-indigo-600 text-white ml-auto'}`}
                        >
                          <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                        </div>
                      ))}
                      {isAiTyping && (
                        <div className="bg-slate-900 border border-slate-800 text-slate-300 p-3 rounded-2xl text-xs mr-auto flex items-center gap-1.5 max-w-[60%]">
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                          <span className="text-[10px]">FinIA está pensando...</span>
                        </div>
                      )}
                    </div>

                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <input 
                        type="text"
                        required
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Pregúntame: ¿puedo comprar un celular?"
                        className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                      />
                      <button 
                        type="submit"
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition"
                      >
                        Enviar
                      </button>
                    </form>

                  </div>
                )}

                {/* ==================== PANTALLA: CALENDARIO FINANCIERO ==================== */}
                {activeTab === 'calendar' && (
                  <div className="space-y-4">
                    <div className="p-2">
                      <h2 className="text-xl font-bold">Calendario de Pagos</h2>
                      <p className="text-xs text-slate-400">Anticipa tus obligaciones recurrentes antes de que venzan.</p>
                    </div>

                    <div className="space-y-2.5">
                      {calendar.map(bill => (
                        <div key={bill.id} className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex justify-between items-center text-xs">
                          <div className="space-y-1">
                            <span className="bg-slate-800 px-2 py-0.5 rounded text-[9px] text-indigo-300 uppercase font-mono">{bill.dueDate}</span>
                            <h4 className="font-bold text-slate-100">{bill.name}</h4>
                          </div>
                          <div className="text-right space-y-1">
                            <p className="font-bold text-rose-400">${bill.amount} MXN</p>
                            <span className="text-[9px] bg-yellow-500/10 text-yellow-400 px-1.5 py-0.5 rounded-full font-bold">Pendiente</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-indigo-600/10 border border-indigo-500/25 rounded-2xl text-xs text-indigo-300">
                      🔔 <strong>Recordatorios automáticos activos:</strong> FinIA te notificará 48 horas antes de cada pago para evitar recargos por mora.
                    </div>
                  </div>
                )}

                {/* ==================== PANTALLA: LOGROS / RECOMPENSAS ==================== */}
                {activeTab === 'achievements' && (
                  <div className="space-y-4">
                    <div className="p-2">
                      <h2 className="text-xl font-bold">Logros de Salud</h2>
                      <p className="text-xs text-slate-400">Consigue insignias y mantén la consistencia.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {achievements.map(ach => (
                        <div key={ach.id} className={`p-4 rounded-3xl border text-center space-y-2 ${ach.unlocked ? 'bg-slate-900 border-indigo-500/40' : 'bg-slate-900/40 border-slate-800'}`}>
                          <span className="text-3xl block">{ach.icon}</span>
                          <h4 className="text-xs font-bold text-slate-100">{ach.title}</h4>
                          <p className="text-[10px] text-slate-400 leading-tight">{ach.description}</p>
                          
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500" style={{ width: `${ach.progress}%` }}></div>
                          </div>
                          <span className="text-[9px] text-indigo-400 block">{ach.unlocked ? 'Completado ✓' : `${ach.progress}%`}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ==================== PANTALLA: SOPORTE Y AJUSTES ==================== */}
                {activeTab === 'support' && (
                  <div className="space-y-4">
                    <div className="p-2">
                      <h2 className="text-xl font-bold">Ajustes & Soporte</h2>
                      <p className="text-xs text-slate-400">Canal directo y control de privacidad.</p>
                    </div>

                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Seguridad de la Cuenta</h4>
                      <div className="space-y-2">
                        <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2">
                          <span>🍏</span> Continuar con Apple
                        </button>
                        <button className="w-full py-2 bg-white text-slate-900 text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm">
                          <span> G </span> Continuar con Google
                        </button>
                      </div>
                    </div>

                    <form onSubmit={handleSupportSubmit} className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Reportar Error o Sugerir</h4>
                      
                      {supportSubmitted ? (
                        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl text-center text-xs">
                          ✓ ¡Sugerencia enviada con éxito!
                        </div>
                      ) : (
                        <>
                          <div className="space-y-1">
                            <input 
                              type="text"
                              required
                              placeholder="Tu nombre"
                              value={supportForm.name}
                              onChange={(e) => setSupportForm({ ...supportForm, name: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <select 
                              value={supportForm.type}
                              onChange={(e) => setSupportForm({ ...supportForm, type: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                            >
                              <option value="Sugerencia">Sugerencia</option>
                              <option value="Error">Error en App</option>
                              <option value="Falla IA">Falla en Asistencia IA</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <textarea 
                              required
                              rows={3}
                              placeholder="Escribe aquí tu comentario..."
                              value={supportForm.text}
                              onChange={(e) => setSupportForm({ ...supportForm, text: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white resize-none"
                            ></textarea>
                          </div>
                          <button 
                            type="submit"
                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs"
                          >
                            Enviar Reporte
                          </button>
                        </>
                      )}
                    </form>
                  </div>
                )}

              </div>

              {/* BARRA DE NAVEGACIÓN MÓVIL ESTILO iOS ACCESIBLE */}
              <div className="border-t border-slate-800/80 pt-3 flex justify-between px-1 bg-slate-950/40 rounded-b-[24px]">
                <button 
                  onClick={() => setActiveTab('dashboard')} 
                  className={`flex flex-col items-center gap-1 flex-1 ${activeTab === 'dashboard' ? 'text-indigo-400' : 'text-slate-500'}`}
                >
                  <span className="text-base">📊</span>
                  <span className="text-[8px] font-bold">Muro</span>
                </button>
                <button 
                  onClick={() => setActiveTab('add')} 
                  className={`flex flex-col items-center gap-1 flex-1 ${activeTab === 'add' ? 'text-indigo-400' : 'text-slate-500'}`}
                >
                  <span className="text-base">➕</span>
                  <span className="text-[8px] font-bold">Registro</span>
                </button>
                <button 
                  onClick={() => setActiveTab('reports')} 
                  className={`flex flex-col items-center gap-1 flex-1 ${activeTab === 'reports' ? 'text-indigo-400' : 'text-slate-500'}`}
                >
                  <span className="text-base">📈</span>
                  <span className="text-[8px] font-bold">Reportes</span>
                </button>
                <button 
                  onClick={() => setActiveTab('goals')} 
                  className={`flex flex-col items-center gap-1 flex-1 ${activeTab === 'goals' ? 'text-indigo-400' : 'text-slate-500'}`}
                >
                  <span className="text-base">🎯</span>
                  <span className="text-[8px] font-bold">Metas</span>
                </button>
                <button 
                  onClick={() => setActiveTab('chat')} 
                  className={`flex flex-col items-center gap-1 flex-1 ${activeTab === 'chat' ? 'text-indigo-400' : 'text-slate-500'}`}
                >
                  <span className="text-base">💬</span>
                  <span className="text-[8px] font-bold">FinIA</span>
                </button>
                <button 
                  onClick={() => setActiveTab('calendar')} 
                  className={`flex flex-col items-center gap-1 flex-1 ${activeTab === 'calendar' ? 'text-indigo-400' : 'text-slate-500'}`}
                >
                  <span className="text-base">📅</span>
                  <span className="text-[8px] font-bold">Pagos</span>
                </button>
                <button 
                  onClick={() => setActiveTab('achievements')} 
                  className={`flex flex-col items-center gap-1 flex-1 ${activeTab === 'achievements' ? 'text-indigo-400' : 'text-slate-500'}`}
                >
                  <span className="text-base">🏆</span>
                  <span className="text-[8px] font-bold">Logros</span>
                </button>
                <button 
                  onClick={() => setActiveTab('support')} 
                  className={`flex flex-col items-center gap-1 flex-1 ${activeTab === 'support' ? 'text-indigo-400' : 'text-slate-500'}`}
                >
                  <span className="text-base">⚙️</span>
                  <span className="text-[8px] font-bold">Ajustes</span>
                </button>
              </div>

            </div>
          </div>
          
        </div>
      </main>

      <footer className="py-4 text-center text-[11px] text-slate-500">
        FinIA iOS Interactive Interface Prototype © 2026. Todos los derechos reservados.
      </footer>
    </div>
  );
}