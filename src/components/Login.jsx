import { useState } from "react";
import { CustomInput } from "./Input";
import { useLogin } from "../shared/hooks";
import {
    emailValidationMessage,
    validateEmail,
    validatePassword,
    validatePasswordMessage
} from '../shared/validators'
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormLabel,
    FormErrorMessage,
    VStack,
    useColorModeValue,
    Stack,
    Heading,
    Text,
    Flex,
    Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Input
} from "@chakra-ui/react";
import toast from "react-hot-toast";

export const Login = ({ switchAuthHandler }) => {
    const { login, isLoading } = useLogin();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [formState, setFormState] = useState({
        email: {
            value: "",
            isValid: false,
            showError: false,
        },
        password: {
            value: "",
            isValid: false,
            showError: false,
        },
    });

    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotPhone, setForgotPhone] = useState("");
    const [isSendingEmail, setIsSendingEmail] = useState(false);

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
            case 'email':
                isValid = validateEmail(value);
                break;
            case 'password':
                isValid = validatePassword(value);
                break;
            default:
                break;
        }
        setFormState((prevState) => ({
            ...prevState,
            [field]: {
                ...prevState[field],
                isValid,
                showError: !isValid
            }
        }))
    }

    const handleLogin = (e) => {
        e.preventDefault();
        login(formState.email.value, formState.password.value);
    };

    const handleForgotPassword = async () => {
        if (!validateEmail(forgotEmail)) {
            toast.error('Por favor ingresa un correo válido', {
                style: {
                    background: 'red',
                    color: 'white'
                }
            });
            return;
        }

        setIsSendingEmail(true);

        try {
            const response = await fetch('https://da-q8nd.onrender.com/dmmsystem/v1/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: forgotEmail, phone: forgotPhone })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Se ha enviado un correo con instrucciones para recuperar tu contraseña', {
                    style: {
                        background: 'green',
                        color: 'white'
                    }
                });
                setForgotEmail("");
                setForgotPhone("");
                onClose();
            } else {
                toast.error(data.msg || 'Error al enviar el correo', {
                    style: {
                        background: 'red',
                        color: 'white'
                    }
                });
            }
        } catch (error) {
            toast.error('Error al enviar la solicitud', {
                style: {
                    background: 'red',
                    color: 'white'
                }
            });
        } finally {
            setIsSendingEmail(false);
        }
    };

    const isSubmitButtonDisabled = isLoading || !formState.email.isValid || !formState.password.isValid;

    const formBackground = useColorModeValue("white", "gray.700");
    const labelColor = useColorModeValue("gray.700", "gray.200");
    const buttonColor = useColorModeValue("red.500", "red.800");

    return (
        <>
            <Flex
                position="relative"
                minH="100vh"
                align="center"
                justify="center"
                p={8}
            >
                <Stack
                    direction={{ base: "column", md: "row" }}
                    spacing={8}
                    align="center"
                    position="relative"
                    zIndex={1}
                >
                    <Box
                        flex="1"
                        bg={formBackground}
                        p={8}
                        borderRadius="md"
                        boxShadow="dark-lg"
                        maxW="md"
                        w="full"
                    >
                        <Stack spacing={4}>
                            <Stack align="center">
                                <Heading fontSize="3xl" textAlign="center">
                                    Inicio de Sesión
                                </Heading>
                                <Text fontSize="lg" color="white.600">

                                </Text>
                            </Stack>
                            <form>
                                <VStack spacing={4}>
                                    <FormControl>
                                        <FormLabel color={labelColor}></FormLabel>
                                        <CustomInput
                                            field='email'
                                            label='Correo'
                                            value={formState.email.value}
                                            onChangeHandler={handleInputValueChange}
                                            type='text'
                                            onBlurHandler={handleInputValidationOnBlur}
                                            showErrorMessage={formState.email.showError}
                                            validationMessage={emailValidationMessage}
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel color={labelColor}></FormLabel>
                                        <CustomInput
                                            field='password'
                                            label='Contraseña'
                                            value={formState.password.value}
                                            onChangeHandler={handleInputValueChange}
                                            type='password'
                                            onBlurHandler={handleInputValidationOnBlur}
                                            showErrorMessage={formState.password.showError}
                                            validationMessage={validatePasswordMessage}
                                        />
                                    </FormControl>

                                    <Text
                                        fontSize="sm"
                                        color="blue.300"
                                        cursor="pointer"
                                        alignSelf="flex-end"
                                        onClick={onOpen}
                                        _hover={{ textDecoration: "underline" }}
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Text>

                                    <Button
                                        bg={buttonColor}
                                        color="white"
                                        _hover={{ bg: "blue.700" }}
                                        width="400px"
                                        type="submit"
                                        isDisabled={isSubmitButtonDisabled}
                                        onClick={handleLogin}
                                    >
                                        Iniciar Sesión
                                    </Button>
                                </VStack>
                            </form>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>

            {/* Modal para recuperación de contraseña */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Recuperar Contraseña</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text mb={4}>
                            Ingresa tu correo electrónico y tu número de teléfono. Te enviaremos un correo con los datos para recuperar tu contraseña.
                        </Text>
                        <VStack spacing={4}>
                            <FormControl>
                                <FormLabel>Correo Electrónico</FormLabel>
                                <Input
                                    type="email"
                                    placeholder="tucorreo@ejemplo.com"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Número de Teléfono</FormLabel>
                                <Input
                                    type="tel"
                                    placeholder="Ej: +502 5555-5555"
                                    value={forgotPhone}
                                    onChange={(e) => setForgotPhone(e.target.value)}
                                />
                            </FormControl>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button
                            colorScheme="blue"
                            onClick={handleForgotPassword}
                            isLoading={isSendingEmail}
                        >
                            Enviar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};