import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
  const authData = JSON.parse(localStorage.getItem("auth"));

  // 🔹 Si no hay datos de autenticación → login
  if (!authData) {
    console.log("❌ No hay datos de autenticación");
    return <Navigate to="/" replace />;
  }

  // 🔹 Extraer el rol correctamente desde authDetails
  // Tu API guarda: { authDetails: { role: "ADMIN_ROLE", username, token, etc } }
  const userRole = authData.authDetails?.role || authData.role;

  console.log("🔍 Datos de auth completos:", authData);
  console.log("🔍 Rol del usuario:", userRole);
  console.log("🔍 Roles permitidos:", allowedRoles);

  // 🔹 Validar que existe el rol
  if (!userRole) {
    console.warn("⚠️ No se encontró rol en los datos de usuario:", authData);
    return <Navigate to="/unauthorized" replace />;
  }

  // 🔹 Validar si el rol del usuario está en los roles permitidos
  const hasAccess = allowedRoles.includes(userRole);

  console.log("✅ ¿Tiene acceso?", hasAccess);

  if (!hasAccess) {
    console.log(`❌ Acceso denegado. Usuario con rol '${userRole}' intentó acceder a ruta que requiere: [${allowedRoles.join(', ')}]`);
    return <Navigate to="/unauthorized" replace />;
  }

  // 🔹 Si pasa todas las validaciones, renderiza el componente hijo
  console.log("✅ Acceso autorizado");
  return <Outlet />;
};

export default PrivateRoute;