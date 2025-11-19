# 📋 GUÍA GENERAL: Implementación de Análisis de Contratos

## 🎯 Objetivo
Implementar un sistema completo de análisis de contratos con IA en cualquier frontend (React, Vue, Angular, Vanilla JS, etc.)

---

## 📊 ARQUITECTURA DEL SISTEMA

### Flujo General
```
1. Usuario selecciona documento → 2. Inicia análisis → 3. Backend procesa (Celery + IA)
                                                      ↓
6. Usuario ve detalles ← 5. Muestra resultados ← 4. Polling/WebSocket para estado
```

---

## 🔌 ENDPOINTS DEL BACKEND

### 1. Iniciar Análisis
**Endpoint:** `POST /api/contracts/analyze/`

**Request Body:**
```json
{
    "document_id": "uuid-del-documento",
    "contract_type": "rent|mortgage|services|employment|general"
}
```

**Response (Success):**
```json
{
    "success": true,
    "data": {
        "analysis_id": "uuid-del-analisis",
        "status": "queued",
        "message": "Análisis iniciado exitosamente"
    }
}
```

---

### 2. Listar Análisis
**Endpoint:** `GET /api/contracts/analysis/`

**Query Parameters (opcionales):**
- `status`: filtrar por estado (queued, processing, completed, failed)
- `contract_type`: filtrar por tipo de contrato
- `page`: número de página
- `page_size`: elementos por página

**Response:**
```json
{
    "success": true,
    "data": {
        "count": 10,
        "next": "url-siguiente-pagina",
        "previous": null,
        "results": [
            {
                "analysis_id": "uuid",
                "document_id": "uuid",
                "document_name": "Contrato_Alquiler.pdf",
                "contract_type": "rent",
                "analysis_state": "completed",
                "total_clauses": 15,
                "flagged_clauses": 3,
                "average_favorability": 7.5,
                "risk_score": 4.2,
                "created_at": "2025-11-18T10:30:00Z",
                "completed_at": "2025-11-18T10:35:00Z"
            }
        ]
    }
}
```

---

### 3. Obtener Detalle de Análisis
**Endpoint:** `GET /api/contracts/analysis/{analysis_id}/`

**Response (Completado):**
```json
{
    "success": true,
    "data": {
        "analysis_id": "uuid",
        "document": {
            "document_id": "uuid",
            "original_filename": "contrato.pdf"
        },
        "contract_type": "rent",
        "analysis_state": "completed",
        "analysis_summary": "El contrato presenta...",
        
        // Métricas principales
        "total_clauses": 15,
        "flagged_clauses": 3,
        "high_risk_clauses_count": 1,
        "average_favorability": 7.5,
        "risk_score": 4.2,
        "processing_time_seconds": 120,
        
        // Cláusulas analizadas
        "clauses": [
            {
                "clause_id": "uuid",
                "clause_order": 1,
                "clause_type": "Pago",
                "clause_text": "El arrendatario se compromete...",
                "text_preview": "El arrendatario se compromete...",
                
                // Análisis de la cláusula
                "analysis": {
                    "outcome": "La cláusula es favorable...",
                    "favorability_level": "favorable",
                    "favorability_rate": 8.5,
                    "is_high_risk": false,
                    "confidence_score": 0.92,
                    "risk_factors": [
                        "Penalización por retraso excesiva"
                    ],
                    "recommendations": [
                        "Negociar tasa de interés más baja"
                    ],
                    "legal_precedents": [
                        {
                            "case": "Caso ABC vs XYZ",
                            "relevance": "Alta"
                        }
                    ],
                    "related_articles": [
                        {
                            "law_name": "Código Civil Boliviano",
                            "article_reference": "Art. 595",
                            "relevance": "Directamente aplicable"
                        }
                    ]
                }
            }
        ],
        
        // Información del modelo IA
        "ai_model_info": {
            "model": "gemma:2b",
            "version": "1.0",
            "temperature": 0.7
        },
        
        // Permisos del usuario
        "user_permissions": {
            "can_export": true,
            "can_view_precedents": true,
            "can_retry_analysis": true,
            "remaining_analyses_this_month": 45
        },
        
        "created_at": "2025-11-18T10:30:00Z",
        "completed_at": "2025-11-18T10:35:00Z"
    }
}
```

