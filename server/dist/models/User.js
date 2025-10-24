import mongoose, { Schema } from 'mongoose';
import { isPasswordHash } from '../utils/password';
import { randomUUID } from 'crypto';
import { ROLES, ALL_ROLES } from 'shared';
const schema = new Schema({
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        validate: { validator: isPasswordHash, message: 'Invalid password hash' },
    },
    name: {
        type: String,
        required: true,
        default: '',
    },
    userType: {
        type: String,
        enum: ['child', 'adult', 'educator'],
        default: 'adult',
    },
    age: {
        type: Number,
        min: 1,
        max: 120,
    },
    location: {
        type: String,
        default: '',
    },
    nativeLanguage: {
        type: String,
        default: '',
    },
    targetLanguage: {
        type: String,
        default: '',
    },
    profilePhoto: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true,
    },
    lastLoginAt: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    role: {
        type: String,
        enum: ALL_ROLES,
        default: ROLES.USER,
    },
    refreshToken: {
        type: String,
        unique: true,
        index: true,
        default: () => randomUUID(),
    },
}, {
    versionKey: false,
});
schema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    },
});
const User = mongoose.model('User', schema);
export default User;
//# sourceMappingURL=User.js.map