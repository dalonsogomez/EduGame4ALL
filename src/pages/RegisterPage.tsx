import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { GamingWorldLogo } from '../components/GamingWorldLogo';
import { UserType, Language } from '../types';
import { useApp } from '../context/AppContext';

export function RegisterPage() {
  const { setUser, setCurrentPage } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    userType: 'adult' as UserType,
    language: 'es' as Language
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Crear usuario
    const newUser = {
      id: `user_${Date.now()}`,
      email: formData.email,
      name: formData.name,
      userType: formData.userType,
      language: formData.language,
      profileCompleted: false,
      xp: 0,
      level: 1,
      streak: 0,
      lastActiveDate: new Date().toISOString(),
      achievements: ['first_login']
    };

    setUser(newUser);
    setCurrentPage('onboarding');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <GamingWorldLogo size={80} />
          <h2 className="text-gray-900 mt-4">Crear Cuenta</h2>
          <p className="text-gray-600 text-center">Únete a EduGame4ALL y comienza tu viaje de aprendizaje</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre Completo</Label>
            <Input
              id="name"
              type="text"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

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

          <div>
            <Label htmlFor="userType">Tipo de Usuario</Label>
            <select
              id="userType"
              value={formData.userType}
              onChange={(e) => setFormData({ ...formData, userType: e.target.value as UserType })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="child">Niño/a (Menor de 18 años)</option>
              <option value="adult">Adulto</option>
              <option value="tutor">Tutor/Educador</option>
            </select>
          </div>

          <div>
            <Label htmlFor="language">Idioma Preferido</Label>
            <select
              id="language"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value as Language })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="ar">العربية (Árabe)</option>
              <option value="zh">中文 (Chino)</option>
            </select>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Crear Cuenta
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={() => setCurrentPage('login')}
              className="text-blue-600 hover:underline"
            >
              Inicia Sesión
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
