let express = require('express');
let router = express.Router();
router.use(express.json());
const axios = require('axios');
const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs');
const saltRounds = 10;
const UserAccount = require("../../models/users/userAccount");
const { extractBirthDate, extractGender } = require("../../utils/userUtils");
const { checkParam } = require('../../middleware/validate');
const removeDiacritics = require('../../utils/stringUtils');


//GET all user accounts
router.get('/', async (req, res) => {
    try {
        const accounts = await UserAccount.findAll();
        res.status(200).json(accounts);
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
})

//Add new user account.
router.post('/add', async (req, res) => {
    try {
        const { accountId, username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const utilizatorCuCont = await UserAccount.create({
            accountId,
            username,
            password: hashedPassword
        });

        res.status(201).json({ message: 'User account created successfully.\n' + utilizatorCuCont });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create user account.' });
    }
});

//ADD new user + card + user account
router.post('/create-account', async (req, res) => {
    try {
        const { tin, surname, name, email, phoneNumber, address, username, password, confirmPassword, cardNumber, expiryDate } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match.' });
        }

        const birthDate = extractBirthDate(tin);
        const gender = extractGender(tin);


        const user = await axios.post('http://localhost:8080/api/users/add', {
            identificationCode: tin,
            surname,
            name,
            birthDate,
            email: email,
            phoneNumber: phoneNumber.replace(/\s/g, ''),
            address: removeDiacritics(address),
            gender
        });
        console.log(user.data, user.data.id);
        const userId = user.data.id;

        await axios.post('http://localhost:8080/api/accounts/add', {
            accountId: userId,
            username,
            password
        });

        if (cardNumber) {
            await axios.post('http://localhost:8080/api/cards/add', {
                cardNumber: cardNumber.replace(/\s/g, ''),
                expiryDate: new Date(expiryDate),
                userId: userId
            });
        }
        res.status(201).json({ message: 'Account created successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

//GET user account (search after credentials)
router.post('/credentials', async (req, res) => {
    try {
        const { username, password } = req.body;

        const account = await UserAccount.findOne({ where: { username } });

        if (!account || !(await bcrypt.compare(password, account.password))) {
            return res.status(401).json({ error: 'Invalid username or password!' });
        }
        res.status(200).json(account);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve user account.' });
    }
});

const storage = multer.diskStorage({
    destination: process.env.PROFILE_PHOTOS_UPLOAD_PATH,
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const upload = multer({ storage });

//UPDATE profile picture for a specific account (search after accountId)
router.put('/update-profilePicture/:accountId', checkParam('accountId'),
    (req, res, next) => {
        upload.single('profilePicture')(req, res, function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to upload profile picture in file.' });
            }
            next();
        });
    },
    async (req, res) => {
        try {
            const { accountId } = req.params;
            const { path } = req.file;
            const fileData = fs.readFileSync(path);

            const updatedAccount = await UserAccount.update(
                { profilePicture: fileData },
                { where: { accountId } }
            );

            if (updatedAccount[0]) {
                const account = await UserAccount.findByPk(accountId);
                res.status(200).json(account);
            } else {
                res.status(404).json({ error: `User account with id ${accountId} not found!` });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update profile picture.' });
        }
    });

//GET a specific user account (search after accountId)
router.get('/:accountId', checkParam('accountId'), async (req, res) => {
    try {
        const { accountId } = req.params;
        const account = await UserAccount.findByPk(accountId);
        if (account) {
            res.status(200).json(account);
        } else {
            res.status(404).json({ error: `User account with id ${accountId} not found!` })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

module.exports = router;