import { GamingWorldLogo } from "../components/GamingWorldLogo";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Globe, Brain, Trophy, Users, Sparkles, Heart } from "lucide-react";
import { useApp } from "../context/AppContext";

export function LandingPage() {
  const { setCurrentPage } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="mb-6">
            <GamingWorldLogo size={120} />
          </div>
          <h1 className="text-blue-900 mb-4">
            EduGame4ALL
          </h1>
          <p className="text-blue-700 max-w-2xl mb-8">
            Plataforma educativa gamificada con IA personalizada para ayudar a personas en situación de vulnerabilidad a aprender idiomas, cultura local y habilidades blandas.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Button onClick={() => setCurrentPage('register')} size="lg" className="bg-blue-600 hover:bg-blue-700">
              Comenzar Ahora
            </Button>
            <Button onClick={() => setCurrentPage('login')} variant="outline" size="lg">
              Iniciar Sesión
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-blue-900 mb-2">Aprendizaje de Idiomas</h3>
            <p className="text-gray-600">
              Aprende vocabulario contextual, conversaciones cotidianas y pronunciación con ejercicios interactivos.
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-purple-900 mb-2">Integración Cultural</h3>
            <p className="text-gray-600">
              Descubre costumbres locales, normas sociales y tradiciones para una mejor integración en tu nueva comunidad.
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-pink-600" />
              </div>
            </div>
            <h3 className="text-pink-900 mb-2">Habilidades Blandas</h3>
            <p className="text-gray-600">
              Desarrolla trabajo en equipo, comunicación asertiva y liderazgo a través de simulaciones prácticas.
            </p>
          </Card>
        </div>

        {/* AI Features */}
        <div className="bg-white rounded-2xl p-8 mb-16 shadow-md">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Brain className="w-8 h-8 text-blue-600" />
            <h2 className="text-blue-900">Inteligencia Artificial Personalizada</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <Sparkles className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-gray-900 mb-1">Feedback Inteligente</h4>
                <p className="text-gray-600">
                  Recibe retroalimentación personalizada basada en tu rendimiento y estilo de aprendizaje.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Sparkles className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-gray-900 mb-1">Adaptación Dinámica</h4>
                <p className="text-gray-600">
                  El sistema ajusta automáticamente la dificultad según tu progreso y necesidades.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Sparkles className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-gray-900 mb-1">Detección Emocional</h4>
                <p className="text-gray-600">
                  Identifica frustración o confusión y adapta la experiencia para apoyarte mejor.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Sparkles className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-gray-900 mb-1">Recomendaciones Personalizadas</h4>
                <p className="text-gray-600">
                  Recibe sugerencias de actividades y recursos adaptados a tus objetivos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="text-center mb-16">
          <h2 className="text-gray-900 mb-8">¿Por qué EduGame4ALL?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center">
              <Trophy className="w-12 h-12 text-yellow-500 mb-3" />
              <h4 className="text-gray-900 mb-2">Gamificación</h4>
              <p className="text-gray-600">Gana puntos, logros y recompensas reales</p>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="w-12 h-12 text-blue-500 mb-3" />
              <h4 className="text-gray-900 mb-2">Multilingüe</h4>
              <p className="text-gray-600">Disponible en 100+ idiomas</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-12 h-12 text-green-500 mb-3" />
              <h4 className="text-gray-900 mb-2">Comunidad</h4>
              <p className="text-gray-600">Conecta con otros estudiantes</p>
            </div>
            <div className="flex flex-col items-center">
              <Heart className="w-12 h-12 text-red-500 mb-3" />
              <h4 className="text-gray-900 mb-2">100% Gratis</h4>
              <p className="text-gray-600">Educación accesible para todos</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="mb-6">Historias de Éxito</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white/10 backdrop-blur border-white/20 text-white">
              <p className="mb-4 italic">
                "Gracias a EduGame4ALL pude aprender español rápidamente y encontrar trabajo en mi nuevo país."
              </p>
              <p>- Ahmad, Refugiado de Siria</p>
            </Card>
            <Card className="p-6 bg-white/10 backdrop-blur border-white/20 text-white">
              <p className="mb-4 italic">
                "Los juegos hicieron que aprender fuera divertido para mi hijo. Ahora se comunica mejor en la escuela."
              </p>
              <p>- María, Madre de familia</p>
            </Card>
            <Card className="p-6 bg-white/10 backdrop-blur border-white/20 text-white">
              <p className="mb-4 italic">
                "Mejoré mis habilidades blandas y conseguí mi primer empleo. El sistema de IA me ayudó mucho."
              </p>
              <p>- Carlos, Estudiante</p>
            </Card>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center mt-16">
          <h2 className="text-gray-900 mb-4">¿Listo para comenzar tu viaje de aprendizaje?</h2>
          <Button onClick={() => setCurrentPage('register')} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Regístrate Gratis Ahora
          </Button>
        </div>
      </div>
    </div>
  );
}
