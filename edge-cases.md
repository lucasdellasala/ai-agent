# Edge Cases por Funcionalidad

---

## **Informar Estado de Pedido**

### 1. ID Inválido

- **Caso**: El ID contiene caracteres no numéricos (ej. "ABC1").  
  **Mensaje**: "Hola, quiero saber el estado de mi pedido ABC1."

  > **OpenAI**
  > ```json
  > {
  >   "context": {
  >     "usage": {
  >       "prompt_tokens": 494,
  >       "completion_tokens": 105,
  >       "total_tokens": 599
  >     }
  >   },
  >   "message": "Hola, cómo andás? No veo ningún pedido con el código ABC1 registrado con tu nombre. Podrás chequear si está correcto?"
  > }
  > ```

  > **DeepSeek**
  > ```json
  > {
  >   "context": {
  >     "usage": {
  >       "prompt_tokens": 79,
  >       "completion_tokens": 39,
  >       "total_tokens": 118
  >     }
  >   },
  >   "message": "Hola, John. No encontré ningún pedido con el número ABC1. Podrías confirmarme el número correcto? Así te puedo ayudar mejor. Gracias!"
  > }
  > ```

- **Caso**: El ID tiene un formato incorrecto (ej. "Pedido #1" vs. "1").  
  **Mensaje**: "Hola, quiero saber el estado de mi pedido #1."

  > **OpenAI**
  > ```json
  > {
  >   "context": {
  >     "usage": {
  >       "prompt_tokens": 498,
  >       "completion_tokens": 75,
  >       "total_tokens": 573
  >     }
  >   },
  >   "message": "Hola! El pedido #1 está en tránsito. Querés saber algo más?"
  > }
  > ```

  > **DeepSeek**
  > ```json
  > {
  >   "context": {
  >     "usage": {
  >       "prompt_tokens": 85,
  >       "completion_tokens": 35,
  >       "total_tokens": 120
  >     }
  >   },
  >   "message": "Hola, John! Tu pedido #1 está en tránsito. Te aviso cuando haya novedades. Necesitás algo más?"
  > }
  > ```

---

### 2. ID No Existente

- **Caso**: El ID es válido pero no existe en la base de datos.  
  **Mensaje**: "Hola, quiero saber el estado de mi pedido 5."

  > **OpenAI**
  > ```json
  > {
  >   "context": {
  >     "usage": {
  >       "prompt_tokens": 494,
  >       "completion_tokens": 239,
  >       "total_tokens": 733
  >     }
  >   },
  >   "message": "Hola, me parece que no tengo datos específicos sobre tu pedido #5. Tenés otro número de referencia o algún dato adicional para ayudarme a encontrarlo?"
  > }
  > ```

  > **DeepSeek**
  > ```json
  > {
  >   "context": {
  >     "usage": {
  >       "prompt_tokens": 79,
  >       "completion_tokens": 47,
  >       "total_tokens": 126
  >     }
  >   },
  >   "message": "Hola, John. No tengo registros de un pedido número 5. Podrías confirmarme el número o si hiciste algún pedido recientemente? Así te puedo ayudar mejor. Gracias."
  > }
  > ```

---

### 3. Falta de ID

- **Caso**: El usuario menciona "estado de mi pedido" pero no proporciona el ID.  
  **Mensaje**: "Hola, quiero saber el estado de mi pedido."

  > **OpenAI**
  > ```json
  > {
  >   "context": {
  >     "usage": {
  >       "prompt_tokens": 496,
  >       "completion_tokens": 56,
  >       "total_tokens": 552
  >     }
  >   },
  >   "message": "Hola! Necesito que me pases el número de tu pedido así te ayudo a buscar el estado, dale?"
  > }
  > ```

  > **DeepSeek**
  > ```json
  > {
  >   "context": {
  >     "usage": {
  >       "prompt_tokens": 83,
  >       "completion_tokens": 57,
  >       "total_tokens": 140
  >     }
  >   },
  >   "message": "Hola, John! Para poder ayudarte con el estado de tu pedido, necesitaría que me pases el número de pedido. Lo tenés a mano? Así puedo buscarlo y darte la info que necesitás. Gracias!"
  > }
  > ```

---

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

---

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

## **Ofrecer Productos**

### 1. Productos No Existentes

- **Caso**: El usuario solicita un producto fuera del catálogo.  
  **Mensaje**: "Quiero una bici, tienen?"

  > **OpenAI**
  > ```json
  > {
  >   "context": {
  >     "usage": {
  >       "prompt_tokens": 499,
  >       "completion_tokens": 84,
  >       "total_tokens": 583
  >     }
  >   },
  >   "message": "Hola! Por ahora no tengo bicis, pero tenemos ruedas y frenos disponibles. Te interesa algún otro producto?"
  > }
  > ```

  > **DeepSeek**
  > ```json
  > {
  >   "context": {
  >     "usage": {
  >       "prompt_tokens": 92,
  >       "completion_tokens": 34,
  >       "total_tokens": 126
  >     }
  >   },
  >   "message": "No, no tenemos bicis. Tenemos rueda y freno en stock. Te sirve?"
  > }
  > ```

---

## **Pricing**

Los precios están calculados en base a los modelos [gpt-4o](https://openai.com/api/pricing/) y [deepseek-chat](https://api-docs.deepseek.com/quick_start/pricing). No se contempla precio cache ni batch. DeepSeek está en promo hasta el 2025-02-08.

### Precio por Token

- **OpenAI**:
    - 2.5USD / 1M input.
    - 10USD / 1M output.
- **DeepSeek**:
    - 0.14USD / 1M input.
    - 0.28USD / 1M output.

### Nota
Una vez terminado este documento me di cuenta que es demasiada la diferencia de tokens entre OpenAI y DeepSeek. Más allá del precio por token, la cantidad de tokens debería ser similar. Voy a hacer un commit y en un commit siguiente haré las correcciones pertinentes en el servicio pero por cuestiones de tiempo no voy a editar este documento.
