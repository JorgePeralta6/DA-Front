import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000/dmmsystem/v1',
    timeout: 5000
})


apiClient.interceptors.request.use(

    (config) => {
        const useUserDetails = localStorage.getItem('user');

        if (useUserDetails) {
            const token = JSON.parse(useUserDetails).token
            config.headers['x-token'] = token;
            config.headers['x-token'] = token;
        }

        return config;
    },
    response => response,
    error => {
        if (error.response?.status === 401) {
            window.dispatchEvent(new Event('token-expired'));
        }
        return Promise.reject(error);
    }
)


export const getUsers = async () => {
    try {
        return await apiClient.get('/users')
    } catch (e) {
        const msg = e.response?.data?.msg || 'Error desconocido';
        return {
            error: true,
            msg,
            e,
        };
    }
}

export const saveUser = async (data) => {
    try {
        return await apiClient.post('/users', data)
    } catch (e) {
        const msg = e.response?.data?.msg || 'Error desconocido';
        return {
            error: true,
            msg,
            e,
        };
    }
}

export const deleteUser = async (userId) => {
    try {
        return await apiClient.delete(`/users/${userId}`)

    } catch (e) {
        const msg = e.response?.data?.msg || 'Error desconocido';
        return {
            error: true,
            msg,
            e,
        };
    }
}

export const updateUser = async (numero, updatedData) => {
    try {
        const response = await apiClient.put(`/users/${numero}`, updatedData); // Ruta con número
        return response.data;
    } catch (e) {
        console.error('Error en updateUser:', e);
        return { error: true, e };
    }
};

export const getDPI = async (DPI) => {
    try {
        const res = await apiClient.get(`/users/findUser?DPI=${DPI}`);
        console.log("DPI:", res.data);
        return res;
    } catch (e) {
        console.error("Error en getDPI:", e.response?.data || e);
        return {
            error: true,
            msg: e.response?.data?.message || 'Error desconocido',
            e,
        };
    }
};