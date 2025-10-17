import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    totalBeds: {
        type: Number,
        required: true,
        default: 2, // total physical beds in the center
    },
    slotDurationMinutes: {
        type: Number,
        required: true,
        default: 40, // updated slot duration as per your last request
    },
    openingTime: {
        type: String,
        required: true,
        default: '09:00', // center opening time
    },
    closingTime: {
        type: String,
        required: true,
        default: '17:00', // center closing time
    },
    timeGapMinutes: {
        type: Number,
        required: true,
        default: 10, // gap between consecutive slots
    },
    
});

// Ensure only one settings document exists
settingsSchema.statics.getSingleton = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
