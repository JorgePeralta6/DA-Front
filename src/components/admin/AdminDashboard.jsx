import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Center,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormControl,
  FormLabel,
  Text,
  Heading,
  HStack,
  VStack,
  Badge,
  IconButton,
  Tooltip,
  useColorModeValue,
  Container,
  Card,
  CardBody,
  Divider,
  InputGroup,
  InputLeftElement,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from "@chakra-ui/react";
import { EditIcon, LockIcon, SearchIcon } from "@chakra-ui/icons";
import { useEmployee } from "../../shared/hooks"; // Ajusta la ruta según tu estructura

const AdminDashboard = () => {
  const {
    employees,
    loading,
    getEmployees,
    updateEmployee,
    updateEmployeePassword
  } = useEmployee();

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [passwordData, setPasswordData] = useState({ password: "", confirmPassword: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose
  } = useDisclosure();

  const {
    isOpen: isPasswordOpen,
    onOpen: onPasswordOpen,
    onClose: onPasswordClose
  } = useDisclosure();

  // Colores para el modo claro/oscuro
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    getEmployees();
  }, []);

  // Filtrar empleados por búsqueda
  useEffect(() => {
    if (!searchTerm) {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(emp =>
        emp.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [employees, searchTerm]);

  const openEditModal = (employee) => {
    setSelectedEmployee({ ...employee });
    onEditOpen();
  };

  const openPasswordModal = (employee) => {
    setSelectedEmployee(employee);
    setPasswordData({ password: "", confirmPassword: "" });
    onPasswordOpen();
  };

  const handleSaveEmployee = async () => {
    if (!selectedEmployee) return;

    const success = await updateEmployee(selectedEmployee._id, {
      nombre: selectedEmployee.nombre,
      apellido: selectedEmployee.apellido,
      email: selectedEmployee.email,
      phone: selectedEmployee.phone,
      role: selectedEmployee.role
    });

    if (success) {
      onEditClose();
      setSelectedEmployee(null);
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordData.password !== passwordData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (passwordData.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    const success = await updateEmployeePassword(selectedEmployee._id, {
      password: passwordData.password
    });

    if (success) {
      onPasswordClose();
      setSelectedEmployee(null);
      setPasswordData({ password: "", confirmPassword: "" });
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "ADMIN_ROLE":
        return "red";
      case "EMPLOYEE_ROLE":
        return "blue";
      default:
        return "gray";
    }
  };

  if (loading && employees.length === 0) {
    return (
      <Center h="50vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text>Cargando empleados...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading as="h1" size="xl" color="blue.600" mb={2}>
            Gestión de Empleados
          </Heading>
          <Text color="gray.600">
            Administra la información de los empleados del sistema
          </Text>
        </Box>

        {/* Search Bar */}
        <Card bg={bgColor} borderColor={borderColor}>
          <CardBody>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Buscar empleado por nombre, apellido, email o usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                bg={useColorModeValue("gray.50", "gray.700")}
              />
            </InputGroup>
          </CardBody>
        </Card>

        {/* Statistics */}
        <HStack spacing={4}>
          <Card flex={1} bg={bgColor} borderColor={borderColor}>
            <CardBody textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                {employees.length}
              </Text>
              <Text color="gray.600">Total Empleados</Text>
            </CardBody>
          </Card>
          <Card flex={1} bg={bgColor} borderColor={borderColor}>
            <CardBody textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="green.500">
                {employees.filter(emp => emp.role === "EMPLOYEE_ROLE").length}
              </Text>
              <Text color="gray.600">Empleados</Text>
            </CardBody>
          </Card>
          <Card flex={1} bg={bgColor} borderColor={borderColor}>
            <CardBody textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="red.500">
                {employees.filter(emp => emp.role === "ADMIN_ROLE").length}
              </Text>
              <Text color="gray.600">Administradores</Text>
            </CardBody>
          </Card>
        </HStack>

        {/* Employee Table */}
        <Card bg={bgColor} borderColor={borderColor}>
          <CardBody>
            {filteredEmployees.length === 0 ? (
              <Alert status="info">
                <AlertIcon />
                <AlertTitle>No se encontraron empleados</AlertTitle>
                <AlertDescription>
                  {searchTerm ? "No hay empleados que coincidan con la búsqueda." : "No hay empleados registrados."}
                </AlertDescription>
              </Alert>
            ) : (
              <Box overflowX="auto">
                <Table variant="simple" size="md">
                  <Thead>
                    <Tr>
                      <Th>Nombre Completo</Th>
                      <Th>Email</Th>
                      <Th>Usuario</Th>
                      <Th>Teléfono</Th>
                      <Th>Rol</Th>
                      <Th>Estado</Th>
                      <Th textAlign="center">Acciones</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredEmployees.map((emp) => (
                      <Tr key={emp._id} _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}>
                        <Td>
                          <Text fontWeight="medium">
                            {emp.nombre} {emp.apellido}
                          </Text>
                        </Td>
                        <Td>
                          <Text color="gray.600">{emp.email}</Text>
                        </Td>
                        <Td>
                          <Text fontFamily="mono" fontSize="sm">
                            {emp.username}
                          </Text>
                        </Td>
                        <Td>
                          <Text>{emp.phone || "No registrado"}</Text>
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={getRoleBadgeColor(emp.role)}
                            variant="subtle"
                          >
                            {emp.role === "ADMIN_ROLE" ? "Administrador" : "Empleado"}
                          </Badge>
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={emp.status ? "green" : "red"}
                            variant="subtle"
                          >
                            {emp.status ? "Activo" : "Inactivo"}
                          </Badge>
                        </Td>
                        <Td>
                          <HStack spacing={2} justify="center">
                            <Tooltip label="Editar empleado">
                              <IconButton
                                icon={<EditIcon />}
                                colorScheme="blue"
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditModal(emp)}
                              />
                            </Tooltip>
                            <Tooltip label="Cambiar contraseña">
                              <IconButton
                                icon={<LockIcon />}
                                colorScheme="orange"
                                variant="ghost"
                                size="sm"
                                onClick={() => openPasswordModal(emp)}
                              />
                            </Tooltip>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </CardBody>
        </Card>
      </VStack>

      {/* Modal Editar Empleado */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <EditIcon color="blue.500" />
              <Text>Editar Empleado</Text>
            </HStack>
          </ModalHeader>
          <Divider />
          <ModalBody py={6}>
            {selectedEmployee && (
              <VStack spacing={4}>
                <HStack spacing={4} width="100%">
                  <FormControl>
                    <FormLabel>Nombre</FormLabel>
                    <Input
                      value={selectedEmployee.nombre || ""}
                      onChange={(e) =>
                        setSelectedEmployee({ ...selectedEmployee, nombre: e.target.value })
                      }
                      placeholder="Ingrese el nombre"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Apellido</FormLabel>
                    <Input
                      value={selectedEmployee.apellido || ""}
                      onChange={(e) =>
                        setSelectedEmployee({ ...selectedEmployee, apellido: e.target.value })
                      }
                      placeholder="Ingrese el apellido"
                    />
                  </FormControl>
                </HStack>

                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={selectedEmployee.email || ""}
                    onChange={(e) =>
                      setSelectedEmployee({ ...selectedEmployee, email: e.target.value })
                    }
                    placeholder="Ingrese el email"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Teléfono</FormLabel>
                  <Input
                    value={selectedEmployee.phone || ""}
                    onChange={(e) =>
                      setSelectedEmployee({ ...selectedEmployee, phone: e.target.value })
                    }
                    placeholder="Ingrese el teléfono"
                  />
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <Divider />
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="ghost" onClick={onEditClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSaveEmployee}
                isLoading={loading}
              >
                Guardar Cambios
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Cambiar Contraseña */}
      <Modal isOpen={isPasswordOpen} onClose={onPasswordClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <LockIcon color="orange.500" />
              <Text>Cambiar Contraseña</Text>
            </HStack>
          </ModalHeader>
          <Divider />
          <ModalBody py={6}>
            <VStack spacing={4}>
              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>¡Atención!</AlertTitle>
                  <AlertDescription>
                    Vas a cambiar la contraseña de {selectedEmployee?.nombre} {selectedEmployee?.apellido}
                  </AlertDescription>
                </Box>
              </Alert>

              <FormControl>
                <FormLabel>Nueva Contraseña</FormLabel>
                <Input
                  type="password"
                  value={passwordData.password}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, password: e.target.value })
                  }
                  placeholder="Ingrese la nueva contraseña"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Confirmar Contraseña</FormLabel>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  placeholder="Confirme la nueva contraseña"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <Divider />
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="ghost" onClick={onPasswordClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="orange"
                onClick={handleUpdatePassword}
                isLoading={loading}
                isDisabled={
                  !passwordData.password ||
                  !passwordData.confirmPassword ||
                  passwordData.password !== passwordData.confirmPassword
                }
              >
                Actualizar Contraseña
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;