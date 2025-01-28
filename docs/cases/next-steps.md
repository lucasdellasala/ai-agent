## Pendientes/Futuras Tareas:

### 0. Reducir consumo de tokens:

- Minizar el consumo de tokens de input y de output modificando los messages, schemas y tools que se pasan al SDK de OpenAI.

### 1. Manejo de Conversaciones Multi-Turno:

- Si el usuario responde "sí" después de que el agente pregunte "¿Desea ver otros productos?".

### 2. Validación de Permisos:

- Asegurar que el usuario solo consulte sus propios pedidos (requiere autenticación).

### 3. Manejo de Contexto:

- Si el usuario escribe "¿Y sobre mi pedido anterior?" sin dar un ID.

### 4. Escalabilidad:

- Cómo manejar altos volúmenes de solicitudes simultáneas.

### 5. Internacionalización:

- Soporte para múltiples idiomas/regiones.

### 6. Testing de Modelo de OpenAI y DeepSeek:

- Evaluar falsos positivos/negativos en la clasificación de intenciones.
- ¿Cómo testear algo que no es idempotente?

### 7. Errores Inesperados:

- Excepciones no controladas al procesar mensajes.

---

## [🔙Volver a edge cases](./../edge-cases.md)
