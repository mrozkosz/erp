import Auth from '@/services/Auth';

const initialState = {
    user: JSON.parse(localStorage.getItem('user'))
};

const state = {
    ...initialState
};

const getters = {
    getUser: state => state.user,

    isAdmin(state) {
        if (!state.user) {
            return false;
        }

        const { roles } = state.user;

        return roles.some(role => role.name === 'admin');
    },

    isEmployee(state) {
        if (!state.user) {
            return false;
        }

        const { roles } = state.user;

        return roles.some(role => role.name === 'employee');
    }
};

const actions = {
    setUser({ commit }, user) {
        commit('setUser', user);
        commit('setToken', user);
    },

    clearStorage({ commit }) {
        commit('clearStorage');
    },

    async loggedStatus({ commit }) {
        try {
            await Auth.me();
        } catch (error) {
            commit('clearStorage');
        }
    }
};

const mutations = {
    setUser(state, data) {
        const { user } = data;

        localStorage.setItem('user', JSON.stringify(user));
        state.user = user;
    },

    setToken(state, data) {
        const { token } = data;

        localStorage.setItem('token', token);
        state.token = token;
    },

    clearStorage(state) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        delete state.token;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
