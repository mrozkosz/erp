import VacationDaysService from '@/services/VacationDaysService';

const initialState = {
    vacationDays: []
};

const state = {
    ...initialState
};

const getters = {
    vacationDays: state => state.vacationDays
};

const actions = {
    async getVacationDays({ commit }, params = null) {
        try {
            const { data } = await VacationDaysService.index(params);

            commit('setVacationDays', data);
        } catch (error) {
            console.error(error);
        }
    },

    deleteVacationDay({ commit }, id) {
        commit('removeVacationDay', id);

        VacationDaysService.delete(id);
    },

    createVacationDay({ commit }, item) {
        commit('pushVacationDay', item);
    },

    updateVacationDay({ commit }, item) {
        commit('modernizeVacationDay', item);
    }
};

const mutations = {
    setVacationDays(state, data) {
        state.vacationDays = data;
    },

    pushVacationDay(state, item) {
        const { data } = state.vacationDays;

        data.push(item);
    },

    removeVacationDay(state, id) {
        const { data } = state.vacationDays;

        const index = data.findIndex(vacationDay => vacationDay.id === id);

        data.splice(index, 1);
    },

    modernizeVacationDay(state, item) {
        const { data } = state.vacationDays;

        const index = data.findIndex(vacationDay => vacationDay.id === item.id);

        data.splice(index, 1, item);
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
