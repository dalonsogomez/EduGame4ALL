import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RewardCard } from '@/components/rewards/RewardCard';
import { getRewards, redeemReward, getMyRewards } from '@/api/rewards';
import { getUserProfile } from '@/api/profile';
import { Reward, RedeemedReward } from '@/types';
import { useToast } from '@/hooks/useToast';
import { Loader2, Gift, Ticket, Download, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function Rewards() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [myRewards, setMyRewards] = useState<RedeemedReward[]>([]);
  const [userXP, setUserXP] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showRedeemDialog, setShowRedeemDialog] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  const loadRewardsData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Loading rewards data...');

      const [rewardsRes, myRewardsRes, profileRes] = await Promise.all([
        getRewards(),
        getMyRewards(),
        getUserProfile(),
      ]);

      setRewards(rewardsRes.rewards);
      setMyRewards(myRewardsRes.redeemedRewards);
      setUserXP(profileRes.profile.xp);

      console.log('Rewards data loaded successfully');
    } catch (error: unknown) {
      const err = error as { message?: string };
      console.error('Error loading rewards:', error);
      toast({
        title: 'Error',
        description: err.message || 'Failed to load rewards',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadRewardsData();
  }, [loadRewardsData]);

  const handleRedeemClick = (reward: Reward) => {
    console.log('Redeem clicked for reward:', reward._id);
    setSelectedReward(reward);
    setShowRedeemDialog(true);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedReward) return;

    try {
      setRedeeming(true);
      console.log('Redeeming reward:', selectedReward._id);

      const response = await redeemReward(selectedReward._id);

      setUserXP((prev) => prev - selectedReward.cost);
      setMyRewards((prev) => [response.redeemedReward, ...prev]);

      toast({
        title: 'Reward Redeemed!',
        description: `You've successfully redeemed ${selectedReward.title}`,
      });

      setShowRedeemDialog(false);
      setSelectedReward(null);
    } catch (error: unknown) {
      const err = error as { message?: string };
      console.error('Error redeeming reward:', error);
      toast({
        title: 'Error',
        description: err.message || 'Failed to redeem reward',
        variant: 'destructive',
      });
    } finally {
      setRedeeming(false);
    }
  };

  const filteredRewards = activeTab === 'all' ? rewards : rewards.filter((r) => r.category === activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Gift className="h-8 w-8 text-purple-600" />
            Rewards Store
          </h1>
          <p className="text-muted-foreground mt-1">Redeem your XP for amazing rewards</p>
        </div>
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
          <CardContent className="p-4">
            <p className="text-sm opacity-90">Your Points</p>
            <p className="text-3xl font-bold">{userXP.toLocaleString()} XP</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Rewards</TabsTrigger>
          <TabsTrigger value="coupon">Coupons</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="donation">Donations</TabsTrigger>
          <TabsTrigger value="my-rewards">My Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {activeTab === 'my-rewards' ? (
            <Card>
              <CardHeader>
                <CardTitle>My Redeemed Rewards</CardTitle>
                <p className="text-sm text-muted-foreground">Your active and past rewards</p>
              </CardHeader>
              <CardContent>
                {myRewards.length === 0 ? (
                  <div className="text-center py-12">
                    <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">You haven't redeemed any rewards yet</p>
                    <Button variant="outline" onClick={() => setActiveTab('all')} className="mt-4">
                      Browse Rewards
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myRewards.map((redeemedReward) => (
                      <Card key={redeemedReward._id} className="border-2 border-purple-200">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <img
                              src={redeemedReward.reward.image}
                              alt={redeemedReward.reward.title}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                            <div className="flex-1 space-y-2">
                              <h3 className="font-semibold text-lg">{redeemedReward.reward.title}</h3>
                              <p className="text-sm text-muted-foreground">{redeemedReward.reward.description}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-muted-foreground">
                                  Redeemed {formatDistanceToNow(new Date(redeemedReward.redeemedAt), { addSuffix: true })}
                                </span>
                                <span className="text-orange-600 font-semibold">
                                  Expires {formatDistanceToNow(new Date(redeemedReward.expiresAt), { addSuffix: true })}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Save
                              </Button>
                              <Button size="sm" variant="outline">
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                              </Button>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t">
                            <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 text-center">
                              <img src={redeemedReward.qrCode} alt="QR Code" className="w-32 h-32 mx-auto mb-2" />
                              <p className="text-xs text-muted-foreground">Show this QR code at checkout</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRewards.map((reward) => (
                <RewardCard key={reward._id} reward={reward} userXP={userXP} onRedeem={handleRedeemClick} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Redeem Reward</DialogTitle>
            <DialogDescription>
              Are you sure you want to redeem this reward?
            </DialogDescription>
          </DialogHeader>
          {selectedReward && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img src={selectedReward.image} alt={selectedReward.title} className="w-20 h-20 object-cover rounded-lg" />
                <div>
                  <h3 className="font-semibold">{selectedReward.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedReward.description}</p>
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Cost:</span>
                  <span className="text-2xl font-bold text-purple-600">{selectedReward.cost} XP</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">Your balance after:</span>
                  <span className="text-lg font-semibold">{userXP - selectedReward.cost} XP</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRedeemDialog(false)} disabled={redeeming}>
              Cancel
            </Button>
            <Button onClick={handleConfirmRedeem} disabled={redeeming}>
              {redeeming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redeeming...
                </>
              ) : (
                'Confirm Redeem'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}