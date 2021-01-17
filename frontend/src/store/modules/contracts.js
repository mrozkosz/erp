import ContractsService from '@/services/ContractsService';

const initialState = {
    contracts: []
};

const state = {
    ...initialState
};

const getters = {
    contracts: state => state.contracts
};

const actions = {
    async getContracts({ commit }, params = null) {
        try {
            const { data } = await ContractsService.index(params);

            commit('setContracts', data);
        } catch (error) {
            console.error(error);
        }
    },

    deleteContract({ commit }, id) {
        commit('removeContract', id);

        ContractsService.delete(id);
    },

    createContract({ commit }, item) {
        commit('pushContract', item);
    }
};

const mutations = {
    setContracts(state, data) {
        state.contracts = data;
    },

    removeContract(state, id) {
        const { data } = state.contracts;

        const index = data.findIndex(contract => contract.id === id);

        data.splice(index, 1);
    },

    pushContract(state, item) {
        const { data } = state.contracts;

        data.push(item);
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