**Response (En Proceso):**
```json
{
    "success": true,
    "data": {
        "analysis_id": "uuid",
        "analysis_state": "processing",
        "progress_percentage": 45,
        "current_step": "Analizando cláusulas con IA",
        "estimated_time_remaining": 60
    }
}
```

---

### 4. Re-analizar Contrato
**Endpoint:** `POST /api/contracts/analysis/{analysis_id}/reanalyze/`

**Response:**
```json
{
    "success": true,
    "data": {
        "analysis_id": "nuevo-uuid",
        "status": "queued",
        "message": "Re-análisis iniciado"
    }
}
```

---

## 🏗️ IMPLEMENTACIÓN POR COMPONENTES

### COMPONENTE 1: Formulario para Iniciar Análisis

**Requisitos UI:**
- Dropdown/Select para elegir documento (solo documentos con estado "PROCESSED")
- Select para tipo de contrato
- Botón "Iniciar Análisis"

**Lógica:**
```javascript
// Pseudocódigo
async function startAnalysis(documentId, contractType) {
    try {
        // 1. Validar inputs
        if (!documentId) throw new Error("Selecciona un documento");
        
        // 2. Mostrar loading
        showLoader("Iniciando análisis...");
        
        // 3. Hacer request al backend
        const response = await httpClient.post('/api/contracts/analyze/', {
            document_id: documentId,
            contract_type: contractType || 'general'
        });
        
        // 4. Manejar respuesta
        if (response.success) {
            const analysisId = response.data.analysis_id;
            showSuccessMessage(`Análisis iniciado! ID: ${analysisId}`);
            
            // 5. Opcional: Iniciar polling para monitorear progreso
            startPollingAnalysisStatus(analysisId);
            
            // 6. Redirigir o actualizar lista
            refreshAnalysisList();
        }
        
    } catch (error) {
        showErrorMessage("Error: " + error.message);
    } finally {
        hideLoader();
    }
}
```

---

### COMPONENTE 2: Lista de Análisis

**Requisitos UI:**
- Tabla/Cards con lista de análisis
- Filtros: estado, tipo de contrato
- Paginación
- Badges para mostrar estado
- Botón "Ver detalles" por cada análisis

**Estructura de datos:**
```javascript
// Estado del componente
{
    analyses: [],
    loading: false,
    filters: {
        status: '',
        contract_type: '',
        page: 1
    },
    pagination: {
        total: 0,
        hasNext: false,
        hasPrevious: false
    }
}
```

**Lógica:**
```javascript
async function loadAnalyses(filters = {}) {
    try {
        showLoader();
        
        // Construir query params
        const params = new URLSearchParams(filters);
        
        // Request
        const response = await httpClient.get(
            `/api/contracts/analysis/?${params}`
        );
        
        if (response.success) {
            // Actualizar estado
            setState({
                analyses: response.data.results,
                pagination: {
                    total: response.data.count,
                    hasNext: !!response.data.next,
                    hasPrevious: !!response.data.previous
                }
            });
        }
        
    } catch (error) {
        showError(error);
    } finally {
        hideLoader();
    }
}

// Función auxiliar para obtener clase de badge según estado
function getStatusBadgeClass(status) {
    const classes = {
        'queued': 'badge-secondary',
        'processing': 'badge-warning',
        'completed': 'badge-success',
        'failed': 'badge-danger'
    };
    return classes[status] || 'badge-secondary';
}
```

