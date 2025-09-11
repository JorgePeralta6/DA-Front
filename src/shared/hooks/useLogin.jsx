import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginRequest } from "../../services"
import toast from "react-hot-toast";

export const useLogin = () => {

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const login = async (email, password) => {

        setIsLoading(true)

        const response = await loginRequest({
            email,
            password
        })

        setIsLoading(false)

        if (response.error) {
            return toast.error(response.error?.response?.data || 'Ocurrió un error al iniciar sesión, usuario no encontrado', {
                style: {
                    background: 'red',
                    color: 'white'
                }
            })
        }

        const { authDetails } = response.data;

        // 💾 Guardar datos de autenticación
        localStorage.setItem('auth', JSON.stringify(authDetails));

        toast.success('Sesión iniciada correctamente', {
            style: {
                background: 'green',
                color: 'white'
            }
        });

        // 🎯 Redirección basada en el rol del usuario
        const userRole = authDetails.role;
        
        console.log("🔍 Usuario logueado con rol:", userRole);

        if (userRole === 'ADMIN_ROLE') {
            console.log("➡️ Redirigiendo admin a dashboard");
            navigate('/adminDashboard');
        } else if (userRole === 'EMPLOYEE_ROLE') {
            console.log("➡️ Redirigiendo empleado a lista de usuarios");
            navigate('/userListPage');
        } else {
            console.warn("⚠️ Rol desconocido:", userRole);
            navigate('/unauthorized');
        }
    }

    return {
        login,
        isLoading
    }
}