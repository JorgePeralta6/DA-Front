import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner, Center, Text, VStack } from '@chakra-ui/react';

const DashboardRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    
    if (!authData) {
      navigate('/', { replace: true });
      return;
    }

    const { role, username } = authData;

    // Pequeño delay para mejor UX
    const timer = setTimeout(() => {
      switch (role) {
        case 'ADMIN_ROLE':
          navigate('/adminDashboard', { replace: true });
          break;
        case 'EMPLOYEE_ROLE':
          navigate('/userListPage', { replace: true });
          break;
        default:
          navigate('/unauthorized', { replace: true });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const authData = JSON.parse(localStorage.getItem("auth"));

  return (
    <Center h="100vh" bg="gray.50">
      <VStack spacing={4}>
        <Spinner size="xl" color="blue.500" thickness="4px" />
        <Text fontSize="lg" color="gray.600">
          Bienvenido {authData?.username}
        </Text>
        <Text color="gray.500">
          Redirigiendo a tu dashboard...
        </Text>
      </VStack>
    </Center>
  );
};

export default DashboardRedirect;