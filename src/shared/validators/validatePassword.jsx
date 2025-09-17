export const validatePassword = (password) => {
    const regex = /^\S{8,12}$/;
    return regex.test(password)
}

export const validatePasswordMessage = 'La contraseña debe tener entre 8 caracteres.'