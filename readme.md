# ai-agent

---

## **Descripción del Proyecto**

Este proyecto implementa un **agente virtual** diseñado para interactuar con usuarios a través de texto. Está optimizado para brindar respuestas claras y eficientes en base a consultas predefinidas, como:

- Consultar el estado de un pedido.
- Ofrecer productos disponibles.
- Derivar consultas complejas a un agente humano.
- Manejar mensajes fuera de contexto (off-topic).

El objetivo principal es demostrar un flujo funcional y escalable, que pueda integrarse fácilmente en cualquier sistema de atención al cliente.

---

## **Configuración**

1. **Clonar el repositorio**:

   ```bash
   git clone https://github.com/lucasdellasala/ai-agent.git
   cd ai-agent-demo2
   ```

2. **Instalar dependencias**:

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   Crear un archivo `.env` en la raíz del proyecto con los siguientes valores:

   ```env
   OPENAI_API_KEY=tu_clave_openai
   PORT=3000
   ```

4. **Levantar el servidor**:

   ```bash
   npm run start
   ```

---

## **Uso**

El proyecto expone un endpoint principal para procesar los mensajes del usuario.

**Endpoint:** `POST /agent`

**Ejemplo de request:**

```json
{
  "message": "Hola, quiero saber el estado de mi pedido 1",
  "userId": "U-001"
}
```

**Ejemplo de respuesta:**

```json
{
  "context": {
    "requestId": "mql0t81zw",
    "startTime": 1738019181786,
    "provider": "openai",
    "user": {
      "id": "U-001",
      "name": "John Doe"
    },
    "usage": {
      "prompt_tokens": 498,
      "completion_tokens": 77,
      "total_tokens": 575
    },
    "orders": [
      {
        "orderId": "1",
        "status": "En tránsito"
      }
    ]
  },
  "message": "Hola, qué tal? El pedido #1 está en tránsito. Necesitás algo más?",
  "provider_response": {
    "types": ["ORDER_STATUS"],
    "details": {
      "orderIds": ["1"],
      "products": [],
      "reasons": []
    },
    "function_calls": [
      {
        "name": "functions.handle_order_status",
        "parameters": {
          "orderIds": ["1"],
          "products": [],
          "reason": ""
        }
      }
    ]
  }
}
```

**Endpoint:** `GET /logs`

**Ejemplo de response:**

```json
[
    {
        "type": "OFF_TOPIC",
        "userId": "U-001",
        "userMessage": "Hola, quiero una rueda y ¿sabes cocinar?",
        "reason": "Tema no relacionado",
        "timestamp": "2025-01-28T06:13:46.371Z"
    }
]
```

---

## Edge Cases

[🪒 edge-cases.md](./docs/edge-cases.md) 

---

## De Yapa

![de yapa](https://i.ibb.co/dbFq6Sn/deyapa.png)

Y por qué no integrar el servicio con otro proveedor como DeepSeek?🤔 
Ya está integrado!🎉

1. **Agregá la variable de entorno**:

   ```env
   DEEPSEEK_API_KEY=tu_clave_deepseek
   ```

2. Probá el request:

   **Ejemplo de request\***

   ```json
   {
     "message": "Hola, quiero saber el estado de mi pedido 1",
     "userId": "U-001",
     "provider": "deepseek"
   }
   ```

   **_Ejemplo de response_**

   ```json
   {
     "context": {
       "requestId": "tqyxk1s20",
       "startTime": 1738019740051,
       "provider": "deepseek",
       "user": {
         "id": "U-001",
         "name": "John Doe"
       },
       "orders": [
         {
           "orderId": "1",
           "status": "En tránsito"
         }
       ],
       "usage": {
         "prompt_tokens": 85,
         "completion_tokens": 34,
         "total_tokens": 119
       }
     },
     "message": "Hola, John. Tu pedido #1 está en tránsito. Te aviso si hay novedades. Necesitás algo más?",
     "provider_response": {
       "types": ["ORDER_STATUS"],
       "details": {
         "orderIds": ["1"]
       },
       "function_calls": [
         {
           "name": "handle_order_status",
           "parameters": {
             "orderIds": ["1"]
           }
         }
       ]
     }
   }
   ```

---

## Usage

Está bueno probar la implementación y ver los números, así que en la respuesta de cada request se puede ver el uso en tokens dentro del contexto. Para ver la comparación entre modelos te invito a ir al archivo [🪒 edge-cases.md](./docs/edge-cases.md) para ver en cada request cómo se comporta cada modelo.

---

## **Arquitectura**

El proyecto está organizado en una estructura modular para facilitar la escalabilidad:

```
src/
├── context/
│   └── context.ts               # Gestión del contexto del mensaje.
├── controllers/
│   └── agent.controller.ts      # Controlador principal para procesar mensajes.
├── services/
│   └── providers/
│       ├── openai/              # Lógica específica para OpenAI.
│       ├── deepseek/            # Lógica específica para Deepseek.
│       └── provider.selector.ts # Selección dinámica de proveedores.
├── data/
│   └── mockDB.ts                # Base de datos simulada para pruebas.
└── main.ts                     # Entrada principal del servidor.
```

## **Base de datos**

La base de datos está en memoria (son constantes en el archivo [mockDB.ts](./src/data/mockDB.ts)). Las tablas son las siguientes (para probar los requests):

---

### Tabla 1: Órdenes (`ordersDB`)

| **ID** | **Estado**            |
| ------ | --------------------- |
| 1      | En tránsito           |
| 2      | Entregado             |
| 3      | Pendiente de despacho |

---

### Tabla 2: Productos (`productsDB`)

| **ID** | **Nombre** | **Stock** |
| ------ | ---------- | --------- |
| P-100  | Rueda      | 10        |
| P-200  | Freno      | 5         |
| P-300  | Volante    | 0         |

---

### Tabla 3: Usuarios (`usersDB`)

| **ID** | **Nombre** |
| ------ | ---------- |
| U-001  | John Doe   |
| U-002  | Jane Doe   |

---

Autor: @lucasdellasala
