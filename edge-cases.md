# Edge Cases por Funcionalidad:

### Informar Estado de Pedido:

1. ID Inválido:

   - El ID contiene caracteres no numéricos (ej. "ABC1"):
     "Hola, quiero saber el estado de mi pedido 1"

     **OpenAI** ($0.002285)

     ```json
     {
       "context": {
         "usage": {
           "prompt_tokens": 494,
           "completion_tokens": 105,
           "total_tokens": 599
         }
       },
       "message": "Hola, cómo andás? No veo ningún pedido con el código ABC1 registrado con tu nombre. Podrás chequear si está correcto?"
     }
     ```

     **DeepSeek** ($0.00002198)

     ```json
     {
       "context": {
         "usage": {
           "prompt_tokens": 79,
           "completion_tokens": 39,
           "total_tokens": 118
         }
       },
       "message": "Hola, John. No encontré ningún pedido con el número ABC1. Podrías confirmarme el número correcto? Así te puedo ayudar mejor. Gracias!"
     }
     ```

   - El ID tiene un formato incorrecto (ej. "Pedido #1" vs. "1").
     "Hola, quiero saber el estado de mi pedido #1"
     **OpenAI**

     ```json
     {
       "context": {
         "usage": {
           "prompt_tokens": 498,
           "completion_tokens": 75,
           "total_tokens": 573
         }
       },
       "message": "Hola! El pedido #1 está en tránsito. Querés saber algo más?"
     }
     ```

     **DeepSeek**

     ```json
     {
       "context": {
         "usage": {
           "prompt_tokens": 85,
           "completion_tokens": 35,
           "total_tokens": 120
         }
       },
       "message": "Hola, John! Tu pedido #1 está en tránsito. Te aviso cuando haya novedades. Necesitás algo más?"
     }
     ```

2. ID No Existente:

   - El ID es válido pero no existe en la base de datos.
     "Hola, quiero saber el estado de mi pedido 5"
     **OpenAI**

     ```json
     {
       "context": {
         "usage": {
           "prompt_tokens": 494,
           "completion_tokens": 239,
           "total_tokens": 733
         }
       },
       "message": "Hola, me parece que no tengo datos específicos sobre tu pedido #5. Tenés otro número de referencia o algún dato adicional para ayudarme a encontrarlo?"
     }
     ```

     **DeepSeek**

     ```json
     {
       "context": {
         "usage": {
           "prompt_tokens": 79,
           "completion_tokens": 47,
           "total_tokens": 126
         }
       },
       "message": "Hola, John. No tengo registros de un pedido número 5. Podrías confirmarme el número o si hiciste algún pedido recientemente? Así te puedo ayudar mejor. Gracias."
     }
     ```

   - El ID corresponde a un pedido cancelado/eliminado: no implementado.

3. Falta de ID:

   - El usuario menciona "estado de mi pedido" pero no proporciona el ID.
     "Hola, quiero saber el estado de mi pedido."
     **OpenAI**

     ```json
     {
       "context": {
         "usage": {
           "prompt_tokens": 496,
           "completion_tokens": 56,
           "total_tokens": 552
         }
       },
       "message": "Hola! Necesito que me pases el número de tu pedido así te ayudo a buscar el estado, dale?"
     }
     ```

     **DeepSeek**

     ```json
     {
       "context": {
         "usage": {
           "prompt_tokens": 83,
           "completion_tokens": 57,
           "total_tokens": 140
         }
       },
       "message": "Hola, John! Para poder ayudarte con el estado de tu pedido, necesitaría que me pases el número de pedido. Lo tenés a mano? Así puedo buscarlo y darte la info que necesitás. Gracias!"
     }
     ```

   - El usuario envía múltiples IDs en un solo mensaje.
     "Hola, quiero saber el estado de mi pedido 1 y 2."
     **OpenAI**

     ```json
     {
       "context": {
         "usage": {
           "prompt_tokens": 512,
           "completion_tokens": 89,
           "total_tokens": 601
         }
       },
       "message": "Hola! El pedido #1 está en tránsito y el pedido #2 ya fue entregado. Te puedo ayudar con algo más?"
     }
     ```

     **DeepSeek**

     ```json
     {
       "context": {
         "usage": {
           "prompt_tokens": 96,
           "completion_tokens": 55,
           "total_tokens": 151
         }
       },
       "message": "Hola, John. Ahí te tiro el estado de tus pedidos:\n\n- Pedido #1: Está en tránsito.\n- Pedido #2: Ya fue entregado.\n\nSi necesitás más info, avisá. 👌"
     }
     ```

