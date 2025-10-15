import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    totalBeds: {
        type: Number,
        required: true,
        default: 6,
    },
    bufferBeds: {
        type: Number,
        required: true,
        default: 1,
    },
    slotDurationMinutes: {
        type: Number,
        required: true,
        default: 30,
    },
    gracePeriodMinutes: {
        type: Number,
        required: true,
        default: 10,
    },
    openingTime: {
        type: String,
        required: true,
        default: '09:00',
    },
    closingTime: {
        type: String,
        required: true,
        default: '17:00',
    },
    timeGapMinutes: {
        type: Number,
        required: true,
        default: 10,
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
