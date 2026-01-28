const express = require('express');
const app = express();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const router = express.Router();
const dotenv = require('dotenv');
const pino = require('pino');

const logger = pino();
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const existingUser = await collection.find({ email: req.body.email }).toArray();
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const { email, firstName, lastName, password } = req.body;
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(password, salt);
        const newUser = await collection.insertOne({
            username: username,
            email: email,
            password: hash,
            createdAt: new Date(),
        })
        const payload = {
            user: {
                id: user.insertedId,
            },
        };
        const authToken = jwt.sign(payload, JWT_SECRET);
        logger.info('User registered successfully');
        res.json({authToken, email});
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;