4. Problemas de Base de Datos:
   - La base de datos está caída o no responde: no implementado.
   - Timeouts al consultar el estado: no implementado.
5. Permisos/Seguridad:
   - El ID pertenece a otro usuario (no debe revelar información): no se implementó lógica de usuarios o pedidos asociados a usuarios.

### Derivar Consulta:

1. Intenciones No Cubiertas:

   - Solicitudes de modificar pedidos.
     "Hola, quiero cambiar la dirección de entrega de mi pedido."

     ```json
     log:
      {
          "type": "DERIVATION",
          "userId": "U-001",
          "userMessage": "Hola, quiero cambiar la dirección de entrega de mi pedido.",
          "reason": "Consulta compleja",
          "timestamp": "2025-01-28T00:06:20.546Z"
      }
     ```

   - Reclamos o devoluciones (ej. "Mi producto llegó roto").
     "Hola, mi producto llegó roto!"
     ```json
     log:
     {
        "type": "DERIVATION",
        "userId": "U-001",
        "userMessage": "Hola, mi producto llegó roto!",
        "reason": "Consulta compleja",
        "timestamp": "2025-01-28T00:09:33.926Z"
     }
     ```
   - Consultas sobre políticas.
     "Hola, cómo es el tema de la garantía?"
     ```json
     log:
     {
        "type": "DERIVATION",
        "userId": "U-001",
        "userMessage": "Hola, cómo es el tema de la garantía?",
        "reason": "Consulta compleja",
        "timestamp": "2025-01-28T00:10:28.238Z"
     }
     ```
   - Solicitudes de contacto humano directo.
     "Por favor, que me contacte tu jefe"
     ```json
     log:
     {
        "type": "DERIVATION",
        "userId": "U-001",
        "userMessage": "Por favor, que me contacte tu jefe",
        "reason": "Consulta compleja",
        "timestamp": "2025-01-28T00:11:37.874Z"
     }
     ```

2. Falsos Positivos:

   - El agente deriva consultas que sí podría resolver (ej. "Quiero comprar una rueda" ➔ debería ofrecer productos, no derivar).
     "Quiero comprar una rueda, tienen?"
     **OpenAI**

     ```json
     {
       "context": {
         "usage": {
           "prompt_tokens": 488,
           "completion_tokens": 79,
           "total_tokens": 567
         }
       },
       "message": "Hola, John! Sí, tenemos diferentes tipos de ruedas. Qué tipo estás buscando específicamente?"
     }
     ```

     **DeepSeek**

     ```json
     {
       "context": {
         "usage": {
           "prompt_tokens": 75,
           "completion_tokens": 45,
           "total_tokens": 120
         }
       },
       "message": "Hola! Claro, tenemos ruedas. Qué tipo de rueda necesitás? Para auto, moto, bici? Contame más detalles así te paso la info correcta."
     }
     ```

3. Registro de Derivación:
   - Fallas al guardar el registro (ej. log service no disponible): no implementado.
   - Mensajes demasiado largos que no se registran completamente: no implementado.

### Off-Topic:

1. Mensajes Ambiguos:
   - Saludos sin contexto.
     "Hola"
     ```json
     {
       "type": "OFF_TOPIC",
       "userId": "U-001",
       "userMessage": "Hola!",
       "reason": "Tema no relacionado",
       "timestamp": "2025-01-28T00:22:19.028Z"
     }
     ```
   - Agradecimientos.
     "Gracias por tu ayuda"
     ```json
     {
       "type": "OFF_TOPIC",
       "userId": "U-001",
       "userMessage": "Gracias por tu ayuda",
       "reason": "Tema no relacionado",
       "timestamp": "2025-01-28T00:24:17.847Z"
     }
     ```
   - Preguntas sobre temas externos.
     "¿Cómo está el clima?"
     ```json
     {
       "type": "OFF_TOPIC",
       "userId": "U-001",
       "userMessage": "¿Cómo está el clima?",
       "reason": "Tema no relacionado",
       "timestamp": "2025-01-28T00:24:54.238Z"
     }
     ```
