const { body } = require('express-validator');
const { User } = require('../models');

const create = [
    body('userId')
        .not()
        .isEmpty()
        .withMessage('should be not empty')
        .custom(async (userId, { req }) => {
            const user = await User.findOne({
                where: {
                    id: userId
                }
            });

            if (!user) {
                return Promise.reject('User does not exists!');
            }

            req.user = user;
        }),

    body(['startDay'])
        .not()
        .isEmpty()
        .withMessage('should be not empty')
        .toDate(),

    body(['stopDay'])
        .not()
        .isEmpty()
        .withMessage('should be not empty')
        .toDate()
];

const update = [
    ...create,

    body('isApproved')
        .not()
        .isEmpty()
        .withMessage('should be not empty')
        .custom(async (isApproved, { req }) => {
            const { isAdmin } = req;

            req.isApproved = isAdmin ? isApproved : false;
        })
];

module.exports = {
    create,
    update
};
