export declare class RewardService {
    static getRewards(category?: string): Promise<any[]>;
    static redeemReward(userId: string, rewardId: string): Promise<{
        userReward: any;
        qrCode: string;
    }>;
    static getUserRewards(userId: string, status?: string): Promise<any[]>;
    private static generateQRCodeString;
    private static generateQRCodeImage;
    static markRewardAsUsed(userRewardId: string): Promise<void>;
    static expireOldRewards(): Promise<void>;
}
//# sourceMappingURL=rewardService.d.ts.map