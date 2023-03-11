const { body, check, sanitizeBody } = require('express-validator') // validator
const checkDuplicate = require('./checkDuplicate')


const validatorRegister = [
    check('name')
    .replace(/\s/g, '')
    .isLength({ min: 3 }).withMessage('Name at least 3 characters!'),
    // .isAlpha().withMessage('Name can only consist of letters!').trim().escape(),
    check('username').isLength({ min: 4 }).withMessage('Username at least 4 characters!'),
    check('password').isLength({ min: 4 }).withMessage('Password at least 4 characters!'),
    body('username').custom(async value => {
        const duplicateName = await checkDuplicate(value)
        if (duplicateName) {
            throw new Error('Username has been used!')
        }
        return true
    }),
    check('email')
    .notEmpty().withMessage('Email must be filled!')
    .isEmail().normalizeEmail().withMessage('Your email is invalid!')
    .trim().escape()
]

module.exports = { validatorRegister }