import React from 'react';
import { Outlet } from 'react-router-dom';
import UnauthorizedModal from './UnauthorizedModal';

const PrivateRoute = ({ allowedRoles = [] }) => {
  let authData;
  try {
    authData = JSON.parse(localStorage.getItem('auth'));
  } catch (error) {
    console.log("🚫 Error parseando datos de autenticación");
    return <UnauthorizedModal />;
  }

  // 🚫 Si no hay datos de autenticación
  if (!authData) {
    console.log("🚫 No hay datos de autenticación");
    return <UnauthorizedModal />;
  }

  const { role, token } = authData;

  // 🚫 Verificaciones básicas (token o rol faltantes)
  if (!token || !role) {
    console.log("🚫 Datos de autenticación incompletos");
    localStorage.removeItem('auth');
    return <UnauthorizedModal />;
  }

  // 🚫 Usuario autenticado pero rol no permitido
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    console.log(`🚫 Usuario autenticado pero rol ${role} no autorizado. Roles permitidos:`, allowedRoles);
    return <UnauthorizedModal />;
  }

  console.log(`✅ Acceso autorizado para rol: ${role}`);
  return <Outlet />;
};

export default PrivateRoute;