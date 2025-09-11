import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000/dmmsystem/v1',
    timeout: 5000
})


apiClient.interceptors.request.use(

    (config) => {
        const useUserDetails = localStorage.getItem('auth');

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

export const deleteUser = async (numero) => {
    try {
        return await apiClient.delete(`/users/${numero}`)

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

export const getDPI = async (search) => {
    try {
        const res = await apiClient.get(`/users/buscar/${encodeURIComponent(search)}`);
        console.log("Resultado de búsqueda:", res.data);
        return res;
    } catch (e) {
        console.error("Error en getDPI:", e.response?.data || e);
        return {
            error: true,
            msg: e.response?.data?.msg || 'Error desconocido',
            e,
        };
    }
};


export const login = async (data) => {
    try {
        return await apiClient.post('/auth/login', data)
    } catch (e) {
        const msg = e.response?.data?.msg || 'Error desconocido';
        return {
            error: true,
            msg,
            e,
        };
    }
}

export const register = async (data) => {
    try {
        const res = await apiClient.post('/auth/register', data);
        return {
            success: true,
            data: res.data
        };
    } catch (e) {
        const msg = e.response?.data?.msg || 'Error desconocido';
        return {
            error: true,
            msg,
            e,
        };
    }
};

export const exportUsersToExcel = async () => {
    try {
        const response = await apiClient.get('/users/excel', {
            responseType: 'blob', // Esto asegura que recibimos un archivo
        });

        // Crear un enlace temporal para descargar el archivo
        const url = window.URL.createObjectURL(new Blob([response.data]));

        return { success: true };
    } catch (e) {
        const msg = e.response?.data?.msg || 'Error desconocido';
        console.error('Error al exportar usuarios:', e);
        return {
            error: true,
            msg,
            e,
        };
    }
};

export const getEmployees = async () => {
    try {
        return await apiClient.get('/auth')
    } catch (e) {
        const msg = e.response?.data?.msg || 'Error desconocido';
        return {
            error: true,
            msg,
            e,
        };
    }
}

// Actualizar empleado
export const updateEmployee = async (id, updatedData) => {
    try {
        const response = await apiClient.put(`/auth/employees/${id}`, updatedData);
        return response.data;
    } catch (e) {
        console.error('Error en updateEmployee:', e);
        return { 
            error: true, 
            msg: e.response?.data?.msg || 'Error desconocido',
            e 
        };
    }
};

// Actualizar contraseña de empleado
export const updateEmployeePassword = async (id, passwordData) => {
    try {
        const response = await apiClient.put(`/auth/employees/${id}/password`, passwordData);
        return response.data;
    } catch (e) {
        console.error('Error en updateEmployeePassword:', e);
        return { 
            error: true, 
            msg: e.response?.data?.msg || 'Error desconocido',
            e 
        };
    }
};