const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const router = express.Router();
const dotenv = require('dotenv');
const pino = require('pino');
const fetchUser = require('../middleware/fetchUser');
const { ObjectId } = require('mongodb');

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
                console.log('wrong!!!')
                logger.error('Passwords do not match');
                return res.status(404).json({ error: 'Wrong password' });
            } 
            const firstName = match.firstName;
            const userEmail = match.email;
            let payload = {
                user: {
                    id: match._id.toString(),
                },
            };
            const authToken = jwt.sign(payload, JWT_SECRET);
            return res.status(200).json({ authToken, firstName, email: userEmail });
        } else {
            logger.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

    } catch (error) {
        logger.error(error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });

    }
});

router.get('/getUser', fetchUser, async(req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');
    
        const user = await collection.findOne({ _id: new ObjectId(req.user.id) });
        if(!user) {
            logger.error('User not found for profile retrieval');
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }

});

router.put('/update', fetchUser, async (req, res) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
            logger.error('Validation errors in update request', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }
    
    try {
        const userId = req.user.id;

        const db = await connectToDatabase();
        const collection = db.collection('users');
        
        const existingUser = await collection.findOne({ _id: new ObjectId(userId) });

        const updateData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            updatedAt: new Date(),
        }
        

        const updateUser = await collection.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { $set: updateData },
            { returnDocument: 'after' }
        );
  
        const payload = {
            user: {
                id: updateUser._id.toString(),
            },
        };
        const authToken = jwt.sign(payload, JWT_SECRET);
        res.json({
            authToken,
            firstName: updateUser.firstName,
            email: updateUser.email
        });
    } catch(error) {
        return res.status(500).json({ error: 'Internal server error', error });
    }
});

router.post('/changePassword', fetchUser, async (req, res) => {

    const userId = req.user.id;
    const { newPassword, currentPassword } = req.body;
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const user = await collection.findOne({ _id: new ObjectId(userId) });
        if(!user) {
            logger.error('User not found for password change');
            return res.status(400).json({ error: 'User not found' });
        }
        const pwdCheck = await bcryptjs.compare(currentPassword, user.password);
        if(!pwdCheck) {
            logger.error('Current password is incorrect');
            return res.status(400).json({ error: 'Current password is incorrect' });
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);
        
        await collection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { password: hashedPassword, updatedAt: new Date() } },
        );
        return res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;