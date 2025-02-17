import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { loginUserSchema, registerUserSchema } from '../validation/auth.js';
import {
    logoutUserController,
    refreshUserSessionController,
    registerUserController,
    loginUserController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

import { requestResetEmailSchema } from '../validation/auth.js';
import { requestResetEmailController } from '../controllers/auth.js';

import { resetPasswordSchema } from '../validation/auth.js';
import { resetPasswordController } from '../controllers/auth.js';

const router = Router();

router.post(
    '/register',
    validateBody(registerUserSchema),
    ctrlWrapper(registerUserController),
);

router.post(
    '/login',
    validateBody(loginUserSchema),
    ctrlWrapper(loginUserController),
);

router.post('/logout', ctrlWrapper(logoutUserController));

router.post('/refresh', ctrlWrapper(refreshUserSessionController));
router.post(
    '/send-reset-email',
    validateBody(requestResetEmailSchema),
    ctrlWrapper(requestResetEmailController),
);



router.post(
    '/reset-pwd',
    validateBody(resetPasswordSchema),
    ctrlWrapper(resetPasswordController),
);

export default router;