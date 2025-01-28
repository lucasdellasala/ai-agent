## Edge Cases Generales:

### 1. **Caso**: Múltiples Intenciones en un Mensaje.
  **Mensaje**: "Quiero saber el estado del pedido 1 y comprar una rueda".

  > **OpenAI**
  > ```json
  > {
  >   "context": {
  >     "usage": {
  >       "prompt_tokens": 506,
  >       "completion_tokens": 120,
  >       "total_tokens": 626
  >     }
  >   },
  >   "message": "El pedido #1 está en tránsito. Sobre la rueda, perfecto! Están en stock. Te gustaría que la agreguemos al carrito?",
  > }
  > ```

  > **DeepSeek**
  > ```json
  > {
  >   "context": {
  >     "usage": {
  >       "prompt_tokens": 667,
  >       "completion_tokens": 178,
  >       "total_tokens": 845
  >     }
  >   },
  >   "message": "Tu pedido #1 está en tránsito, ya está en camino. Y la rueda está en stock, así que no hay drama. Querés que te la reserve o la agregamos a un nuevo pedido?",
  > }
  > ```

### 2. Límites Técnicos:
- **Caso**:Mensajes muy largos que exceden el límite de tokens de la API de OpenAI: no implementado.
- **Caso**: Tiempos de respuesta elevados de la API de OpenAI: no implementado.
### 3. Seguridad:
- **Caso**: Inyección de código/SQL en los inputs del usuario: al utilizar el sdk de openai no estaríamos añadiendo una brecha de seguridad que no tenga el sdk.

---

## [⏭Continuar viendo edge cases](./next-steps.md)
