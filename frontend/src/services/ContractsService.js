import axios from './Api';

export default {
    index(params) {
        return axios.get(`contracts`, { params });
    },

    delete(id) {
        return axios.delete(`contracts/${id}`);
    },

    save(data) {
        if (data.id) {
            return axios.put(`contracts/${data.id}`, data);
        }

        return axios.post('contracts', data);
    }
};
