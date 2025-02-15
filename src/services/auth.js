import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { UsersCollection } from '../db/models/user.js';
import createHttpError from 'http-errors';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';

export const registerUser = async (payload) => {
    const user = await UsersCollection.findOne({ email: payload.email });
    if (user) throw createHttpError(409, 'Email in use');

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    return await UsersCollection.create({
        ...payload,
        password: encryptedPassword,
    });
};

export const loginUser = async (payload) => {
    const user = await UsersCollection.findOne({ email: payload.email });
    if (!user) {
        throw createHttpError(404, 'User not found');
    }

    const isEqual = await bcrypt.compare(payload.password, user.password);
    if (!isEqual) {
        throw createHttpError(401, 'Unauthorized');
    }

    await SessionsCollection.deleteOne({ userId: user._id });

    const session = createSession();

    return await SessionsCollection.create({
        userId: user._id,
        ...session,
    });
};

export const logoutUser = async (sessionId) => {
    const result = await SessionsCollection.deleteOne({ _id: sessionId });

    if (result.deletedCount === 0) {
        throw createHttpError(404, 'Session not found');
    }
};

const createSession = () => {
    return {
        accessToken: randomBytes(30).toString('hex'),
        refreshToken: randomBytes(30).toString('hex'),
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
    const session = await SessionsCollection.findOne({
        _id: sessionId,
        refreshToken,
    });

    if (!session) {
        throw createHttpError(401, 'Session not found');
    }

    if (new Date() > new Date(session.refreshTokenValidUntil)) {
        throw createHttpError(401, 'Session token expired');
    }

    await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

    const newSession = createSession();

    return await SessionsCollection.create({
        userId: session.userId,
        ...newSession,
    });
};