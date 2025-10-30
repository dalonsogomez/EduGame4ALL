import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { GamingWorldLogo } from '../components/GamingWorldLogo';
import { useApp } from '../context/AppContext';

export function LoginPage() {
  const { setUser, setCurrentPage } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simular login exitoso con usuario demo
    const demoUser = {
      id: 'demo_user',
      email: formData.email,
      name: 'Usuario Demo',
      userType: 'adult' as const,
      language: 'es' as const,
      profileCompleted: true,
      xp: 250,
      level: 3,
      streak: 5,
      lastActiveDate: new Date().toISOString(),
      achievements: ['first_login', 'first_game'],
      profile: {
        currentLanguageLevel: 'intermediate' as const,
        culturalKnowledge: 'beginner' as const,
        communicationSkills: 'intermediate' as const,
        personalSituation: 'Refugiado aprendiendo español',
        learningGoals: ['Mejorar español', 'Conseguir empleo', 'Integración cultural'],
        preferredTopics: ['Vocabulario laboral', 'Cultura local', 'Habilidades de comunicación']
      }
    };

    setUser(demoUser);
    setCurrentPage('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <GamingWorldLogo size={80} />
          <h2 className="text-gray-900 mt-4">Iniciar Sesión</h2>
          <p className="text-gray-600 text-center">Bienvenido de vuelta a EduGame4ALL</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-gray-600">Recordarme</span>
            </label>
            <button type="button" className="text-blue-600 hover:underline">
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Iniciar Sesión
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿No tienes cuenta?{' '}
            <button
              onClick={() => setCurrentPage('register')}
              className="text-blue-600 hover:underline"
            >
              Regístrate Gratis
            </button>
          </p>
        </div>

        {/* Demo hint */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-900 text-center">
            💡 <strong>Demo:</strong> Usa cualquier email y contraseña para probar
          </p>
        </div>
      </Card>
    </div>
  );
}
