import { IUserProgress } from '../models/UserProgress';
import { BadgeResponse, GameSessionResponse, WeeklyReportResponse } from '../types';
export declare class ProgressService {
    static getUserProgress(userId: string): Promise<IUserProgress | null>;
    static getUserBadges(userId: string): Promise<BadgeResponse[]>;
    static checkAndAwardBadges(userId: string): Promise<void>;
    static getGameHistory(userId: string, limit?: number): Promise<GameSessionResponse[]>;
    static getWeeklyReport(userId: string): Promise<WeeklyReportResponse>;
}
//# sourceMappingURL=progressService.d.ts.map