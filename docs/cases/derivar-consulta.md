## **Derivar Consulta**

### 1. Intenciones No Cubiertas

- **Caso**: Solicitudes de modificar pedidos.  
  **Mensaje**: "Hola, quiero cambiar la dirección de entrega de mi pedido."

  > **Log**:
  > ```json
  > {
  >   "type": "DERIVATION",
  >   "userId": "U-001",
  >   "userMessage": "Hola, quiero cambiar la dirección de entrega de mi pedido.",
  >   "reason": "Consulta compleja",
  >   "timestamp": "2025-01-28T00:06:20.546Z"
  > }
  > ```

- **Caso**: Reclamos o devoluciones. 
  **Mensaje**: "Hola, mi producto llegó roto!"

  > **Log**:
  > ```json
  > {
  >   "type": "DERIVATION",
  >   "userId": "U-001",
  >   "userMessage": "Hola, mi producto llegó roto!",
  >   "reason": "Consulta compleja",
  >   "timestamp": "2025-01-28T00:09:33.926Z"
  > }
  > ```

- **Caso**: Consultas sobre políticas. 
  **Mensaje**: "Hola, cómo es el tema de la garantía?"

  > **Log**:
  > ```json
  > {
  >   "type": "DERIVATION",
  >   "userId": "U-001",
  >   "userMessage": "Hola, cómo es el tema de la garantía?",
  >   "reason": "Consulta compleja",
  >   "timestamp": "2025-01-28T00:10:28.238Z"
  > }
  > ```

- **Caso**: Solicitudes de contacto humano directo.
  **Mensaje**: "Por favor, que me contacte tu jefe"

  > **Log**:
  > ```json
  > {
  >   "type": "DERIVATION",
  >   "userId": "U-001",
  >   "userMessage": "Por favor, que me contacte tu jefe",
  >   "reason": "Consulta compleja",
  >   "timestamp": "2025-01-28T00:11:37.874Z"
  > }
  > ```

---

### 2. Falsos positivos:

- **Caso**: El agente deriva consultas que sí podría resolver.
  **Mensaje**: "Quiero comprar una rueda, tienen?"

  > **OpenAI**
  > ```json
  > {
  >   "context": {
  >     "usage": {
  >       "prompt_tokens": 488,
  >       "completion_tokens": 79,
  >       "total_tokens": 567
  >     }
  >   },
  >   "message": "Hola, John! Sí, tenemos diferentes tipos de ruedas. Qué tipo estás buscando específicamente?"
  > }
  > ```

  > **DeepSeek**
  > ```json
  > {
  >   "context": {
  >     "usage": {
  >       "prompt_tokens": 647,
  >       "completion_tokens": 104,
  >       "total_tokens": 751
  >     }
  >   },
  >   "message": "Hola! Claro, tenemos ruedas. Qué tipo de rueda necesitás? Para auto, moto, bici? Contame más detalles así te paso la info correcta."
  > }
  > ```

---

## [⏭Continuar viendo edge cases](./off-topic.md)
