import { IUserReward } from '../models/UserReward';
export declare class RewardService {
    static getRewards(category?: string): Promise<any[]>;
    static redeemReward(userId: string, rewardId: string): Promise<{
        userReward: IUserReward;
        qrCode: string;
    }>;
    static getUserRewards(userId: string, status?: string): Promise<any[]>;
    private static generateQRCode;
    static markRewardAsUsed(userRewardId: string): Promise<void>;
    static expireOldRewards(): Promise<void>;
}
//# sourceMappingURL=rewardService.d.ts.map