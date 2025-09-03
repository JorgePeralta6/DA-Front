import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginRequest } from "../../services"
import toast from "react-hot-toast";

export const useLogin = () => {

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate()


    const login = async (email, password) => {

        setIsLoading(true)

        const response = await loginRequest({
            email,
            password
        })

        setIsLoading(false)

        if(response.error){
            return toast.error(response.error?.response?.data || 'Ocurrio un error al iniciar sesión, usuario no encontrado', {
                style: {
                    background: 'red',
                    color: 'white'
                }
            })
        }

        const { authDetails } = response.data

        localStorage.setItem('auth', JSON.stringify(authDetails));
        

        toast.success('Sesion iniciada correctamente', {
            style: {
                background: 'green',
                color: 'white'
            }
        })

        navigate('/userListPage')
    }
    return {
        login,
        isLoading
    }
}