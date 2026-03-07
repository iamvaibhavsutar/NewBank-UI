

import axios from 'axios';


const axiosApi = axios.create({
    baseURL:'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
        
    },

});
let getToken = () => localStorage.getItem('token');

export const setTokenGetter = (getter) => {
    getToken = getter;
};

axiosApi.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, 
    (error) => {
        return Promise.reject(error);
    }
);
axiosApi.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            const rmtoken = localStorage.removeItem('token');
            console.log('Unauthorized! Token removed:', rmtoken);
        }
        return Promise.reject(error);
    }
);


export default axiosApi;