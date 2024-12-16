import axios from 'axios';

// Create axios instance with default config
const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || '',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor
instance.interceptors.request.use(
    (config) => {
        // You can add auth headers here if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    console.error('Bad Request:', error.response.data);
                    break;
                case 401:
                    console.error('Unauthorized');
                    break;
                case 403:
                    console.error('Forbidden');
                    break;
                case 404:
                    console.error('Not Found');
                    break;
                case 500:
                    console.error('Internal Server Error');
                    break;
                default:
                    console.error('API Error:', error.response.status);
            }
        } else if (error.request) {
            console.error('Network Error:', error.request);
        } else {
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default instance;