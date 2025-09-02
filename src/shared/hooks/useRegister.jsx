import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerRequest } from '../../services';
import toast from "react-hot-toast";

export const useRegister = () => {
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const register = async (email, nombre, password, phone, apellido, username) => {

        setIsLoading(true)

        const response = await registerRequest({ email, nombre, password, phone, apellido, username })

        setIsLoading(false)

        if (!response.success) {
            return toast.error(response.message, {
                style: {
                    background: 'red',
                    color: 'white',
                    whiteSpace: 'pre-line'
                }
            });
        }

        const { authDetails } = response.data

        localStorage.setItem('auth', JSON.stringify(authDetails));

        toast.success('Usuario registrado con exito!', {
            style: {
                background: 'green',
                color: 'white'
            }
        })

        navigate('/')

    }

    return {
        register,
        isLoading
    }
}