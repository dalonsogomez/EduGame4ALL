import { IUserProgress } from '../models/UserProgress';
export declare class ProgressService {
    static getUserProgress(userId: string): Promise<IUserProgress | null>;
    static getUserBadges(userId: string): Promise<any[]>;
    static checkAndAwardBadges(userId: string): Promise<void>;
    static getGameHistory(userId: string, limit?: number): Promise<any[]>;
    static getWeeklyReport(userId: string): Promise<any>;
    private static generateInsight;
}
//# sourceMappingURL=progressService.d.ts.map