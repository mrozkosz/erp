const express = require('express');
const router = express.Router();
const contractValidator = require('../validators/contractValidator');
const { isLoggedIn, isAdmin, validate } = require('../middleware');

module.exports = (di) => {
    const contractController = di.get('controller.contract');

    router.get('/contracts', [isLoggedIn], (...args) =>
        contractController.index(...args)
    );

    router.get('/contracts/:id', [isLoggedIn], (...args) =>
        contractController.show(...args)
    );

    router.post(
        '/contracts',
        [isLoggedIn, isAdmin],
        [contractValidator, validate],
        (...args) => contractController.create(...args)
    );

    router.put('/contracts/:id', [isLoggedIn, isAdmin], (...args) =>
        contractController.update(...args)
    );

    router.delete('/contracts/:id', [isLoggedIn, isAdmin], (...args) =>
        contractController.delete(...args)
    );

    return router;
};
