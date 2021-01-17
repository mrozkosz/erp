import axios from './Api';

export default {
    index(params) {
        return axios.get(`vacations`, { params });
    },

    show(id) {
        return axios.get(`vacations/${id}`);
    },

    delete(id) {
        return axios.delete(`vacations/${id}`);
    },

    save(data) {
        if (data.id) {
            return axios.put(`vacations/${data.id}`, data);
        }

        return axios.post('vacations', data);
    }
};
