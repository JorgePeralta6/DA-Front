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
    Center,
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
                    src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhn1uaAI2Ud5QqCdj-uknMRoeiJqmJi9SnlOwEgqq3igqoX0EciSRe5Xyqsbe3xVLUqXC29XIMDpJyLsKuKPMpJLWKnsyNfCt1PRNGbS8ghrgdKp0L1WRqUd1tsqh-HGgn7N5-9jzyTR6E/w1200-h630-p-k-no-nu/BanderaAmatitl%25C3%25A1n.jpg" // Reemplaza con tu URL
                    alt="Logo"
                    boxSize="100px"
                    objectFit="contain"
                />

                <Flex alignItems={'center'}>
                    <Stack direction={'row'} spacing={7}>
                        <Button onClick={toggleColorMode}>
                            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                        </Button>

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
