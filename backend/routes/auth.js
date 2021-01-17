const express = require('express');
const router = express.Router();
const { isLoggedIn, isRecoverHash, validate } = require('../middleware');
const recoverPassword = require('../validators/recoverPassword');
const emailValidator = require('../validators/emailValidator');

module.exports = (di) => {
    const authController = di.get('controller.auth');

    router.get('/me', [isLoggedIn], (...args) => authController.me(...args));
    router.post('/login', [emailValidator, validate], (...args) =>
        authController.login(...args)
    );
    router.post(
        '/recover-password',
        [recoverPassword.create, validate],
        (...args) => authController.recoverPasswordSendMail(...args)
    );
    router.post(
        '/recover-password/:hash',
        [recoverPassword.update, validate],
        isRecoverHash,
        (...args) => authController.recoverPassword(...args)
    );

    return router;
};
