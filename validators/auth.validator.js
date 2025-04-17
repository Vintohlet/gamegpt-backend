import { body } from "express-validator"
import { createCustomValidatorMiddleware } from "./general.validator.js"
const userName =  body("userName").exists().withMessage("поле userName обязательно!").isString().withMessage("userName должен быть String")
.isLength({min:3}).withMessage("userName должен содержать минимум 3 символа")
const email = body("email").exists().withMessage("поле email обязательно ").isEmail().withMessage("email должен быть в верном формате")
const password = body("password").exists().withMessage("Пароль обязателен").isString().withMessage("Password должен быть String").isLength({min:6}).withMessage("Password must contain minimum 6 symbol")
export const registerValidator = createCustomValidatorMiddleware([
    userName,email, password,
 ]
)
export const loginValidator = createCustomValidatorMiddleware([
    email,password
])
