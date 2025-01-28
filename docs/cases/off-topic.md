
## **Off-Topic**

### 1. Mensajes Ambiguos

- **Caso**: Saludos sin contexto.  
  **Mensaje**: "Hola."

  > **Log**:
  > ```json
  > {
  >   "type": "OFF_TOPIC",
  >   "userId": "U-001",
  >   "userMessage": "Hola!",
  >   "reason": "Tema no relacionado",
  >   "timestamp": "2025-01-28T00:22:19.028Z"
  > }
  > ```

---

### 2. Mezcla de Intenciones:
- **Caso**: Mensajes que combinan on-topic y off-topic (ej. "Hola, quiero una rueda y ¿sabes cocinar?").
  **Mensaje**: "Hola, quiero una rueda y ¿sabes cocinar?"

  > **OpenAI**
  > ```json
  > {
  >   "context": {
  >     "usage": {
  >       "prompt_tokens": 508,
  >       "completion_tokens": 97,
  >       "total_tokens": 605
  >     }
  >   },
  >   "message": "Hola, John. Tu pedido #1 está en tránsito. Y sobre cocinar, siempre es algo que disfruto. Hay algo más en lo que pueda ayudarte?",
  > }
  > ```

  > **DeepSeek**
  > ```json
  > {
  >   "context": {
  >     "usage": {
  >       "prompt_tokens": 659,
  >       "completion_tokens": 183,
  >       "total_tokens": 842
  >     }
  >   },
  >   "message": "Hola, John. Tu pedido #1 está en tránsito. No, no sé cocinar, pero puedo ayudarte con el seguimiento de tu pedido o cualquier otra consulta que tengas. Necesitás algo más?",
  > }
  > ```

  > **Log**:
  > ```json
  > {
  >   "type": "OFF_TOPIC",
  >   "userId": "U-001",
  >   "userMessage": "Hola, quiero saber el estado de mi pedido 1. Sabes cocinar?",
  >   "reason": "Tema no relacionado",
  >   "timestamp": "2025-01-28T00:27:16.680Z"
  > }
  > ```


---

## [⏭Continuar viendo edge cases](./ofrecer-productos.md)


