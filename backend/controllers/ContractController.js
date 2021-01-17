const HttpStatuses = require('http-status-codes');
const { Contract, VacationDay } = require('../models');
const moment = require('moment');

class ContractController {
    constructor(userRepository, contractRepository) {
        this.userRepository = userRepository;
        this.contractRepository = contractRepository;
    }

    async index(req, res) {
        const { loggedUser } = req;
        const {
            perPage = 5,
            page = 1,
            sortBy = 'createdAt',
            order = 'desc'
        } = req.query;

        const pageNumber = parseInt(page);
        const limit = parseInt(perPage);

        const offset = (pageNumber - 1) * limit;

        const where = {};

        if (!(await loggedUser.isAdmin())) {
            where.userId = loggedUser.id;
        }

        const contractsId = await this.contractRepository.findAll({
            where,
            attributes: ['id'],
            row: true
        });

        if (!(await loggedUser.isAdmin())) {
            where.id = contractsId.map((value) => {
                return value.id;
            });
        }

        const count = await this.contractRepository.count({ where });

        const contracts = await this.contractRepository.findAll({
            where,
            limit,
            offset,
            subQuery: false,
            attributes: {
                include: [
                    [
                        Contract.sequelize.fn(
                            'SUM',
                            Contract.sequelize.col('vacationDays.days')
                        ),
                        'usedDays'
                    ]
                ]
            },
            include: [
                {
                    association: 'vacationDays',
                    attributes: []
                }
            ],
            group: ['id'],
            order: [[sortBy, order]]
        });

        const totalPages = Math.ceil(count / limit);

        return res.send({
            count,
            totalPages,
            data: contracts
        });
    }

    async show(req, res) {
        const { id } = req.params;
        const { loggedUser } = req;

        const contract = await this.contractRepository.findById(id);

        if (!contract) {
            return res.sendStatus(HttpStatuses.NOT_FOUND);
        }

        if (
            !(await loggedUser.isAdmin()) &&
            loggedUser.id !== contract.userId
        ) {
            return res.sendStatus(HttpStatuses.FORBIDDEN);
        }

        return res.send(contract);
    }

    async create(req, res) {
        const { userId: id, duration, startDay, stopDay, freeDays } = req.body;

        if (!stopDay) {
            req.body.stopDay = moment(startDay)
                .add(duration, 'M')
                .subtract(1, 'd');
        }

        const newAvailableDays = (duration / 12) * freeDays;

        const availableDays = VacationDay.sequelize.literal(
            `availableDays + ${newAvailableDays}`
        );

        this.userRepository.updateById(id, { availableDays });

        const contract = await this.contractRepository.create(req.body);

        return res.status(201).send(contract);
    }

    async update(req, res) {
        const { id: contractId } = req.params;
        const { duration, startDay, freeDays, userId } = req.body;

        const contract = await this.contractRepository.findById(contractId);

        if (!contract) {
            return res.sendStatus(HttpStatuses.NOT_FOUND);
        }

        const availableDaysBeforeUpdate =
            (contract.duration / 12) * contract.freeDays;

        this.userRepository.updateById(userId, {
            availableDays: VacationDay.sequelize.literal(
                `availableDays - ${availableDaysBeforeUpdate}`
            )
        });

        req.body.stopDay = moment(startDay).add(duration, 'M').subtract(1, 'd');

        const updatedContract = await contract.update(req.body);

        const availableDaysAfterUpdate = (duration / 12) * freeDays;

        this.userRepository.updateById(userId, {
            availableDays: VacationDay.sequelize.literal(
                `availableDays + ${availableDaysAfterUpdate}`
            )
        });

        return res.send(updatedContract);
    }

    async delete(req, res) {
        const { id: contractId } = req.params;

        const contract = await this.contractRepository.findById(contractId);

        if (!contract) {
            return res.sendStatus(HttpStatuses.NO_CONTENT);
        }

        const vacationDaysSum = await VacationDay.findAll({
            where: { userId: contract.userId },
            attributes: [
                [
                    VacationDay.sequelize.fn(
                        'sum',
                        VacationDay.sequelize.col('days')
                    ),
                    'usedDays'
                ]
            ],
            raw: true
        });

        const { usedDays } = vacationDaysSum.reduce((data) => {
            return data;
        });

        const availableDays =
            (contract.duration / 12) * contract.freeDays - usedDays;

        this.userRepository.updateById(contract.userId, {
            availableDays: VacationDay.sequelize.literal(
                `availableDays - ${availableDays}`
            )
        });

        if (contract) {
            await contract.destroy();
        }

        return res.sendStatus(HttpStatuses.NO_CONTENT);
    }
}

module.exports = ContractController;
