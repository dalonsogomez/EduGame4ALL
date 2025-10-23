import { Reward, IReward } from '../models/Reward';
import { UserReward, IUserReward } from '../models/UserReward';
import { UserProgress } from '../models/UserProgress';
import mongoose from 'mongoose';
import crypto from 'crypto';

export class RewardService {
  // Get all available rewards
  static async getRewards(category?: string): Promise<any[]> {
    console.log('[RewardService] Fetching rewards, category:', category);

    const query: any = { isActive: true, availableQuantity: { $gt: 0 } };

    if (category) {
      query.category = category;
    }

    const rewards = await Reward.find(query).sort({ xpCost: 1 });

    console.log(`[RewardService] Found ${rewards.length} available rewards`);
    return rewards;
  }

  // Redeem a reward
  static async redeemReward(
    userId: string,
    rewardId: string
  ): Promise<{ userReward: IUserReward; qrCode: string }> {
    console.log('[RewardService] Redeeming reward for user:', userId, 'reward:', rewardId);

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(rewardId)) {
      throw new Error('Invalid user ID or reward ID');
    }

    // Get reward
    const reward = await Reward.findById(rewardId);
    if (!reward) {
      throw new Error('Reward not found');
    }

    if (!reward.isActive || reward.availableQuantity <= 0) {
      throw new Error('Reward is not available');
    }

    // Check if expired
    if (reward.expiryDate && reward.expiryDate < new Date()) {
      throw new Error('Reward has expired');
    }

    // Get user progress
    const userProgress = await UserProgress.findOne({ userId });
    if (!userProgress) {
      throw new Error('User progress not found');
    }

    // Check if user has enough XP
    if (userProgress.totalXP < reward.xpCost) {
      throw new Error('Insufficient XP to redeem this reward');
    }

    // Generate unique QR code
    const qrCode = this.generateQRCode(userId, rewardId);

    // Calculate expiry date (30 days from now or reward expiry, whichever is sooner)
    const defaultExpiry = new Date();
    defaultExpiry.setDate(defaultExpiry.getDate() + 30);
    const expiryDate = reward.expiryDate
      ? new Date(Math.min(reward.expiryDate.getTime(), defaultExpiry.getTime()))
      : defaultExpiry;

    // Create user reward record
    const userReward = await UserReward.create({
      userId,
      rewardId,
      status: 'active',
      redeemedAt: new Date(),
      qrCode,
      expiryDate,
    });

    // Deduct XP from user
    userProgress.totalXP -= reward.xpCost;
    await userProgress.save();

    // Decrease available quantity
    reward.availableQuantity -= 1;
    await reward.save();

    console.log('[RewardService] Reward redeemed successfully, QR code:', qrCode);

    return { userReward, qrCode };
  }

  // Get user's redeemed rewards
  static async getUserRewards(userId: string, status?: string): Promise<any[]> {
    console.log('[RewardService] Fetching user rewards for:', userId, 'status:', status);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    const query: any = { userId };
    if (status) {
      query.status = status;
    }

    const userRewards = await UserReward.find(query)
      .populate('rewardId')
      .sort({ redeemedAt: -1 });

    const rewards = userRewards.map((ur) => {
      const reward = ur.rewardId as any;
      return {
        id: ur._id,
        reward: {
          id: reward._id,
          title: reward.title,
          description: reward.description,
          category: reward.category,
          imageUrl: reward.imageUrl,
        },
        status: ur.status,
        redeemedAt: ur.redeemedAt,
        usedAt: ur.usedAt,
        qrCode: ur.qrCode,
        expiryDate: ur.expiryDate,
      };
    });

    console.log(`[RewardService] Returning ${rewards.length} user rewards`);
    return rewards;
  }

  // Generate unique QR code
  private static generateQRCode(userId: string, rewardId: string): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    const data = `${userId}-${rewardId}-${timestamp}-${random}`;
    return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16).toUpperCase();
  }

  // Mark reward as used
  static async markRewardAsUsed(userRewardId: string): Promise<void> {
    console.log('[RewardService] Marking reward as used:', userRewardId);

    if (!mongoose.Types.ObjectId.isValid(userRewardId)) {
      throw new Error('Invalid user reward ID');
    }

    const userReward = await UserReward.findById(userRewardId);
    if (!userReward) {
      throw new Error('User reward not found');
    }

    if (userReward.status !== 'active') {
      throw new Error('Reward is not active');
    }

    userReward.status = 'used';
    userReward.usedAt = new Date();
    await userReward.save();

    console.log('[RewardService] Reward marked as used');
  }

  // Expire old rewards (can be run as a cron job)
  static async expireOldRewards(): Promise<void> {
    console.log('[RewardService] Checking for expired rewards');

    const now = new Date();
    const result = await UserReward.updateMany(
      { status: 'active', expiryDate: { $lt: now } },
      { $set: { status: 'expired' } }
    );

    console.log(`[RewardService] Expired ${result.modifiedCount} rewards`);
  }
}
