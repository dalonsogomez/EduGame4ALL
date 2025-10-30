import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Briefcase, DollarSign, Users as UsersIcon, Newspaper, ExternalLink, Filter } from 'lucide-react';

export function ResourcesPage() {
  const { resources, setCurrentPage } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = {
    all: { label: 'Todos', icon: Newspaper, color: 'bg-gray-500' },
    job: { label: 'Empleos', icon: Briefcase, color: 'bg-blue-500' },
    grant: { label: 'Subvenciones', icon: DollarSign, color: 'bg-green-500' },
    community: { label: 'Comunidad', icon: UsersIcon, color: 'bg-purple-500' },
    news: { label: 'Noticias', icon: Newspaper, color: 'bg-orange-500' }
  };

  const filteredResources = selectedCategory === 'all'
    ? resources
    : resources.filter(r => r.category === selectedCategory);

  const getCategoryInfo = (category: string) => categories[category as keyof typeof categories] || categories.all;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage('dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
            <div>
              <h1 className="text-gray-900">Centro de Recursos</h1>
              <p className="text-gray-600">Información útil para tu integración</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-gray-900">Filtrar por categoría</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {Object.entries(categories).map(([key, cat]) => {
              const Icon = cat.icon;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all flex items-center gap-2 ${
                    selectedCategory === key
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Resources List */}
        <div className="space-y-4">
          {filteredResources.map(resource => {
            const categoryInfo = getCategoryInfo(resource.category);
            const Icon = categoryInfo.icon;

            return (
              <Card key={resource.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg ${categoryInfo.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-gray-900">{resource.title}</h3>
                      <Badge className={`${categoryInfo.color} text-white`}>
                        {categoryInfo.label}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{resource.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-gray-500 text-sm">
                        {new Date(resource.date).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => window.open(resource.url, '_blank')}
                      >
                        Ver más
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {filteredResources.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-gray-600 mb-4">No hay recursos disponibles en esta categoría</p>
              <Button onClick={() => setSelectedCategory('all')} variant="outline">
                Ver todos los recursos
              </Button>
            </Card>
          )}
        </div>

        {/* Help Section */}
        <Card className="p-6 mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <h3 className="text-gray-900 mb-4">¿Necesitas más ayuda?</h3>
          <p className="text-gray-700 mb-6">
            Estos recursos se actualizan regularmente. Si necesitas asistencia específica,
            te recomendamos contactar con los centros comunitarios locales o servicios sociales.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <h4 className="text-gray-900 mb-2">📞 Línea de Ayuda</h4>
              <p className="text-gray-600 text-sm">900 123 456</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="text-gray-900 mb-2">📧 Email</h4>
              <p className="text-gray-600 text-sm">ayuda@edugame4all.org</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="text-gray-900 mb-2">🏢 Oficina Local</h4>
              <p className="text-gray-600 text-sm">Calle Principal, 123</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
