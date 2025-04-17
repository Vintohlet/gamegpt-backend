import bcrypt from "bcryptjs";
import e from "express";

export async function hashPassword(plainPassword) {
    try {
        const salt = await bcrypt.genSalt(10)
        const password = await bcrypt.hash(plainPassword, salt)
        return password
    } catch (error) {
        console.log(error)
    }
}

export async function checkValidPassword(plainPassword, hashedPassword) {
    try {
        const passwordIsValid = await bcrypt.compare(plainPassword, hashedPassword)
        return passwordIsValid
    } catch (error) {
        console.log(error)
    }
}