**Template ejemplo (HTML):**
```html
<!-- Filtros -->
<div class="filters">
    <select onchange="filterByStatus(this.value)">
        <option value="">Todos los estados</option>
        <option value="completed">Completados</option>
        <option value="processing">En proceso</option>
    </select>
    
    <select onchange="filterByType(this.value)">
        <option value="">Todos los tipos</option>
        <option value="rent">Arrendamiento</option>
        <option value="mortgage">Hipoteca</option>
    </select>
</div>

<!-- Lista -->
<div class="analyses-list">
    <!-- Iterar sobre analyses -->
    <div class="analysis-card" *for="analysis in analyses">
        <h4>{analysis.document_name}</h4>
        <span class="badge {getStatusBadgeClass(analysis.analysis_state)}">
            {analysis.analysis_state}
        </span>
        <p>Cláusulas: {analysis.total_clauses}</p>
        <p>Riesgo: {analysis.risk_score}/10</p>
        <button onclick="viewAnalysisDetails(analysis.analysis_id)">
            Ver Detalles
        </button>
    </div>
</div>
```

---

### COMPONENTE 3: Visor de Resultados Detallados

**Requisitos UI:**
- Modal/Página completa para mostrar resultados
- Sección de resumen con métricas
- Tabla de cláusulas
- Opción para ver detalle de cada cláusula
- Indicadores visuales (progress bars, badges)

**Lógica:**
```javascript
async function showAnalysisDetails(analysisId) {
    try {
        showLoader();
        
        // Request
        const response = await httpClient.get(
            `/api/contracts/analysis/${analysisId}/`
        );
        
        if (response.success) {
            const analysis = response.data;
            
            // Renderizar en modal/página
            renderAnalysisDetails(analysis);
            
            // Abrir modal
            openModal('analysisDetailsModal');
        }
        
    } catch (error) {
        showError(error);
    } finally {
        hideLoader();
    }
}

function renderAnalysisDetails(analysis) {
    // Estructura del HTML/Template
    const html = `
        <!-- Sección 1: Resumen -->
        <div class="summary-section">
            <h3>Resumen del Análisis</h3>
            <div class="metrics">
                <div class="metric">
                    <label>Total Cláusulas:</label>
                    <span>${analysis.total_clauses}</span>
                </div>
                <div class="metric">
                    <label>Cláusulas Marcadas:</label>
                    <span class="highlight">${analysis.flagged_clauses}</span>
                </div>
                <div class="metric">
                    <label>Favorabilidad:</label>
                    <div class="progress-bar">
                        <div style="width: ${(analysis.average_favorability/10)*100}%">
                            ${analysis.average_favorability.toFixed(1)}/10
                        </div>
                    </div>
                </div>
                <div class="metric">
                    <label>Riesgo:</label>
                    <span class="badge ${getRiskClass(analysis.risk_score)}">
                        ${analysis.risk_score.toFixed(1)}/10
                    </span>
                </div>
            </div>
            <p>${analysis.analysis_summary}</p>
        </div>
        
        <!-- Sección 2: Tabla de Cláusulas -->
        <div class="clauses-section">
            <h3>Cláusulas Analizadas</h3>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tipo</th>
                        <th>Preview</th>
                        <th>Favorabilidad</th>
                        <th>Riesgo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${analysis.clauses.map(renderClauseRow).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    // Insertar en el DOM
    document.getElementById('analysisDetailsContent').innerHTML = html;
}

function renderClauseRow(clause) {
    return `
        <tr>
            <td>${clause.clause_order}</td>
            <td><span class="badge">${clause.clause_type}</span></td>
            <td class="preview">${clause.text_preview}</td>
            <td>
                <span class="badge ${getFavorabilityClass(clause.analysis.favorability_level)}">
                    ${clause.analysis.favorability_level}
                    (${clause.analysis.favorability_rate.toFixed(1)})
                </span>
            </td>
            <td>
                <span class="badge ${clause.analysis.is_high_risk ? 'danger' : 'success'}">
                    ${clause.analysis.is_high_risk ? 'Alto Riesgo' : 'Normal'}
                </span>
            </td>
            <td>
                <button onclick="showClauseDetail('${clause.clause_id}')">
                    Ver Detalle
                </button>
            </td>
        </tr>
    `;
}

