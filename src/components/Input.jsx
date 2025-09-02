import {
    FormControl,
    FormLabel,
    Textarea,
    FormErrorMessage,
    Input as ChakraInput,
    InputGroup,
    InputRightElement,
    IconButton,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";

export const CustomInput = ({
    field,
    label,
    value,
    onChangeHandler,
    type = 'text',
    showErrorMessage,
    validationMessage,
    onBlurHandler,
    textArea = false,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleValueChange = (event) => {
        onChangeHandler(event.target.value, field);
    };

    const handleInputBlur = (event) => {
        onBlurHandler(event.target.value, field);
    };

    const isPasswordField = type === 'password';

    return (
        <FormControl isInvalid={showErrorMessage} maxW="400px">
            <FormLabel>{label}</FormLabel>
            {textArea ? (
                <Textarea
                    value={value}
                    onChange={handleValueChange}
                    onBlur={handleInputBlur}
                    rows={5}
                />
            ) : isPasswordField ? (
                <InputGroup>
                    <ChakraInput
                        type={showPassword ? 'text' : 'password'}
                        value={value}
                        onChange={handleValueChange}
                        onBlur={handleInputBlur}
                    />
                    <InputRightElement>
                        <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </InputRightElement>
                </InputGroup>
            ) : (
                <ChakraInput
                    type={type}
                    value={value}
                    onChange={handleValueChange}
                    onBlur={handleInputBlur}
                />
            )}
            {showErrorMessage && (
                <FormErrorMessage>{validationMessage}</FormErrorMessage>
            )}
        </FormControl>
    );
};
