import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../server/models/userModel.js';


dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to your MongoDB (adjust URI if needed)
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Check if admin already exists
    const existingAdmin = await User.findOne({ phone: '9999999999' });
    if (existingAdmin) {
      console.log('Admin already exists!');
      process.exit();
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create the admin user
    const admin = new User({
      name: 'Admin User',
      phone: '9999999999',
      password: hashedPassword,
      role: 'admin',
      eligibilityStatus: 'pending_screening',
    });

    await admin.save();
    console.log('✅ Admin created successfully!');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error creating admin:', err);
    mongoose.disconnect();
  }
};

createAdmin();