// Funciones auxiliares para clases CSS
function getFavorabilityClass(level) {
    const classes = {
        'very_favorable': 'success',
        'favorable': 'info',
        'neutral': 'secondary',
        'unfavorable': 'warning',
        'very_unfavorable': 'danger'
    };
    return classes[level] || 'secondary';
}

function getRiskClass(score) {
    if (score <= 3) return 'success';
    if (score <= 6) return 'warning';
    return 'danger';
}
```

---

### COMPONENTE 4: Detalle de Cláusula Individual

**Requisitos UI:**
- Modal para mostrar una cláusula específica
- Texto completo de la cláusula
- Análisis detallado
- Factores de riesgo
- Recomendaciones
- Precedentes legales (si hay)
- Artículos relacionados (si hay)

**Lógica:**
```javascript
// Nota: La cláusula ya está en memoria desde el análisis completo
// No necesitas hacer otro request

function showClauseDetail(clauseId) {
    // Buscar cláusula en los datos actuales
    const clause = currentAnalysisData.clauses.find(
        c => c.clause_id === clauseId
    );
    
    if (!clause) {
        showError("Cláusula no encontrada");
        return;
    }
    
    // Renderizar
    renderClauseDetail(clause);
    
    // Abrir modal
    openModal('clauseDetailModal');
}

