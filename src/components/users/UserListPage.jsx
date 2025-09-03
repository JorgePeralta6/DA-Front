import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useDisclosure,
  Spinner,
  Center,
  Tooltip,
  Text,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  FormControl,
  FormLabel
} from "@chakra-ui/react";
import { Edit, Eye, Trash } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useUser } from "../../shared/hooks";

const UserListPage = () => {
  const { users, saveUser, updateUser, getUsers, deleteUser, loading } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  
  const { control, handleSubmit, reset } = useForm();
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState(null);

  // Cargar usuarios cuando el componente se monte
  useEffect(() => {
    fetchUsersData();
  }, []);

  const fetchUsersData = async () => {
    try {
      setError(null);
      await getUsers();
    } catch (err) {
      setError("Error al cargar los usuarios");
    }
  };

  // Función para manejar la creación de un usuario
  const handleAddUser = async (data) => {
    try {
      const newUser = await saveUser(data);
      if (newUser) {
        onClose();
        reset(); // Limpiar formulario
        setSelectedUser(null);
        await fetchUsersData(); // Recargar la lista
      }
    } catch (error) {
      console.error("Error al agregar usuario:", error);
    }
  };

const handleDeleteUser = async (numero) => {
    const confirm = window.confirm("¿Estás seguro de que quieres eliminar este usuario?");
    if (!confirm) return;

    const success = await deleteUser(numero);

    if (success) {
        setSelectedUser((prev) => prev.filter((user) => user.numero !== numero));
    }
};

  // Función para manejar la actualización de un usuario
  const handleEditUser = async (data) => {
    try {
      if (!selectedUser?.numero) {
        toast.error("Número de usuario no válido");
        return;
      }

      const updatedUser = await updateUser(selectedUser.numero, data);
      if (updatedUser) {
        onClose();
        reset(); // Limpiar formulario
        setSelectedUser(null);
        await fetchUsersData(); // Recargar la lista
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    }
  };

  // Función para manejar la vista de usuario
  const handleViewUser = (user) => {
    setSelectedUser(user);
    onViewOpen();
  };

  // Función para abrir modal de edición
  const openEditModal = (user) => {
    setSelectedUser(user);
    // Resetear el formulario con los datos del usuario seleccionado
    reset({
      nombreE: user.nombreE || '',
      nombreN: user.nombreN || '',
      DPI: user.DPI || '',
      comunidad: user.comunidad || '',
      direccion: user.direccion || '',
      email: user.email || '',
      telefono: user.telefono || '',
      genero: user.genero || '',
      notas: user.notas || ''
    });
    onOpen();
  };

  // Función para abrir modal de agregar
  const openAddModal = () => {
    setSelectedUser(null);
    // Resetear el formulario completamente vacío
    reset({
      nombreE: '',
      nombreN: '',
      DPI: '',
      comunidad: '',
      direccion: '',
      email: '',
      telefono: '',
      genero: '',
      notas: ''
    });
    onOpen();
  };

  // Función para cerrar modal y limpiar estado
  const handleCloseModal = () => {
    onClose();
    reset(); // Limpiar formulario
    setSelectedUser(null);
  };

  // Renderizar estado de carga
  if (loading && users.length === 0) {
    return (
      <Center h="400px">
        <VStack spacing={6}>
          <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
          <Text color="gray.600" fontSize="lg" fontWeight="medium">
            Cargando usuarios...
          </Text>
        </VStack>
      </Center>
    );
  }

  // Renderizar estado de error
  if (error) {
    return (
      <Box p={6}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle>Error al cargar usuarios</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Box>
        </Alert>
        <Button mt={4} onClick={fetchUsersData} colorScheme="blue">
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <HStack justifyContent="space-between" mb={4}>
        <Button onClick={openAddModal} colorScheme="blue">
          Agregar Usuario
        </Button>
      </HStack>

      <TableContainer>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Número</Th>
              <Th>Nombre Encargado</Th>
              <Th>Nombre Niño</Th>
              <Th>DPI</Th>
              <Th>Comunidad</Th>
              <Th>Dirección</Th>
              <Th>Correo</Th>
              <Th>Teléfono</Th>
              <Th>Género</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user, index) => {
              // Crear una key única usando _id o index como fallback
              const uniqueKey = user._id || `user-${index}`;
              
              return (
                <Tr key={uniqueKey}>
                  <Td>{user.numero || index + 1}</Td>
                  <Td>{user.nombreE || 'No especificado'}</Td>
                  <Td>{user.nombreN || 'No especificado'}</Td>
                  <Td>{user.DPI || 'No especificado'}</Td>
                  <Td>{user.comunidad || 'No especificado'}</Td>
                  <Td>{user.direccion || 'No especificado'}</Td>
                  <Td>{user.email || 'No especificado'}</Td>
                  <Td>{user.telefono || 'No especificado'}</Td>
                  <Td>{user.genero || 'No especificado'}</Td>
                  
                  <Td>
                    <HStack spacing={2}>
                      <Tooltip label="Ver detalles">
                        <IconButton
                          icon={<Eye />}
                          aria-label="Ver"
                          onClick={() => handleViewUser(user)}
                          colorScheme="blue"
                          isDisabled={loading}
                          size="sm"
                        />
                      </Tooltip>
                      <Tooltip label="Editar usuario">
                        <IconButton
                          icon={<Edit />}
                          aria-label="Editar"
                          onClick={() => openEditModal(user)}
                          colorScheme="yellow"
                          isDisabled={loading}
                          size="sm"
                        />
                      </Tooltip>
                      <Tooltip label="Eliminar Usuario">
                        <IconButton
                          icon={<Trash />}
                          aria-label="Eliminar"
                          onClick={() => handleDeleteUser(user.numero)}
                          colorScheme="red"
                          isDisabled={loading}
                          size="sm"
                        />
                      </Tooltip>
                    </HStack>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      {users.length === 0 && !loading && (
        <Center p={8}>
          <Box textAlign="center">
            <Text fontSize="lg" color="gray.600" mb={4}>No hay usuarios registrados</Text>
            <Button colorScheme="blue" onClick={openAddModal}>
              Agregar Primer Usuario
            </Button>
          </Box>
        </Center>
      )}

      {/* Modal Ver Usuario */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Detalles del Usuario</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedUser && (
              <VStack spacing={4} align="stretch">
                <HStack>
                  <Text fontWeight="bold" minW="120px">Número:</Text>
                  <Text>{selectedUser.numero || 'No asignado'}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" minW="120px">Nombre Encargado:</Text>
                  <Text>{selectedUser.nombreE || 'No especificado'}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" minW="120px">Nombre Niño:</Text>
                  <Text>{selectedUser.nombreN || 'No especificado'}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" minW="120px">DPI:</Text>
                  <Text>{selectedUser.DPI || 'No especificado'}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" minW="120px">Comunidad:</Text>
                  <Text>{selectedUser.comunidad || 'No especificado'}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" minW="120px">Dirección:</Text>
                  <Text>{selectedUser.direccion || 'No especificado'}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" minW="120px">Email:</Text>
                  <Text>{selectedUser.email || 'No especificado'}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" minW="120px">Teléfono:</Text>
                  <Text>{selectedUser.telefono || 'No especificado'}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" minW="120px">Género:</Text>
                  <Text>{selectedUser.genero || 'No especificado'}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" minW="120px">Notas:</Text>
                  <Text>{selectedUser.notas || 'No hay notas'}</Text>
                </HStack>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onViewClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Agregar/Editar Usuario */}
      <Modal isOpen={isOpen} onClose={handleCloseModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedUser ? "Editar Usuario" : "Agregar Usuario"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(selectedUser ? handleEditUser : handleAddUser)}>
              <Stack spacing={3}>
                <Controller
                  name="nombreE"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <FormControl>
                      <FormLabel>Nombre del Encargado</FormLabel>
                      <Input placeholder="Nombre del encargado" {...field} />
                    </FormControl>
                  )}
                />
                <Controller
                  name="nombreN"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <FormControl>
                      <FormLabel>Nombre del Niño</FormLabel>
                      <Input placeholder="Nombre del niño" {...field} />
                    </FormControl>
                  )}
                />
                <Controller
                  name="DPI"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <FormControl>
                      <FormLabel>DPI</FormLabel>
                      <Input placeholder="DPI" {...field} />
                    </FormControl>
                  )}
                />
                <Controller
                  name="comunidad"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <FormControl>
                      <FormLabel>Comunidad</FormLabel>
                      <Input placeholder="Comunidad" {...field} />
                    </FormControl>
                  )}
                />
                <Controller
                  name="direccion"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <FormControl>
                      <FormLabel>Dirección</FormLabel>
                      <Input placeholder="Dirección" {...field} />
                    </FormControl>
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <FormControl>
                      <FormLabel>Email</FormLabel>
                      <Input placeholder="Email" type="email" {...field} />
                    </FormControl>
                  )}
                />
                <Controller
                  name="telefono"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <FormControl>
                      <FormLabel>Teléfono</FormLabel>
                      <Input placeholder="Teléfono" {...field} />
                    </FormControl>
                  )}
                />
                <Controller
                  name="genero"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <FormControl>
                      <FormLabel>Género</FormLabel>
                      <Input placeholder="Género" {...field} />
                    </FormControl>
                  )}
                />
                <Controller
                  name="notas"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <FormControl>
                      <FormLabel>Notas</FormLabel>
                      <Input placeholder="Notas" {...field} />
                    </FormControl>
                  )}
                />
                <Button 
                  type="submit" 
                  colorScheme="teal"
                  isLoading={loading}
                  loadingText={selectedUser ? "Actualizando..." : "Agregando..."}
                >
                  {selectedUser ? "Actualizar Usuario" : "Agregar Usuario"}
                </Button>
              </Stack>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={handleCloseModal}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UserListPage;