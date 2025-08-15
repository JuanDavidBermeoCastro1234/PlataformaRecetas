# API – Gestión de Usuarios, Recetas e Ingredientes (Express + MongoDB)

Este proyecto expone una API REST para gestionar **usuarios**, **recetas** e **ingredientes** usando **Node.js (Express)** y **MongoDB**.

> **Requisito de entrega**  
> - README documentado con instrucciones y endpoints (este archivo).  
> - **Video demostrativo** (máx. 10 min, con cámara activa de todos los integrantes) usando **Insomnia o Postman** que muestre:  
>   - Ejecución de cada operación solicitada.  
>   - Búsqueda por ingrediente.  
>   - Listado de recetas por usuario.  
> - Agregar el **link del video** más abajo en la sección indicada.

---

## ⚙️ Requisitos

- Node.js 18+
- MongoDB en ejecución (local o en la nube)
- `npm` o `pnpm`

---

## 🚀 Instalación y Configuración

1. **Clonar** el repo y entrar a la carpeta del proyecto.
2. **Instalar dependencias:**
   ```bash
   npm install
   ```
3. **Variables de entorno** (`.env` en la raíz):
   ```env
    PORT=3000  
    DB_URI=mongodb+srv://Juancho123:1096065716@juancho.asxw736.mongodb.net/?retryWrites=true&w=majority&appName=Juancho

    DB_NAME= recetasdb

   ```

---

**cargar base de datos :**
```bash
node db/dataset.js
```

---

## ▶️ Ejecutar

```bash
# descarga dependencias
npm i

# ejecuta el servidor 
npm run dev
```
**Base URL:** `http://localhost:3000`  
Recuerda enviar `Content-Type: application/json` en las solicitudes con body.

---

## 🔐 Estructura de colecciones (MongoDB)

- **usuarios**
  ```json
  {
    "_id": 1,
    "nombre": "Andres",
    "cedula": 10245631,
    "pais": "Colombia",
    "id_recetas": [1, 2]
  }
  ```
- **recetas**
  ```json
  {
    "_id": 1,
    "user_id": 1,
    "nombre": "Agua",
    "descripcion": "Hacer tales",
    "ingredientes": ["H", "2", "O"]
  }
  ```

---

## 📚 Endpoints

### 1) Gestión de **Usuarios** (`/usuario`)

> Basado en tu `routers/router.js` (estilo simple + validaciones mínimas que ya tienes).

- **Registrar nuevo usuario**  
  **POST** `/usuario/create`  
  **Body:**
  ```json
  {
    "_id": 5,
    "nombre": "Pedro",
    "pais": "Colombia",
    "cedula": 12345678,
    "id_recetas": [1, 2]
  }
  ```

- **Listar todos los usuarios (proyección _id, nombre)**  
  **GET** `/usuario/getall`

- **Ver usuario por id**  
  **GET** `/usuario/getId/3`

- **Actualizar (reemplazo total)**  
  **PUT** `/usuario/put/3`  
  **Body:**
  ```json
  {
    "nombre": "Juan Actualizado",
    "pais": "Colombia",
    "cedula": 999999,
    "id_recetas": [5, 6]
  }
  ```

- **Actualizar (parcial)**  
  **PATCH** `/usuario/patch/2`  
  **Body (ejemplos):**
  ```json
  { "cedula": 88888888 }
  ```
  ```json
  { "nombre": "Luisa M.", "pais": "Chile" }
  ```

- **Eliminar usuario + recetas asociadas**  
  **DELETE** `/usuario/delete/4`

---

### 2) Gestión de **Recetas** (`/recetas`)

- **Crear receta**  
  **POST** `/recetas/create`  
  **Body:**
  ```json
  {
    "_id": 8,
    "user_id": 2,
    "nombre": "Pasta al pesto",
    "descripcion": "Pasta con salsa de albahaca",
    "ingredientes": ["Pasta", "Albahaca", "Ajo"]
  }
  ```

- **Listar todas las recetas**  
  **GET** `/recetas/getall`

- **Consultar una receta específica (incluye ingredientes)**  
  **GET** `/recetas/get/3`

- **Editar título o descripción (parcial)**  
  **PATCH** `/recetas/patch/3`  
  **Body (uno o ambos):**
  ```json
  {
    "nombre": "Ensalada fresca",
    "descripcion": "Verdes crujientes con aderezo ligero"
  }
  ```

- **Eliminar receta**  
  **DELETE** `/recetas/delete/7`

- **Listar todas las recetas de un usuario**  
  **GET** `/recetas/by-user/2`

---

### 3) Gestión de **Ingredientes** (`/ingredientes`)

- **Agregar ingredientes a una receta**  
  **POST** `/ingredientes/add`  
  **Body (acepta string o array):**
  ```json
  {
    "receta_id": 5,
    "ingredientes": ["Cilantro", "Limón"]
  }
  ```
  *(o)*
  ```json
  {
    "receta_id": 5,
    "ingredientes": "Cilantro"
  }
  ```

- **Ver todos los ingredientes de una receta**  
  **GET** `/ingredientes/by-receta/5`

- **Eliminar ingredientes de una receta**  
  **DELETE** `/ingredientes/remove`  
  **Body:**
  ```json
  {
    "receta_id": 5,
    "ingredientes": ["Limón"]
  }
  ```

- **Buscar recetas por ingrediente**  
  **GET** `/ingredientes/search/pollo`

---

## ✅ Códigos de estado (convención usada)

- `200 OK` – Operación exitosa
- `201 Created` – Creación exitosa
- `400 Bad Request` – Datos inválidos/faltantes
- `404 Not Found` – Recurso no encontrado
- `409 Conflict` – Duplicado (p. ej. `_id` repetido al crear usuario)
- `500 Internal Server Error` – Error no controlado

---

## 🎬 Video demostrativo

**Video:** _[Pega el link del video aquí]_


---

## 📝 Notas

- En este proyecto los `_id` de `usuarios` y `recetas` son **numéricos** por simplicidad para consultas con un solo numero y no un object id completo.
- Los arrays (`id_recetas`, `ingredientes`) se almacenan en formato estándar de MongoDB.
- Asegúrate de montar correctamente los routers en `app.js` y de usar la **misma Base URL** al probar.


