const HttpStatuses = require('http-status-codes');
const moment = require('moment');
const { VacationDay } = require('../models');

class VacationDayController {
    constructor(contractRepository, vacationDayRepository, userRepository) {
        this.contractRepository = contractRepository;
        this.vacationDayRepository = vacationDayRepository;
        this.userRepository = userRepository;
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

        const vacationDays = await this.vacationDayRepository.findAndCountAll({
            where,
            offset,
            limit,
            order: [[sortBy, order]]
        });

        const totalPages = Math.ceil(vacationDays.count / limit);

        return res.send({ totalPages, data: vacationDays.rows });
    }

    async show(req, res) {
        const { id } = req.params;

        const contract = await this.contractRepository.findById(id, {
            include: [
                {
                    association: 'vacationDays'
                }
            ],
            subQuery: false
        });

        if (!contract) {
            return res.sendStatus(HttpStatuses.NOT_FOUND);
        }

        return res.send(contract);
    }

    async create(req, res) {
        const { isAdmin, loggedUser, body, user } = req;
        const { startDay, stopDay } = req.body;

        if (!isAdmin) {
            body.userId = loggedUser.id;
        }

        const lastContract = await this.contractRepository.findOne({
            where: {
                userId: body.userId
            },
            order: [['createdAt', 'DESC']]
        });

        if (!lastContract) {
            return res.sendStatus(HttpStatuses.NOT_FOUND);
        }

        const startAt = moment(startDay);
        const stopAt = moment(stopDay);
        const days = isAdmin ? Math.abs(startAt.diff(stopAt, 'days')) : 0;

        const createdVacationDay = await this.vacationDayRepository.create({
            userId: body.userId,
            contractId: lastContract.id,
            startDay,
            stopDay,
            days,
            isApproved: isAdmin ? true : false
        });

        let availableDays = null;

        if (isAdmin) {
            availableDays = VacationDay.sequelize.literal(
                `availableDays - ${createdVacationDay.days}`
            );

            user.update({ availableDays });
        }

        return res.status(201).send(createdVacationDay);
    }

    async update(req, res) {
        const { params, isAdmin, isApproved, user } = req;
        const { startDay, stopDay } = req.body;

        const vacationDay = await this.vacationDayRepository.findById(
            params.id
        );

        if (!vacationDay) {
            return res.sendStatus(HttpStatuses.NOT_FOUND);
        }

        const approvedBeforeUpdate = vacationDay.isApproved;
        const vacationDaysBeforeUpdate = vacationDay.days;

        if (!isAdmin && vacationDay.isApproved) {
            return res.status(HttpStatuses.UNPROCESSABLE_ENTITY).send({
                message: 'Vacations has been approved, you can not edit it.'
            });
        }

        const startAt = moment(startDay ? startDay : vacationDay.startDay);
        const stopAt = moment(stopDay ? stopDay : vacationDay.stopDay);
        const days = isApproved ? Math.abs(startAt.diff(stopAt, 'days')) : 0;

        const updatedVacationDay = await vacationDay.update({
            isApproved,
            startDay: startAt,
            stopDay: stopAt,
            days
        });

        let availableDays = 0;

        if (
            approvedBeforeUpdate === true &&
            updatedVacationDay.days !== vacationDaysBeforeUpdate
        ) {
            const difference =
                updatedVacationDay.days - vacationDaysBeforeUpdate;

            availableDays = VacationDay.sequelize.literal(
                `availableDays - ${difference}`
            );
        }

        if (
            approvedBeforeUpdate === false &&
            updatedVacationDay.isApproved === true
        ) {
            availableDays = VacationDay.sequelize.literal(
                `availableDays - ${updatedVacationDay.days}`
            );
        }

        if (
            approvedBeforeUpdate === true &&
            updatedVacationDay.isApproved === false
        ) {
            availableDays = VacationDay.sequelize.literal(
                `availableDays + ${Math.abs(startAt.diff(stopAt, 'days'))}`
            );
        }

        user.update({ availableDays });

        return res.send(updatedVacationDay);
    }

    async delete(req, res) {
        const { id: vacationDayId } = req.params;

        const vacationDay = await this.vacationDayRepository.findById(
            vacationDayId
        );

        const { userId } = vacationDay;

        const user = await this.userRepository.findById(userId);

        user.update({
            availableDays: VacationDay.sequelize.literal(
                `availableDays + ${vacationDay.days}`
            )
        });

        if (vacationDay) {
            await vacationDay.destroy();
        }

        return res.sendStatus(HttpStatuses.NO_CONTENT);
    }
}

module.exports = VacationDayController;
