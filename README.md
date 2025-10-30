# EduApp4ALL

**EduApp4ALL** es una aplicación web educativa y gamificada diseñada para ofrecer una experiencia de aprendizaje personalizada e inclusiva, especialmente dirigida a personas en situaciones vulnerables. Utiliza un enfoque de microaprendizaje a través de juegos interactivos y un sistema de inteligencia artificial para adaptar el contenido, proporcionar retroalimentación y mantener la motivación del usuario.

## 📜 Tabla de Contenidos

- [✨ Características Principales](#-características-principales)
- [🛠️ Stack Tecnológico](#️-stack-tecnológico)
- [🏛️ Arquitectura](#️-arquitectura)
- [🚀 Cómo Empezar](#-cómo-empezar)
- [🤝 Contribuciones](#-contribuciones)
- [📄 Licencia](#-licencia)

## ✨ Características Principales

- **Plataforma Gamificada:** Aprende a través de juegos interactivos en tres áreas clave: vocabulario, cultura general y habilidades blandas.
- **Adaptación por IA:** Un motor de IA (actualmente simulado) analiza tu rendimiento, detecta emociones y ajusta la dificultad de los juegos para optimizar tu aprendizaje.
- **Feedback Personalizado:** Recibe retroalimentación detallada y constructiva generada por IA después de cada sesión de juego.
- **Seguimiento de Progreso:** Visualiza tus estadísticas, rachas, logros y XP (puntos de experiencia) en un dashboard completo.
- **Sistema de Recompensas:** Gana puntos y canjéalos por recompensas reales, como cursos de formación, sesiones de mentoring o recursos para la búsqueda de empleo.
- **Tutor de IA:** Un chat interactivo te permite hacer preguntas y recibir ayuda de un tutor de IA en cualquier momento.
- **Recursos Adicionales:** Accede a un centro de recursos con enlaces a ofertas de empleo, cursos y organizaciones de apoyo.

## 🛠️ Stack Tecnológico

- **Frontend:** React, TypeScript, Vite
- **UI:** Tailwind CSS, shadcn/ui, Radix UI
- **Gestión de Estado:** React Context API
- **Iconos:** Lucide React
- **Gráficos y Visualizaciones:** Recharts
- **Testing (propuesto):** Vitest, Playwright

## 🏛️ Arquitectura

El proyecto sigue una arquitectura de capas bien definida que separa la presentación, la lógica de la aplicación, los servicios y los datos. Para una descripción detallada de la arquitectura, consulta el documento [ARCHITECTURE.md](src/ARCHITECTURE.md).

La futura integración de IA se detalla en la [Guía de Implementación de IA](src/AI_IMPLEMENTATION_GUIDE.md), que planea utilizar modelos como Llama-3.1 y Whisper.

## 🔧 Configuración del Backend (Supabase)

Este proyecto utiliza **Supabase** para la gestión del backend (base de datos, autenticación, etc.). Para configurar tu propia instancia de Supabase, sigue la guía detallada que se encuentra en el siguiente documento:

**[➡️ Guía de Configuración de Supabase](supabase/SUPABASE_GUIDE.md)**

## 🚀 Cómo Empezar

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

1.  **Clona el repositorio:**

    ```bash
    git clone https://github.com/dalonsogomez/EduApp4ALL.git
    cd EduApp4ALL
    ```

2.  **Instala las dependencias:**

    ```bash
    npm install
    ```

3.  **Inicia el servidor de desarrollo:**

    ```bash
    npm run dev
    ```

    La aplicación estará disponible en `http://localhost:5173`.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar el proyecto, por favor, sigue estos pasos:

1.  Haz un fork del repositorio.
2.  Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3.  Realiza tus cambios y haz commit (`git commit -m 'Añade nueva funcionalidad'`).
4.  Empuja tus cambios a la rama (`git push origin feature/nueva-funcionalidad`).
5.  Abre un Pull Request.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
