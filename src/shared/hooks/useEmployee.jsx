import { useState } from "react";
import toast from "react-hot-toast";
import {
    getEmployees as getEmployeesRequest,
    updateEmployee as updateEmployeeRequest,
    updateEmployeePassword as updateEmployeePasswordRequest
} from "../../services";

export const useEmployee = () => {
    const [employees, setEmployees] = useState([]);
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(false);

    // Obtener todos los empleados
    const getEmployees = async () => {
        setLoading(true);
        try {
            const result = await getEmployeesRequest();

            if (result?.error) {
                setLoading(false);
                toast.error(result.msg || "No se pudieron obtener los empleados");
                return [];
            }

            // La API devuelve { employees: [...] }
            const fetchedEmployees = result.data?.employees || result.employees || [];
            setEmployees(fetchedEmployees);
            setLoading(false);
            return fetchedEmployees;
        } catch (error) {
            setLoading(false);
            toast.error("Error al cargar empleados");
            return [];
        }
    };

    // Actualizar empleado
    const updateEmployee = async (id, updatedEmployee) => {
        setLoading(true);
        try {
            const result = await updateEmployeeRequest(id, updatedEmployee);

            if (result?.error) {
                setLoading(false);
                toast.error(result.msg || "No se pudo actualizar el empleado");
                return null;
            }

            toast.success("Empleado actualizado correctamente");

            // Actualizar el empleado en el estado local
            setEmployees((prev) =>
                prev.map((emp) => (emp._id === id ? { ...emp, ...updatedEmployee } : emp))
            );

            setLoading(false);
            return result.updated || result.data?.updated || null;
        } catch (error) {
            setLoading(false);
            toast.error("Error al actualizar empleado");
            return null;
        }
    };

    // Actualizar contraseña de empleado
    const updateEmployeePassword = async (id, passwordData) => {
        setLoading(true);
        try {
            const result = await updateEmployeePasswordRequest(id, passwordData);

            if (result?.error) {
                setLoading(false);
                toast.error(result.msg || "No se pudo actualizar la contraseña");
                return false;
            }

            toast.success("Contraseña actualizada correctamente");
            setLoading(false);
            return true;
        } catch (error) {
            setLoading(false);
            toast.error("Error al actualizar contraseña");
            return false;
        }
    };

    // Seleccionar empleado específico
    const selectEmployee = (employeeData) => {
        setEmployee(employeeData);
    };

    // Limpiar empleado seleccionado
    const clearEmployee = () => {
        setEmployee(null);
    };

    return {
        employees,
        employee,
        loading,
        getEmployees,
        updateEmployee,
        updateEmployeePassword,
        selectEmployee,
        clearEmployee
    };
};