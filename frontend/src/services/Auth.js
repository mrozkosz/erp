import axios from './Api';

export default {
    async login(credentials) {
        const { data } = await axios.post('login', credentials);
        axios.defaults.headers.common['Authorization'] = data.token;

        return data;
    },

    me() {
        return axios.get('me');
    },

    recoverPasswordSendEmail(email) {
        return axios.post('recover-password', email);
    },

    recoverPassword(credentials) {
        return axios.post(`recover-password/${credentials.hash}`, credentials);
    }
};
