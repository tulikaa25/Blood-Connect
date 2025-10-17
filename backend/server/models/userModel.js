import mongoose from 'mongoose';
const screeningSchema = new mongoose.Schema({
    age: {
        type: Number,
        required: true,
        min: 18, // minimum age to donate
        max: 65, // optional upper limit
    },
    weight: {
        type: Number,
        required: true,
        min: 45, // minimum weight in kg to donate
    },
    medicalConditions: {
        hiv: { type: Boolean, default: false },
        hepatitis: { type: Boolean, default: false },
        syphilis: { type: Boolean, default: false },
        malaria: { type: Boolean, default: false },
        heartDisease: { type: Boolean, default: false },
        cancer: { type: Boolean, default: false },
        epilepsy: { type: Boolean, default: false },
        tuberculosis: { type: Boolean, default: false },
    },
    longTermMedications: {
        type: Boolean,
        default: false,
    },
    medicationDetails: {
        type: String,
        default: null,
        // will only be stored if longTermMedications = true
    },
    hasDonatedBefore: {
        type: Boolean,
        default: false,
    },
    lastDonationDate: {
        type: Date,
        default: null,
    },
    tattooOrPiercing: {
        type: Boolean,
        default: false,
    },
    vaccination: {
        type: Boolean,
        default: false,
    },
    isPregnantOrBreastfeeding: {
        type: Boolean,
        default: false,
    }
}, { _id: false });

const donationHistorySchema = new mongoose.Schema({             //updated only after donation is completed 
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


    donationHistory: [donationHistorySchema],           //


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


    screeningData: screeningSchema,                     //
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
