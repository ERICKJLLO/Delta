# ⚡ Delta — Plataforma de Prevención de Fraudes con Inteligencia Artificial

<p align="center">
  <img src="https://via.placeholder.com/800x400/13141b/3b82f6?text=Delta+Security" alt="Delta Banner">
</p>

## 🚀 Sobre Delta

**Delta** es un ecosistema avanzado de monitoreo transaccional y prevención de fraudes diseñado para instituciones financieras modernas. Utilizando un motor de reglas en tiempo real combinado con **Delta AI**, nuestra plataforma detecta anomalías, bloquea transacciones de alto riesgo preventivamente y provee a los equipos de análisis un dashboard de control centralizado y altamente visual.

---

## ✨ Características Principales

*   **Monitoreo en Tiempo Real**: Análisis instantáneo de cada transacción con scores de riesgo dinámicos calculados en milisegundos.
*   **Gestión Visual y Táctica**: Interfaz *glassmorphism* premium con soporte para modo oscuro, alertas animadas e indicadores clave de rendimiento (KPI).
*   **Delta AI (Asistente Semántico)**: Inteligencia artificial conversacional capaz de:
    *   Comprender consultas complejas.
    *   Generar reportes estructurados.
    *   Recomendar y ejecutar acciones como bloqueos de transacciones.
*   **Protocolo de Resolución Rápida**: Flujos de trabajo orientados a la reducción del tiempo de respuesta ante alertas críticas.
*   **Arquitectura de Permisos y Planes**: Control de acceso granular a funcionalidades según el modelo de suscripción (Básico, Profesional, Empresarial).
*   **Paneles de Estadísticas Integrados**: Gráficos interactivos generados con Recharts, con tooltips y animaciones dinámicas.

---

## 🛠️ Tecnologías Utilizadas

### Frontend
*   **Vite & React**: Framework de UI rápido y modular.
*   **Tailwind CSS**: Utilizado extensamente para crear una interfaz *Dark Mode Premium* y *Glassmorphism*.
*   **Lucide React**: Iconografía elegante, vectorizada y altamente consistente.
*   **Recharts**: Para la visualización de datos interactivos, incluyendo gráficos de barras, tendencias y *PieCharts* dinámicos.

### Backend
*   **Express.js (Node.js)**: API RESTful ligera y escalable.
*   **Motor de Reglas IA**: Backend simulado con respuestas semánticas configuradas en `routes/ai.js`, capaz de devolver comandos de acciones estructuradas hacia el cliente.
*   **CORS & Middleware**: Configuración lista para entornos seguros.

---

## 💻 Instalación y Ejecución Local

Sigue estos pasos para arrancar el entorno de desarrollo local.

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/delta.git
cd delta
```

### 2. Inicializar el Backend

El backend gestiona la autenticación, datos simulados de empresas y las interacciones con Delta AI.

```bash
cd backend
npm install
npm start
```
*El servidor arrancará en el puerto `3001`.*

### 3. Inicializar el Frontend

Abre una nueva terminal e inicializa el dashboard visual interactivo.

```bash
cd frontend
npm install
npm run dev
```
*La plataforma será accesible en `http://localhost:5173/`.*

---

## ⚙️ Uso de la Aplicación

1.  **Ingreso**: Dirígete a la ruta `/login` (si no tienes una sesión activa serás redirigido). Puedes utilizar cualquier credencial para la simulación inicial, o completar el flujo de registro `/register`.
2.  **Transacciones Sospechosas**: En el Dashboard, los paneles interactivos permiten *"Bloquear"*, *"Investigar"* o marcar transacciones como *"Seguras"*.
3.  **Delta AI**: Navega a la sección **Delta AI**. Puedes interactuar usando el chat. Intenta comandos como:
    *   *"Bloquear todas las transacciones pendientes."*
    *   *"Muestra un reporte de fraude."*
    *   *"¿Cuáles son las transacciones desde Nigeria?"*
4.  **Simulador de Planes**: Si intentas acceder a funciones analíticas o configuraciones avanzadas estando en un plan "Básico", observarás el modal de *Upgrade*. Las funciones están protegidas en todos los niveles.

---

## 📝 Roadmap & Futuras Mejoras

- [x] Separación de frontend y backend.
- [x] Interfaz de usuario Dark/Glassmorphism premium.
- [x] Panel de Notificaciones interactivo y reactivo.
- [x] Filtros y búsquedas globales en transacciones y alertas.
- [x] Delta AI con ejecución semántica real en el frontend.
- [x] Tooltips, Gráficos Reactivos (Recharts).
- [ ] Conexión a Base de Datos en la Nube (PostgreSQL / MongoDB).
- [ ] Integración real de modelos de lenguaje grande (LLM como OpenAI/Gemini) para Delta AI.
- [ ] Websockets reales para notificaciones push automáticas.

---

<p align="center">
  Creado con 💻 y ☕ por el equipo Delta. <br>
  © 2026 Delta Security Inc. Todos los derechos reservados.
</p>