2. Mezcla de Intenciones:

   - Mensajes que combinan on-topic y off-topic (ej. "Hola, quiero una rueda y ¿sabes cocinar?").
     **OpenAI**

     ````json
       {
         "context": {
       "usage": {
           "prompt_tokens": 508,
           "completion_tokens": 97,
           "total_tokens": 605
       },
         },
         "message": "Hola, John. Tu pedido #1 está en tránsito. Y sobre cocinar, siempre es algo que disfruto. Hay algo más en lo que pueda ayudarte?",

       }
       ```
     **DeepSeek**
     ```json
       {
         "context": {
           "usage": {
             "prompt_tokens": 92,
             "completion_tokens": 54,
             "total_tokens": 146
           }
         },
         "message": "Hola, John. Tu pedido #1 está en tránsito. No, no sé cocinar, pero puedo ayudarte con el seguimiento de tu pedido o cualquier otra consulta que tengas. Necesitás algo más?",

       }
       ```
       ```json
         log
         {
             "type": "OFF_TOPIC",
             "userId": "U-001",
             "userMessage": "Hola, quiero saber el estado de mi pedido 1. Sabes cocinar?",
             "reason": "Tema no relacionado",
             "timestamp": "2025-01-28T00:27:16.680Z"
         }
       ```
     ````

3. Spam/Abuso:
   - Mensajes con contenido inapropiado o repetitivo.
      ```json
      {
        "type": "OFF_TOPIC",
        "userId": "U-001",
        "userMessage": "Soretes!!!! Soretes!!! Soretes!!!! Soretes!!!",
        "reason": "Tema no relacionado",
        "timestamp": "2025-01-28T00:31:17.523Z"
      }
      ```

## Doc TBD

### Ofrecer Productos:

1. Productos No Existentes:
   - El usuario solicita un producto fuera del catálogo (ej. "Quiero una bicicleta eléctrica" ➔ pero no hay en la DB).
   - Productos descontinuados o sin stock.
2. Solicitudes Ambiguas:
   - Descripciones vagas (ej. "Algo barato", "Lo más vendido").
   - Errores de escritura (ej. "rueda" ➔ "ruedda").
3. Múltiples Productos:
   - El usuario pide muchos productos en un solo mensaje (ej. "Muéstrame ruedas, sillines y cascos").

### Edge Cases Generales:

1. Múltiples Intenciones en un Mensaje:
   - "Quiero saber el estado del pedido 123 y comprar una rueda".
2. Límites Técnicos:
   - Mensajes muy largos que exceden el límite de tokens de la API de OpenAI.
   - Tiempos de respuesta elevados de la API de OpenAI.
   - Errores de autenticación con la API de OpenAI (ej. clave inválida).
3. Seguridad:
   - Inyección de código/SQL en los inputs del usuario.
   - Exposición de datos sensibles en logs (ej. IDs de pedidos).
4. Errores Inesperados:
   - Excepciones no controladas al procesar mensajes.
   - Fallas en la conexión con la base de datos.

### Pendientes/Futuras Tareas:

1. Manejo de Conversaciones Multi-Turno:
   - Si el usuario responde "sí" después de que el agente pregunte "¿Desea ver otros productos?".
2. Validación de Permisos:
   - Asegurar que el usuario solo consulte sus propios pedidos (requiere autenticación).
3. Manejo de Contexto:
   - Si el usuario escribe "¿Y sobre mi pedido anterior?" sin dar un ID.
4. Escalabilidad:
   - Cómo manejar altos volúmenes de solicitudes simultáneas.
5. Internacionalización:
   - Soporte para múltiples idiomas/regiones.
6. Testing de Modelo de OpenAI:
   - Evaluar falsos positivos/negativos en la clasificación de intenciones.

```json

```

## Pricing

Los precios están calculados solo para el primer ejemplo de manera ilustrativa en base a los modelos [gpt-4o](https://openai.com/api/pricing/) y [deepseek-chat](https://api-docs.deepseek.com/quick_start/pricing) obtenidos de sus respectivas webs. No se contempla precio cache ni batch. Se obtiene el precio por token y luego se multiplica por la cantidad de tokens. DeepSeek está en promo "From now until 2025-02-08 16:00 (UTC), all users can enjoy the discounted prices of DeepSeek API".

### Precio por token

- OpenAI: 2.5USD / 1M input | 10USD / 1M output.
- DeepSeek: 0.14USD / 1M input | 0.28USD / 1M output.
