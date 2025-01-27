# Challenge Gen AI DEV - Volanti.ai

---

#### **Descripción del Proyecto**

Este proyecto implementa un **agente virtual** diseñado para interactuar con usuarios a través de texto. Está optimizado para brindar respuestas claras y eficientes en base a consultas predefinidas, como:

- Consultar el estado de un pedido.
- Ofrecer productos disponibles.
- Derivar consultas complejas a un agente humano.
- Manejar mensajes fuera de contexto (off-topic).

El objetivo principal es demostrar un flujo funcional y escalable, que pueda integrarse fácilmente en cualquier sistema de atención al cliente.

---

#### **Características**

- **Compatibilidad con Múltiples Proveedores**: Implementación modular para usar tanto OpenAI como Deepseek, según las necesidades del negocio.
- **Optimización de Tokens**: Minimiza el costo por solicitud utilizando prompts y respuestas estructuradas de manera eficiente.
- **Extensibilidad**: El diseño está pensado para que sea sencillo agregar nuevos proveedores o funciones en el futuro.
- **TODO: Gestión de Contexto**: Mantiene un historial limitado de la conversación para mejorar la interacción con el usuario.

---

#### **Requerimientos**

- **Node.js** v16 o superior.
- **NPM** o **Yarn**.
- Cuenta activa en **OpenAI** y/o **Deepseek** para configurar las claves API.

---

#### **Configuración**

1. **Clonar el repositorio**:

   ```bash
   git clone https://github.com/tu_usuario/agente-virtual.git
   cd agente-virtual
   ```

2. **Instalar dependencias**:

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   Crear un archivo `.env` en la raíz del proyecto con los siguientes valores:

   ```env
   OPENAI_API_KEY=tu_clave_openai
   DEEPSEEK_API_KEY=tu_clave_deepseek
   PORT=3000
   ```

4. **Levantar el servidor**:
   ```bash
   npm run start
   ```

---

#### **Uso**

El proyecto expone un endpoint principal para procesar los mensajes del usuario.

**Endpoint:** `POST /agent`

**Ejemplo de request:**

```json
{
  "message": "Hola, quiero saber el estado de mi pedido 1",
  "userId": "U-001",
  "provider": "openai"
}
```

**Ejemplo de respuesta:**

```json
{
  "context": {
    "userId": "U-001",
    "userName": "John Doe",
    "orderStatus": {
      "orderId": "1",
      "status": "En tránsito"
    }
  },
  "userId": "U-001",
  "message": {
    "role": "assistant",
    "content": "Hola! El pedido 1 está en tránsito. Necesitás algo más?",
    "refusal": null
  },
  "intent": {
    "type": "ORDER_STATUS",
    "details": {
      "orderId": "1",
      "products": [],
      "reason": ""
    },
    "function_call": {
      "name": "functions.handle_order_status",
      "parameters": {
        "orderId": "1",
        "products": [],
        "reason": ""
      }
    }
  }
}
```

---

#### **Arquitectura**

El proyecto está organizado en una estructura modular para facilitar la escalabilidad:

```
src/
├── controllers/
│   └── agent.controller.ts      # Controlador principal para procesar mensajes.
├── services/
│   ├── providers/
│   │   ├── openai/              # Lógica específica para OpenAI.
│   │   ├── deepseek/            # Lógica específica para Deepseek.
│   │   └── provider.selector.ts # Selección dinámica de proveedores.
│   ├── context.ts        # Gestión del contexto del mensaje.
│   └── utils/
│       └── sanitizeContent.ts   # Funciones de utilidad para limpiar respuestas.
├── data/
│   └── mockDB.ts                # Base de datos simulada para pruebas.
└── index.ts                     # Entrada principal del servidor.
```
