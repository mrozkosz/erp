import axios from './Api';

export default {
    index(params) {
        return axios.get(`employees`, { params });
    },

    show(id) {
        return axios.get(`employees/${id}`);
    },

    delete(id) {
        return axios.delete(`employees/${id}`);
    },

    save(data) {
        if (data.id) {
            return axios.put(`employees/${data.id}`, data);
        }

        return axios.post('employees', data);
    }
};
