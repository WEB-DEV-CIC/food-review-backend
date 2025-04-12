require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function setAdminRole() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find and update the user
        const user = await User.findOneAndUpdate(
            { email: 'admin@foodxbites.com' },
            { role: 'admin' },
            { new: true }
        );

        if (!user) {
            console.log('User not found');
            process.exit(1);
        }

        console.log('User updated successfully:', {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

setAdminRole(); 