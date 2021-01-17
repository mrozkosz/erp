import EmployeesService from '@/services/EmployeesService';

const initialState = {
    employees: [],
    employee: []
};

const state = {
    ...initialState
};

const getters = {
    employee: state => state.employee,
    employees: state => state.employees
};

const actions = {
    async getEmployees({ commit }, params = null) {
        try {
            const { data } = await EmployeesService.index(params);

            commit('setEmployees', data);
        } catch (error) {
            console.error(error);
        }
    },

    async getEmployee({ commit }, id) {
        try {
            const { data } = await EmployeesService.show(id);

            commit('setEmployee', data);
        } catch (error) {
            console.error(error);
        }
    },

    deleteEmployee({ commit }, id) {
        commit('removeEmployee', id);

        EmployeesService.delete(id);
    },

    createEmployee({ commit }, item) {
        commit('pushEmployee', item);
    }
};

const mutations = {
    setEmployees(state, data) {
        state.employees = data;
    },

    setEmployee(state, data) {
        state.employee = data;
    },

    removeEmployee(state, id) {
        const { data } = state.employees;

        const index = data.findIndex(employee => employee.id === id);

        data.splice(index, 1);
    },

    pushEmployee(state, item) {
        const { data } = state.employees;

        data.push(item);
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
