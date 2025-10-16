import mongoose from 'mongoose';

const screeningSchema = new mongoose.Schema({
    medicalConditions: {
        hiv: Boolean,
        hepatitis: Boolean,
        syphilis: Boolean,
        malaria: Boolean,
        heartDisease: Boolean,
        cancer: Boolean,
        epilepsy: Boolean,
        tuberculosis: Boolean,
    },
    longTermMedications: Boolean,
    medicationDetails: String,
    permanentlyDeferred: Boolean,
    hasDonatedBefore: Boolean,
    tattooOrPiercing: Boolean,
    vaccination: Boolean,
    isPregnantOrBreastfeeding: Boolean,
}, { _id: false });

const donationHistorySchema = new mongoose.Schema({
    donationDate: {
        type: Date,
        required: true,
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
    },
}, { _id: false });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
    },
    weight: {
        type: Number,
    },
    bloodGroup: {
        type: String,
    },
    gender: {
        type: String,
    },
    lastDonationDate: {
        type: Date,
    },
    nextEligibleDate: {
        type: Date,
    },
    donationHistory: [donationHistorySchema],
    role: {
        type: String,
        enum: ['donor', 'admin'],
        default: 'donor',
    },
    eligibilityStatus: {
        type: String,
        enum: ['pending_screening', 'eligible', 'deferred'],
        default: 'pending_screening',
    },
    screeningData: screeningSchema,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
