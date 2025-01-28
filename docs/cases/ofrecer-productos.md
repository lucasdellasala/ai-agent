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
  >       "prompt_tokens": 653,
  >       "completion_tokens": 113,
  >       "total_tokens": 766
  >     }
  >   },
  >   "message": "No, no tenemos bicis. Tenemos rueda y freno en stock. Te sirve?"
  > }
  > ```

- **Caso**: Productos sin stock.
  **Mensaje**: "Quiero un volante tienen?"

  > **OpenAI**
  > ```json
  > {
  >   "context": {
  >     "usage": {
  >       "prompt_tokens": 486,
  >       "completion_tokens": 86,
  >       "total_tokens": 572
  >     }
  >   },
  >   "message": "Hola, John. Mirá, justo ahora no tenemos stock de volantes. Cualquier otra cosa que necesites, avisame.",
  > }
  > ```

  > **DeepSeek**
  > ```json
  > {
  >   "context": {
  >     "usage": {
  >       "prompt_tokens": 638,
  >       "completion_tokens": 102,
  >       "total_tokens": 740
  >     }
  >   },
  >   "message": "No, lamentablemente el volante está sin stock por ahora. Te interesa que te avise cuando tengamos?",
  > }
  > ```

---

### 2. Solicitudes Ambiguas:

- **Caso**: Descripciones vagas
  **Mensaje**: "Me podés ofrecer lo más vendido?"

  > **OpenAI**
  > ```json
  > {
  >   "context": {
  >     "usage": {
  >       "prompt_tokens": 503,
  >       "completion_tokens": 96,
  >       "total_tokens": 599
  >     }
  >   },
  >   "message": "Claro, che. Lo más vendido en este momento son las ruedas y los frenos, que casualmente están en stock. Si querés algo más, avísame.",
  > }
  > ```

  > **DeepSeek**
  > ```json
  > {
  >   "context": {
  >     "usage": {
  >       "prompt_tokens": 659,
  >       "completion_tokens": 128,
  >       "total_tokens": 787
  >     }
  >   },
  >   "message": "Claro, John. Lo más vendido ahora son las ruedas y los frenos. Ambos están en stock. Si te interesa, avisame y te armo el pedido.",
  > }
  > ```

- **Caso**: Errores de escritura.
  **Mensaje**: "Quiero una ruedda tienen?"

  > **OpenAI**
  > ```json
  > {
  >   "context": {
  >     "usage": {
  >       "prompt_tokens": 489,
  >       "completion_tokens": 77,
  >       "total_tokens": 566
  >     }
  >   },
  >   "message": "Sí, tenemos ruedas en stock. Querés que te ayude con el pedido?",
  > }
  > ```

  > **DeepSeek**
  > ```json
  > {
  >   "context": {
  >     "usage": {
  >       "prompt_tokens": 641,
  >       "completion_tokens": 112,
  >       "total_tokens": 753
  >     }
  >   },
  >   "message": "Dale, John! Tenemos ruedas en stock. Cuántas necesitás? Así te la preparamos.",
  > }
  > ```

---

### 3. Múltiples Productos:

- **Caso**: El usuario pide muchos productos en un solo mensaje.
  **Mensaje**: "Tenés volantes, ruedas y frenos?"

  > **OpenAI**
  > ```json
  > {
  >   "context": {
  >     "usage": {
  >       "prompt_tokens": 507,
  >       "completion_tokens": 97,
  >       "total_tokens": 604
  >     }
  >   },
  >   "message": "Tenemos ruedas y frenos en stock. Los volantes están sin stock por ahora. Te interesa igual?",
  > }
  > ```

  > **DeepSeek**
  > ```json
  > {
  >   "context": {
  >     "usage": {
  >       "prompt_tokens": 661,
  >       "completion_tokens": 129,
  >       "total_tokens": 790
  >     }
  >   },
  >   "message": "Hola John. Mirá, tenemos ruedas y frenos en stock, pero los volantes están sin stock por ahora. Te sirve igual o necesitás los tres productos?",
  > }
  > ```

---

## [⏭Continuar viendo edge cases](./generales.md)
