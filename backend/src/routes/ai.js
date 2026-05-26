import express from 'express';

const router = express.Router();

/**
 * POST /api/ai/chat
 * Endpoint de procesamiento semántico para Delta AI.
 * Analiza la intención del usuario y genera respuestas contextuales
 * basadas en el plan de suscripción, transacciones y contexto de riesgo.
 */
router.post('/chat', (req, res) => {
  try {
    const { message, plan, transactions, context } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Se requiere un mensaje de texto.' });
    }

    const query = message.toLowerCase().trim();
    const planId = plan || 'basic';
    const txList = transactions || [];

    // Detectar intención del usuario
    const intent = detectIntent(query);
    
    // Generar respuesta semántica basada en la intención
    const response = generateSemanticResponse(intent, query, planId, txList, context);

    res.json({
      response: response.text,
      intent: intent.type,
      confidence: intent.confidence,
      suggestions: response.suggestions || [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Delta AI Error]', error);
    res.status(500).json({ error: 'Error interno en Delta AI.' });
  }
});

/**
 * Detectar la intención del mensaje del usuario.
 */
function detectIntent(query) {
  const intents = [
    {
      type: 'transaction_query',
      keywords: ['transacción', 'transacciones', 'tx-', 'transferencia', 'pago', 'retiro', 'compra'],
      confidence: 0.9
    },
    {
      type: 'block_request',
      keywords: ['bloquear', 'bloqueo', 'bloquea', 'cancelar', 'detener', 'frenar', 'congelar'],
      confidence: 0.95
    },
    {
      type: 'risk_analysis',
      keywords: ['riesgo', 'riesgos', 'peligro', 'amenaza', 'vulnerabilidad', 'score', 'nivel'],
      confidence: 0.88
    },
    {
      type: 'report_request',
      keywords: ['reporte', 'informe', 'informe', 'resumen', 'exportar', 'descargar', 'pdf'],
      confidence: 0.92
    },
    {
      type: 'fraud_info',
      keywords: ['fraude', 'estafa', 'phishing', 'clonación', 'suplantación', 'robo', 'identidad'],
      confidence: 0.87
    },
    {
      type: 'plan_info',
      keywords: ['plan', 'suscripción', 'precio', 'mejorar', 'upgrade', 'funciones', 'premium'],
      confidence: 0.85
    },
    {
      type: 'alert_query',
      keywords: ['alerta', 'alertas', 'notificación', 'aviso', 'advertencia', 'crítica'],
      confidence: 0.86
    },
    {
      type: 'help',
      keywords: ['ayuda', 'ayúdame', 'qué puedes', 'cómo', 'qué haces', 'funciones', 'comandos'],
      confidence: 0.8
    },
    {
      type: 'greeting',
      keywords: ['hola', 'buenos', 'buenas', 'hey', 'saludos', 'qué tal'],
      confidence: 0.75
    },
    {
      type: 'region_query',
      keywords: ['nigeria', 'rusia', 'china', 'asia', 'áfrica', 'europa', 'región', 'país', 'origen', 'ubicación'],
      confidence: 0.88
    },
    {
      type: 'stats_query',
      keywords: ['estadísticas', 'datos', 'métricas', 'números', 'porcentaje', 'tasa', 'tendencia', 'gráfico'],
      confidence: 0.85
    }
  ];

  // Buscar la intención con mayor coincidencia
  let bestMatch = { type: 'general', confidence: 0.5 };
  let maxKeywordHits = 0;

  for (const intent of intents) {
    const hits = intent.keywords.filter(kw => query.includes(kw)).length;
    if (hits > maxKeywordHits) {
      maxKeywordHits = hits;
      bestMatch = { type: intent.type, confidence: Math.min(intent.confidence + (hits - 1) * 0.02, 0.99) };
    }
  }

  return bestMatch;
}

/**
 * Generar respuesta semántica contextual basada en la intención detectada.
 */
function generateSemanticResponse(intent, query, planId, transactions, context) {
  const planNames = {
    basic: 'Básico',
    professional: 'Profesional',
    enterprise: 'Empresarial'
  };
  const planName = planNames[planId] || 'Básico';

  // Contar estados de transacciones
  const blockedTx = transactions.filter(t => t.actionState === 'blocked');
  const investigatingTx = transactions.filter(t => t.actionState === 'investigating');
  const pendingTx = transactions.filter(t => t.actionState === 'pending' || !t.actionState);
  const highRiskTx = transactions.filter(t => t.risk === 'high' && t.actionState === 'pending');

  const responses = {
    greeting: {
      text: `¡Hola! 👋 Soy **Delta AI**, tu asistente inteligente de seguridad financiera.\n\nEstás operando con el plan **${planName}**. Actualmente estoy monitoreando **${transactions.length} transacciones** en el sistema.\n\n¿En qué puedo ayudarte hoy? Puedo:\n- 🔍 Analizar transacciones sospechosas\n- 📊 Generar reportes de riesgo\n- 🛡️ Recomendar acciones de seguridad\n- 📈 Mostrar estadísticas y tendencias`,
      suggestions: ['Analizar transacciones', 'Ver riesgos actuales', 'Generar reporte']
    },

    transaction_query: {
      text: generateTransactionAnalysis(transactions, pendingTx, blockedTx, investigatingTx, highRiskTx),
      suggestions: ['Bloquear transacciones de alto riesgo', 'Ver detalle de TX-7482', 'Filtrar por región']
    },

    block_request: {
      text: generateBlockRecommendation(highRiskTx, blockedTx, pendingTx),
      suggestions: ['Confirmar bloqueo masivo', 'Ver transacciones pendientes', 'Generar reporte de bloqueos']
    },

    risk_analysis: {
      text: `## 📊 Análisis de Riesgo en Tiempo Real\n\n**Score global de riesgo:** \`72/100\` ⚠️ (Elevado)\n\n### Desglose por categoría:\n| Categoría | Score | Estado |\n|-----------|-------|--------|\n| Transacciones internacionales | 85/100 | 🔴 Crítico |\n| Patrones de comportamiento | 62/100 | 🟡 Moderado |\n| Verificación de identidad | 45/100 | 🟢 Bajo |\n| Volumen transaccional | 71/100 | 🟡 Moderado |\n\n### Recomendaciones:\n1. **Prioridad Alta**: Revisar las ${highRiskTx.length} transacciones de alto riesgo pendientes\n2. **Prioridad Media**: Activar verificación adicional en transferencias > $10,000\n3. **Prioridad Baja**: Programar auditoría de reglas de detección\n\n_Tu plan **${planName}** ${planId === 'enterprise' ? 'incluye análisis predictivo avanzado con IA.' : planId === 'professional' ? 'incluye análisis de tendencias.' : 'incluye monitoreo básico. Mejora a Profesional para acceder a análisis predictivos.'}_`,
      suggestions: ['Ver transacciones críticas', 'Descargar reporte de riesgos', 'Configurar alertas']
    },

    report_request: {
      text: `## 📋 Reporte de Seguridad — ${new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}\n\n### Resumen Ejecutivo\n- **Transacciones monitoreadas:** ${transactions.length}\n- **Alertas críticas pendientes:** ${highRiskTx.length}\n- **Transacciones bloqueadas:** ${blockedTx.length}\n- **En investigación:** ${investigatingTx.length}\n- **Score de riesgo global:** 72/100\n\n### Métricas Clave\n| Métrica | Valor | Tendencia |\n|---------|-------|-----------|\n| Pérdidas estimadas | $45,230 | ↑ 18% |\n| Eventos detectados | 127 | ↑ 23 |\n| Tasa de detección | 94.2% | ↑ 2.1% |\n| Exposición al riesgo | $2.4M | ↑ 5% |\n\n### Acciones Recomendadas\n1. Bloquear preventivamente transacciones de alto riesgo desde Nigeria y Rusia\n2. Activar protocolo de verificación adicional\n3. Revisar reglas de detección de anomalías\n\n_${planId === 'basic' ? '⚡ Tu plan Básico no permite exportar reportes. Mejora a Profesional para descargar PDFs.' : '✅ Puedes exportar este reporte desde la sección de Análisis.'}_`,
      suggestions: ['Exportar reporte', 'Analizar tendencias', 'Ver transacciones críticas']
    },

    fraud_info: {
      text: `## 🛡️ Información sobre Fraude\n\n### Tipos de fraude más detectados en tu cuenta:\n\n1. **Phishing (35%)** — Intentos de suplantación de identidad mediante emails y sitios falsos\n2. **Transferencias fraudulentas (28%)** — Movimientos no autorizados desde cuentas comprometidas\n3. **Robo de identidad (20%)** — Uso de credenciales robadas para acceder a servicios\n4. **Tarjetas clonadas (12%)** — Duplicación de tarjetas de débito/crédito\n5. **Otros (5%)** — Incluye lavado de activos, fraude interno\n\n### Zonas geográficas de mayor riesgo:\n- 🔴 **Nigeria** — 85% score de riesgo\n- 🔴 **Rusia** — 78% score de riesgo  \n- 🟡 **China** — 62% score de riesgo\n\n### ¿Cómo protegerte?\n- Activa la verificación en dos pasos\n- Configura alertas instantáneas por transacción\n- Bloquea preventivamente transacciones desde zonas de alto riesgo`,
      suggestions: ['Ver transacciones desde Nigeria', 'Activar bloqueo regional', 'Generar reporte de fraude']
    },

    plan_info: {
      text: `## 📦 Tu Plan: **${planName}**\n\n### Características incluidas:\n${generatePlanFeatures(planId)}\n\n### Comparación de planes:\n| Característica | Básico | Profesional | Empresarial |\n|---------------|--------|------------|-------------|\n| Monitoreo en tiempo real | ✅ | ✅ | ✅ |\n| Gestión de transacciones | Solo lectura | ✅ Completa | ✅ Completa |\n| Alertas avanzadas | ❌ | ✅ | ✅ |\n| Análisis predictivo | ❌ | ✅ | ✅ |\n| Delta AI | ❌ | ⚡ Limitado | ✅ Ilimitado |\n| Reportes PDF | ❌ | ✅ | ✅ |\n| API personalizada | ❌ | ❌ | ✅ |\n\n${planId !== 'enterprise' ? '_🚀 **¿Quieres más funciones?** Contacta a nuestro equipo para mejorar tu plan._' : '_✨ Tienes acceso a todas las funciones de Delta._'}`,
      suggestions: ['Mejorar mi plan', 'Ver funciones bloqueadas', 'Contactar soporte']
    },

    alert_query: {
      text: `## 🔔 Resumen de Alertas\n\n### Alertas Activas:\n- 🔴 **1 Crítica**: Patrón de fraude detectado — Múltiples transferencias desde Nigeria\n- 🟡 **2 Advertencias**: Incremento del 45% en actividad anómala y comportamiento inusual\n- 🔵 **1 Informativa**: Sistema de protección activó bloqueo automático de 12 transacciones\n\n### Estado del Sistema:\n- Transacciones pendientes de revisión: **${pendingTx.length}**\n- Transacciones bloqueadas: **${blockedTx.length}**\n- En investigación: **${investigatingTx.length}**\n\n_Las alertas se actualizan en tiempo real. Revisa el panel de Alertas para más detalle._`,
      suggestions: ['Ver todas las alertas', 'Silenciar alertas informativas', 'Configurar umbrales']
    },

    help: {
      text: `## 🤖 ¿Cómo puedo ayudarte?\n\nSoy **Delta AI**, tu asistente inteligente de seguridad financiera. Aquí tienes algunos ejemplos de lo que puedo hacer:\n\n### 📋 Consultas que puedo responder:\n- *"¿Cuáles son las transacciones de alto riesgo?"*\n- *"Genera un reporte de seguridad"*\n- *"¿Cuál es el score de riesgo actual?"*\n- *"Bloquear transacciones sospechosas"*\n- *"¿Qué tipos de fraude se han detectado?"*\n- *"¿Qué incluye mi plan?"*\n- *"Muestra las alertas activas"*\n- *"Estadísticas de hoy"*\n\n### ⚡ Acciones rápidas:\n- Analizar transacciones por región o monto\n- Recomendar bloqueos preventivos\n- Generar reportes detallados\n- Explicar patrones de fraude`,
      suggestions: ['Analizar transacciones', 'Ver riesgos', 'Generar reporte']
    },

    region_query: {
      text: generateRegionAnalysis(transactions, query),
      suggestions: ['Bloquear transacciones de esa región', 'Ver mapa de calor', 'Reporte por regiones']
    },

    stats_query: {
      text: `## 📈 Estadísticas del Día\n\n### Panel de Métricas en Tiempo Real:\n| Métrica | Valor | Cambio |\n|---------|-------|--------|\n| Pérdidas estimadas | $45,230 | ↑ 18% |\n| Eventos detectados | 127 | +23 nuevos |\n| Exposición al riesgo | $2.4M | ↑ 5% |\n| Transacciones bloqueadas | 34 | ↓ 12% |\n| Tasa de detección | 94.2% | ↑ 2.1% |\n\n### Distribución de Fraude:\n- Phishing: **35%**\n- Transferencias fraudulentas: **28%**\n- Robo de identidad: **20%**\n- Tarjetas clonadas: **12%**\n- Otros: **5%**\n\n_El monitoreo opera 24/7 con actualización cada 30 segundos._`,
      suggestions: ['Ver gráficos detallados', 'Exportar estadísticas', 'Comparar con mes anterior']
    },

    general: {
      text: generateGeneralResponse(query, planName, transactions),
      suggestions: ['¿Qué puedes hacer?', 'Ver riesgos actuales', 'Generar reporte']
    }
  };

  return responses[intent.type] || responses.general;
}

function generateTransactionAnalysis(transactions, pendingTx, blockedTx, investigatingTx, highRiskTx) {
  let text = `## 🔍 Análisis de Transacciones\n\n`;
  text += `**Total monitoreadas:** ${transactions.length}\n\n`;
  text += `### Estado actual:\n`;
  text += `- 🟡 **Pendientes de revisión:** ${pendingTx.length}\n`;
  text += `- 🔴 **Bloqueadas:** ${blockedTx.length}\n`;
  text += `- 🔵 **En investigación:** ${investigatingTx.length}\n`;
  text += `- ⚠️ **Alto riesgo pendientes:** ${highRiskTx.length}\n\n`;

  if (highRiskTx.length > 0) {
    text += `### ⚠️ Transacciones de Alto Riesgo:\n`;
    highRiskTx.forEach(tx => {
      text += `- **${tx.id}** — ${tx.amount} desde ${tx.location} (${tx.type}) — _${tx.time}_\n`;
    });
    text += `\n**Recomendación:** Revisar y tomar acción inmediata sobre estas transacciones.`;
  } else {
    text += `✅ No hay transacciones de alto riesgo pendientes. ¡El sistema está bajo control!`;
  }

  return text;
}

function generateBlockRecommendation(highRiskTx, blockedTx, pendingTx) {
  if (highRiskTx.length === 0) {
    return `## ✅ Sin Bloqueos Pendientes\n\nNo hay transacciones de alto riesgo que requieran bloqueo en este momento.\n\n**Transacciones ya bloqueadas:** ${blockedTx.length}\n**Pendientes de revisión:** ${pendingTx.length}\n\n_El sistema de detección automática está activo y monitoreando._`;
  }

  let text = `## 🔒 Recomendación de Bloqueo\n\n`;
  text += `He identificado **${highRiskTx.length} transacciones** que recomiendo bloquear de forma preventiva:\n\n`;
  highRiskTx.forEach(tx => {
    text += `- ⚠️ **${tx.id}** — ${tx.amount} desde ${tx.location}\n`;
  });
  text += `\n### Motivos:\n`;
  text += `1. Origen geográfico en zonas de alto riesgo\n`;
  text += `2. Montos que superan los umbrales de seguridad\n`;
  text += `3. Patrones inconsistentes con el comportamiento histórico\n\n`;
  text += `_Para bloquear, usa los botones de acción en el panel de Transacciones Sospechosas._`;

  return text;
}

function generatePlanFeatures(planId) {
  const features = {
    basic: `- ✅ Dashboard de monitoreo general\n- ✅ Visualización de transacciones\n- ✅ Alertas básicas\n- ❌ Acciones sobre transacciones\n- ❌ Análisis predictivo\n- ❌ Delta AI\n- ❌ Reportes exportables`,
    professional: `- ✅ Dashboard de monitoreo general\n- ✅ Gestión completa de transacciones\n- ✅ Alertas avanzadas con filtros\n- ✅ Análisis predictivo e interactivo\n- ✅ Delta AI (asistente limitado)\n- ✅ Reportes exportables en PDF\n- ❌ API personalizada`,
    enterprise: `- ✅ Dashboard de monitoreo general\n- ✅ Gestión completa de transacciones\n- ✅ Alertas avanzadas con filtros\n- ✅ Análisis predictivo e interactivo\n- ✅ Delta AI ilimitado con IA avanzada\n- ✅ Reportes exportables en PDF\n- ✅ API personalizada y webhooks`
  };
  return features[planId] || features.basic;
}

function generateRegionAnalysis(transactions, query) {
  const regions = {
    nigeria: { name: 'Nigeria', risk: 85, status: 'Crítico' },
    rusia: { name: 'Rusia', risk: 78, status: 'Crítico' },
    china: { name: 'China', risk: 62, status: 'Moderado' },
    'méxico': { name: 'México', risk: 45, status: 'Bajo' },
    'españa': { name: 'España', risk: 23, status: 'Bajo' },
    asia: { name: 'Asia (General)', risk: 72, status: 'Elevado' },
    'áfrica': { name: 'África (General)', risk: 85, status: 'Crítico' },
    europa: { name: 'Europa del Este', risk: 58, status: 'Moderado' }
  };

  let matchedRegion = null;
  for (const [key, region] of Object.entries(regions)) {
    if (query.includes(key)) {
      matchedRegion = region;
      break;
    }
  }

  if (matchedRegion) {
    const txFromRegion = transactions.filter(t => 
      t.location.toLowerCase().includes(matchedRegion.name.toLowerCase().split(' ')[0])
    );
    
    return `## 🌍 Análisis Regional: ${matchedRegion.name}\n\n**Score de riesgo:** ${matchedRegion.risk}/100 — ${matchedRegion.status}\n\n### Transacciones desde ${matchedRegion.name}:\n${txFromRegion.length > 0 
      ? txFromRegion.map(tx => `- **${tx.id}** — ${tx.amount} (${tx.type}) — Estado: ${tx.actionState || 'pendiente'}`).join('\n')
      : '_No hay transacciones activas desde esta región._'
    }\n\n### Recomendación:\n${matchedRegion.risk > 70 
      ? '⚠️ **Activar bloqueo preventivo** para todas las transacciones originadas desde esta región.'
      : '✅ Nivel de riesgo controlado. Mantener monitoreo estándar.'}`;
  }

  return `## 🌍 Análisis por Región\n\n| Región | Score de Riesgo | Estado |\n|--------|----------------|--------|\n| Nigeria | 85/100 | 🔴 Crítico |\n| Rusia | 78/100 | 🔴 Crítico |\n| China | 62/100 | 🟡 Moderado |\n| México | 45/100 | 🟢 Bajo |\n| España | 23/100 | 🟢 Bajo |\n\n_Pregúntame sobre una región específica para más detalle._`;
}

function generateGeneralResponse(query, planName, transactions) {
  // Intentar generar una respuesta más contextual para consultas no reconocidas
  if (query.length < 3) {
    return `No entendí tu consulta. ¿Puedes ser más específico? Prueba con frases como:\n- *"Analizar transacciones"*\n- *"Score de riesgo actual"*\n- *"Generar reporte"*`;
  }

  return `## 💡 Respuesta de Delta AI\n\nBasándome en el monitoreo en tiempo real de tu plan **${planName}**:\n\n- El sistema está operando con normalidad\n- Se están monitoreando **${transactions.length} transacciones** activas\n- La tasa de detección se mantiene en **94.2%**\n\nSi necesitas algo más específico, prueba preguntar sobre:\n- 📊 **Riesgos** — Análisis de scores y tendencias\n- 🔍 **Transacciones** — Estado y acciones\n- 📋 **Reportes** — Informes de seguridad\n- 🛡️ **Fraude** — Tipos y prevención\n\n_Escribe "ayuda" para ver todos los comandos disponibles._`;
}

export default router;
