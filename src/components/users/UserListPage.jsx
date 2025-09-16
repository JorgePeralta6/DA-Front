import React, { useEffect, useState, useMemo } from "react";
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
  Select,
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
  FormLabel,
  SimpleGrid,
  useColorModeValue,
  Image,
  Flex,
  Badge,
  Divider
} from "@chakra-ui/react";
import { Edit, Eye, Trash, Search, RefreshCcw, Users } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useUser } from "../../shared/hooks";
import { exportUsersToExcel } from '../../services/api';
import Nav from '../Navbar';
import toast from "react-hot-toast";

const UserListPage = () => {
  const { users, saveUser, updateUser, getUsers, deleteUser, getDPI, exportToExcel, loading } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isFamilyOpen, onOpen: onFamilyOpen, onClose: onFamilyClose } = useDisclosure();

  const { control, handleSubmit, reset } = useForm();
  const [selectedUser, setSelectedUser] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Función para obtener familias (usuarios con el mismo DPI)
  const getFamiliesByDPI = useMemo(() => {
    const familiesMap = {};
    users.forEach(user => {
      if (user.DPI) {
        if (!familiesMap[user.DPI]) {
          familiesMap[user.DPI] = [];
        }
        familiesMap[user.DPI].push(user);
      }
    });

    // Solo retornar DPIs que tengan más de un miembro
    const families = {};
    Object.keys(familiesMap).forEach(dpi => {
      if (familiesMap[dpi].length > 1) {
        families[dpi] = familiesMap[dpi];
      }
    });

    return families;
  }, [users]);

  // Función para verificar si un usuario tiene familia
  const hasFamily = (user) => {
    return getFamiliesByDPI[user.DPI] && getFamiliesByDPI[user.DPI].length > 1;
  };

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

  const handleSearch = async () => {
    if (!searchText.trim()) {
      toast.error("Ingrese un texto para buscar");
      return;
    }

    await getDPI(searchText.trim());
  };

  // Función para ver familia
  const handleViewFamily = (user) => {
    const family = getFamiliesByDPI[user.DPI] || [];
    setFamilyMembers(family);
    onFamilyOpen();
  };

  // Función para manejar la creación de un usuario
  const handleAddUser = async (data) => {
    try {
      const newUser = await saveUser(data);
      if (newUser) {
        onClose();
        reset();
        setSelectedUser(null);
        await fetchUsersData();
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
        reset();
        setSelectedUser(null);
        await fetchUsersData();
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
    reset();
    setSelectedUser(null);
  };

  const handleExportToExcel = async () => {
    const result = await exportUsersToExcel();
    if (result.error) {
      alert('Hubo un problema al exportar el archivo');
    } else {
      alert('Usuarios exportados correctamente, ve a la carpeta de descargas');
    }
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
    <>
      <Nav />
      <Box p={6}>
        <HStack justifyContent="space-between" mb={4} flexWrap="wrap">
          <HStack spacing={2}>
            <Input
              placeholder="Buscar por DPI o Nombre"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              maxW="300px"
            />
            <IconButton
              icon={<Search />}
              colorScheme="blue"
              onClick={handleSearch}
              aria-label="Buscar"
            />
            <IconButton
              icon={<RefreshCcw />}
              colorScheme="blue"
              onClick={() => {
                setSearchText("");
                fetchUsersData();
              }}
            />
          </HStack>

          <Button onClick={openAddModal} colorScheme="blue">
            Agregar Usuario
          </Button>
          <Button onClick={handleExportToExcel} colorScheme="green">
            Exportar a Excel
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
                const uniqueKey = user._id || `user-${index}`;
                const userHasFamily = hasFamily(user);
                const auth = JSON.parse(localStorage.getItem("auth"));
                const userRole = auth?.role;

                return (
                  <Tr
                    key={uniqueKey}
                    bg={userHasFamily ? useColorModeValue('blue.50', 'blue.900') : 'transparent'}
                  >
                    <Td>
                      <HStack>
                        <Text>{user.numero || index + 1}</Text>
                      </HStack>
                    </Td>
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
                        {/* Botón de Ver: visible para todos */}
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
                        {/* Botones solo para el rol ADMIN_ROLE */}
                        {userRole === "ADMIN_ROLE" && (
                          <>
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
                          </>
                        )}
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
                Agregar Usuario
              </Button>
            </Box>
          </Center>
        )}

        {/* Modal Ver Familia */}
        <Modal isOpen={isFamilyOpen} onClose={onFamilyClose} size="6xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <HStack>
                <Users />
                <Text>Información de la Familia</Text>
                <Badge colorScheme="purple">{familyMembers.length} miembros</Badge>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={6} align="stretch">
                {familyMembers.length > 0 && (
                  <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={4} bg={useColorModeValue('gray.50', 'gray.800')}>
                    <Text fontWeight="bold" fontSize="lg" mb={2}>Información Común de la Familia</Text>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                      <Box>
                        <Text fontWeight="semibold" color="blue.600">DPI:</Text>
                        <Text>{familyMembers[0]?.DPI || 'No especificado'}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="semibold" color="green.600">Comunidad:</Text>
                        <Text>{familyMembers[0]?.comunidad || 'No especificado'}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="semibold" color="orange.600">Dirección:</Text>
                        <Text>{familyMembers[0]?.direccion || 'No especificado'}</Text>
                      </Box>
                    </SimpleGrid>
                  </Box>
                )}

                <Divider />

                <Text fontWeight="bold" fontSize="lg">Miembros de la Familia:</Text>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {familyMembers.map((member, index) => (
                    <Box
                      key={member._id || index}
                      border="2px solid"
                      borderColor={member.genero === 'MASCULINO' ? 'blue.300' : 'pink.300'}
                      borderRadius="lg"
                      p={4}
                      bg={member.genero === 'MASCULINO'
                        ? useColorModeValue('blue.50', 'blue.900')
                        : useColorModeValue('pink.50', 'pink.900')
                      }
                    >
                      <VStack align="stretch" spacing={3}>
                        <HStack justify="space-between">
                          <Badge
                            colorScheme={member.genero === 'MASCULINO' ? 'blue' : 'pink'}
                            fontSize="sm"
                          >
                            #{member.numero} - {member.genero}
                          </Badge>
                        </HStack>

                        <Box>
                          <Text fontWeight="semibold" color="purple.600">Encargado:</Text>
                          <Text fontSize="md" fontWeight="medium">{member.nombreE || 'No especificado'}</Text>
                        </Box>

                        <Box>
                          <Text fontWeight="semibold" color="teal.600">Niño/a:</Text>
                          <Text fontSize="md" fontWeight="medium">{member.nombreN || 'No especificado'}</Text>
                        </Box>

                        <Box>
                          <Text fontWeight="semibold" color="orange.600">Contacto:</Text>
                          <Text fontSize="sm">📧 {member.email || 'No especificado'}</Text>
                          <Text fontSize="sm">📞 {member.telefono || 'No especificado'}</Text>
                        </Box>

                        {member.notas && (
                          <Box>
                            <Text fontWeight="semibold" color="gray.600">Notas:</Text>
                            <Text fontSize="sm" fontStyle="italic">{member.notas}</Text>
                          </Box>
                        )}

                        <Box>
                          <Text fontWeight="semibold" color="gray.600">Registrado:</Text>
                          <Text fontSize="sm">
                            {member.createdAt
                              ? new Date(member.createdAt).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })
                              : 'No hay fecha'}
                          </Text>
                        </Box>
                      </VStack>
                    </Box>
                  ))}
                </SimpleGrid>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="purple" onClick={onFamilyClose}>
                Cerrar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal Ver Usuario */}
        <Modal isOpen={isViewOpen} onClose={onViewClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Detalles del Usuario</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedUser && (
                <VStack spacing={4} align="stretch">
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>

                    {/* Correo */}
                    <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={3} bg={useColorModeValue('green.50', 'green.800')}>
                      <Text fontWeight="bold">Correo:</Text>
                      <Text>{selectedUser.email || 'No especificado'}</Text>
                    </Box>

                    {/* Comunidad */}
                    <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={3} bg={useColorModeValue('green.50', 'green.800')}>
                      <Text fontWeight="bold">Comunidad:</Text>
                      <Text>{selectedUser.comunidad || 'No especificado'}</Text>
                    </Box>

                    {/* Direccion */}
                    <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={3} bg={useColorModeValue('green.50', 'green.800')}>
                      <Text fontWeight="bold">Direccion:</Text>
                      <Text>{selectedUser.direccion || 'No especificado'}</Text>
                    </Box>

                    {/* Nombre del Encargado */}
                    <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={3} bg={useColorModeValue('red.50', 'red.800')}>
                      <Text fontWeight="bold">Nombre Encargado:</Text>
                      <Text>{selectedUser.nombreE || 'No especificado'}</Text>
                    </Box>

                    {/* Telefono */}
                    <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={3} bg={useColorModeValue('red.50', 'red.800')}>
                      <Text fontWeight="bold">Telefono:</Text>
                      <Text>{selectedUser.telefono || 'No especificado'}</Text>
                    </Box>

                    {/* DPI */}
                    <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={3} bg={useColorModeValue('red.50', 'red.800')}>
                      <Text fontWeight="bold">DPI:</Text>
                      <Text>{selectedUser.DPI || 'No especificado'}</Text>
                    </Box>

                    {/* Nombre del Niño */}
                    <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={3} bg={useColorModeValue('blue.50', 'blue.800')}>
                      <Text fontWeight="bold">Nombre Niño:</Text>
                      <Text>{selectedUser.nombreN || 'No especificado'}</Text>
                    </Box>

                    {/* Genero */}
                    <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={3} bg={useColorModeValue('blue.50', 'blue.800')}>
                      <Text fontWeight="bold">Genero:</Text>
                      <Text>{selectedUser.genero || 'No especificado'}</Text>
                    </Box>
                  </SimpleGrid>

                  {/* Notas */}
                  <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={3} bg={useColorModeValue('orange.50', 'orange.800')}>
                    <Text fontWeight="bold">Notas:</Text>
                    <Text>{selectedUser.notas || 'No hay notas'}</Text>
                  </Box>

                  {/* Fecha de creación */}
                  <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={3} bg={useColorModeValue('gray.50', 'gray.800')}>
                    <Text fontWeight="bold">Agregado el:</Text>
                    <Text>
                      {selectedUser.createdAt
                        ? new Date(selectedUser.createdAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                        : 'No hay fecha'}
                    </Text>
                  </Box>
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <HStack spacing={3}>
                {/* Botón Ver Familia - solo se muestra si el usuario tiene familia */}
                {selectedUser && hasFamily(selectedUser) && (
                  <Button
                    leftIcon={<Users />}
                    colorScheme="purple"
                    onClick={() => handleViewFamily(selectedUser)}
                  >
                    Ver Familia ({getFamiliesByDPI[selectedUser.DPI]?.length || 0} miembros)
                  </Button>
                )}
                <Button colorScheme="blue" onClick={onViewClose}>
                  Cerrar
                </Button>
              </HStack>
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
                        <Input placeholder="DPI (Encargado)" maxLength={13} {...field} />
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
                        <Input placeholder="Teléfono (8 dígitos)" maxLength={8} {...field} />
                      </FormControl>
                    )}
                  />
                  <Controller
                    name="genero"
                    control={control}
                    defaultValue=""
                    rules={{ required: "El género es obligatorio" }}
                    render={({ field, fieldState }) => (
                      <FormControl isRequired isInvalid={!!fieldState.error}>
                        <FormLabel>Género</FormLabel>
                        <Select placeholder="Seleccione género" {...field}>
                          <option value="MASCULINO">Masculino</option>
                          <option value="FEMENINO">Femenino</option>
                        </Select>
                        {fieldState.error && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {fieldState.error.message}
                          </Text>
                        )}
                      </FormControl>
                    )}
                  />
                  <Controller
                    name="notas"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <FormControl>
                        <FormLabel>Notas (Opcional)</FormLabel>
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
                    {selectedUser ? "Actualizar Registro" : "Agregar Registro"}
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

        <Flex justify="center" align="center">
          <Image
            src="https://i.ibb.co/dsY03w5t/escudo-muni-1.png"
            alt="Logo"
            boxSize="275px"
            objectFit="contain"
            mr={2}
          />
        </Flex>
      </Box>
    </>
  );
};

export default UserListPage;