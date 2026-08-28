# Documentación

## Fuente de verdad de la API

Los contratos de la API se consultan en el backend en ejecución:

- Swagger: `GET /api/docs/`
- OpenAPI JSON: `GET /api/schema/`

El código del frontend (`legalpartner-frontend/src/lib/api/`) refleja esos contratos y está verificado contra el backend (agosto de 2026).

## `legacy/`

Guías escritas durante el diseño inicial del proyecto. **Están desactualizadas** y no deben usarse como referencia de la API: describen un chatbot síncrono (hoy responde 202 y se sondea el estado), una URL base fija (`localhost:8080`), códigos de verificación de prueba que ya no existen y componentes que nunca llegaron a implementarse. Se conservan solo como contexto histórico.

| Archivo | Contenido |
|---|---|
| `FRONTEND_IMPLEMENTATION_GUIDE.md` | Ejemplos de integración con el endpoint de progreso de análisis (React, Vue, Angular, JS). |
| `GUIA_GENERAL_ANALISIS_CONTRATOS.md` | Descripción del flujo de análisis de contratos y ejemplos de cliente HTTP. |
| `UI_PLANNING.md` | Planificación inicial de pantallas y componentes. |
