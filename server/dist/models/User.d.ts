import mongoose, { Document } from 'mongoose';
import { RoleValues } from 'shared';
export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    userType: 'child' | 'adult' | 'educator';
    age?: number;
    location: string;
    nativeLanguage: string;
    targetLanguage: string;
    profilePhoto?: string;
    createdAt: Date;
    lastLoginAt: Date;
    isActive: boolean;
    role: RoleValues;
    refreshToken: string;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default User;
//# sourceMappingURL=User.d.ts.map