import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Text,
  Divider,
  Select,
  FormErrorMessage,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirPassword,
  validateUsernameMessage,
  emailValidationMessage,
  validatePasswordMessage,
  passwordConfirmationMessage,
} from "../../shared/validators";
import { register as registerRequest } from "../../services";
import toast from "react-hot-toast";

const AddUserModal = ({ isOpen, onClose, onEmployeeAdded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState({
    email: {
      value: "",
      isValid: false,
      showError: false,
    },
    nombre: {
      value: "",
      isValid: false,
      showError: false,
    },
    password: {
      value: "",
      isValid: false,
      showError: false,
    },
    passwordConfir: {
      value: "",
      isValid: false,
      showError: false,
    },
    phone: {
      value: "",
      isValid: false,
      showError: false,
    },
    apellido: {
      value: "",
      isValid: false,
      showError: false,
    },
    username: {
      value: "",
      isValid: false,
      showError: false,
    },
    role: {
      value: "EMPLOYEE_ROLE",
      isValid: true,
      showError: false,
    },
  });

  const handleInputValueChange = (value, field) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        value,
      },
    }));
  };

  const handleInputValidationOnBlur = (value, field) => {
    let isValid = false;
    switch (field) {
      case "email":
        isValid = validateEmail(value);
        break;
      case "nombre":
        isValid = value.trim().length > 0;
        break;
      case "password":
        isValid = validatePassword(value);
        break;
      case "passwordConfir":
        isValid = validateConfirPassword(formState.password.value, value);
        break;
      case "phone":
        isValid = value.trim().length > 0;
        break;
      case "apellido":
        isValid = value.trim().length > 0;
        break;
      case "username":
        isValid = validateUsername(value);
        break;
      case "role":
        isValid = true;
        break;
      default:
        break;
    }
    setFormState((prevState) => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        isValid,
        showError: !isValid,
      },
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const employeeData = {
      email: formState.email.value,
      nombre: formState.nombre.value,
      password: formState.password.value,
      phone: formState.phone.value,
      apellido: formState.apellido.value,
      username: formState.username.value,
      role: formState.role.value,
    };

    const response = await registerRequest(employeeData);

    setIsLoading(false);

    if (!response.success) {
      return toast.error(response.msg || "Error al agregar empleado", {
        style: {
          background: "red",
          color: "white",
          whiteSpace: "pre-line",
        },
      });
    }

    toast.success("Empleado agregado exitosamente!", {
      style: {
        background: "green",
        color: "white",
      },
    });

    // Resetear formulario
    setFormState({
      email: { value: "", isValid: false, showError: false },
      nombre: { value: "", isValid: false, showError: false },
      password: { value: "", isValid: false, showError: false },
      passwordConfir: { value: "", isValid: false, showError: false },
      phone: { value: "", isValid: false, showError: false },
      apellido: { value: "", isValid: false, showError: false },
      username: { value: "", isValid: false, showError: false },
      role: { value: "EMPLOYEE_ROLE", isValid: true, showError: false },
    });

    // Recargar lista de empleados
    if (onEmployeeAdded) {
      await onEmployeeAdded();
    }

    onClose();
  };

  const isSubmitButtonDisabled =
    isLoading ||
    !formState.email.isValid ||
    !formState.nombre.isValid ||
    !formState.password.isValid ||
    !formState.phone.isValid ||
    !formState.apellido.isValid ||
    !formState.username.isValid ||
    !formState.passwordConfir.isValid;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <AddIcon color="green.500" />
            <Text>Agregar Nuevo Empleado</Text>
          </HStack>
        </ModalHeader>
        <Divider />
        <ModalBody py={6}>
          <VStack spacing={4}>
            <HStack spacing={4} width="100%">
              <FormControl isInvalid={formState.nombre.showError}>
                <FormLabel>Nombre</FormLabel>
                <Input
                  value={formState.nombre.value}
                  onChange={(e) => handleInputValueChange(e.target.value, "nombre")}
                  onBlur={(e) => handleInputValidationOnBlur(e.target.value, "nombre")}
                  placeholder="Ingrese el nombre"
                />
                {formState.nombre.showError && (
                  <FormErrorMessage>El nombre es requerido</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={formState.apellido.showError}>
                <FormLabel>Apellido</FormLabel>
                <Input
                  value={formState.apellido.value}
                  onChange={(e) => handleInputValueChange(e.target.value, "apellido")}
                  onBlur={(e) => handleInputValidationOnBlur(e.target.value, "apellido")}
                  placeholder="Ingrese el apellido"
                />
                {formState.apellido.showError && (
                  <FormErrorMessage>El apellido es requerido</FormErrorMessage>
                )}
              </FormControl>
            </HStack>

            <HStack spacing={4} width="100%">
              <FormControl isInvalid={formState.username.showError}>
                <FormLabel>Username</FormLabel>
                <Input
                  value={formState.username.value}
                  onChange={(e) => handleInputValueChange(e.target.value, "username")}
                  onBlur={(e) => handleInputValidationOnBlur(e.target.value, "username")}
                  placeholder="Ingrese el username"
                />
                {formState.username.showError && (
                  <FormErrorMessage>{validateUsernameMessage}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={formState.phone.showError}>
                <FormLabel>Teléfono</FormLabel>
                <Input
                  value={formState.phone.value}
                  onChange={(e) => handleInputValueChange(e.target.value, "phone")}
                  onBlur={(e) => handleInputValidationOnBlur(e.target.value, "phone")}
                  placeholder="Ingrese el teléfono"
                />
                {formState.phone.showError && (
                  <FormErrorMessage>El teléfono es requerido</FormErrorMessage>
                )}
              </FormControl>
            </HStack>

            <FormControl isInvalid={formState.email.showError}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={formState.email.value}
                onChange={(e) => handleInputValueChange(e.target.value, "email")}
                onBlur={(e) => handleInputValidationOnBlur(e.target.value, "email")}
                placeholder="Ingrese el email"
              />
              {formState.email.showError && (
                <FormErrorMessage>{emailValidationMessage}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Rol</FormLabel>
              <Select
                value={formState.role.value}
                onChange={(e) => handleInputValueChange(e.target.value, "role")}
              >
                <option value="EMPLOYEE_ROLE">Empleado</option>
                <option value="ADMIN_ROLE">Administrador</option>
              </Select>
            </FormControl>

            <HStack spacing={4} width="100%">
              <FormControl isInvalid={formState.password.showError}>
                <FormLabel>Contraseña</FormLabel>
                <Input
                  type="password"
                  value={formState.password.value}
                  onChange={(e) => handleInputValueChange(e.target.value, "password")}
                  onBlur={(e) => handleInputValidationOnBlur(e.target.value, "password")}
                  placeholder="Ingrese la contraseña"
                />
                {formState.password.showError && (
                  <FormErrorMessage>{validatePasswordMessage}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={formState.passwordConfir.showError}>
                <FormLabel>Confirmar Contraseña</FormLabel>
                <Input
                  type="password"
                  value={formState.passwordConfir.value}
                  onChange={(e) => handleInputValueChange(e.target.value, "passwordConfir")}
                  onBlur={(e) => handleInputValidationOnBlur(e.target.value, "passwordConfir")}
                  placeholder="Confirme la contraseña"
                />
                {formState.passwordConfir.showError && (
                  <FormErrorMessage>{passwordConfirmationMessage}</FormErrorMessage>
                )}
              </FormControl>
            </HStack>
          </VStack>
        </ModalBody>
        <Divider />
        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="green"
              onClick={handleSubmit}
              isLoading={isLoading}
              isDisabled={isSubmitButtonDisabled}
            >
              Agregar Empleado
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddUserModal;