import { loginUser, logoutUser, registerUser } from '../services/auth.js';
import { ONE_DAY } from '../constants/index.js';

import { refreshUsersSession } from '../services/auth.js';

export const registerUserController = async (req, res) => {
    const user = await registerUser(req.body);

    res.status(201).json({
        status: 201,
        message: 'Successfully registered a user!',
        data: user,
    });
};

export const loginUserController = async (req, res) => {
    const session = await loginUser(req.body);

    console.log('Session after login:', session);

    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY),
    });
    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY),
    });

    console.log('Cookies set:', {
        refreshToken: session.refreshToken,
        sessionId: session._id,
    });

    res.json({
        status: 200,
        message: 'Successfully logged in an user!',
        data: {
            accessToken: session.accessToken,
        },
    });
};

export const logoutUserController = async (req, res) => {
    console.log('Cookies:', req.cookies);
    console.log('Session ID:', req.cookies.sessionId);

    if (req.cookies.sessionId) {
        await logoutUser(req.cookies.sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
};

const setupSession = (res, session) => {
    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY),
    });
    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY),
    });
};

export const refreshUserSessionController = async (req, res) => {

    console.log('Cookies at refresh:', req.cookies);
    console.log('Session ID:', req.cookies.sessionId);
    console.log('Refresh Token:', req.cookies.refreshToken);

    if (!req.cookies.sessionId || !req.cookies.refreshToken) {
        console.log('Missing sessionId or refreshToken!');
        return res.status(401).json({ message: 'Unauthorized' });
    }


    const session = await refreshUsersSession({
        sessionId: req.cookies.sessionId,
        refreshToken: req.cookies.refreshToken,
    });

    console.log('New session:', session);

    setupSession(res, session);

    res.json({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: {
            accessToken: session.accessToken,
        },
    });
};