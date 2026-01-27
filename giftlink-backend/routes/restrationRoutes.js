const bcrypt = require('bcrypt');
const express = require('express');

application.post('/api/users/register', async (req, res) => {
    try {
        const { firstName, lastName, username, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
})