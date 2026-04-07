

import axios from 'axios';


const axiosApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api' || 'http://localhost:8080/api',
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

let isRefreshing = false;      
let failedQueue = [];         

const processQueue = (error, token = null) => {
    failedQueue.forEach(promise => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    });    failedQueue = [];
};

axiosApi.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {

            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axiosApi(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await axios.post(
                    'http://localhost:8080/api/auth/refresh',
                    { refreshToken },
                    { headers: { 'Content-Type': 'application/json', } }
                );

                const newToken = data.token;

                localStorage.setItem('token', newToken);

                axiosApi.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                processQueue(null, newToken);  
                return axiosApi(originalRequest); 

            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);

            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);


export default axiosApi;