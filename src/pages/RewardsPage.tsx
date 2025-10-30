import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Gift, Star, CheckCircle, AlertCircle } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

export function RewardsPage() {
  const { user, rewards, redeemReward, setCurrentPage } = useApp();
  const [selectedReward, setSelectedReward] = useState<string | null>(null);

  if (!user) return null;

  const handleRedeem = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return;

    if (user.xp < reward.pointsCost) {
      toast.error(`Necesitas ${reward.pointsCost - user.xp} XP más para canjear esta recompensa`);
      return;
    }

    redeemReward(rewardId);
    toast.success(`¡${reward.title} canjeado con éxito!`, {
      description: 'Revisa tu email para recibir el cupón'
    });
    setSelectedReward(null);
  };

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
            <div className="flex-1">
              <h1 className="text-gray-900">Tienda de Recompensas</h1>
              <p className="text-gray-600">Canjea tus puntos por premios reales</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-lg border border-yellow-200">
              <Star className="w-5 h-5 text-yellow-600" />
              <span className="text-gray-900">{user.xp} XP</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Info Banner */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-start gap-4">
            <Gift className="w-8 h-8 text-purple-600 flex-shrink-0" />
            <div>
              <h3 className="text-gray-900 mb-2">¿Cómo funcionan las recompensas?</h3>
              <p className="text-gray-700">
                Gana XP completando juegos y actividades. Usa tu XP para canjear cupones y premios
                de nuestros partners. Los cupones te serán enviados por email y podrás usarlos
                en establecimientos participantes.
              </p>
            </div>
          </div>
        </Card>

        {/* Rewards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map(reward => {
            const canAfford = user.xp >= reward.pointsCost;
            const isSelected = selectedReward === reward.id;

            return (
              <Card key={reward.id} className={`overflow-hidden ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
                <div className="aspect-video relative">
                  <ImageWithFallback
                    src={reward.imageUrl}
                    alt={reward.title}
                    className="w-full h-full object-cover"
                  />
                  {!canAfford && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <p className="text-white px-4 py-2 bg-black/70 rounded-lg">
                        Requiere {reward.pointsCost - user.xp} XP más
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-gray-900 flex-1">{reward.title}</h3>
                    <Badge className="bg-purple-100 text-purple-700">
                      {reward.pointsCost} XP
                    </Badge>
                  </div>

                  <p className="text-gray-600 mb-4">{reward.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline">{reward.category}</Badge>
                    <p className="text-gray-500 text-sm">Por {reward.partner}</p>
                  </div>

                  <Button
                    onClick={() => {
                      if (canAfford) {
                        setSelectedReward(reward.id);
                      }
                    }}
                    disabled={!canAfford}
                    className={`w-full ${
                      canAfford
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Canjear' : 'Insuficiente XP'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Confirmation Modal */}
        {selectedReward && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full p-6">
              <div className="mb-6">
                <h3 className="text-gray-900 mb-2">Confirmar Canje</h3>
                <p className="text-gray-600">
                  ¿Estás seguro de que quieres canjear esta recompensa?
                </p>
              </div>

              {(() => {
                const reward = rewards.find(r => r.id === selectedReward);
                return reward ? (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-900 mb-2">{reward.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Costo:</span>
                      <span className="text-gray-900">{reward.pointsCost} XP</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-600">Tu saldo:</span>
                      <span className="text-gray-900">{user.xp} XP</span>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t">
                      <span className="text-gray-900">Saldo restante:</span>
                      <span className="text-gray-900">{user.xp - reward.pointsCost} XP</span>
                    </div>
                  </div>
                ) : null;
              })()}

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedReward(null)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => handleRedeem(selectedReward)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Confirmar Canje
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* How to earn more */}
        <Card className="p-6 mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <h3 className="text-gray-900 mb-4">¿Necesitas más XP?</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <p className="text-gray-900 mb-2">🎮 Juega más</p>
              <p className="text-gray-600 text-sm">
                Completa juegos para ganar 50-100 XP por sesión
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-gray-900 mb-2">🔥 Mantén tu racha</p>
              <p className="text-gray-600 text-sm">
                Rachas largas te dan bonificaciones de XP
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-gray-900 mb-2">🏆 Desbloquea logros</p>
              <p className="text-gray-600 text-sm">
                Cada logro te otorga XP adicional
              </p>
            </div>
          </div>
          <Button onClick={() => setCurrentPage('games')} className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
            Ir a Jugar
          </Button>
        </Card>
      </div>
    </div>
  );
}
