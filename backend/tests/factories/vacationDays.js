const faker = require('faker');
const { VacationDay } = require('../../models');
const moment = require('moment');

class VacationDaysFactory {
    static generate(props) {
        const userId = faker.random.number({ min: 1, max: 999 });
        const days = faker.random.number({ min: 1, max: 26 });
        const startDay = faker.date.between('2020-07-05', '2020-12-05');
        const stopDay = moment(startDay).add(days, 'days');
        const contractId = faker.random.number({ min: 1, max: 999 });
        const defaultProps = {
            userId,
            startDay,
            stopDay,
            days,
            isApproved: faker.random.boolean(),
            contractId
        };

        return Object.assign({}, defaultProps, props);
    }

    static build(props) {
        return VacationDay.build(VacationDaysFactory.generate(props));
    }

    static create(props) {
        return VacationDay.create(VacationDaysFactory.generate(props));
    }
}

module.exports = VacationDaysFactory;
