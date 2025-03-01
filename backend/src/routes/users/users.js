let express = require('express');
let router = express.Router();
const User = require("../../models/users/user");
const { body } = require('express-validator');
const { checkParam } = require('../../middleware/validate');


//GET all users
router.route('/').get(async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
})

//ADD a new user
router.post('/add',
    [   //Middleware for fileds validation
        body('identificationCode').isLength(13).withMessage('Identification code must be 13 characters.'),
        body('surname').notEmpty().withMessage('Surname is required.'),
        body('name').notEmpty().withMessage('Name is required.'),
        body('birthDate').isDate().withMessage('Invalid birth date format.'),
        body('email').isEmail().withMessage('Invalid email format.'),
        body('phoneNumber').optional().isNumeric().isLength(10).withMessage('Invalid phone number format.'),
        body('gender').optional().isIn(['M', 'F', 'O']).withMessage('Gender must be either "M" for male, "F" for female, or "O" for other.')
    ],
    async (req, res) => {
        try {
            const { identificationCode, surname, name, birthDate, email, phoneNumber, address, gender } = req.body;

            const user = await User.create({
                identificationCode, //CNP
                surname,
                name,
                birthDate,
                email,
                phoneNumber,
                address,
                gender
            });

            res.status(201).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create new user.' });
        }
    });

//GET a specific user (search after user id)
router.route('/:id').get(checkParam('id'), async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: `User with id ${id} not found!` })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

//GET a specific user (search after identification code)
router.route('/code/:code').get(async (req, res) => {
    try {
        const { code } = req.params;
        const user = await User.findOne({
            where: {
                identificationCode: code
            }
        });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: `User with identification code ${code} not found!` });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

//UPDATE user (with given filed and value)
router.put('/update/:id', async (req, res) => {
    try {
        const allowedFields = ['email', 'phoneNumber', 'address'];
        const { field, value } = req.body;
        console.log("field:", field, "value:", value);
        const { id } = req.params;

        if (!allowedFields.includes(field)) {
            return res.status(400).json({ error: `Invalid field: ${field}` });
        }

        const updatedUser = await User.update(
            { [field]: value },
            { where: { id } }
        );

        if (updatedUser[0]) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ error: `User with id ${id} not found!` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update user.' });
    }
});

module.exports = router;