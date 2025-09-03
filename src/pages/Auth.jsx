import { Box, useColorModeValue } from '@chakra-ui/react'
import { useState } from 'react'
import { Login } from '../components/Login'
import { Register } from '../components/Register'
import { AnimatePresence, motion } from 'framer-motion'

const MotionBox = motion.create(Box)

const Auth = () => {
    const backgroundStyleL = {
        background: "linear-gradient(135deg,rgb(56, 73, 184),rgb(0, 0, 0))",
        transition: { duration: 0.6 }

    }
    const [isLogin, setIsLogin] = useState(true)

    const handleAuthPageToggle = () => {
        setIsLogin((prev) => !prev)
    }
    const backgroundStyleD = {
        background: "linear-gradient(135deg,rgb(56, 73, 184),rgb(0, 0, 0))",
        transition: { duration: 0.6 }
    }

    const variants = {
        hidden: { opacity: 0, y: 30, transition: { duration: 0.4 } },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
        exit: { opacity: 0, y: -30, transition: { duration: 0.4 } }
    }

    const backgroundVariants = {
        login: {
            background: "linear-gradient(135deg,rgb(56, 73, 184),rgb(0, 0, 0))",
            transition: { duration: 0.6 }
        },
        register: {
            background: "linear-gradient(135deg, rgb(0, 0, 0), rgb(56, 73, 184))",
            transition: { duration: 0.6 }
        }
    }

    return (
        <MotionBox
            minH="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            initial={false}
            animate={isLogin ? "login" : "register"}
            variants={backgroundVariants}
            p={4}
        >
            <AnimatePresence mode="wait">
                {isLogin ? (
                    <MotionBox
                        key="login"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={variants}
                        width="100%"
                        maxW="400px"
                    >
                        <Login switchAuthHandler={handleAuthPageToggle} />
                    </MotionBox>
                ) : (
                    <MotionBox
                        key="register"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={variants}
                        width="100%"
                        maxW="400px"
                    >
                        <Register switchAuthHandler={handleAuthPageToggle} />
                    </MotionBox>
                )}
            </AnimatePresence>
        </MotionBox>
    )
}

export default Auth