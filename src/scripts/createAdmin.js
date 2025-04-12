const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdminUser = async () => {
    try {
        console.log('Connecting to MongoDB with URI:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'admin123@foodxBites.com';
        const adminPassword = 'admin123';

        // Check if admin exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        console.log('Existing admin:', existingAdmin);
        
        if (!existingAdmin) {
            // Create admin user
            const admin = new User({
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                name: 'Admin User'
            });

            await admin.save();
            console.log('✅ Admin user created successfully');
        } else {
            console.log('✅ Admin user already exists');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createAdminUser(); 