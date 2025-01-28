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
  >       "prompt_tokens": 653,
  >       "completion_tokens": 124,
  >       "total_tokens": 777
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
  >       "prompt_tokens": 659,
  >       "completion_tokens": 90,
  >       "total_tokens": 749
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
  >       "prompt_tokens": 653,
  >       "completion_tokens": 108,
  >       "total_tokens": 761
  >     }
  >   },
  >   "message": "Hola, John. No tengo registros de un pedido número 5. Podrías confirmarme el número o si hiciste algún pedido recientemente? Así te puedo ayudar mejor. Gracias."
  > }
  > ```

- **Caso**: El ID corresponde a un pedido cancelado/eliminado: no implementado.

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
  >       "prompt_tokens": 654,
  >       "completion_tokens": 89,
  >       "total_tokens": 743
  >     }
  >   },
  >   "message": "Hola, John! Para poder ayudarte con el estado de tu pedido, necesitaría que me pases el número de pedido. Lo tenés a mano? Así puedo buscarlo y darte la info que necesitás. Gracias!"
  > }
  > ```

- **Caso**: El usuario envía múltiples IDs en un solo mensaje.
  **Mensaje**: "Hola, quiero saber el estado de mi pedido 1 y 2."

  > **OpenAI**
  > ```json
  > {
  >   "context": {
  >     "usage": {
  >       "prompt_tokens": 512,
  >       "completion_tokens": 89,
  >       "total_tokens": 601
  >     }
  >   },
  >   "message": "Hola! El pedido #1 está en tránsito y el pedido #2 ya fue entregado. Te puedo ayudar con algo más?"
  > }
  > ```

  > **DeepSeek**
  > ```json
  > {
  >   "context": {
  >     "usage": {
  >       "prompt_tokens": 672,
  >       "completion_tokens": 139,
  >       "total_tokens": 811
  >     }
  >   },
  >   "message": "Hola, John. Ahí te tiro el estado de tus pedidos:\n\n- Pedido #1: Está en tránsito.\n- Pedido #2: Ya fue entregado.\n\nSi necesitás más info, avisá. 👌"
  > }
  > ```

---

### 4. Problemas de Base de Datos:

- **Caso**: La base de datos está caída o no responde: no implementado.
- **Caso**: Timeouts al consultar el estado: no implementado.

---

### 5. Permisos/Seguridad:

- **Caso**: El ID pertenece a otro usuario (no debe revelar información): no se implementó lógica de usuarios o pedidos asociados a usuarios.

---

## [⏭Continuar viendo edge cases](./derivar-consulta.md)
