import axios from 'axios';
import config from '../config';

const instance = axios.create({
    baseURL: config.apiUrl
});

if (localStorage.token) {
    instance.defaults.headers.common['Authorization'] = localStorage.token;
}

export default instance;