function renderClauseDetail(clause) {
    const html = `
        <!-- Texto de la cláusula -->
        <div class="clause-text">
            <h4>Texto de la Cláusula</h4>
            <pre>${clause.clause_text}</pre>
        </div>
        
        <!-- Análisis -->
        <div class="clause-analysis">
            <h4>Análisis</h4>
            <p>${clause.analysis.outcome}</p>
            
            <div class="metrics">
                <span class="badge ${getFavorabilityClass(clause.analysis.favorability_level)}">
                    Favorabilidad: ${clause.analysis.favorability_level}
                    (${clause.analysis.favorability_rate.toFixed(1)}/10)
                </span>
                <span>
                    Confianza: ${(clause.analysis.confidence_score * 100).toFixed(1)}%
                </span>
            </div>
        </div>
        
        <!-- Factores de Riesgo -->
        ${clause.analysis.risk_factors?.length > 0 ? `
            <div class="risk-factors">
                <h4>Factores de Riesgo</h4>
                <ul>
                    ${clause.analysis.risk_factors.map(risk => `
                        <li>${risk}</li>
                    `).join('')}
                </ul>
            </div>
        ` : ''}
        
        <!-- Recomendaciones -->
        ${clause.analysis.recommendations?.length > 0 ? `
            <div class="recommendations">
                <h4>Recomendaciones</h4>
                <ul>
                    ${clause.analysis.recommendations.map(rec => `
                        <li>${rec}</li>
                    `).join('')}
                </ul>
            </div>
        ` : ''}
        
        <!-- Artículos Legales Relacionados -->
        ${clause.analysis.related_articles?.length > 0 ? `
            <div class="related-articles">
                <h4>Artículos Legales Relacionados</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Ley</th>
                            <th>Artículo</th>
                            <th>Relevancia</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${clause.analysis.related_articles.map(article => `
                            <tr>
                                <td>${article.law_name}</td>
                                <td>${article.article_reference}</td>
                                <td>${article.relevance}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        ` : ''}
    `;
    
    document.getElementById('clauseDetailContent').innerHTML = html;
}
```

---

### COMPONENTE 5: Polling para Estado del Análisis

**Cuando inicias un análisis, este se procesa en background (puede tardar 1-5 minutos)**

**Opciones de implementación:**

#### Opción A: Polling (Recomendado para simplicidad)
```javascript
let pollingInterval = null;

function startPollingAnalysisStatus(analysisId) {
    // Limpiar cualquier polling anterior
    if (pollingInterval) {
        clearInterval(pollingInterval);
    }
    
    // Polling cada 5 segundos
    pollingInterval = setInterval(async () => {
        try {
            const response = await httpClient.get(
                `/api/contracts/analysis/${analysisId}/`
            );
            
            if (response.success) {
                const analysis = response.data;
                
                // Actualizar UI con progreso
                updateAnalysisProgress(analysis);
                
                // Si completó o falló, detener polling
                if (analysis.analysis_state === 'completed') {
                    stopPolling();
                    showSuccessMessage("¡Análisis completado!");
                    showAnalysisDetails(analysisId);
                }
                
                if (analysis.analysis_state === 'failed') {
                    stopPolling();
                    showErrorMessage("El análisis falló");
                }
            }
            
        } catch (error) {
            console.error("Error en polling:", error);
            // No detengas el polling por errores temporales
        }
    }, 5000); // 5 segundos
}

function stopPolling() {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
    }
}

function updateAnalysisProgress(analysis) {
    // Actualizar barra de progreso si existe
    if (analysis.progress_percentage) {
        const progressBar = document.getElementById(`progress-${analysis.analysis_id}`);
        if (progressBar) {
            progressBar.style.width = `${analysis.progress_percentage}%`;
            progressBar.textContent = `${analysis.progress_percentage}%`;
        }
    }
    
    // Actualizar mensaje de estado
    if (analysis.current_step) {
        const statusText = document.getElementById(`status-${analysis.analysis_id}`);
        if (statusText) {
            statusText.textContent = analysis.current_step;
        }
    }
}

// Importante: Detener polling cuando el usuario sale de la página
window.addEventListener('beforeunload', stopPolling);
```

#### Opción B: WebSocket (Más eficiente, requiere backend WebSocket)
```javascript
let ws = null;

function connectAnalysisWebSocket(analysisId) {
    ws = new WebSocket(`ws://your-backend/ws/analysis/${analysisId}/`);
    
    ws.onopen = () => {
        console.log("WebSocket conectado");
    };
    
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'progress_update') {
            updateAnalysisProgress(data.analysis);
        }
        
        if (data.type === 'completed') {
            showSuccessMessage("¡Análisis completado!");
            showAnalysisDetails(analysisId);
            ws.close();
        }
        
        if (data.type === 'failed') {
            showErrorMessage("El análisis falló: " + data.error);
            ws.close();
        }
    };
    
    ws.onerror = (error) => {
        console.error("WebSocket error:", error);
    };
    
    ws.onclose = () => {
        console.log("WebSocket cerrado");
    };
}
```

---

## 🎨 ESTILOS Y CLASES CSS

### Clases para Badges de Estado
```css
/* Estados del análisis */
.badge-queued { background: #6c757d; } /* Gris */
.badge-processing { background: #ffc107; } /* Amarillo */
.badge-completed { background: #28a745; } /* Verde */
.badge-failed { background: #dc3545; } /* Rojo */

/* Favorabilidad */
.badge-very_favorable { background: #28a745; }
.badge-favorable { background: #17a2b8; }
.badge-neutral { background: #6c757d; }
.badge-unfavorable { background: #ffc107; }
.badge-very_unfavorable { background: #dc3545; }

/* Riesgo */
.badge-low-risk { background: #28a745; }
.badge-medium-risk { background: #ffc107; }
.badge-high-risk { background: #dc3545; }
```

### Progress Bars
```css
.progress-bar {
    width: 100%;
    height: 20px;
    background: #e9ecef;
    border-radius: 4px;
    overflow: hidden;
}

.progress-bar-fill {
    height: 100%;
    transition: width 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
}

.progress-bar-fill.success { background: #28a745; }
.progress-bar-fill.warning { background: #ffc107; }
.progress-bar-fill.danger { background: #dc3545; }
```

---

## 📝 UTILIDADES Y HELPERS

### 1. Formatear Fechas
```javascript
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    
    // Formato local
    return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
```

### 2. Escape HTML (Seguridad)
```javascript
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
```

### 3. HTTP Client Genérico
```javascript
class HttpClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }
    
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        // Headers por defecto
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        // Agregar token si existe
        const token = this.getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const config = {
            ...options,
            headers
        };
        
        const response = await fetch(url, config);
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        return await response.json();
    }
    
    get(endpoint, options) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }
    
    post(endpoint, data, options) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    getAuthToken() {
        // Implementar según tu sistema de auth
        return localStorage.getItem('authToken');
    }
}

// Uso
const httpClient = new HttpClient('http://localhost:8080');
```

---

## 🔐 AUTENTICACIÓN

Todos los endpoints requieren autenticación JWT:

```javascript
// En cada request, incluir header:
headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
}
```

---

## ⚠️ MANEJO DE ERRORES

### Errores Comunes

**1. 401 Unauthorized**
```javascript
if (error.status === 401) {
    // Token expirado o inválido
    redirectToLogin();
}
```

**2. 404 Not Found**
```javascript
if (error.status === 404) {
    showError("Análisis no encontrado");
}
```

**3. 500 Internal Server Error**
```javascript
if (error.status === 500) {
    showError("Error del servidor. Intenta más tarde.");
}
```

**4. Analysis Failed**
```json
{
    "success": true,
    "data": {
        "analysis_state": "failed",
        "error_message": "Descripción del error"
    }
}
```

---

## 📱 RESPONSIVE DESIGN

### Consideraciones Mobile

```css
/* En pantallas pequeñas */
@media (max-width: 768px) {
    /* Tabla de cláusulas en cards */
    .clauses-table {
        display: none;
    }
    
    .clauses-cards {
        display: block;
    }
    
    /* Modal full screen */
    .modal-dialog {
        margin: 0;
        max-width: 100%;
        height: 100vh;
    }
}
```

---

## 🚀 OPTIMIZACIONES

### 1. Cache de Análisis
```javascript
// Cachear análisis completados para evitar requests repetidos
const analysisCache = new Map();

async function getAnalysis(analysisId, forceRefresh = false) {
    if (!forceRefresh && analysisCache.has(analysisId)) {
        return analysisCache.get(analysisId);
    }
    
    const analysis = await httpClient.get(`/api/contracts/analysis/${analysisId}/`);
    
    if (analysis.data.analysis_state === 'completed') {
        analysisCache.set(analysisId, analysis.data);
    }
    
    return analysis.data;
}
```

### 2. Debounce para Filtros
```javascript
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Uso
const debouncedSearch = debounce((searchTerm) => {
    loadAnalyses({ search: searchTerm });
}, 300);
```

### 3. Virtual Scrolling para Listas Largas
Si tienes muchos análisis o cláusulas, considera implementar virtual scrolling.

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

- [ ] **Componente de Inicio de Análisis**
  - [ ] Selector de documento
  - [ ] Selector de tipo de contrato
  - [ ] Botón de inicio
  - [ ] Validaciones

- [ ] **Lista de Análisis**
  - [ ] Tabla/Cards
  - [ ] Filtros por estado
  - [ ] Filtros por tipo
  - [ ] Paginación
  - [ ] Loading states

- [ ] **Visor de Resultados**
  - [ ] Resumen con métricas
  - [ ] Tabla de cláusulas
  - [ ] Badges de favorabilidad
  - [ ] Badges de riesgo
  - [ ] Progress bars

- [ ] **Detalle de Cláusula**
  - [ ] Modal
  - [ ] Texto completo
  - [ ] Análisis detallado
  - [ ] Factores de riesgo
  - [ ] Recomendaciones
  - [ ] Artículos relacionados

- [ ] **Polling/WebSocket**
  - [ ] Monitoreo de progreso
  - [ ] Actualización automática
  - [ ] Cleanup al salir

- [ ] **Manejo de Errores**
  - [ ] Mensajes claros
  - [ ] Retry logic
  - [ ] Fallbacks

- [ ] **Responsive**
  - [ ] Mobile optimizado
  - [ ] Tablet optimizado
  - [ ] Desktop optimizado

- [ ] **Performance**
  - [ ] Cache implementado
  - [ ] Debounce en filtros
  - [ ] Lazy loading

---

## 🎯 EJEMPLO COMPLETO: React

```jsx
import React, { useState, useEffect } from 'react';

function ContractAnalysis() {
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedAnalysis, setSelectedAnalysis] = useState(null);
    
    // Cargar lista de análisis
    useEffect(() => {
        loadAnalyses();
    }, []);
    
    async function loadAnalyses() {
        setLoading(true);
        try {
            const response = await fetch('/api/contracts/analysis/', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setAnalyses(data.data.results);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    
    async function startAnalysis(documentId, contractType) {
        try {
            const response = await fetch('/api/contracts/analyze/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    document_id: documentId,
                    contract_type: contractType
                })
            });
            
            const data = await response.json();
            alert(`Análisis iniciado: ${data.data.analysis_id}`);
            
            // Iniciar polling
            pollAnalysisStatus(data.data.analysis_id);
            
        } catch (error) {
            console.error(error);
        }
    }
    
    function pollAnalysisStatus(analysisId) {
        const interval = setInterval(async () => {
            const response = await fetch(`/api/contracts/analysis/${analysisId}/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            
            if (data.data.analysis_state === 'completed') {
                clearInterval(interval);
                alert('¡Análisis completado!');
                loadAnalyses();
            }
        }, 5000);
    }
    
    return (
        <div className="contract-analysis">
            <h1>Análisis de Contratos</h1>
            
            {/* Lista de análisis */}
            {loading ? (
                <p>Cargando...</p>
            ) : (
                <div className="analyses-grid">
                    {analyses.map(analysis => (
                        <div key={analysis.analysis_id} className="analysis-card">
                            <h3>{analysis.document_name}</h3>
                            <span className={`badge ${getStatusClass(analysis.analysis_state)}`}>
                                {analysis.analysis_state}
                            </span>
                            <p>Cláusulas: {analysis.total_clauses}</p>
                            <button onClick={() => viewDetails(analysis.analysis_id)}>
                                Ver Detalles
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function getStatusClass(status) {
    const classes = {
        'queued': 'badge-secondary',
        'processing': 'badge-warning',
        'completed': 'badge-success',
        'failed': 'badge-danger'
    };
    return classes[status];
}

export default ContractAnalysis;
```

---

## 📚 RECURSOS ADICIONALES

### Testing
- Prueba con documentos de diferentes tamaños
- Prueba flujo completo: inicio → polling → resultados → detalle
- Prueba manejo de errores
- Prueba en diferentes dispositivos

### Documentación Backend
- Lee la documentación completa del API
- Revisa los modelos de datos en el backend
- Verifica rate limits y quotas

---

## ✅ RESUMEN

**Lo único específico que necesitas:**
1. **Endpoints del backend** ✅ (ya documentados arriba)
2. **Estructura de JSON** ✅ (ya documentada arriba)
3. **Token de autenticación JWT** (tu sistema)

**Todo lo demás es genérico:**
- Lógica de componentes
- Manejo de estado
- UI/UX
- Estilos CSS

Puedes implementar esto en **cualquier framework** siguiendo los mismos principios.

---

**Última actualización:** Noviembre 18, 2025  
**Versión:** 1.0

