import { useState } from "react";
import toast from "react-hot-toast";
import {
    saveUser as saveUserRequest,
    getUsers as getUsersRequest,
    deleteUser as deleteUserRequest,
    updateUser as updateUserRequest,
    getDPI as getDPIRequest
} from "../../services";

export const useUser = () => {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const saveUser = async (userData) => {
        setLoading(true);
        const result = await saveUserRequest(userData);

        if (result?.error) {
            setLoading(false);
            toast.error(result.msg || "No se pudo agregar el usuario");
            return null;
        }

        toast.success("Usuario agregado con éxito");

        // Agregar el nuevo usuario al estado
        if (result.data && result.data.user) {
            setUsers((prev) => [...prev, result.data.user]);
        }

        setLoading(false);
        return result.data.user;
    };

    // Función corregida para obtener todos los usuarios
    const getUsers = async () => {
        setLoading(true);
        try {
            const result = await getUsersRequest(); // Sin parámetros

            if (result?.error) {
                setLoading(false);
                toast.error(result.msg || "No se pudieron obtener los usuarios");
                return [];
            }

            // IMPORTANTE: Tu API devuelve { success: true, users: [...] }
            // Asegúrate de acceder correctamente a los datos
            const fetchedUsers = result.data?.users || result.users || [];
            setUsers(fetchedUsers);
            setLoading(false);
            return fetchedUsers;
        } catch (error) {
            setLoading(false);
            toast.error("Error al cargar usuarios");
            return [];
        }
    };

    const deleteUser = async (numero) => {
        setLoading(true);
        try {
            const result = await deleteUserRequest(numero); // API call

            if (result?.error || !result?.success) {
                setLoading(false);
                return false;
            }

            toast.success("Usuario eliminado correctamente");
            setLoading(false);
            return true;
        } catch (error) {
            toast.error("Error al eliminar usuario");
            setLoading(false);
            return false;
        }
    };


    const updateUser = async (numero, updatedUser) => {
        const result = await updateUserRequest(numero, updatedUser);

        if (result.error) {
            toast.error(result.e?.response?.data?.message || "No se pudo actualizar el usuario");
            return null;
        }

        toast.success("Usuario actualizado correctamente");

        // Actualiza el usuario en el estado global
        setUsers((prev) =>
            prev.map((u) => (u.numero === numero ? { ...u, ...updatedUser } : u))
        );

        return result.user || result.data?.user || null;
    };


    const getDPI = async (search) => {
        setLoading(true);
        try {
            const result = await getDPIRequest(search);

            if (result?.error) {
                setLoading(false);
                toast.error(result.msg || "No se pudo obtener el usuario por DPI o nombre");
                return null;
            }

            const foundUsers = result.data?.users || result.users;

            if (foundUsers.length === 0) {
                toast("No se encontraron usuarios");
            }

            setUsers(foundUsers);
            setLoading(false);
            return foundUsers;
        } catch (error) {
            toast.error("Error al buscar usuario");
            setLoading(false);
            return null;
        }
    };


    return {
        users,
        user,
        loading,
        saveUser,
        getUsers,
        deleteUser,
        updateUser,
        getDPI
    };
};