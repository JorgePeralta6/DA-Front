'use client'

import {
    Box,
    Flex,
    Avatar,
    Button,
    Menu,
    useDisclosure,
    useColorModeValue,
    Stack,
    useColorMode,
    MenuList,
    MenuButton,
    MenuItem,
    Tooltip,
    Image
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const NavLink = ({ children }) => (
    <Box
        as="a"
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.200', 'gray.700'),
        }}
        href={'#'}
    >
        {children}
    </Box>
)

export default function Nav({ onCourseSelect }) {
    const { colorMode, toggleColorMode } = useColorMode();
    const navigate = useNavigate(); // <--- necesario para redirigir
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleCourseSelect = (course) => {
        onCourseSelect(course);
    };

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                <Image
                    src="https://i.ibb.co/1t1rKmHQ/Logo-Amatitlan-removebg-preview.png"
                    alt="Logo"
                    boxSize="250px"
                    objectFit="contain"
                />

                <Flex alignItems={'center'}>
                    <Stack direction={'row'} spacing={7}>
                        <Tooltip label="Cambiar de tema">
                            <Button onClick={toggleColorMode}>
                                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                            </Button>
                        </Tooltip>

                        {/* Menú del avatar */}
                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded={'full'}
                                variant={'link'}
                                cursor={'pointer'}
                                minW={0}
                            >
                                <Avatar size={'sm'} />
                            </MenuButton>
                            <MenuList>
                                <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
                            </MenuList>
                        </Menu>
                    </Stack>
                </Flex>
            </Flex>
        </Box>
    );
}
