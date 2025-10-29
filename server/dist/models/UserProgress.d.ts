import mongoose, { Document } from 'mongoose';
export interface IUserProgress extends Document {
    userId: mongoose.Types.ObjectId;
    totalXP: number;
    level: number;
    streak: number;
    lastActivityDate: Date;
    weeklyGoal: number;
    weeklyProgress: number;
    skills: {
        language: {
            xp: number;
            level: number;
        };
        culture: {
            xp: number;
            level: number;
        };
        softSkills: {
            xp: number;
            level: number;
        };
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserProgress: mongoose.Model<IUserProgress, {}, {}, {}, mongoose.Document<unknown, {}, IUserProgress, {}, {}> & IUserProgress & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default UserProgress;
//# sourceMappingURL=UserProgress.d.ts.map