const express = require('express');
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
        const { email, firstName, lastName, password } = req.body;
        const existingUser = await collection.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(password, salt);
        const newUser = await collection.insertOne({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hash,
            createdAt: new Date(),
        })
        const payload = {
            user: {
                id: newUser.insertedId,
            },
        };
        const authToken = jwt.sign(payload, JWT_SECRET);
        logger.info('User registered successfully');
        res.json({authToken, email, firstName});
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        debugger;
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const { email, password } = req.body;
        const match = await collection.findOne({ email: email });
        if(match) {
            let result = await bcryptjs.compare(password, match.password)
            if(!result) {
                logger.error('Passwords do not match');
                return res.status(404).json({ error: 'Wrong password' });
            } 
            const userName = match.firstName;
            const userEmail = match.email;
            let payload = {
                user: {
                    id: match._id.toString(),
                },
            };
            const authToken = jwt.sign(payload, JWT_SECRET);
            return res.status(200).json({ authToken, userName, email: userEmail });
        } else {
            logger.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

    } catch (error) {
        logger.error(error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });

    }
})

module.exports = router;