import { useState } from "react";
import { CustomInput } from "./Input";
import {
    validateUsername,
    validateEmail,
    validatePassword,
    validateConfirPassword,
    validateUsernameMessage,
    emailValidationMessage,
    validatePasswordMessage,
    passwordConfirmationMessage,
} from "../shared/validators";
import { useRegister } from "../shared/hooks";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    useColorModeValue,
    Stack,
    Heading,
    Text,
    Flex,
    SimpleGrid,
    GridItem
    
} from "@chakra-ui/react";

export const Register = ({ switchAuthHandler }) => {
    const { register, isLoading } = useRegister();

    const [formState, setFormState] = useState({

        email: {
            value: "",
            isValid: false,
            showError: false,
        },
        nombre: {
            value: "",
            isValid: false,
            showError: false
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
            showError: false
        },
        apellido: {
            value: '',
            isValid: false,
            showError: false
        },
        username: {
            value: "",
            isValid: false,
            showError: false,
        }


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
                isValid = true;
                break;
            case "password":
                isValid = validatePassword(value);
                break;
            case "passwordConfir":
                isValid = validateConfirPassword(formState.password.value, value);
                break;
            case "phone":
                isValid = true;
                break;
            case "apellido":
                isValid = true;
                break;
            case "username":
                isValid = validateUsername(value);
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

    const handleRegister = (e) => {
        e.preventDefault();
        register(
            formState.email.value,
            formState.nombre.value,
            formState.password.value,
            formState.phone.value,
            formState.apellido.value,
            formState.username.value

        );
    };

    const isSubmitButtonDisabled =
        isLoading ||
        !formState.email.isValid ||
        !formState.nombre.isValid ||
        !formState.password.isValid ||
        !formState.phone.isValid ||
        !formState.apellido.isValid ||
        !formState.username.isValid ||
        !formState.passwordConfir.isValid

    const formBackground = useColorModeValue("white", "gray.700");
    const labelColor = useColorModeValue("gray.700", "gray.200");
    const buttonColor = useColorModeValue("red.500", "red.800");

    return (
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
                    maxW="2xl"
                    w="full"
                >
                    <Stack spacing={4}>
                        <Stack align="center">
                            <Heading fontSize="3xl" textAlign="center">
                                Crear Usuario
                            </Heading>
                            <Text fontSize="lg" color="white.600">

                            </Text>
                        </Stack>
                        <form>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                                <FormControl>
                                    <FormLabel color={labelColor}></FormLabel>
                                    <CustomInput
                                        field='nombre'
                                        label='Nombre'
                                        value={formState.nombre.value}
                                        onChangeHandler={handleInputValueChange}
                                        type='text'
                                        onBlurHandler={handleInputValidationOnBlur}
                                        showErrorMessage={formState.nombre.showError}
                                        validationMessage={""}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel color={labelColor}></FormLabel>
                                    <CustomInput
                                        field='apellido'
                                        label='Apellido'
                                        value={formState.apellido.value}
                                        onChangeHandler={handleInputValueChange}
                                        type='text'
                                        onBlurHandler={handleInputValidationOnBlur}
                                        showErrorMessage={formState.apellido.showError}
                                        validationMessage={''}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel color={labelColor}></FormLabel>
                                    <CustomInput
                                        field='username'
                                        label='Username'
                                        value={formState.username.value}
                                        onChangeHandler={handleInputValueChange}
                                        type='text'
                                        onBlurHandler={handleInputValidationOnBlur}
                                        showErrorMessage={formState.username.showError}
                                        validationMessage={validateUsernameMessage}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel color={labelColor}></FormLabel>
                                    <CustomInput
                                        field='phone'
                                        label='Phone'
                                        value={formState.phone.value}
                                        onChangeHandler={handleInputValueChange}
                                        type='text'
                                        onBlurHandler={handleInputValidationOnBlur}
                                        showErrorMessage={formState.phone.showError}
                                        validationMessage={''}
                                    />
                                </FormControl>

                                <GridItem colSpan={2}>
                                    <FormControl textAlign="center">
                                        <FormLabel color={labelColor}></FormLabel>
                                        <CustomInput
                                            field='email'
                                            label='Email'
                                            value={formState.email.value}
                                            onChangeHandler={handleInputValueChange}
                                            type='text'
                                            onBlurHandler={handleInputValidationOnBlur}
                                            showErrorMessage={formState.email.showError}
                                            validationMessage={emailValidationMessage}
                                        />
                                    </FormControl>
                                </GridItem>

                                <FormControl>
                                    <FormLabel color={labelColor}></FormLabel>
                                    <CustomInput
                                        field='password'
                                        label='Password'
                                        value={formState.password.value}
                                        onChangeHandler={handleInputValueChange}
                                        type='password'
                                        onBlurHandler={handleInputValidationOnBlur}
                                        showErrorMessage={formState.password.showError}
                                        validationMessage={validatePasswordMessage}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel color={labelColor}></FormLabel>
                                    <CustomInput
                                        field='passwordConfir'
                                        label='Confirm Password'
                                        value={formState.passwordConfir.value}
                                        onChangeHandler={handleInputValueChange}
                                        type='password'
                                        onBlurHandler={handleInputValidationOnBlur}
                                        showErrorMessage={formState.passwordConfir.showError}
                                        validationMessage={passwordConfirmationMessage}
                                    />
                                </FormControl>
                            </SimpleGrid>

                            <Flex justify="center" mt={4}>
                                <Button
                                    bg={buttonColor}
                                    color="white"
                                    _hover={{ bg: "blue.700" }}
                                    width="500px"
                                    type="submit"
                                    isDisabled={isSubmitButtonDisabled}
                                    onClick={handleRegister}
                                >
                                    Registrate
                                </Button>
                            </Flex>
                        </form>

                        <Text textAlign="center">
                            Ya tienes cuenta{" "}
                            <Box
                                as="span"
                                fontWeight="bold"
                                color="blue.300"
                                cursor="pointer"
                                onClick={switchAuthHandler}
                            >
                                Inicia Sesión
                            </Box>
                        </Text>

                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
};