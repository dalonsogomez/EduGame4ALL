 # 🚀 Guía de Configuración de Supabase para EduApp4ALL

Esta guía te ayudará a configurar tu propio proyecto de Supabase para que funcione con EduApp4ALL. Supabase se utiliza como backend para la persistencia de datos, autenticación y almacenamiento.

## 📋 Pre-requisitos

- Una cuenta de [Supabase](https://supabase.com/).
- [Supabase CLI](https://supabase.com/docs/guides/cli) instalado en tu máquina local (opcional pero recomendado para un flujo de trabajo avanzado).

---

## 🛠️ Paso 1: Crear un Proyecto en Supabase

1.  **Inicia sesión en tu cuenta de Supabase** y ve a tu [Dashboard](https://app.supabase.com).
2.  Haz clic en **"New Project"**.
3.  Elige una organización y dale un **nombre** a tu proyecto (ej. `EduApp4ALL-dev`).
4.  Genera una **contraseña segura** para la base de datos y guárdala en un lugar seguro.
5.  Selecciona la **región** más cercana a tus usuarios.
6.  Haz clic en **"Create Project"** y espera a que se aprovisione la infraestructura.

---

## 🔑 Paso 2: Obtener las Claves de API

Una vez que el proyecto esté creado, necesitarás las claves de API para conectar la aplicación.

1.  En el dashboard de tu proyecto, ve a **Settings** (icono de engranaje) > **API**.
2.  Encontrarás dos valores importantes:
    - **Project URL** (`VITE_SUPABASE_URL`)
    - **Project API Keys** > `anon` `public` (`VITE_SUPABASE_ANON_KEY`)

3.  **Crea un archivo `.env`** en la raíz del proyecto EduApp4ALL copiando el contenido de `.env.example`.

    ```bash
    cp .env.example .env
    ```

4.  **Pega tus claves** en el archivo `.env`:

    ```env
    VITE_SUPABASE_URL=https://<tu-id-de-proyecto>.supabase.co
    VITE_SUPABASE_ANON_KEY=<tu-clave-anon-publica>
    ```

---

## 🏗️ Paso 3: Aplicar el Esquema de la Base de Datos

El esquema define todas las tablas, relaciones, políticas de seguridad y funciones necesarias para que la aplicación funcione. Puedes aplicarlo de dos maneras:

### Método 1: Usando el Editor SQL de Supabase (Recomendado)

1.  Navega a la sección **SQL Editor** en el dashboard de tu proyecto Supabase.
2.  Haz clic en **"+ New query"**.
3.  Copia todo el contenido del archivo de migración:
    - `supabase/migrations/20241029_initial_schema.sql`
4.  Pega el contenido en el editor SQL.
5.  Haz clic en **"RUN"**.

El script está diseñado para ser idempotente, por lo que puedes ejecutarlo varias veces sin problemas.

### Método 2: Usando Supabase CLI (Avanzado)

Si tienes la CLI de Supabase instalada y has vinculado tu proyecto, puedes aplicar las migraciones localmente.

```bash
# Inicia sesión en Supabase (solo la primera vez)
supabase login

# Vincula tu proyecto remoto
supabase link --project-ref <tu-id-de-proyecto>

# Aplica las migraciones
supabase db push
```

---

## 🌱 Paso 4: Poblar la Base de Datos con Datos de Prueba (Seed)

Para tener datos iniciales (logros, recompensas, recursos), puedes ejecutar el script de seed.

1.  Ve al **SQL Editor** en tu dashboard de Supabase.
2.  Crea una **nueva consulta**.
3.  Copia el contenido del archivo de seed:
    - `supabase/seed/seed_data.sql`
4.  Pega el contenido en el editor y haz clic en **"RUN"**.

Esto poblará las tablas `achievements`, `rewards` y `resources` con datos de ejemplo.

---

## 🔒 Resumen de la Configuración de Seguridad (RLS)

El esquema ya incluye políticas de **Row Level Security (RLS)** para proteger los datos de los usuarios. Aquí un resumen:

- **`profiles`**: Los usuarios solo pueden ver y modificar su propio perfil.
- **`user_profiles`**: Los usuarios solo pueden gestionar sus preferencias de aprendizaje.
- **`game_sessions`**, **`ai_feedback`**, **`user_achievements`**, **`user_rewards`**, **`knowledge_tracker`**: Los usuarios solo tienen acceso a sus propios registros.
- **`achievements`**, **`rewards`**, **`resources`**: Son tablas públicas de solo lectura para usuarios autenticados.

**¡Importante!** RLS está habilitado por defecto en todas las tablas sensibles.

---

## ⚙️ Resumen de los Triggers y Funciones

El esquema también configura automatizaciones importantes:

- **`handle_new_user()`**: Una función que se dispara (`trigger`) cada vez que un nuevo usuario se registra en Supabase Auth. Automáticamente crea una entrada correspondiente en la tabla `public.profiles`.
- **`handle_updated_at()`**: Una función que actualiza automáticamente el campo `updated_at` en varias tablas cada vez que se modifica un registro.

---

## ✅ ¡Todo Listo!

Una vez completados estos pasos, tu instancia de Supabase estará configurada y lista para ser usada con EduApp4ALL. Puedes iniciar la aplicación localmente y probar el registro, inicio de sesión y todas las funcionalidades que dependen del backend.

```bash
npm install
npm run dev
```
